import { NextResponse } from 'next/server';
import { pool } from '@/app/api/sql/sql.js';

export async function POST(request) {
  let connection; 
  try {
    const { name, departamentos } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Se requiere nombre de proveedor' },
        { status: 400 }
      );
    }
    
    if (!departamentos || !Array.isArray(departamentos) || departamentos.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un departamento' },
        { status: 400 }
      );
    }
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Verificar si ya existe un proveedor con el mismo nombre
      const [existingProveedorResult] = await connection.query(
        'SELECT id FROM Proveedor WHERE nombre = ?',
        [name]
      );
      
      let idProveedor;
      let isNewProvider = true;
      
      if (existingProveedorResult.length > 0) {
        // Si el proveedor ya existe, usar su ID
        idProveedor = existingProveedorResult[0].id;
        isNewProvider = false;
      } else {
        // Si no existe, crear un nuevo proveedor
        const [proveedorResult] = await connection.query(
          'INSERT INTO Proveedor (nombre) VALUES (?)',
          [name]
        );
        idProveedor = proveedorResult.insertId;
      }
      
      // Para cada departamento seleccionado, verificar si ya existe la relación
      for (const idDepartamento of departamentos) {
        // Verificar si ya existe la relación proveedor-departamento
        const [existingRelation] = await connection.query(
          'SELECT 1 FROM Proveedor_Departamento WHERE idProveedor_FK = ? AND idDepartamento_FK = ?',
          [idProveedor, idDepartamento]
        );
        
        // Solo insertar si no existe la relación
        if (existingRelation.length === 0) {
          await connection.query(
            'INSERT INTO Proveedor_Departamento (idProveedor_FK, idDepartamento_FK) VALUES (?, ?)',
            [idProveedor, idDepartamento]
          );
        }
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        id: idProveedor,
        isNewProvider,
        message: isNewProvider 
          ? 'Proveedor creado y asociado a los departamentos correctamente' 
          : 'Departamentos asociados al proveedor existente correctamente'
      }, { status: 200 });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (releaseErr) {
        console.error('Error al liberar la conexión:', releaseErr);
      }
    }
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}