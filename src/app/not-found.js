/**
 * ============================================================================
 * PÁGINA DE ERROR 404 - NO ENCONTRADO
 * ============================================================================
 * Esta página se muestra cuando el usuario intenta acceder a una ruta que no existe.
 * Proporciona una interfaz amigable con opción de retorno al inicio.
 * 
 * Características:
 * - Diseño centrado y responsive
 * - Icono visual del error
 * - Mensaje claro del problema
 * - Botón de retorno al inicio
 */

'use client';

import { AlertTriangle } from "lucide-react";

/**
 * COMPONENTE PÁGINA 404
 * Renderiza una página de error amigable cuando no se encuentra la ruta solicitada
 * 
 * @returns {JSX.Element} - Página de error 404 completa
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* CONTENEDOR PRINCIPAL DEL ERROR */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        
        {/* ICONO DE ADVERTENCIA */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle size={32} className="text-[#DB1515]" />
        </div>

        {/* TÍTULO DEL ERROR */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Error 404</h1>
        
        {/* DESCRIPCIÓN DEL ERROR */}
        <p className="text-xl text-gray-600 mb-6">
          Página no encontrada
        </p>
        
        {/* BOTÓN DE RETORNO AL INICIO */}
        <a 
          href="/inicio" 
          className="px-6 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors inline-block"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
} 