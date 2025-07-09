/**
 * ============================================================================
 * FUNCIONES UTILITARIAS DE AUTENTICACIÓN Y PERMISOS
 * ============================================================================
 * Este archivo contiene funciones auxiliares para manejar la autenticación,
 * verificación de permisos y procesamiento de datos en el lado del servidor.
 * 
 * Funciones principales:
 * - Obtener información del usuario autenticado
 * - Verificar permisos específicos (admin, escritura, lectura)
 * - Validar acceso a departamentos
 * - Procesar datos para gráficos
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getDepartamentosUser } from "./querys";

/**
 * OBTENER ID Y PERMISOS DEL USUARIO AUTENTICADO
 * Función principal para obtener información básica del usuario en el servidor.
 * Se usa en la mayoría de páginas para verificar autenticación y permisos.
 * 
 * @returns {Array} - [idUsuario, esAdmin, tienePermisosContables]
 * @throws {redirect} - Redirige a login si no hay sesión
 */
export async function getIdUser() {
    const session = await getServerSession(authOptions);
    if (session) {
        return [
            session.user.id,           // ID del usuario en la base de datos
            session.user.isAdmin,      // Boolean: si es administrador
            session.user.permisos.c    // Boolean: si tiene permisos contables
        ];
    } else {
        // Usuario no autenticado - redirigir al login
        redirect("/login");
    }
}

/**
 * VERIFICAR PERMISOS DE ESCRITURA
 * Comprueba si el usuario tiene permisos para modificar datos.
 * Solo permite acceso a administradores o usuarios con permisos de escritura.
 * 
 * @throws {redirect} - Redirige a inicio si no tiene permisos
 */
export async function getReadOnly() {
    const session = await getServerSession(authOptions);
    if (session && (session.user.isAdmin || session.user.permisos.w)) {
        // Usuario tiene permisos de escritura - permitir acceso
        return;
    } else {
        // Usuario sin permisos de escritura - redirigir
        redirect("/inicio");
    }
}

/**
 * VERIFICAR PERMISOS DE ADMINISTRADOR
 * Función que solo permite acceso a usuarios administradores.
 * Usada en páginas y funciones exclusivas para admins.
 * 
 * @returns {number} - ID del usuario administrador
 * @throws {redirect} - Redirige a inicio si no es admin
 */
export async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (session && session.user.isAdmin) {
        return session.user.id;
    } else {
        // Usuario no es administrador - redirigir
        redirect("/inicio");
    }
}

/**
 * OBTENER SESIÓN COMPLETA
 * Función simple para obtener toda la información de la sesión.
 * Útil cuando se necesita acceso a todos los datos del usuario.
 * 
 * @returns {Object|null} - Objeto de sesión completo o null
 */
export async function getSession() {
    const session = await getServerSession(authOptions);
    return session;
}

/**
 * VERIFICAR ACCESO A DEPARTAMENTO ESPECÍFICO
 * Comprueba si un usuario tiene acceso a un departamento particular.
 * Los admins y contables tienen acceso a todos los departamentos.
 * Los usuarios normales solo a sus departamentos asignados.
 * 
 * @param {number} id - ID del departamento a verificar
 * @returns {boolean} - true si tiene acceso, false si no
 * @throws {redirect} - Redirige a login si no hay sesión
 */
export async function isVerificacion(id) {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    // Administradores y contables tienen acceso total
    if (session.user.isAdmin || session.user.permisos.c) {
        return true;
    } else {
        // Verificar si el usuario normal tiene acceso al departamento específico
        const departamentos = await getDepartamentosUser(session.user.id, id);
        console.log(departamentos);
        if (departamentos.length === 0) {
            // Usuario no tiene acceso a este departamento
            //redirect("/inicio");
            return false;
        }
    }
    return true;
}

/**
 * PROCESAR DATOS PARA GRÁFICOS MENSUALES
 * Convierte datos de base de datos en formato apropiado para gráficos.
 * Agrupa importes por mes del año para visualización.
 * 
 * @param {Array} data - Array de objetos con propiedades 'fecha' e 'importe'
 * @returns {Object} - Objeto con labels (meses) y values (importes por mes)
 */
export function chartData(data) {
    // Estructura base del gráfico con 12 meses
    const chartData = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // Inicializar todos los meses en 0
    };
    
    // Procesar cada elemento de datos
    data.forEach(element => {
        // Obtener el mes (0-11) de la fecha y sumar el importe
        const month = new Date(element.fecha).getMonth();
        chartData.values[month] += element.importe;
    });
    
    return chartData;
}