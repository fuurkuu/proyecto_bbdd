/**
 * API ENDPOINT: /api/bolsa/deleteOrden
 * MÉTODO: POST
 * PROPÓSITO: Eliminar una orden de compra específica y todos sus registros relacionados
 * 
 * FUNCIONALIDAD:
 * - Elimina completamente una orden de compra del sistema
 * - Maneja eliminación en cascada de registros dependientes
 * - Soporta tanto órdenes de inversión como de presupuesto
 * - Utiliza transacciones para garantizar consistencia de datos
 * 
 * PROCESO DE ELIMINACIÓN (en orden):
 * 1. Verificar existencia de la orden
 * 2. Eliminar facturas asociadas (tabla Factura)
 * 3. Eliminar relación de compra (Compra_Inversion o Compra_Presupuesto)
 * 4. Eliminar la orden principal (Orden_Compra)
 * 
 * PARÁMETROS REQUERIDOS:
 * - id: ID de la orden de compra a eliminar
 * - type: Tipo de orden ('inversion' o 'presupuesto')
 * 
 * VALIDACIONES:
 * - Verificación de parámetros requeridos
 * - Validación del tipo de orden
 * - Verificación de existencia de la orden antes de eliminar
 * 
 * SEGURIDAD:
 * - Transacciones para rollback automático en caso de error
 * - Validación de integridad referencial
 * - Manejo de errores específicos para cada paso
 * 
 * NOTA: Este endpoint no incluye autenticación explícita,
 * pero debería implementarse en producción
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    let connection;
    try {
        // Extraer parámetros del cuerpo de la petición
        const { id, type } = await request.json();
        
        // Validación del ID de la orden
        // Parámetro crítico que identifica la orden a eliminar
        if (!id) {
            return NextResponse.json(
                { error: 'ID de la orden requerido' },
                { status: 400 }
            );
        }
        
        // Validación del tipo de orden
        // Solo se aceptan 'inversion' o 'presupuesto' para determinar
        // qué tabla de relación usar (Compra_Inversion vs Compra_Presupuesto)
        if (!type || (type !== 'inversion' && type !== 'presupuesto')) {
            return NextResponse.json(
                { error: 'Tipo de orden inválido' },
                { status: 400 }
            );
        }
        
        // Obtener conexión del pool y iniciar transacción
        // La transacción es crítica para mantener integridad referencial
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // PASO 1: Verificar que la orden existe antes de proceder
            // Evita errores silenciosos y proporciona feedback claro
            const [ordenCheck] = await connection.query(
                'SELECT id FROM Orden_Compra WHERE id = ?',
                [id]
            );
            
            if (ordenCheck.length === 0) {
                return NextResponse.json(
                    { error: 'La orden de compra no existe' },
                    { status: 404 }
                );
            }
            
            // PASO 2: Eliminar facturas asociadas
            // Las facturas deben eliminarse primero debido a restricciones FK
            // Esto previene errores de integridad referencial
            await connection.query(
                'DELETE FROM Factura WHERE idOrden_Compra_FK = ?',
                [id]
            );
            
            // PASO 3: Eliminar relación específica según el tipo
            // Diferentes tipos de orden tienen diferentes tablas de relación
            if (type === 'inversion') {
                // Para inversiones: eliminar de Compra_Inversion
                await connection.query(
                    'DELETE FROM Compra_Inversion WHERE idOrden_Compra_FK = ?',
                    [id]
                );
            } else {
                // Para presupuestos: eliminar de Compra_Presupuesto
                await connection.query(
                    'DELETE FROM Compra_Presupuesto WHERE idOrden_Compra_FK = ?',
                    [id]
                );
            }
            
            // PASO 4: Eliminar la orden principal
            // Último paso después de limpiar todas las dependencias
            const [result] = await connection.query(
                'DELETE FROM Orden_Compra WHERE id = ?',
                [id]
            );
            
            // Confirmar todas las operaciones de la transacción
            // Solo se ejecuta si todos los pasos anteriores fueron exitosos
            await connection.commit();
            
            // Respuesta exitosa con información del resultado
            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Orden eliminada correctamente',
                    affectedRows: result.affectedRows  // Confirmación de eliminación
                },
                { status: 200 }
            );
        } catch (error) {
            // En caso de error en cualquier paso, revertir toda la transacción
            // Esto garantiza que la base de datos permanezca en estado consistente
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        // Manejo de errores global con mensaje apropiado
        return NextResponse.json(
            { error: error.message || 'Error al eliminar orden' },
            { status: 500 }
        );
    } finally {
        // Siempre liberar la conexión de vuelta al pool
        // Crítico para evitar agotamiento de conexiones
        if (connection) {
            connection.release();
        }
    }
}