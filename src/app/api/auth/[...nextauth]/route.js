/**
 * ============================================================================
 * MANEJADOR DE RUTAS DE NEXTAUTH
 * ============================================================================
 * Este archivo configura el endpoint dinámico de NextAuth que maneja todas
 * las rutas de autenticación de la aplicación.
 * 
 * Rutas manejadas:
 * - /api/auth/signin - Página de inicio de sesión
 * - /api/auth/signout - Cierre de sesión
 * - /api/auth/callback - Callbacks de proveedores
 * - /api/auth/session - Información de sesión actual
 * - /api/auth/providers - Lista de proveedores disponibles
 * 
 * El patrón [...nextauth] permite que NextAuth capture todas las sub-rutas
 * bajo /api/auth/ y las maneje automáticamente.
 */

// Importaciones necesarias
import NextAuth from "next-auth";
import { authOptions } from "./options"; // Configuración de autenticación

/**
 * CREAR MANEJADOR DE NEXTAUTH
 * Inicializa NextAuth con la configuración personalizada definida en options.js
 * Este manejador procesará todas las peticiones de autenticación
 */
const handler = NextAuth(authOptions);

/**
 * EXPORTAR MANEJADORES PARA MÉTODOS HTTP
 * NextAuth necesita manejar tanto peticiones GET como POST:
 * - GET: Para mostrar páginas de login, obtener sesión, etc.
 * - POST: Para procesar formularios de login, logout, etc.
 */
export { handler as GET, handler as POST };