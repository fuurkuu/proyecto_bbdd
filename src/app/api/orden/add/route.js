import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request) {
   try {
       // Verificar la sesión del usuario
       const session = await getServerSession(authOptions);
       if (!session) {
           return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
       }

       const body = await request.json();
       const { data, comentarios } = body;
       
       
       if (!data) {
           return NextResponse.json(
               { error: 'Data no found' },
               { status: 400 }
           );
       }
       
       const { ano, departamento, codigo, proveedor, fecha, cantidad, codigoInversion, importe, inventariable, observacion } = data;
       console.log('Data received:', data);
       
       const requiredFields = ['ano', 'departamento', 'codigo', 'proveedor', 'fecha', 'cantidad', 'importe', 'inventariable', 'observacion'];
       
       for (const field of requiredFields) {
           if (!data[field] || data[field] === '') {
               return NextResponse.json(
                   { error: `El campo ${field} es requerido` },
                   { status: 400 }
               );
           }
       }
       
       if (proveedor === '0') {
           return NextResponse.json(
               { error: 'Debe seleccionar un proveedor válido' },
               { status: 400 }
           );
       }

       const connection = await pool.getConnection();
       
       try {
           await connection.beginTransaction();
           
           const [bolsaRows] = await connection.query(
               'SELECT id FROM Bolsa WHERE ano = ?', 
               [ano]
           );
           
           if (bolsaRows.length === 0) {
               throw new Error(`No se encontró la bolsa para el año ${ano}`);
           }
           
           const bolsaId = bolsaRows[0].id;
           
           const [ordenCompra] = await connection.query(
               `INSERT INTO Orden_Compra (
                   cod_compra, cantidad, es_inventariable, importe, fecha, observacion, idProveedor_FK
               ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
               [
                   codigo, 
                   parseInt(cantidad), 
                   inventariable === 'si' ? 1 : 0,
                   parseFloat(importe),
                   fecha,
                   observacion,
                   parseInt(proveedor)
               ]
           );
           
           const ordenId = ordenCompra.insertId;
           
           if (codigoInversion && codigoInversion !== '') {
               const [inversionRows] = await connection.query(
                   `SELECT i.id FROM Inversion AS i 
                   WHERE i.idBolsa_FK = ? AND i.idDepartamento_FK = ?`,
                   [bolsaId, parseInt(departamento)]
               );
               
               let inversionId;
               
               if (inversionRows.length === 0) {
                   const [newInversion] = await connection.query(
                       'INSERT INTO Inversion (idBolsa_FK, idDepartamento_FK, cod_inversion) VALUES (?, ?, ?)',
                       [bolsaId, parseInt(departamento), codigoInversion]
                   );
                   inversionId = newInversion.insertId;
               } else {
                   inversionId = inversionRows[0].id;
               }
               
               await connection.query(
                   'INSERT INTO Compra_Inversion (idOrden_Compra_FK, idInversion_FK, numInversion) VALUES (?, ?, ?)',
                   [ordenId, inversionId, codigoInversion]
               );
               
           } else {
               const [presupuestoRows] = await connection.query(
                   `SELECT p.id FROM Presupuesto AS p 
                   WHERE p.idBolsa_FK = ? AND p.idDepartamento_FK = ?`,
                   [bolsaId, parseInt(departamento)]
               );
               
               let presupuestoId;
               
               if (presupuestoRows.length === 0) {
                   const [newPresupuesto] = await connection.query(
                       'INSERT INTO Presupuesto (idBolsa_FK, idDepartamento_FK) VALUES (?, ?)',
                       [bolsaId, parseInt(departamento)]
                   );
                   presupuestoId = newPresupuesto.insertId;
               } else {
                   presupuestoId = presupuestoRows[0].id;
               }
               
               await connection.query(
                   'INSERT INTO Compra_Presupuesto (idOrden_Compra_FK, idPresupuesto_FK) VALUES (?, ?)',
                   [ordenId, presupuestoId]
               );
           }
           
           // Agregar comentarios si existen
           if (comentarios && comentarios.length > 0) {
               for (const comentario of comentarios) {
                   if (comentario.comentario && comentario.comentario.trim()) {
                       await connection.query(
                           'INSERT INTO Comentario_Orden (comentario, idOrden_Compra_FK, idUsuario_FK) VALUES (?, ?, ?)',
                           [comentario.comentario.trim(), ordenId, session.user.id]
                       );
                   }
               }
           }
           
           await connection.commit();
           
           return NextResponse.json(
               { 
                   success: true, 
                   message: codigoInversion && codigoInversion !== '' ? 
                       'Orden de compra de inversión creada correctamente' : 
                       'Orden de compra de presupuesto creada correctamente' 
               },
               { status: 200 }
           );
       } catch (error) {
           await connection.rollback();
           throw error;
       } finally {
           connection.release();
       }
   } catch (error) {
       console.error('Error al procesar la solicitud:', error);
       return NextResponse.json(
           { error: error.message || 'Error al crear la orden de compra' },
           { status: 500 }
       );
   }
}