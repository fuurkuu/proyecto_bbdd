/**
 * ============================================================================
 * PÁGINA PRINCIPAL DE LA APLICACIÓN
 * ============================================================================
 * Esta es la página de inicio que se muestra cuando el usuario accede a la raíz
 * de la aplicación. Redirige automáticamente a la página de login.
 * 
 * Funcionalidad:
 * - Redirección automática a /login usando redirect de Next.js
 * - Manejo de la página raíz de la aplicación
 */

import { redirect } from "next/navigation";

/**
 * COMPONENTE PÁGINA PRINCIPAL
 * Función que maneja la redirección desde la raíz hacia la página de login.
 * 
 * @returns {void} No retorna JSX, solo ejecuta la redirección
 */
export default function Home() {
  // Redirigir inmediatamente a la página de login
  // Esto significa que cuando alguien vaya a "/" será enviado a "/login"
  redirect("/login");
}