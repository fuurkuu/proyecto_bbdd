/**
 * ============================================================================
 * COMPONENTE DESPLEGABLE DE AÑOS
 * ============================================================================
 * Componente select personalizado que permite filtrar información por año.
 * Actualiza automáticamente la URL con el año seleccionado y mantiene el
 * estado entre navegaciones.
 * 
 * Características:
 * - Sincronización con parámetros de URL
 * - Estilo personalizable
 * - Persistencia de selección
 * - Icono de flecha personalizado
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation"

/**
 * COMPONENTE DESPLEGABLE
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.menu - Array de objetos con propiedad ANO que se mostrarán como opciones
 * @param {string} props.talwind - Clases CSS de Tailwind para personalizar el estilo
 * @returns {JSX.Element} - Select personalizado con opciones de año
 */
export default function Desplegable({ menu, talwind }) {
    // ========================================================================
    // HOOKS Y ESTADO LOCAL
    // ========================================================================
    
    const router = useRouter();                              // Para navegación programática
    const searchParams = useSearchParams();                 // Para leer parámetros de URL
    
    // Estado local para el año seleccionado - inicializa desde URL o primer elemento
    const [id, setId] = useState(searchParams.get("an") || menu[0]?.ANO);
    
    // ========================================================================
    // MANEJADORES DE EVENTOS
    // ========================================================================
    
    /**
     * MANEJADOR DE CAMBIO DE SELECCIÓN
     * Actualiza el estado local y la URL cuando el usuario selecciona un año diferente
     * 
     * @param {Event} e - Evento de cambio del select
     */
    const handleSearch = async (e) => {
        const newQuery = e.target.value;  // Nuevo año seleccionado
        setId(newQuery);                  // Actualizar estado local
        
        // Construir nuevos parámetros de URL
        const params = new URLSearchParams();
        params.set("an", newQuery);       // Establecer parámetro "an" (año)
        
        // Actualizar URL sin recargar la página
        router.replace(`?${params.toString()}`);
        router.refresh();                 // Refrescar componentes que dependen de los parámetros
    };

    // ========================================================================
    // EFECTOS
    // ========================================================================
    
    /**
     * EFECTO DE INICIALIZACIÓN
     * Se ejecuta una vez al montar el componente para establecer
     * el parámetro de año en la URL si no existe
     */
    useEffect(() => {
        const params = new URLSearchParams();
        params.set("an", id);
        router.replace(`?${params.toString()}`);
    }, []); // Array vacío = solo se ejecuta al montar
    
    // ========================================================================
    // RENDERIZADO
    // ========================================================================
    
    return (
        <div className="relative inline-block">
            {/* SELECT PRINCIPAL */}
            <select 
                value={id} 
                onChange={handleSearch} 
                className={`${talwind} pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9E0B0F] transition-all duration-200`}
            >
                {/* OPCIONES DINÁMICAS DESDE EL ARRAY MENU */}
                {menu.length > 0 && menu.map((item, index) => (
                    <option key={index} value={item.ANO} className="text-gray-900 bg-white">
                        {item.ANO}
                    </option>
                ))}
            </select>
            
            {/* ICONO DE FLECHA HACIA ABAJO */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}