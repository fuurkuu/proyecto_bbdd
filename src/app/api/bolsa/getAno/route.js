/**
 * API ENDPOINT: /api/bolsa/getAno
 * MÉTODO: POST
 * PROPÓSITO: Obtener lista de años fiscales disponibles para un departamento específico
 * 
 * FUNCIONALIDAD:
 * - Consulta años únicos de bolsas asociadas a un departamento
 * - Proporciona datos para filtros de selección temporal
 * - Ordena resultados por ID de bolsa y año (más reciente primero)
 * 
 * CONSULTA SQL:
 * - Une tablas Bolsa, Inversion y Departamento
 * - Filtra por ID de departamento específico
 * - Retorna ID de bolsa y año correspondiente
 * - Ordena por año descendente para mostrar más recientes primero
 * 
 * PARÁMETROS:
 * - id: ID del departamento para filtrar años disponibles
 * 
 * ESTRUCTURA DE RESPUESTA:
 * - result: Array de objetos con campos 'id' (bolsa) y 'ano' (año)
 * 
 * CASOS DE USO:
 * - Dropdown de selección de año en interfaces
 * - Filtros temporales en reportes financieros
 * - Navegación histórica de presupuestos/inversiones
 * 
 * LIMITACIONES:
 * - Solo considera bolsas con inversiones (no presupuestos independientes)
 * - Falta validación de autenticación
 * - Manejo de errores básico
 * 
 * MEJORAS POTENCIALES:
 * - Incluir también años de presupuestos sin inversiones
 * - Añadir validación de permisos departamentales
 * - Implementar cache para consultas frecuentes
 */

import { pool } from '../../sql/sql.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Extraer el ID del departamento del cuerpo de la petición
        const body = await request.json();
        const { id } = body;
        
        // CONSULTA PRINCIPAL: Obtener años disponibles para el departamento
        // Esta consulta obtiene todos los años fiscales únicos de bolsas
        // que tienen inversiones asociadas al departamento especificado
        // 
        // FLUJO DE DATOS:
        // Bolsa -> Inversion -> Departamento
        // 
        // ORDENAMIENTO:
        // - Primero por ID de bolsa (identificador único)
        // - Luego por año descendente (más recientes primero)
        var [result] = await pool.query(`SELECT b.id, b.ano FROM 
    bbdd.Bolsa AS b
    JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
    JOIN bbdd.Departamento AS d1 ON d1.id = i.idDepartamento_FK
     WHERE d1.id = ? ORDER BY b.id, b.ano DESC`, [id]);

        // Retornar lista de años disponibles
        return NextResponse.json(
            { result },
            { status: 200 }
        );
    } catch (error) {
        // Manejo básico de errores
        // TODO: Implementar logging más detallado y categorización de errores
        return NextResponse.json(
            { error: 'Error al obtener datos'},
            { status: 500 }
        );
    }
}

