/**
 * ============================================================================
 * API - OBTENER DETALLES DE USUARIO
 * ============================================================================
 * Endpoint para obtener información completa de un usuario específico,
 * incluyendo sus departamentos asignados, permisos y listas de todos
 * los departamentos/permisos disponibles en el sistema.
 * 
 * Método: POST
 * Ruta: /api/usuario/get
 * Autenticación: Requerida (middleware)
 * Permisos: Todos los usuarios autenticados
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

/**
 * HANDLER POST - OBTENER DETALLES DE USUARIO
 * Consulta la base de datos para obtener información completa de un usuario
 * 
 * @param {Request} request - Request con {id} en el body
 * @returns {NextResponse} - Datos del usuario, departamentos y permisos
 */
export async function POST(request) {
    let connection;
    try {
        // Extraer ID del usuario desde el body de la petición
        const body = await request.json();
        const { id } = body;
        
        // Validar que se proporcione el ID requerido
        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            );
        }
        
        // Obtener conexión del pool para transacciones
        connection = await pool.getConnection();
        
        // ========================================================================
        // CONSULTA 1: OBTENER DATOS BÁSICOS DEL USUARIO
        // ========================================================================
        const [usuario] = await connection.query(`
            SELECT u.id, u.nombre, u.email, u.cargo 
            FROM Usuario u 
            WHERE u.id = ?
        `, [id]);
        
        // Verificar si el usuario existe
        if (usuario.length === 0) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }
        
        // ========================================================================
        // CONSULTA 2: OBTENER DEPARTAMENTOS ASIGNADOS AL USUARIO
        // ========================================================================
        const [departamentos] = await connection.query(`
            SELECT d.id, d.nombre 
            FROM Departamento d
            JOIN Departamento_Usuario du ON d.id = du.idDepartamento_FK
            WHERE du.idUsuario_FK = ?
        `, [id]);
        
        // ========================================================================
        // CONSULTA 3: OBTENER PERMISOS ASIGNADOS AL USUARIO
        // ========================================================================
        const [permisos] = await connection.query(`
            SELECT p.id, p.tipo 
            FROM Permiso p
            JOIN Permiso_Usuario pu ON p.id = pu.idPermiso_FK
            WHERE pu.idUsuario_FK = ?
        `, [id]);
        
        // ========================================================================
        // CONSULTAS AUXILIARES: OBTENER TODOS LOS DEPARTAMENTOS Y PERMISOS
        // (Para formularios de edición)
        // ========================================================================
        
        // Todos los departamentos disponibles en el sistema
        const [allDepartamentos] = await connection.query(`
            SELECT id, nombre FROM Departamento
        `);
        
        // Todos los permisos disponibles en el sistema
        const [allPermisos] = await connection.query(`
            SELECT id, tipo FROM Permiso
        `);

        // Retornar respuesta exitosa con todos los datos
        return NextResponse.json({
            usuario: usuario[0],        // Datos básicos del usuario
            departamentos,              // Departamentos asignados
            permisos,                  // Permisos asignados
            allDepartamentos,          // Todos los departamentos (para selección)
            allPermisos               // Todos los permisos (para selección)
        }, { status: 200 });
        
    } catch (error) {
        // Manejo de errores de base de datos o servidor
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { error: 'Error al obtener detalles del usuario' },
            { status: 500 }
        );
    } finally {
        // Liberar la conexión de vuelta al pool
        if (connection) {
            connection.release();
        }
    }
}