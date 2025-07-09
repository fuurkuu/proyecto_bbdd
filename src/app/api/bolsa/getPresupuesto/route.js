/**
 * API ENDPOINT: /api/bolsa/getPresupuesto
 * MÉTODO: GET
 * PROPÓSITO: Obtener información detallada de un presupuesto específico y sus órdenes de compra
 * 
 * FUNCIONALIDAD:
 * - Recupera datos completos de un presupuesto basado en ID de bolsa
 * - Calcula el total gastado mediante órdenes de compra asociadas
 * - Obtiene la orden de compra más reciente para mostrar detalles
 * - Incluye información del proveedor asociado
 * 
 * PARÁMETROS:
 * - id (query param): ID de la bolsa del presupuesto a consultar
 * 
 * CONSULTAS SQL:
 * 1. Datos principales: bolsa + total gastado (JOIN múltiple con agregación)
 * 2. Orden más reciente: última compra con detalles del proveedor
 * 
 * ESTRUCTURA DE RESPUESTA:
 * - id, dinero, ano: Datos básicos de la bolsa
 * - total: Suma de todos los importes de órdenes de compra
 * - ordenCompra: Detalles de la compra más reciente (opcional)
 * 
 * VALIDACIONES:
 * - Verificación de sesión de usuario
 * - Validación de ID proporcionado
 * - Verificación de existencia del presupuesto
 * 
 * CASOS DE USO:
 * - Dashboard de presupuestos departamentales
 * - Seguimiento de gastos por categoría
 * - Auditoría de compras realizadas
 */

import { NextResponse } from 'next/server';
import { pool } from '../../sql/sql.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request) {
  try {
    // Verificar la sesión del usuario
    // Todos los usuarios autenticados pueden consultar presupuestos
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Acceso no autorizado a getPresupuesto");
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Extraer el ID de la bolsa desde los parámetros de consulta
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log("ID recibido en getPresupuesto:", id);

    // Validación exhaustiva del ID
    // Verificamos que no sea nulo, undefined, o strings equivalentes
    if (!id || id === 'undefined' || id === 'null') {
      console.log("ID no proporcionado o inválido:", id);
      return NextResponse.json({ error: 'ID no proporcionado o inválido' }, { status: 400 });
    }

    // Obtener conexión del pool para las consultas
    const connection = await pool.getConnection();
    
    try {
      // CONSULTA PRINCIPAL: Obtener datos del presupuesto con total gastado
      // Esta consulta compleja une múltiples tablas para calcular:
      // - Información básica de la bolsa (id, dinero, año)
      // - Total gastado sumando todas las órdenes de compra relacionadas
      console.log("Ejecutando consulta para obtener datos de presupuesto con ID:", id);
      const [result] = await connection.query(`
        SELECT b.id, b.dinero, b.ano, COALESCE(SUM(oc.importe), 0) AS total
        FROM bbdd.Bolsa AS b
        LEFT JOIN bbdd.Presupuesto AS p ON p.idBolsa_FK = b.id
        LEFT JOIN bbdd.Compra_Presupuesto AS cp ON cp.idPresupuesto_FK = p.id
        LEFT JOIN bbdd.Orden_Compra AS oc ON oc.id = cp.idOrden_Compra_FK
        WHERE b.id = ?
        GROUP BY b.id, b.dinero, b.ano
      `, [id]);
      
      console.log("Resultado de la consulta de presupuesto:", result);
      
      // Verificar que el presupuesto existe
      if (result.length === 0) {
        console.log("Presupuesto no encontrado para ID:", id);
        return NextResponse.json(
          { error: 'Presupuesto no encontrado' }, 
          { status: 404 }
        );
      }
      
      // CONSULTA SECUNDARIA: Obtener detalles de la orden de compra más reciente
      // Esto proporciona información contextual sobre la última actividad del presupuesto
      // Incluye datos del proveedor para referencia completa
      console.log("Ejecutando consulta para obtener órdenes de compra para ID:", id);
      const [ordenesCompra] = await connection.query(`
        SELECT oc.id, oc.cod_compra AS codigo, oc.cantidad, oc.es_inventariable AS inventariable,
               oc.importe, oc.fecha, oc.observacion AS descripcion,
               oc.idProveedor_FK AS idProveedor, p.nombre AS nombreProveedor
        FROM bbdd.Bolsa AS b
        JOIN bbdd.Presupuesto AS pres ON pres.idBolsa_FK = b.id
        JOIN bbdd.Compra_Presupuesto AS cp ON cp.idPresupuesto_FK = pres.id
        JOIN bbdd.Orden_Compra AS oc ON oc.id = cp.idOrden_Compra_FK
        JOIN bbdd.Proveedor AS p ON p.id = oc.idProveedor_FK
        WHERE b.id = ?
        ORDER BY oc.fecha DESC
        LIMIT 1
      `, [id]);
      
      console.log("Órdenes de compra encontradas:", ordenesCompra.length);
      
      // Preparar la respuesta combinando ambas consultas
      const presupuestoData = result[0];
      
      // Añadir información de la orden más reciente si existe
      // Esto es opcional - algunos presupuestos pueden no tener órdenes aún
      if (ordenesCompra.length > 0) {
        presupuestoData.ordenCompra = ordenesCompra[0];
      }
      
      // Retornar datos completos del presupuesto
      return NextResponse.json(presupuestoData, { status: 200 });
      
    } catch (error) {
      // Log específico para errores de consulta SQL
      console.error("Error en la consulta SQL:", error);
      throw error;
    } finally {
      // Liberar conexión de vuelta al pool
      // Crítico para mantener la disponibilidad del pool
      connection.release();
    }
  } catch (error) {
    // Manejo de errores global con logging detallado
    console.error('Error al obtener datos de presupuesto:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    }, { status: 500 });
  }
} 