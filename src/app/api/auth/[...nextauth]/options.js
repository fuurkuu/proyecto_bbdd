/**
 * ============================================================================
 * CONFIGURACIÓN DE NEXTAUTH
 * ============================================================================
 * Este archivo contiene toda la configuración personalizada de NextAuth para
 * manejar la autenticación con Google y la integración con la base de datos.
 * 
 * Características implementadas:
 * - Autenticación con Google OAuth
 * - Verificación de usuarios en base de datos
 * - Sistema de permisos personalizado
 * - Sesiones JWT con datos de usuario
 * - Páginas de login personalizadas
 */

import GoogleProvider from "next-auth/providers/google";
import { pool } from "../../sql/sql.js"; // Conexión a base de datos

/**
 * OPCIONES DE CONFIGURACIÓN DE NEXTAUTH
 * Objeto principal que define todo el comportamiento de autenticación
 */
export const authOptions = {
  // Habilitar debug en desarrollo para ver logs detallados
  debug: true,

  // Clave secreta para firmar tokens JWT (desde variable de entorno)
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * ========================================================================
   * PROVEEDORES DE AUTENTICACIÓN
   * ========================================================================
   * Define qué servicios externos se pueden usar para autenticarse
   */
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,         // ID de cliente de Google OAuth
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Secreto de cliente de Google OAuth
      authorization: {
        params: {
          prompt: "consent",        // Siempre pedir consentimiento
          access_type: "offline",   // Permitir tokens de actualización
          response_type: "code"     // Usar flujo de código de autorización
        }
      }
    }),
  ],

  /**
   * ========================================================================
   * CALLBACKS PERSONALIZADOS
   * ========================================================================
   * Funciones que se ejecutan en diferentes momentos del proceso de autenticación
   * para personalizar el comportamiento y agregar lógica de negocio
   */
  callbacks: {
    /**
     * CALLBACK DE SESIÓN
     * Se ejecuta cada vez que se accede a la sesión.
     * Aquí se agregan datos personalizados del usuario desde la base de datos.
     * 
     * @param {Object} param0 - Parámetros del callback
     * @param {Object} param0.session - Objeto de sesión actual
     * @param {Object} param0.token - Token JWT con datos del usuario
     * @returns {Object} - Sesión modificada con datos adicionales
     */
    async session({ session, token }) {
      if (token) {
        // Inicializar objeto de usuario si no existe
        session.user = session.user || {};
        
        // Transferir datos del token a la sesión
        session.user.id = token.id;
        session.user.cargo = token.cargo;
        session.user.permisos = token.permisos;
        
        // Consultar permisos actualizados desde la base de datos
        const [permisos] = await pool.query(
          'SELECT p.tipo FROM bbdd.Permiso_Usuario AS pu JOIN bbdd.Permiso AS p ON p.id = pu.idPermiso_FK WHERE pu.idUsuario_FK = ?', 
          [token.id]
        );
        
        // Mapear permisos a objeto de fácil acceso
        session.user.permisos = {
          r: permisos.some(permiso => permiso.tipo === "Lectura"),      // Permiso de lectura
          w: permisos.some(permiso => permiso.tipo === "Escritura"),    // Permiso de escritura
          c: permisos.some(permiso => permiso.tipo === "Contable")      // Permiso contable
        };
        
        // Verificar si es administrador
        session.user.isAdmin = permisos.some(permiso => permiso.tipo === "Administrador");
      }
      return session;
    },

    /**
     * CALLBACK DE JWT
     * Se ejecuta cuando se crea o actualiza un token JWT.
     * Almacena datos del usuario en el token para acceso rápido.
     * 
     * @param {Object} param0 - Parámetros del callback
     * @param {Object} param0.token - Token JWT actual
     * @param {Object} param0.user - Datos del usuario (solo en primer login)
     * @returns {Object} - Token modificado con datos del usuario
     */
    async jwt({ token, user, account, profile }) {
      if (user) {
        // En el primer login, transferir datos del usuario al token
        token.id = user.id;
        token.cargo = user.cargo;
        token.isAdmin = user.isAdmin;
        token.permisos = user.permisos;
      }
      // En subsecuentes accesos, mantener los datos existentes
      return token;
    },

    /**
     * CALLBACK DE SIGN IN
     * Se ejecuta cuando un usuario intenta iniciar sesión.
     * Verifica si el usuario existe en la base de datos y tiene permisos.
     * 
     * @param {Object} param0 - Parámetros del callback
     * @param {Object} param0.user - Datos del usuario desde el proveedor
     * @param {Object} param0.account - Información de la cuenta
     * @param {Object} param0.profile - Perfil del usuario desde el proveedor
     * @returns {boolean} - true si el login es exitoso, false si se rechaza
     */
    async signIn({ user, account, profile }) {
      try {
        // Buscar usuario en la base de datos por email
        const [users] = await pool.query(
          'SELECT id, nombre, email, cargo FROM Usuario WHERE email = ?', 
          [user.email]
        );

        // Rechazar login si el usuario no existe en la base de datos
        if (users.length === 0) {
          return false;
        }

        // Obtener permisos del usuario desde la base de datos
        const [permisos] = await pool.query(
          'SELECT p.tipo FROM bbdd.Permiso_Usuario AS pu JOIN bbdd.Permiso AS p ON p.id = pu.idPermiso_FK WHERE pu.idUsuario_FK = ?', 
          [users[0].id]
        );
        
        // Agregar datos adicionales al objeto user
        user.id = users[0].id;
        user.cargo = users[0].cargo;
        user.isAdmin = false;
        
        // Mapear permisos
        user.permisos = {
          r: permisos.some(permiso => permiso.tipo === "Lectura"),
          w: permisos.some(permiso => permiso.tipo === "Escritura"),
          c: permisos.some(permiso => permiso.tipo === "Contable")
        };
        
        // Verificar si es administrador
        if (permisos.some(permiso => permiso.tipo === "Administrador")) {
          user.isAdmin = true;
        }
        
        return true; // Permitir el login
      } catch (error) {
        console.error('Error en signIn callback:', error);
        return false; // Rechazar el login en caso de error
      }
    }
  },

  /**
   * ========================================================================
   * PÁGINAS PERSONALIZADAS
   * ========================================================================
   * Define qué páginas usar para diferentes estados de autenticación
   */
  pages: {
    signIn: "/login",  // Página personalizada de inicio de sesión
    error: "/login",   // Redirigir errores a la página de login
  },

  /**
   * ========================================================================
   * CONFIGURACIÓN DE SESIÓN
   * ========================================================================
   * Define cómo se manejan las sesiones de usuario
   */
  session: {
    strategy: "jwt",                    // Usar JWT en lugar de base de datos
    maxAge: 30 * 24 * 60 * 60,         // Duración de sesión: 30 días en segundos
  },

  /**
   * ========================================================================
   * CONFIGURACIÓN DE COOKIES
   * ========================================================================
   * Define las opciones de seguridad para las cookies de sesión
   */
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,  // Nombre de la cookie
      options: {
        httpOnly: true,                 // Solo accesible por el servidor (seguridad)
        sameSite: "lax",               // Protección CSRF moderada
        path: "/",                     // Disponible en toda la aplicación
        secure: process.env.NODE_ENV === "production", // HTTPS solo en producción
      },
    },
  },
};