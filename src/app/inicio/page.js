/**
 * ============================================================================
 * PÁGINA PRINCIPAL DE INICIO
 * ============================================================================
 * Esta es la primera página que ven los usuarios después de autenticarse.
 * Muestra los departamentos disponibles según los permisos del usuario.
 * 
 * Funcionalidad:
 * - Obtiene información del usuario autenticado
 * - Consulta departamentos según permisos
 * - Redirige automáticamente si solo hay un departamento disponible
 * - Muestra selector de departamentos si hay múltiples opciones
 */

import { getDepartamentos } from "@/app/functions/querys.js";
import { getIdUser } from "@/app/functions/functions.js";
import DepartamentosInicio from "./components/departamentos";
import { redirect } from "next/navigation";

/**
 * COMPONENTE PÁGINA DE INICIO
 * Función asíncrona que maneja la lógica de inicio y selección de departamentos
 * 
 * @returns {JSX.Element|void} - Componente de departamentos o redirección automática
 */
export default async function Inicio() {
  // ========================================================================
  // OBTENER INFORMACIÓN DEL USUARIO AUTENTICADO
  // ========================================================================
  const session = await getIdUser();
  const idUser = session[0];        // ID del usuario
  const isAdmin = session[1];       // Si es administrador
  const isContable = session[2];    // Si tiene permisos contables

  // ========================================================================
  // CONSULTAR DEPARTAMENTOS DISPONIBLES
  // ========================================================================
  // Los departamentos mostrados dependen de los permisos del usuario:
  // - Admins y contables: ven todos los departamentos
  // - Usuarios normales: solo ven sus departamentos asignados
  const departamentos = await getDepartamentos(idUser, isAdmin || isContable);
  
  // ========================================================================
  // LÓGICA DE REDIRECCIÓN AUTOMÁTICA
  // ========================================================================
  // Si el usuario solo tiene acceso a un departamento, redirigir directamente
  // Esto mejora la experiencia de usuario evitando pasos innecesarios
  if (departamentos.length === 1) {
   redirect(`/inicio/${departamentos[0].id}`);
  }

  // ========================================================================
  // RENDERIZAR SELECTOR DE DEPARTAMENTOS
  // ========================================================================
  // Si hay múltiples departamentos, mostrar interfaz de selección
  return (
    <DepartamentosInicio departamentos={departamentos} />
  );
}