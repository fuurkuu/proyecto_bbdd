/**
 * ============================================================================
 * COMPONENTE DE MENÚ DE ADMINISTRACIÓN
 * ============================================================================
 * Submenú desplegable que solo es visible para usuarios administradores.
 * Incluye opciones para gestionar usuarios, departamentos y fondos.
 * 
 * Características:
 * - Desplegable con animación
 * - Indicador visual de página activa
 * - Solo visible para admins
 * - Submenú anidado con estilo diferenciado
 */

'use client';

// Importaciones para iconos, estado y navegación
import { Building, Settings, ChevronRight, ChevronDown, Users, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/**
 * COMPONENTE MENÚ DE ADMINISTRACIÓN
 * Renderiza un menú desplegable con opciones administrativas
 * 
 * @returns {JSX.Element} - Elemento de lista con submenú desplegable
 */
export default function Admin() {
    // Estado para controlar si el menú admin está abierto o cerrado
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    
    // Hook para obtener la ruta actual y marcar elemento activo
    const pathname = usePathname();

    /**
     * ELEMENTOS DEL SUBMENÚ DE ADMINISTRACIÓN
     * Define las opciones disponibles solo para administradores
     */
    const adminSubmenu = [
        { 
            src: '/admin/usuario', 
            name: 'USUARIOS', 
            icon: <Users size={18} /> 
        },
        { 
            src: '/admin/departamento', 
            name: 'DEPARTAMENTOS', 
            icon: <Building size={18} /> 
        },
        { 
            src: '/', 
            name: 'AÑADIR FONDOS', 
            icon: <PlusCircle size={18} /> 
        },
    ];

    /**
     * FUNCIÓN PARA ALTERNAR EL MENÚ DESPLEGABLE
     * Abre/cierra el submenú de administración
     */
    const toggleAdminMenu = () => {
        setIsAdminOpen(!isAdminOpen);
    };

    return (
        <li>
            {/* ================================================================
                BOTÓN PRINCIPAL DE ADMINISTRACIÓN
                ================================================================ */}
            <button
                onClick={toggleAdminMenu}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-between text-sm cursor-pointer transition-all duration-200 hover:bg-white/20 
                            ${isAdminOpen || adminSubmenu.some(item => pathname.indexOf(item.src) !== -1 && item.src !== '/') ? 'bg-white/20 font-medium shadow-inner' : ''}`}
            >
                {/* Icono y texto del botón */}
                <div className="flex items-center space-x-3">
                    <span className="text-white"><Settings size={18} /></span>
                    <span>ADMINISTRACIÓN</span>
                </div>
                
                {/* Flecha indicadora del estado (abierto/cerrado) */}
                <span className="text-white">
                    {isAdminOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
            </button>

            {/* ================================================================
                SUBMENÚ DESPLEGABLE (solo visible cuando está abierto)
                ================================================================ */}
            {isAdminOpen && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-2">
                    {/* Renderizar cada elemento del submenú */}
                    {adminSubmenu.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={`${item.src}`}
                                className={`py-2 px-4 rounded-lg flex items-center space-x-3 text-sm cursor-pointer transition-all duration-200 hover:bg-white/20 
                                            ${(pathname.indexOf(item.src) !== -1 && item.src !== '/') ? 'bg-white/10 font-medium' : ''}`}
                            >
                                {/* Icono del elemento */}
                                <span className="text-white">{item.icon}</span>
                                {/* Texto del elemento */}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}