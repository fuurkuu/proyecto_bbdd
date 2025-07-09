/**
 * API ENDPOINT: /api/bolsa/update
 * MÉTODO: POST
 * PROPÓSITO: Actualizar el monto de dinero de una bolsa específica (inversión o presupuesto)
 * 
 * FUNCIONALIDAD:
 * - Permite a administradores y usuarios con permisos de escritura actualizar bolsas
 * - Actualiza el campo 'dinero' de una bolsa específica en la base de datos
 * - Utiliza transacciones para garantizar la integridad de los datos
 * - Valida permisos de usuario y formato de datos antes de procesar
 * 
 * PARÁMETROS REQUERIDOS:
 * - id: ID de la bolsa a actualizar
 * - dinero: Nuevo monto a asignar (debe ser un número válido)
 * - tipo: Tipo de bolsa ('inversion' o 'presupuesto') para mensajes personalizados
 * 
 * VALIDACIONES:
 * - Verificación de sesión activa de usuario
 * - Control de permisos (admin o escritura)
 * - Validación de ID proporcionado
 * - Validación de formato numérico del dinero
 * 
 * RESPUESTAS:
 * - 200: Actualización exitosa
 * - 400: Datos inválidos o faltantes
 * - 401: Usuario no autenticado
 * - 403: Sin permisos suficientes
 * - 500: Error del servidor
 */

import { NextResponse } from 'next/server';
import { pool } from '../../sql/sql.js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request) {
  try {
    // Verificar la sesión del usuario
    // Solo usuarios autenticados pueden acceder a esta funcionalidad
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Control de permisos granular
    // Solo los administradores o usuarios con permiso de escritura pueden editar bolsas
    // Esto protege la integridad financiera del sistema
    if (!session.user.isAdmin && !session.user.permisos.w) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción' }, { status: 403 });
    }

    // Extraer y validar los datos del cuerpo de la petición
    const { id, dinero, tipo } = await request.json();

    // Validación del ID de la bolsa
    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    // Validación del formato del dinero
    // Debe ser un número válido para evitar corrupción de datos financieros
    if (isNaN(parseFloat(dinero))) {
      return NextResponse.json({ error: 'El valor del presupuesto debe ser un número válido' }, { status: 400 });
    }

    // Obtener la conexión de la base de datos del pool de conexiones
    const connection = await pool.getConnection();
    
    try {
      // Iniciar transacción para garantizar consistencia de datos
      // Si algo falla, todos los cambios se revierten automáticamente
      await connection.beginTransaction();
      
      // Ejecutar la actualización de la bolsa
      // Convertimos el dinero a float para almacenamiento correcto
      const [result] = await connection.query(
        'UPDATE Bolsa SET dinero = ? WHERE id = ?',
        [parseFloat(dinero), id]
      );
      
      // Verificar que la actualización afectó alguna fila
      // Si no se afectó ninguna fila, significa que el ID no existe
      if (result.affectedRows === 0) {
        throw new Error('No se encontró la bolsa con el ID proporcionado');
      }
      
      // Confirmar la transacción si todo salió bien
      await connection.commit();
      
      // Respuesta exitosa con mensaje personalizado según el tipo
      return NextResponse.json({
        success: true,
        message: `${tipo === 'inversion' ? 'Inversión' : 'Presupuesto'} actualizado correctamente`
      }, { status: 200 });
      
    } catch (error) {
      // En caso de error, revertir todos los cambios de la transacción
      await connection.rollback();
      throw error;
    } finally {
      // Siempre liberar la conexión de vuelta al pool
      // Esto es crítico para evitar agotamiento del pool de conexiones
      connection.release();
    }
  } catch (error) {
    // Manejo de errores global con logging para debugging
    console.error('Error al actualizar la bolsa:', error);
    return NextResponse.json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    }, { status: 500 });
  }
} 