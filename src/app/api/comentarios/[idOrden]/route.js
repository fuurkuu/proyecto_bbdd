/**
 * API ENDPOINT: /api/comentarios/[idOrden]
 * MÉTODO: GET
 * PROPÓSITO: Obtener todos los comentarios asociados a una orden de compra específica
 * 
 * FUNCIONALIDAD:
 * - Recupera todos los comentarios de una orden de compra
 * - Incluye información del usuario autor de cada comentario
 * - Ordena comentarios por fecha de creación (más recientes primero)
 * - Utiliza rutas dinámicas de Next.js para el ID de orden
 * 
 * CARACTERÍSTICAS:
 * - Ruta dinámica con parámetro [idOrden]
 * - JOIN con tabla Usuario para obtener nombres de autores
 * - Ordenamiento cronológico inverso (DESC)
 * - Respuesta estructurada con metadatos de éxito
 * 
 * ESTRUCTURA DE CONSULTA:
 * - Tabla principal: Comentario_Orden
 * - JOIN: Usuario (para obtener nombre del autor)
 * - Filtro: Por ID de orden de compra específica
 * - Orden: Por fecha de creación descendente
 * 
 * PARÁMETROS:
 * - idOrden (ruta): ID de la orden de compra a consultar
 * 
 * VALIDACIONES:
 * - Verificación de sesión activa
 * - Validación de parámetro idOrden presente
 * - Control de acceso básico (usuario autenticado)
 * 
 * ESTRUCTURA DE RESPUESTA:
 * - success: boolean de éxito
 * - comentarios: Array de comentarios con datos del usuario
 * 
 * CAMPOS RETORNADOS POR COMENTARIO:
 * - Todos los campos de Comentario_Orden (id, comentario, fecha_creacion, etc.)
 * - nombre: Nombre del usuario autor del comentario
 * 
 * CASOS DE USO:
 * - Vista detallada de orden de compra
 * - Historial de comentarios en tiempo real
 * - Seguimiento de comunicación sobre órdenes
 * - Interfaz de comentarios en frontend
 * 
 * RESPUESTAS:
 * - 200: Lista de comentarios obtenida exitosamente
 * - 400: Parámetro idOrden faltante
 * - 401: Usuario no autenticado
 * - 500: Error del servidor
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Handler para obtener comentarios de una orden específica
// Utiliza el patrón de rutas dinámicas de Next.js
export async function GET(request, { params }) {
    try {
        // Resolver los parámetros de la ruta dinámica
        // En Next.js 13+, params es una Promise que debe ser resuelta
        const resolvedParams = await params;
        
        // Verificar la sesión del usuario
        // Control de acceso básico - solo usuarios autenticados pueden ver comentarios
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Extraer el ID de la orden desde los parámetros de la ruta
        const { idOrden } = resolvedParams;
        
        // Validación del parámetro de ruta
        if (!idOrden) {
            return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
        }

        // Obtener conexión del pool de base de datos
        const connection = await pool.getConnection();
        
        try {
            // CONSULTA PRINCIPAL: Obtener comentarios con información del usuario autor
            // Esta consulta combina las tablas Comentario_Orden y Usuario para
            // proporcionar información completa de cada comentario:
            // 
            // JOINS:
            // - Comentario_Orden: Datos del comentario (texto, fecha, etc.)
            // - Usuario: Información del autor (nombre para mostrar)
            // 
            // FILTROS:
            // - idOrden_Compra_FK: Solo comentarios de la orden específica
            // 
            // ORDENAMIENTO:
            // - fecha_creacion DESC: Comentarios más recientes primero
            const [comentarios] = await connection.query(
                `SELECT co.*, u.nombre
                 FROM Comentario_Orden co 
                 JOIN Usuario u ON u.id = co.idUsuario_FK 
                 WHERE co.idOrden_Compra_FK = ? 
                 ORDER BY co.fecha_creacion DESC`,
                [idOrden]
            );

            // Respuesta exitosa con lista de comentarios
            // Estructura consistente con otros endpoints de la API
            return NextResponse.json({
                success: true,
                comentarios: comentarios
            }, { status: 200 });

        } finally {
            // Liberar la conexión de vuelta al pool
            // Importante para evitar agotamiento de conexiones
            connection.release();
        }
        
    } catch (error) {
        // Manejo de errores global con logging para debugging
        console.error('Error al obtener comentarios:', error);
        return NextResponse.json({
            error: 'Error al procesar la solicitud'
        }, { status: 500 });
    }
} 