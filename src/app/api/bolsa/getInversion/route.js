/**
 * API ENDPOINT: /api/bolsa/getInversion
 * MÉTODO: GET
 * PROPÓSITO: Obtener información detallada de una inversión específica y sus órdenes de compra
 * 
 * FUNCIONALIDAD:
 * - Recupera datos completos de una inversión basado en ID de bolsa
 * - Calcula el total gastado mediante órdenes de compra asociadas
 * - Obtiene la orden de compra más reciente con detalles del proveedor
 * - Incluye el código de inversión para trazabilidad
 * 
 * DIFERENCIAS CON PRESUPUESTO:
 * - Consulta tabla Inversion en lugar de Presupuesto
 * - Utiliza Compra_Inversion como tabla de relación
 * - Incluye campo numInversion (código único de inversión)
 * 
 * PARÁMETROS:
 * - id (query param): ID de la bolsa de la inversión a consultar
 * 
 * CONSULTAS SQL:
 * 1. Datos principales: bolsa + total gastado en inversiones
 * 2. Orden más reciente: última compra con código de inversión y proveedor
 * 
 * ESTRUCTURA DE RESPUESTA:
 * - id, dinero, ano: Datos básicos de la bolsa
 * - total: Suma de importes de órdenes de compra de inversión
 * - ordenCompra: Detalles de la compra más reciente (incluye codigoInversion)
 * 
 * CASOS DE USO:
 * - Gestión de inversiones departamentales
 * - Seguimiento de proyectos de capital
 * - Control de gastos en equipamiento
 */

import { NextResponse } from 'next/server';
import { pool } from '../../sql/sql.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request) {
  try {
    // Verificar la sesión del usuario
    // Control de acceso: solo usuarios autenticados pueden consultar inversiones
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Acceso no autorizado a getInversion");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Extraer el ID de la bolsa desde los parámetros de consulta URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log("ID recibido en getInversion:", id);

    // Validación robusta del ID recibido
    // Verificamos múltiples casos de valores inválidos o vacíos
    if (!id || id === 'undefined' || id === 'null') {
      console.log("ID no proporcionado o inválido:", id);
      return NextResponse.json({ error: 'ID no proporcionado o inválido' }, { status: 400 });
    }

    // Obtener conexión del pool de bases de datos
    const connection = await pool.getConnection();
    
    try {
      // CONSULTA PRINCIPAL: Obtener datos de inversión con total gastado
      // Similar a presupuesto pero usando tablas específicas de inversión:
      // - Bolsa -> Inversion -> Compra_Inversion -> Orden_Compra
      // - Calcula suma total de importes gastados en esta inversión
      console.log("Ejecutando consulta para obtener datos de inversión con ID:", id);
      const [result] = await connection.query(`
        SELECT b.id, b.dinero, b.ano, COALESCE(SUM(oc.importe), 0) AS total
        FROM bbdd.Bolsa AS b
        LEFT JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
        LEFT JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
        LEFT JOIN bbdd.Orden_Compra AS oc ON oc.id = ci.idOrden_Compra_FK
        WHERE b.id = ?
        GROUP BY b.id, b.dinero, b.ano
      `, [id]);
      
      console.log("Resultado de la consulta de inversión:", result);
      
      // Verificar que la inversión existe en el sistema
      if (result.length === 0) {
        console.log("Inversión no encontrada para ID:", id);
        return NextResponse.json(
          { error: 'Inversión no encontrada' }, 
          { status: 404 }
        );
      }
      
      // CONSULTA SECUNDARIA: Obtener detalles de la orden de compra más reciente
      // Específica para inversiones, incluye:
      // - Información completa de la orden de compra
      // - Datos del proveedor asociado
      // - Código único de inversión (numInversion) para trazabilidad
      console.log("Ejecutando consulta para obtener órdenes de compra para ID:", id);
      const [ordenesCompra] = await connection.query(`
        SELECT oc.id, oc.cod_compra AS codigo, oc.cantidad, oc.es_inventariable AS inventariable,
               oc.importe, oc.fecha, oc.observacion AS descripcion,
               oc.idProveedor_FK AS idProveedor, p.nombre AS nombreProveedor,
               ci.numInversion AS codigoInversion
        FROM bbdd.Bolsa AS b
        JOIN bbdd.Inversion AS i ON i.idBolsa_FK = b.id
        JOIN bbdd.Compra_Inversion AS ci ON ci.idInversion_FK = i.id
        JOIN bbdd.Orden_Compra AS oc ON oc.id = ci.idOrden_Compra_FK
        JOIN bbdd.Proveedor AS p ON p.id = oc.idProveedor_FK
        WHERE b.id = ?
        ORDER BY oc.fecha DESC
        LIMIT 1
      `, [id]);
      
      console.log("Órdenes de compra encontradas:", ordenesCompra.length);
      
      // Combinar resultados de ambas consultas
      const inversionData = result[0];
      
      // Añadir información de la orden más reciente si existe
      // Para inversiones nuevas sin órdenes, este campo será undefined
      if (ordenesCompra.length > 0) {
        inversionData.ordenCompra = ordenesCompra[0];
      }
      
      // Retornar datos completos de la inversión
      return NextResponse.json(inversionData, { status: 200 });
      
    } catch (error) {
      // Manejo específico de errores de consultas SQL
      console.error("Error en la consulta SQL:", error);
      throw error;
    } finally {
      // Liberar la conexión de vuelta al pool
      // Esencial para evitar agotamiento del pool de conexiones
      connection.release();
    }
  } catch (error) {
    // Manejo de errores global con logging completo
    console.error('Error al obtener datos de inversión:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    }, { status: 500 });
  }
} 