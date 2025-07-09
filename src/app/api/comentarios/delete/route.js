/**
 * API ENDPOINT: /api/comentarios/delete
 * MÉTODO: DELETE
 * PROPÓSITO: Eliminar comentarios de órdenes de compra con control de permisos
 * 
 * FUNCIONALIDAD:
 * - Permite eliminar comentarios asociados a órdenes de compra
 * - Implementa control de permisos granular (solo autor o admin)
 * - Verifica la existencia del comentario antes de proceder
 * - Mantiene trazabilidad y seguridad en la eliminación
 * 
 * CONTROL DE PERMISOS:
 * - Usuario autenticado requerido
 * - Solo el autor del comentario puede eliminarlo
 * - Los administradores pueden eliminar cualquier comentario
 * - Validación de propiedad del comentario
 * 
 * PARÁMETROS REQUERIDOS:
 * - id: ID del comentario a eliminar
 * 
 * VALIDACIONES:
 * - Verificación de sesión activa
 * - Validación de ID proporcionado
 * - Verificación de existencia del comentario
 * - Control de propiedad (autor o admin)
 * 
 * FLUJO DE SEGURIDAD:
 * 1. Verificar autenticación de usuario
 * 2. Validar parámetros de entrada
 * 3. Verificar existencia del comentario
 * 4. Validar permisos de eliminación
 * 5. Ejecutar eliminación
 * 6. Confirmar resultado
 * 
 * RESPUESTAS:
 * - 200: Eliminación exitosa
 * - 400: Parámetros faltantes o inválidos
 * - 401: Usuario no autenticado
 * - 403: Sin permisos para eliminar
 * - 404: Comentario no encontrado
 * - 500: Error del servidor
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function DELETE(request) {
    try {
        // Verificar la sesión del usuario
        // Solo usuarios autenticados pueden eliminar comentarios
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Extraer el ID del comentario del cuerpo de la petición
        const { id } = await request.json();

        // Validación del ID del comentario
        if (!id) {
            return NextResponse.json(
                { error: 'ID del comentario requerido' },
                { status: 400 }
            );
        }

        // Obtener conexión del pool de base de datos
        const connection = await pool.getConnection();
        
        try {
            // PASO 1: Verificar que el comentario existe y obtener información de propiedad
            // Esta consulta es crucial para el control de permisos posterior
            const [comentarioCheck] = await connection.query(
                'SELECT * FROM Comentario_Orden WHERE id = ?',
                [id]
            );

            // Verificar existencia del comentario
            if (comentarioCheck.length === 0) {
                return NextResponse.json(
                    { error: 'El comentario no existe' },
                    { status: 404 }
                );
            }

            // PASO 2: Control de permisos granular
            // Solo el autor del comentario o un administrador pueden eliminarlo
            // Esto protege contra eliminación no autorizada de comentarios
            if (comentarioCheck[0].idUsuario_FK !== session.user.id && !session.user.isAdmin) {
                return NextResponse.json(
                    { error: 'No tienes permisos para eliminar este comentario' },
                    { status: 403 }
                );
            }

            // PASO 3: Ejecutar la eliminación del comentario
            // Eliminación directa ya que las validaciones de seguridad fueron exitosas
            const [result] = await connection.query(
                'DELETE FROM Comentario_Orden WHERE id = ?',
                [id]
            );

            // Verificar que la eliminación fue exitosa
            // affectedRows = 0 indicaría un problema en la eliminación
            if (result.affectedRows === 0) {
                return NextResponse.json(
                    { error: 'No se pudo eliminar el comentario' },
                    { status: 500 }
                );
            }

            // Respuesta exitosa de eliminación
            return NextResponse.json({
                success: true,
                message: 'Comentario eliminado correctamente'
            }, { status: 200 });

        } finally {
            // Liberar la conexión de vuelta al pool
            // Crítico para mantener la disponibilidad del pool
            connection.release();
        }
    } catch (error) {
        // Manejo de errores global con logging para debugging
        console.error('Error al eliminar comentario:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
} 