/**
 * ============================================================================
 * COMPONENTE DE NAVEGACIÓN LATERAL
 * ============================================================================
 * Barra de navegación lateral que se muestra en todas las páginas autenticadas.
 * Incluye el logo, menú principal, sección de administrador y botón de logout.
 * 
 * Características:
 * - Menú dinámico según permisos de usuario
 * - Indicador visual de página activa
 * - Sección especial para administradores
 * - Manejo de rutas con parámetros
 */

'use client'

// Importaciones necesarias para navegación y autenticación
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Home, ShoppingCart, TrendingUp, DollarSign, Truck, LogOut, LogIn, Users } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import Admin from './admin'; // Componente de administración

/**
 * COMPONENTE DE NAVEGACIÓN PRINCIPAL
 * Renderiza la barra lateral con menú dinámico basado en permisos de usuario
 * 
 * @returns {JSX.Element} - Barra de navegación lateral completa
 */
export default function Nav() {
    // Hooks para obtener información de la ruta y sesión actual
    const pathname = usePathname();           // Ruta actual
    const { data: session } = useSession();  // Datos de sesión del usuario
    const searchParams = useSearchParams();   // Parámetros de URL

    /**
     * ELEMENTOS DEL MENÚ PRINCIPAL
     * Define las opciones de navegación básicas disponibles para todos los usuarios
     */
    const menuItems = [
        { src: '/inicio', name: 'INICIO', icon: <Home size={18} /> },
        { src: '/inversion', name: 'INVERSION', icon: <TrendingUp size={18} /> },
        { src: '/presupuesto', name: 'PRESUPUESTO', icon: <DollarSign size={18} /> },
        { src: '/proveedor', name: 'PROVEEDORES', icon: <Truck size={18} /> },
    ];

    /**
     * AGREGAR ELEMENTOS SEGÚN PERMISOS
     * Solo usuarios con permisos de escritura o administradores pueden ver "Orden de Compra"
     */
    if (session && (session.user.isAdmin || session.user.permisos.w)) {
        menuItems.push({ 
            src: '/compra', 
            name: 'ORDEN DE COMPRA', 
            icon: <ShoppingCart size={18} /> 
        });
    }

    /**
     * MANEJO DINÁMICO DE RUTAS CON PARÁMETROS
     * Actualiza las URLs de inversión y presupuesto para mantener contexto
     * cuando el usuario navega entre departamentos/años específicos
     */
    if (pathname.includes('/inicio/') || pathname.includes('/presupuesto/') || pathname.includes('/inversion/')) {
        // Determinar la base de la ruta actual
        let base = '/inicio';
        if (pathname.includes('/presupuesto/')) {
            base = '/presupuesto';
        } else if (pathname.includes('/inversion/')) {
            base = '/inversion';
        }
        
        // Construir la ruta con parámetros preservados
        const ruta = pathname.split(base)[1] + '?an=' + searchParams.get('an');
        menuItems[1].src = '/inversion' + ruta;   // Actualizar enlace de inversión
        menuItems[2].src = '/presupuesto' + ruta; // Actualizar enlace de presupuesto
    }

    return (
        <div className="w-64 bg-gradient-to-b from-[#DB1515] to-[#9E0B0F] text-white flex flex-col min-h-screen shadow-xl z-20">
            {/* ================================================================
                SECCIÓN DEL LOGO
                ================================================================ */}
            <div className="p-6 flex justify-center">
                <div className="relative w-full h-20">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* ================================================================
                MENÚ DE NAVEGACIÓN PRINCIPAL
                ================================================================ */}
            <nav className="flex-1 px-2">
                <ul className='flex flex-col gap-1'>
                    {/* Renderizar elementos del menú dinámicamente */}
                    {menuItems.length > 0 && menuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={`${item.src}`}
                                className={`py-3 px-4 rounded-lg flex items-center space-x-3 text-sm cursor-pointer transition-all duration-200 hover:bg-white/20 
                                ${(pathname.indexOf(item.src) !== -1 && item.src !== '/') ? 'bg-white/20 font-medium shadow-inner' : ''}`}
                            >
                                <span className="text-white">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                    
                    {/* ========================================================
                        SECCIÓN DE ADMINISTRADOR
                        Solo visible para usuarios administradores
                        ======================================================== */}
                    {session && session.user.isAdmin && (
                        <Admin />
                    )}
                </ul>
            </nav>

            {/* ================================================================
                SECCIÓN DE AUTENTICACIÓN (LOGIN/LOGOUT)
                ================================================================ */}
            <div className="p-4 border-t border-white/20">
                {session ? (
                    /* Botón de cerrar sesión para usuarios autenticados */
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full py-3 flex justify-center items-center text-sm bg-[#7E0103] hover:bg-[#6B0001] rounded-lg transition-colors duration-200 space-x-2"
                    >
                        <LogOut size={18} />
                        <span>CERRAR SESIÓN</span>
                    </button>
                ) : (
                    /* Botón de iniciar sesión para usuarios no autenticados */
                    <Link href="/login">
                        <button className="w-full py-3 flex justify-center items-center text-sm bg-[#7E0103] hover:bg-[#6B0001] rounded-lg transition-colors duration-200 space-x-2">
                            <LogIn size={18} />
                            <span>INICIAR SESIÓN</span>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}