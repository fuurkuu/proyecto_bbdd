import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { id, nombre, email, cargo, departamentos, permisos } = body;
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            );
        }
        
        if (!nombre || nombre.trim() === '') {
            return NextResponse.json(
                { error: 'El nombre del usuario es requerido' },
                { status: 400 }
            );
        }
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Update usuario with new fields
            await connection.query(
                'UPDATE Usuario SET nombre = ?, email = ?, cargo = ? WHERE id = ?', 
                [nombre, email || null, cargo || null, id]
            );
            
            // Delete existing department associations
            await connection.query(
                'DELETE FROM Departamento_Usuario WHERE idUsuario_FK = ?',
                [id]
            );
            
            // Add new department associations
            if (departamentos && departamentos.length > 0) {
                for (const deptoId of departamentos) {
                    await connection.query(
                        'INSERT INTO Departamento_Usuario (idUsuario_FK, idDepartamento_FK) VALUES (?, ?)',
                        [id, deptoId]
                    );
                }
            }
            
            // Delete existing permission associations
            await connection.query(
                'DELETE FROM Permiso_Usuario WHERE idUsuario_FK = ?',
                [id]
            );
            
            // Add new permission associations
            if (permisos && permisos.length > 0) {
                for (const permisoId of permisos) {
                    await connection.query(
                        'INSERT INTO Permiso_Usuario (idUsuario_FK, idPermiso_FK) VALUES (?, ?)',
                        [id, permisoId]
                    );
                }
            }
            
            await connection.commit();
            
            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Usuario actualizado correctamente' 
                },
                { status: 200 }
            );
            
        } catch (error) {
            await connection.rollback();
            throw error;
        }
        
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Error al actualizar usuario' },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}