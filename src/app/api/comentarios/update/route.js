/**
 * API ENDPOINT: /api/comentarios/update
 * MÉTODO: PUT
 * PROPÓSITO: Actualizar el contenido de comentarios existentes en órdenes de compra
 * 
 * FUNCIONALIDAD:
 * - Permite editar el texto de comentarios ya publicados
 * - Implementa control de permisos (solo autor o admin)
 * - Valida el contenido del comentario antes de actualizar
 * - Retorna el comentario actualizado con información del usuario
 * 
 * CARACTERÍSTICAS:
 * - Validación de contenido no vacío
 * - Limpieza automática de espacios en blanco
 * - Verificación de propiedad del comentario
 * - Respuesta con datos actualizados del comentario
 * 
 * CONTROL DE PERMISOS:
 * - Usuario autenticado requerido
 * - Solo el autor original puede editar su comentario
 * - Los administradores pueden editar cualquier comentario
 * - Validación de existencia previa del comentario
 * 
 * PARÁMETROS REQUERIDOS:
 * - id: ID del comentario a actualizar
 * - comentario: Nuevo texto del comentario (no vacío)
 * 
 * VALIDACIONES:
 * - Verificación de sesión activa
 * - Validación de parámetros requeridos
 * - Verificación de contenido no vacío
 * - Control de propiedad del comentario
 * - Verificación de existencia del comentario
 * 
 * PROCESO DE ACTUALIZACIÓN:
 * 1. Verificar autenticación y parámetros
 * 2. Validar existencia y permisos
 * 3. Actualizar contenido del comentario
 * 4. Recuperar comentario actualizado con datos del usuario
 * 5. Retornar resultado completo
 * 
 * RESPUESTAS:
 * - 200: Actualización exitosa con datos del comentario
 * - 400: Parámetros faltantes o inválidos
 * - 401: Usuario no autenticado
 * - 403: Sin permisos para editar
 * - 404: Comentario no encontrado
 * - 500: Error del servidor
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function PUT(request) {
    try {
        // Verificar la sesión del usuario
        // Solo usuarios autenticados pueden actualizar comentarios
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Extraer parámetros del cuerpo de la petición
        const { id, comentario } = await request.json();

        // Validación exhaustiva de parámetros de entrada
        // Verificamos ID presente y contenido de comentario no vacío
        if (!id || !comentario || comentario.trim() === '') {
            return NextResponse.json(
                { error: 'ID del comentario y texto son requeridos' },
                { status: 400 }
            );
        }

        // Obtener conexión del pool de base de datos
        const connection = await pool.getConnection();
        
        try {
            // PASO 1: Verificar existencia del comentario y obtener datos de propiedad
            // Esta consulta nos permite validar tanto existencia como permisos
            const [comentarioCheck] = await connection.query(
                'SELECT * FROM Comentario_Orden WHERE id = ?',
                [id]
            );

            // Verificar que el comentario existe en el sistema
            if (comentarioCheck.length === 0) {
                return NextResponse.json(
                    { error: 'El comentario no existe' },
                    { status: 404 }
                );
            }

            // PASO 2: Control de permisos granular para edición
            // Solo el autor original del comentario o un administrador pueden editarlo
            // Esto mantiene la integridad de autoría de los comentarios
            if (comentarioCheck[0].idUsuario_FK !== session.user.id && !session.user.isAdmin) {
                return NextResponse.json(
                    { error: 'No tienes permisos para editar este comentario' },
                    { status: 403 }
                );
            }

            // PASO 3: Ejecutar la actualización del comentario
            // Limpiamos el texto y actualizamos solo el contenido
            const [result] = await connection.query(
                'UPDATE Comentario_Orden SET comentario = ? WHERE id = ?',
                [comentario.trim(), id]
            );

            // Verificar que la actualización fue procesada correctamente
            if (result.affectedRows === 0) {
                return NextResponse.json(
                    { error: 'No se pudo actualizar el comentario' },
                    { status: 500 }
                );
            }

            // PASO 4: Recuperar el comentario actualizado con información del usuario
            // Esto proporciona datos completos para actualizar la interfaz de usuario
            const [comentarioActualizado] = await connection.query(
                `SELECT co.*, u.nombre as usuario_nombre 
                 FROM Comentario_Orden co 
                 JOIN Usuario u ON u.id = co.idUsuario_FK 
                 WHERE co.id = ?`,
                [id]
            );

            // Respuesta exitosa con el comentario actualizado
            return NextResponse.json({
                success: true,
                comentario: comentarioActualizado[0]
            }, { status: 200 });

        } finally {
            // Liberar la conexión de vuelta al pool
            // Esencial para mantener la disponibilidad del pool de conexiones
            connection.release();
        }
    } catch (error) {
        // Manejo de errores global con logging detallado
        console.error('Error al actualizar comentario:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
} 