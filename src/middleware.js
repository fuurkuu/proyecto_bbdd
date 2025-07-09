/**
 * ============================================================================
 * MIDDLEWARE DE SEGURIDAD Y AUTENTICACIÓN
 * ============================================================================
 * Este archivo controla el acceso a todas las rutas de la aplicación.
 * Se ejecuta ANTES de que cualquier página o API se procese.
 * 
 * Funciones principales:
 * - Verificar si el usuario está autenticado
 * - Controlar permisos de acceso según el tipo de usuario
 * - Redirigir usuarios no autorizados
 * - Proteger APIs según los permisos del usuario
 */

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from "next-auth/middleware";

/**
 * MIDDLEWARE PRINCIPAL
 * Combina la funcionalidad de NextAuth con lógica personalizada
 * para proteger rutas de páginas y APIs según permisos específicos
 */
export default withAuth(
  async function middleware(request) {
    // Obtener el token JWT del usuario autenticado
    // El token contiene: id, email, isAdmin, permisos, etc.
    const token = await getToken({ req: request });
    
    // Si no hay token, withAuth se encargará de redirigir al login
    if (!token) {
      return NextResponse.next();
    }
    
    // ========================================================================
    // PROTECCIÓN DE RUTAS DE ADMINISTRADOR
    // ========================================================================
    // Verificar si la ruta solicitada es del área de administrador
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    
    // Solo permitir acceso a rutas admin si el usuario es administrador
    if (isAdminRoute && !token.isAdmin) {
      // Redirigir usuarios no-admin que intentan acceder a rutas admin
      return NextResponse.redirect(new URL('/inicio', request.url));
    }
    
    // ========================================================================
    // PROTECCIÓN DE RUTAS API
    // ========================================================================
    // Verificar si la petición es a una API
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');
    
    // Si no es una ruta API, dejar que withAuth maneje la autenticación
    if (!isApiRoute) {
      return NextResponse.next();
    }
    
    // Identificar si es una API de modificación (crear, editar, eliminar)
    const isModificationRoute = 
      request.nextUrl.pathname.includes('/delete') || 
      request.nextUrl.pathname.includes('/update') || 
      request.nextUrl.pathname.includes('/add');

    // Para APIs de modificación, verificar permisos de administrador o escritura
    if (isModificationRoute) {
      const isAdmin = token.isAdmin;
      const hasWritePermission = token.permisos?.w;

      // Denegar acceso si no es admin Y no tiene permisos de escritura
      if (!isAdmin && !hasWritePermission) {
        return NextResponse.json(
          { error: 'No tienes permisos para realizar esta acción' },
          { status: 403 }
        );
      }
    }
    
    // ========================================================================
    // PROTECCIÓN DE APIs ESPECÍFICAS DE ADMIN
    // ========================================================================
    // Para APIs que contienen '/admin', solo permitir acceso a administradores
    if (isApiRoute && request.nextUrl.pathname.includes('/admin')) {
      if (!token.isAdmin) {
        return NextResponse.json(
          { error: 'Solo los administradores pueden acceder a esta función' },
          { status: 403 }
        );
      }
    }

    // Usuario autenticado y con permisos requeridos - permitir acceso
    return NextResponse.next();
  },
  {
    // ========================================================================
    // CONFIGURACIÓN DE NEXTAUTH
    // ========================================================================
    pages: {
      signIn: '/login', // Página de inicio de sesión personalizada
    },
  }
);

/**
 * ============================================================================
 * CONFIGURACIÓN DE RUTAS PROTEGIDAS
 * ============================================================================
 * Define qué rutas deben pasar por el middleware de autenticación.
 * Combina protección de páginas normales con protección de APIs.
 */
export const config = { 
  matcher: [
    // ========================================================================
    // PÁGINAS PROTEGIDAS (requieren autenticación)
    // ========================================================================
    '/inicio/:path*',           // Página principal
    '/inversion/:path*',        // Gestión de inversiones
    '/compra/:path*',          // Gestión de compras
    '/presupuesto/:path*',     // Gestión de presupuestos
    '/proveedor/:path*',       // Gestión de proveedores
    '/departamento/:path*',    // Gestión de departamentos
    '/usuario/:path*',         // Gestión de usuarios
    '/uploads/pdfs/:path*',    // Archivos PDF subidos
    '/admin/:path*',           // Área de administración
    
    // ========================================================================
    // APIs PROTEGIDAS (requieren autenticación y permisos)
    // ========================================================================
    '/api/:path*',             // Todas las APIs
  ],
};