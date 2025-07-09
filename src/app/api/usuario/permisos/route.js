import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [result] = await pool.query('SELECT * FROM Permiso');

        return NextResponse.json(
            { result },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return NextResponse.json(
            { error: 'Error al obtener permisos' },
            { status: 500 }
        );
    }
}