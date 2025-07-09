import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { query } = body;
        var result  = [];
        if (!query || query === '') {
            [result] = await pool.query('SELECT * FROM Departamento');
        } else {
            [result] = await pool.query('SELECT * FROM Departamento WHERE nombre LIKE ?', [`%${query}%`]);
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

