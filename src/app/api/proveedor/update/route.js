import { NextResponse } from 'next/server';
import { pool } from '@/app/api/sql/sql.js';

export async function POST(request) {
    let connection;
    try {
        const { id, nombre, departamentos } = await request.json();

        if (!id || !nombre || !departamentos || departamentos.length === 0) {
            return NextResponse.json(
                { error: 'Se requiere ID, nombre de proveedor y departamentos' },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE Proveedor SET nombre = ? WHERE id = ?',
                [nombre, id]
            );

            await connection.query(
                'DELETE FROM Proveedor_Departamento WHERE idProveedor_FK = ?',
                [id]
            );

            for (const deptoId of departamentos) {
                await connection.query(
                    'INSERT INTO Proveedor_Departamento (idProveedor_FK, idDepartamento_FK) VALUES (?, ?)',
                    [id, deptoId]
                );
            }

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Proveedor actualizado correctamente'
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