import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { nombre, email, cargo, departamentos, permisos } = body;
        
        if (!nombre || nombre.trim() === '') {
            return NextResponse.json(
                { error: 'El nombre del usuario es requerido' },
                { status: 400 }
            );
        }
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Insert the user with the new fields
            const [usuarioResult] = await connection.query(
                'INSERT INTO Usuario (nombre, email, cargo) VALUES (?, ?, ?)', 
                [nombre, email || null, cargo || null]
            );
            
            const usuarioId = usuarioResult.insertId;
            
            // Associate departments if provided
            if (departamentos && departamentos.length > 0) {
                for (const deptoId of departamentos) {
                    await connection.query(
                        'INSERT INTO Departamento_Usuario (idUsuario_FK, idDepartamento_FK) VALUES (?, ?)',
                        [usuarioId, deptoId]
                    );
                }
            }
            
            // Associate permissions if provided
            if (permisos && permisos.length > 0) {
                for (const permisoId of permisos) {
                    await connection.query(
                        'INSERT INTO Permiso_Usuario (idUsuario_FK, idPermiso_FK) VALUES (?, ?)',
                        [usuarioId, permisoId]
                    );
                }
            }
            
            await connection.commit();
            
            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Usuario creado correctamente',
                    id: usuarioId
                },
                { status: 201 }
            );
            
        } catch (error) {
            await connection.rollback();
            throw error;
        }
        
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Error al crear usuario' },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}