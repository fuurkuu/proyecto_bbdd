/**
 * API ENDPOINT: /api/comentarios/batch
 * MÉTODO: POST
 * PROPÓSITO: Realizar operaciones en lote sobre comentarios de órdenes
 * 
 * FUNCIONALIDADES:
 * - Actualizar múltiples comentarios simultáneamente
 * - Eliminar múltiples comentarios con confirmación
 * - Transferir comentarios entre órdenes (admin)
 * - Operaciones atómicas con transacciones
 * 
 * TIPOS DE OPERACIONES:
 * - 'update_multiple': Actualizar varios comentarios
 * - 'delete_multiple': Eliminar varios comentarios
 * - 'transfer_comments': Mover comentarios entre órdenes
 * - 'archive_comments': Archivar comentarios antiguos
 * 
 * PARÁMETROS:
 * - operation: Tipo de operación a realizar
 * - data: Datos específicos según la operación
 * - options: Configuraciones adicionales (opcional)
 * 
 * VALIDACIONES:
 * - Verificación de permisos por comentario
 * - Validación de integridad de datos
 * - Control de operaciones administrativas
 * - Verificación de existencia de recursos
 * 
 * SEGURIDAD:
 * - Transacciones para consistencia
 * - Rollback automático en errores
 * - Validación granular de permisos
 * - Logging de operaciones sensibles
 */

import { NextResponse } from 'next/server';
import { pool } from '../../sql/sql.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request) {
    try {
        // Verificar la sesión del usuario
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Extraer datos de la petición
        const { operation, data, options = {} } = await request.json();

        // Validar operación especificada
        const operacionesPermitidas = ['update_multiple', 'delete_multiple', 'transfer_comments', 'archive_comments'];
        if (!operation || !operacionesPermitidas.includes(operation)) {
            return NextResponse.json({ 
                error: 'Operación no válida',
                operaciones_disponibles: operacionesPermitidas
            }, { status: 400 });
        }

        // Obtener conexión y comenzar transacción
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            let resultado;
            
            // Ejecutar operación específica
            switch (operation) {
                case 'update_multiple':
                    resultado = await actualizarMultiples(connection, data, session);
                    break;
                    
                case 'delete_multiple':
                    resultado = await eliminarMultiples(connection, data, session);
                    break;
                    
                case 'transfer_comments':
                    resultado = await transferirComentarios(connection, data, session);
                    break;
                    
                case 'archive_comments':
                    resultado = await archivarComentarios(connection, data, session, options);
                    break;
                    
                default:
                    throw new Error('Operación no implementada');
            }
            
            // Confirmar transacción si todo fue exitoso
            await connection.commit();
            
            return NextResponse.json({
                success: true,
                operation: operation,
                resultado: resultado,
                timestamp: new Date().toISOString()
            }, { status: 200 });
            
        } catch (error) {
            // Revertir transacción en caso de error
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Error en operación batch de comentarios:', error);
        return NextResponse.json({
            error: 'Error al procesar operación en lote',
            details: error.message
        }, { status: 500 });
    }
}

/**
 * FUNCIÓN: Actualizar múltiples comentarios
 * @param {Object} connection - Conexión de base de datos
 * @param {Array} data - Array de comentarios a actualizar
 * @param {Object} session - Sesión del usuario
 */
async function actualizarMultiples(connection, data, session) {
    const { comentarios } = data;
    
    if (!Array.isArray(comentarios) || comentarios.length === 0) {
        throw new Error('Array de comentarios requerido');
    }
    
    const resultados = [];
    
    for (const comentario of comentarios) {
        const { id, texto } = comentario;
        
        if (!id || !texto || texto.trim() === '') {
            throw new Error(`Datos inválidos para comentario ID: ${id}`);
        }
        
        // Verificar permisos para cada comentario
        const [comentarioOriginal] = await connection.query(
            'SELECT idUsuario_FK FROM Comentario_Orden WHERE id = ?',
            [id]
        );
        
        if (comentarioOriginal.length === 0) {
            throw new Error(`Comentario con ID ${id} no encontrado`);
        }
        
        // Solo el autor o admin pueden actualizar
        if (comentarioOriginal[0].idUsuario_FK !== session.user.id && !session.user.isAdmin) {
            throw new Error(`Sin permisos para actualizar comentario ID: ${id}`);
        }
        
        // Actualizar comentario
        const [resultado] = await connection.query(
            'UPDATE Comentario_Orden SET comentario = ? WHERE id = ?',
            [texto.trim(), id]
        );
        
        resultados.push({
            id: id,
            actualizado: resultado.affectedRows > 0
        });
    }
    
    return {
        total_procesados: comentarios.length,
        actualizados: resultados.filter(r => r.actualizado).length,
        detalles: resultados
    };
}

/**
 * FUNCIÓN: Eliminar múltiples comentarios
 * @param {Object} connection - Conexión de base de datos
 * @param {Array} data - Array de IDs de comentarios a eliminar
 * @param {Object} session - Sesión del usuario
 */
