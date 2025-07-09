import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;
        const [result] = await pool.query('DELETE FROM Departamento WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'No se encontró el departamento' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { result },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Error' },
            { status: 500 }
        );
    }
}

