/**
 * ============================================================================
 * CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
 * ============================================================================
 * Este archivo configura y exporta el pool de conexiones a la base de datos MySQL.
 * Utiliza mysql2/promise para operaciones asíncronas con soporte para async/await.
 * 
 * El pool de conexiones permite:
 * - Reutilizar conexiones existentes
 * - Manejar múltiples conexiones simultáneas
 * - Optimizar el rendimiento de la base de datos
 * - Evitar el overhead de crear/cerrar conexiones constantemente
 */

import mysql from 'mysql2/promise';

/**
 * POOL DE CONEXIONES MYSQL
 * Crea un pool de conexiones reutilizables a la base de datos
 * 
 * Configuración:
 * - host: Servidor de base de datos (localhost para desarrollo)
 * - user: Usuario de MySQL
 * - password: Contraseña de MySQL  
 * - database: Nombre de la base de datos a utilizar
 */
const pool = mysql.createPool({
  host: 'localhost',          // Servidor de base de datos
  user: 'root',              // Usuario de MySQL
  password: 'password',       // Contraseña de MySQL
  database: 'bbdd',          // Nombre de la base de datos
  
  // Configuraciones adicionales del pool (opcionales)
  waitForConnections: true,   // Esperar conexiones disponibles si el pool está lleno
  connectionLimit: 10,        // Máximo número de conexiones simultáneas
  queueLimit: 0              // Sin límite en la cola de espera
});

/**
 * EXPORTAR POOL PARA USO EN APIS
 * Este pool se importa en todos los endpoints de API para realizar
 * operaciones de base de datos de manera eficiente
 */
export { pool }; 