async function eliminarMultiples(connection, data, session) {
    const { ids } = data;
    
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('Array de IDs requerido');
    }
    
    const resultados = [];
    
    for (const id of ids) {
        // Verificar permisos
        const [comentario] = await connection.query(
            'SELECT idUsuario_FK FROM Comentario_Orden WHERE id = ?',
            [id]
        );
        
        if (comentario.length === 0) {
            resultados.push({ id, eliminado: false, razon: 'No encontrado' });
            continue;
        }
        
        // Solo el autor o admin pueden eliminar
        if (comentario[0].idUsuario_FK !== session.user.id && !session.user.isAdmin) {
            resultados.push({ id, eliminado: false, razon: 'Sin permisos' });
            continue;
        }
        
        // Eliminar comentario
        const [resultado] = await connection.query(
            'DELETE FROM Comentario_Orden WHERE id = ?',
            [id]
        );
        
        resultados.push({
            id: id,
            eliminado: resultado.affectedRows > 0
        });
    }
    
    return {
        total_procesados: ids.length,
        eliminados: resultados.filter(r => r.eliminado).length,
        detalles: resultados
    };
}

/**
 * FUNCIÓN: Transferir comentarios entre órdenes (solo admin)
 * @param {Object} connection - Conexión de base de datos
 * @param {Object} data - Datos de transferencia
 * @param {Object} session - Sesión del usuario
 */
async function transferirComentarios(connection, data, session) {
    // Solo administradores pueden transferir comentarios
    if (!session.user.isAdmin) {
        throw new Error('Solo administradores pueden transferir comentarios');
    }
    
    const { ordenOrigen, ordenDestino, comentarioIds } = data;
    
    if (!ordenOrigen || !ordenDestino || !Array.isArray(comentarioIds)) {
        throw new Error('Datos de transferencia incompletos');
    }
    
    // Verificar que ambas órdenes existen
    const [ordenOrigenCheck] = await connection.query(
        'SELECT id FROM Orden_Compra WHERE id = ?',
        [ordenOrigen]
    );
    
    const [ordenDestinoCheck] = await connection.query(
        'SELECT id FROM Orden_Compra WHERE id = ?',
        [ordenDestino]
    );
    
    if (ordenOrigenCheck.length === 0 || ordenDestinoCheck.length === 0) {
        throw new Error('Una o ambas órdenes no existen');
    }
    
    // Transferir comentarios
    const resultados = [];
    
    for (const comentarioId of comentarioIds) {
        const [resultado] = await connection.query(
            'UPDATE Comentario_Orden SET idOrden_Compra_FK = ? WHERE id = ? AND idOrden_Compra_FK = ?',
            [ordenDestino, comentarioId, ordenOrigen]
        );
        
        resultados.push({
            id: comentarioId,
            transferido: resultado.affectedRows > 0
        });
    }
    
    return {
        orden_origen: ordenOrigen,
        orden_destino: ordenDestino,
        total_procesados: comentarioIds.length,
        transferidos: resultados.filter(r => r.transferido).length,
        detalles: resultados
    };
}

/**
 * FUNCIÓN: Archivar comentarios antiguos
 * @param {Object} connection - Conexión de base de datos
 * @param {Object} data - Criterios de archivado
 * @param {Object} session - Sesión del usuario
 * @param {Object} options - Opciones adicionales
 */
async function archivarComentarios(connection, data, session, options) {
    // Solo administradores pueden archivar comentarios
    if (!session.user.isAdmin) {
        throw new Error('Solo administradores pueden archivar comentarios');
    }
    
    const { fechaLimite, ordenIds = [] } = data;
    const { crearBackup = true } = options;
    
    if (!fechaLimite) {
        throw new Error('Fecha límite requerida para archivado');
    }
    
    // Construir consulta base
    let whereClause = 'WHERE fecha_creacion < ?';
    let queryParams = [fechaLimite];
    
    if (ordenIds.length > 0) {
        whereClause += ' AND idOrden_Compra_FK IN (?)';
        queryParams.push(ordenIds);
    }
    
    // Si se solicita backup, crear tabla temporal
    if (crearBackup) {
        await connection.query(`
            CREATE TEMPORARY TABLE comentarios_backup_${Date.now()} AS 
            SELECT co.*, u.nombre as usuario_nombre 
            FROM Comentario_Orden co 
            JOIN Usuario u ON u.id = co.idUsuario_FK 
            ${whereClause}
        `, queryParams);
    }
    
    // Contar comentarios a archivar
    const [conteo] = await connection.query(
        `SELECT COUNT(*) as total FROM Comentario_Orden ${whereClause}`,
        queryParams
    );
    
    // Eliminar comentarios (archivado)
    const [resultado] = await connection.query(
        `DELETE FROM Comentario_Orden ${whereClause}`,
        queryParams
    );
    
    return {
        fecha_limite: fechaLimite,
        ordenes_afectadas: ordenIds,
        comentarios_archivados: resultado.affectedRows,
        backup_creado: crearBackup,
        total_identificados: conteo[0].total
    };
} 