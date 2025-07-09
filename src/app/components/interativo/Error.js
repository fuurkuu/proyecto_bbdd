/**
 * ============================================================================
 * COMPONENTES DE MANEJO DE ERRORES
 * ============================================================================
 * Este archivo contiene diferentes componentes para mostrar estados de error
 * en la aplicación. Cada componente está diseñado para un contexto específico
 * y proporciona opciones de recuperación apropiadas.
 * 
 * Componentes incluidos:
 * - ErrorInicio: Error general con opción de volver al inicio
 * - ErrorProveedorEditar: Error específico para proveedores no encontrados
 * - ErrorTabla: Estado vacío para tablas sin datos
 */

'use client';

import { AlertTriangle, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";

/**
 * COMPONENTE DE ERROR GENERAL
 * Muestra un mensaje de error genérico con opciones para volver al inicio
 * o recargar la página. Usado en páginas principales cuando algo falla.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.msg - Mensaje de error personalizado a mostrar
 * @returns {JSX.Element} - Pantalla de error con opciones de recuperación
 */
export function ErrorInicio({ msg }) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
            {/* CONTENEDOR PRINCIPAL DEL ERROR */}
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                {/* ICONO DE ALERTA */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                    <AlertTriangle size={32} className="text-[#DB1515]" />
                </div>

                {/* TÍTULO DEL ERROR */}
                <h1 className="text-2xl font-bold mb-4 text-gray-800">{msg || "Error"}</h1>

                {/* DESCRIPCIÓN DEL ERROR */}
                <p className="text-gray-600 mb-6">
                    Ha ocurrido un error al intentar procesar su solicitud. Por favor, compruebe los parámetros o intente nuevamente más tarde.
                </p>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* BOTÓN VOLVER AL INICIO */}
                    <Link
                        href="/inicio"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Volver al inicio
                    </Link>

                    {/* BOTÓN RECARGAR PÁGINA */}
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors"
                    >
                        Intentar nuevamente
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * COMPONENTE DE ERROR PARA PROVEEDOR NO ENCONTRADO
 * Específicamente diseñado para cuando se intenta editar un proveedor
 * que no existe en la base de datos.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.msg - Mensaje de error personalizado (opcional)
 * @returns {JSX.Element} - Pantalla de error específica para proveedores
 */
export function ErrorProveedorEditar({ msg }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            {/* CONTENEDOR DEL ERROR */}
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
                {/* ICONO DE ALERTA */}
                <div className="flex items-center justify-center text-red-500 mb-4">
                    <AlertTriangle size={48} />
                </div>
                
                {/* TÍTULO ESPECÍFICO */}
                <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Proveedor no encontrado</h2>
                
                {/* DESCRIPCIÓN ESPECÍFICA */}
                <p className="text-gray-600 text-center mb-6">
                    El proveedor que está buscando no existe o ha sido eliminado.
                </p>
                
                {/* BOTÓN DE RETORNO A PROVEEDORES */}
                <div className="flex justify-center">
                    <Link
                        href="/proveedor"
                        className="px-6 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors flex items-center"
                    >
                        <Truck size={18} className="mr-2" />
                        Volver a Proveedores
                    </Link>
                </div>
            </div>
        </div>
    );
}

/**
 * COMPONENTE DE ESTADO VACÍO PARA TABLAS
 * Se muestra cuando una tabla no tiene datos para mostrar.
 * Incluye una acción sugerida para crear nuevos registros.
 * 
 * @returns {JSX.Element} - Estado vacío con opción de crear nueva orden
 */
export function ErrorTabla() {
    return (
        <div className="mt-8 bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center">
                {/* ICONO DE DOCUMENTO VACÍO */}
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                
                {/* TÍTULO DEL ESTADO VACÍO */}
                <h3 className="text-lg font-medium text-gray-700 mb-2">No hay datos disponibles</h3>
                
                {/* DESCRIPCIÓN */}
                <p className="text-gray-500 mb-4">No se encontraron registros en el sistema.</p>
                
                {/* ACCIÓN SUGERIDA */}
                <Link href="/compra">
                    <button className="px-4 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-all duration-200 shadow">
                        Crear nueva orden
                    </button>
                </Link>
            </div>
        </div>
    );
}