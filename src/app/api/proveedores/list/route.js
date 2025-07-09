import { NextResponse } from 'next/server';
import { pool } from '../../sql/sql.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET() {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener la conexión de la base de datos
    const connection = await pool.getConnection();
    
    try {
      // Obtener la lista de proveedores
      const [proveedores] = await connection.query(`
        SELECT id, nombre, cif, direccion, poblacion, provincia, telefono, correo
        FROM bbdd.Proveedor
        ORDER BY nombre ASC
      `);
      
      return NextResponse.json({ proveedores }, { status: 200 });
      
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    }, { status: 500 });
  }
} 