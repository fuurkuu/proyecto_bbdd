/**
 * API ENDPOINT: /api/bolsa/getAllBolsa
 * MÉTODO: POST
 * PROPÓSITO: Obtener resumen financiero consolidado de bolsas por departamento
 * 
 * FUNCIONALIDAD:
 * - Calcula totales de presupuesto e inversión para un departamento específico
 * - Agrupa información financiera de múltiples bolsas
 * - Proporciona vista consolidada para dashboard departamental
 * 
 * CONSULTA COMPLEJA:
 * La consulta SQL realiza múltiples JOINs para relacionar:
 * - Bolsa (dinero asignado y año)
 * - Inversión y Presupuesto (por departamento)
 * - Compras asociadas (Compra_Inversion, Compra_Presupuesto)
 * - Órdenes de compra (importes gastados)
 * 
 * CÁLCULOS:
 * - total_presupuesto: Suma de importes gastados en presupuestos
 * - total_inversion: Suma de importes gastados en inversiones
 * - DINERO: Monto total asignado en las bolsas
 * - ANO: Año fiscal de las bolsas
 * 
 * PARÁMETROS:
 * - id: ID del departamento para filtrar bolsas
 * 
 * LIMITACIONES ACTUALES:
 * - Falta validación de autenticación
 * - Manejo de errores básico
 * - No incluye validación de permisos departamentales
 * 
 * USO TÍPICO:
 * - Dashboard financiero por departamento
 * - Reportes de gastos consolidados
 * - Análisis comparativo presupuesto vs inversión
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Extraer el ID del departamento del cuerpo de la petición
        const body = await request.json();
        const { id } = body;
        
        // CONSULTA PRINCIPAL: Resumen financiero departamental
        // Esta consulta compleja combina múltiples tablas para calcular:
        // 1. Dinero total asignado al departamento (DINERO)
        // 2. Año fiscal de las bolsas (ANO)
        // 3. Total gastado en presupuestos (total_presupuesto)
        // 4. Total gastado en inversiones (total_inversion)
        var [result] = await pool.query(`SELECT 
    b.DINERO, 
    b.ANO,
    SUM(oc1.importe) AS total_presupuesto,
    SUM(oc2.importe) AS total_inversion
FROM 
    bbdd.Bolsa AS b
    JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
    JOIN bbdd.Departamento AS d1 ON d1.id = i.idDepartamento_FK
    JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
    JOIN bbdd.Presupuesto AS p ON p.idBolsa_FK = b.id
    JOIN bbdd.Departamento AS d2 ON d2.id = p.idDepartamento_FK
    JOIN bbdd.Compra_Presupuesto AS cp ON cp.idPresupuesto_FK = p.id
    JOIN bbdd.Orden_Compra AS oc1 ON oc1.id = cp.idOrden_Compra_FK
    JOIN bbdd.Orden_Compra AS oc2 ON oc2.id = ci.idOrden_Compra_FK
     WHERE d1.id = ? AND d2.id = ?
GROUP BY 
    b.DINERO, b.ANO`, [id,id]);
        

        // Retornar resultados del resumen financiero
        return NextResponse.json(
            { result },
            { status: 200 }
        );
    } catch (error) {
        // Logging del error para debugging
        console.error('Error fetching data:', error);
        
        // Respuesta de error genérica
        // TODO: Implementar manejo de errores más específico
        return NextResponse.json(
            { error: 'Error' },
            { status: 500 }
        );
    }
}

