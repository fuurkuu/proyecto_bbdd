import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name } = body;
        
        if (!name || name === '') {
            return NextResponse.json(
            { error: 'El nombre del departamento es requerido' },
            { status: 400 }
            );
        }
        
        const [result] = await pool.query('INSERT INTO Departamento (nombre) VALUES (?)', [name]);
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'No se pudo agregar el departamento' },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
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

