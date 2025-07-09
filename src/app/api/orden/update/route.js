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

    // Solo los administradores o usuarios con permiso de escritura pueden editar
    if (!session.user.isAdmin && !session.user.permisos.w) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción' }, { status: 403 });
    }

    const data = await request.json();
    console.log("Datos recibidos para actualización:", data);
    
    const { 
      id,
      codigo, 
      codigoInversion, 
      descripcion, 
      idProveedor, 
      cantidad, 
      fecha, 
      es_inventariable,
      importe 
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID de orden no proporcionado' }, { status: 400 });
    }

    // Verificar campos obligatorios
    if (!codigo || !idProveedor || !cantidad || !fecha || !importe) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Obtener la conexión de la base de datos
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Actualizar la orden de compra
      const [result] = await connection.query(
        `UPDATE Orden_Compra 
         SET cod_compra = ?, 
             cantidad = ?, 
             importe = ?, 
             fecha = ?, 
             observacion = ?,
             es_inventariable = ?,
             idProveedor_FK = ?
         WHERE id = ?`,
        [
          codigo,
          parseInt(cantidad),
          parseFloat(importe),
          fecha,
          descripcion || '',
          es_inventariable !== undefined ? es_inventariable : 1,
          parseInt(idProveedor),
          id
        ]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('No se encontró la orden de compra con el ID proporcionado');
      }
      
      // Si hay un código de inversión, actualizar también la relación de Compra_Inversion
      if (codigoInversion) {
        // Verificar si existe un registro en Compra_Inversion
        const [inversionCheck] = await connection.query(
          'SELECT * FROM Compra_Inversion WHERE idOrden_Compra_FK = ?',
          [id]
        );
        
        if (inversionCheck.length > 0) {
          // Actualizar el numInversion
          await connection.query(
            'UPDATE Compra_Inversion SET numInversion = ? WHERE idOrden_Compra_FK = ?',
            [codigoInversion, id]
          );
        }
      }
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: 'Orden de compra actualizada correctamente'
      }, { status: 200 });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al actualizar la orden de compra:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    }, { status: 500 });
  }
} 