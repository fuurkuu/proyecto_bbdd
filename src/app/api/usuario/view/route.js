import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { query } = body;
        var result = [];
        
        if (!query || query === '') {
            [result] = await pool.query(`
                SELECT u.id, u.nombre, u.email, u.cargo,
                GROUP_CONCAT(DISTINCT d.nombre SEPARATOR ', ') as departamentos,
                GROUP_CONCAT(DISTINCT p.tipo SEPARATOR ', ') as permisos 
                FROM Usuario u
                LEFT JOIN Departamento_Usuario du ON u.id = du.idUsuario_FK
                LEFT JOIN Departamento d ON d.id = du.idDepartamento_FK
                LEFT JOIN Permiso_Usuario pu ON u.id = pu.idUsuario_FK
                LEFT JOIN Permiso p ON p.id = pu.idPermiso_FK
                GROUP BY u.id, u.nombre, u.email, u.cargo
            `);
        } else {
            [result] = await pool.query(`
                SELECT u.id, u.nombre, u.email, u.cargo, 
                GROUP_CONCAT(DISTINCT d.nombre SEPARATOR ', ') as departamentos,
                GROUP_CONCAT(DISTINCT p.tipo SEPARATOR ', ') as permisos 
                FROM Usuario u
                LEFT JOIN Departamento_Usuario du ON u.id = du.idUsuario_FK
                LEFT JOIN Departamento d ON d.id = du.idDepartamento_FK
                LEFT JOIN Permiso_Usuario pu ON u.id = pu.idUsuario_FK
                LEFT JOIN Permiso p ON p.id = pu.idPermiso_FK
                WHERE u.nombre LIKE ?
                GROUP BY u.id, u.nombre, u.email, u.cargo
            `, [`%${query}%`]);
        }

        return NextResponse.json(
            { result },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Error al obtener usuarios' },
            { status: 500 }
        );
    }
}