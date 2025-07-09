import { NextResponse } from 'next/server';
import { pool } from '@/app/api/sql/sql.js';

export async function POST(request) {
  let connection;
  try {
    const { id, departamentoId, departamentoIds } = await request.json();
    connection = await pool.getConnection();
    
    await connection.beginTransaction();
    
    try {
      if (departamentoIds && Array.isArray(departamentoIds) && departamentoIds.length > 0) {
        for (const deptId of departamentoIds) {
          await connection.query(
            `DELETE FROM Proveedor_Departamento WHERE idProveedor_FK = ? AND idDepartamento_FK = ?`, 
            [id, deptId]
          );
        }
        
        const [restantes] = await connection.query(
          `SELECT COUNT(*) as count FROM Proveedor_Departamento WHERE idProveedor_FK = ?`, 
          [id]
        );
        
        await connection.commit();
        
        if (restantes[0].count === 0) {
          return NextResponse.json({ deletedProveedor: true }, { status: 200 });
        }
        
        return NextResponse.json({ deletedDepartamentos: true }, { status: 200 });
      } 
      else if (departamentoId) {
        await connection.query(
          `DELETE FROM Proveedor_Departamento WHERE idProveedor_FK = ? AND idDepartamento_FK = ?`, 
          [id, departamentoId]
        );
        
        const [restantes] = await connection.query(
          `SELECT COUNT(*) as count FROM Proveedor_Departamento WHERE idProveedor_FK = ?`, 
          [id]
        );
        
        await connection.commit();
        
        if (restantes[0].count === 0) {
          return NextResponse.json({ deletedProveedor: true }, { status: 200 });
        }
        
        return NextResponse.json({ deletedDepartamento: true }, { status: 200 });
      } 
      else {
        await connection.query(
          `DELETE FROM Proveedor_Departamento WHERE idProveedor_FK = ?`, 
          [id]
        );
        
        await connection.commit();
        
        return NextResponse.json({ deletedProveedor: true }, { status: 200 });
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error in provider deletion:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud de eliminación',
      details: error.message 
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}