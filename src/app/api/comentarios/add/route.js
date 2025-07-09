/**
 * API ENDPOINT: /api/comentarios/add
 * MÉTODO: POST
 * PROPÓSITO: Crear nuevos comentarios en órdenes de compra con control de permisos
 * 
 * FUNCIONALIDAD:
 * - Permite agregar comentarios a órdenes de compra existentes
 * - Implementa control de permisos de escritura
 * - Valida la existencia de la orden antes de crear el comentario
 * - Retorna el comentario creado con información del usuario
 * 
 * CARACTERÍSTICAS:
 * - Validación de permisos granular (admin o escritura)
 * - Verificación de existencia de orden de compra
 * - Limpieza automática de contenido (trim)
 * - Respuesta con comentario completo incluyendo datos del autor
 * - Asignación automática del usuario actual como autor
 * 
 * CONTROL DE PERMISOS:
 * - Usuario autenticado requerido
 * - Permisos de escritura (w) o admin necesarios
 * - Verificación de orden de compra válida
 * - Protección contra comentarios en órdenes inexistentes
 * 
 * PARÁMETROS REQUERIDOS:
 * - idOrdenCompra: ID de la orden de compra a comentar
 * - comentario: Texto del comentario (no vacío)
 * 
 * VALIDACIONES:
 * - Verificación de sesión activa
 * - Control de permisos de escritura
 * - Validación de parámetros requeridos
 * - Verificación de contenido no vacío
 * - Validación de existencia de orden de compra
 * 
 * PROCESO DE CREACIÓN:
 * 1. Verificar autenticación y permisos
 * 2. Validar parámetros de entrada
 * 3. Verificar existencia de orden de compra
 * 4. Insertar nuevo comentario
 * 5. Recuperar comentario creado con datos del usuario
 * 6. Retornar resultado completo
 * 
 * CAMPOS AUTO-ASIGNADOS:
 * - idUsuario_FK: ID del usuario actual de la sesión
 * - fecha_creacion: Timestamp automático de la base de datos
 * 
 * RESPUESTAS:
 * - 201: Comentario creado exitosamente
 * - 400: Parámetros faltantes o inválidos
 * - 401: Usuario no autenticado
 * - 403: Sin permisos de escritura
 * - 404: Orden de compra no encontrada
 * - 500: Error del servidor
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request) {
    try {
        // Verificar la sesión del usuario
        // Solo usuarios autenticados pueden agregar comentarios
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Control de permisos granular para creación de comentarios
        // Solo los usuarios con permiso de escritura pueden agregar comentarios
        // Esto mantiene el control sobre quién puede participar en las discusiones
        if (!session.user.isAdmin && !session.user.permisos.w) {
            return NextResponse.json({ error: 'No tienes permisos para realizar esta acción' }, { status: 403 });
        }

        // Extraer parámetros del cuerpo de la petición
        const { idOrdenCompra, comentario } = await request.json();

        // Validación exhaustiva de parámetros requeridos
        // Verificamos ID de orden presente y contenido de comentario válido
        if (!idOrdenCompra || !comentario || comentario.trim() === '') {
            return NextResponse.json(
                { error: 'ID de orden y comentario son requeridos' },
                { status: 400 }
            );
        }

        // Obtener conexión del pool de base de datos
        const connection = await pool.getConnection();
        
        try {
            // PASO 1: Verificar que la orden de compra existe
            // Esta validación previene comentarios órfanos en órdenes inexistentes
            // y proporciona feedback claro si la orden fue eliminada
            const [ordenCheck] = await connection.query(
                'SELECT id FROM Orden_Compra WHERE id = ?',
                [idOrdenCompra]
            );

            // Verificar existencia de la orden de compra
            if (ordenCheck.length === 0) {
                return NextResponse.json(
                    { error: 'La orden de compra no existe' },
                    { status: 404 }
                );
            }

            // PASO 2: Insertar el nuevo comentario
            // La inserción incluye:
            // - comentario: Texto limpio del comentario
            // - idOrden_Compra_FK: Relación con la orden de compra
            // - idUsuario_FK: Usuario actual como autor del comentario
            const [result] = await connection.query(
                'INSERT INTO Comentario_Orden (comentario, idOrden_Compra_FK, idUsuario_FK) VALUES (?, ?, ?)',
                [comentario.trim(), idOrdenCompra, session.user.id]
            );

            // PASO 3: Recuperar el comentario recién creado con información del usuario
            // Esto proporciona los datos completos necesarios para actualizar la interfaz
            // Incluye el nombre del usuario para mostrar en la lista de comentarios
            const [comentarioCreado] = await connection.query(
                `SELECT co.*, u.nombre as usuario_nombre 
                 FROM Comentario_Orden co 
                 JOIN Usuario u ON u.id = co.idUsuario_FK 
                 WHERE co.id = ?`,
                [result.insertId]
            );

            // Respuesta exitosa con el comentario creado
            // Status 201 indica creación exitosa de recurso
            return NextResponse.json({
                success: true,
                comentario: comentarioCreado[0]
            }, { status: 201 });

        } finally {
            // Liberar la conexión de vuelta al pool
            // Crítico para mantener la disponibilidad del pool de conexiones
            connection.release();
        }
    } catch (error) {
        // Manejo de errores global con logging detallado
        console.error('Error al agregar comentario:', error);
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        );
    }
} 