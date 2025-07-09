import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            );
        }
        
        const [result] = await pool.query('DELETE FROM Usuario WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'No se encontró el usuario' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                message: 'Usuario eliminado correctamente' 
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Error al eliminar usuario' },
            { status: 500 }
        );
    }
}