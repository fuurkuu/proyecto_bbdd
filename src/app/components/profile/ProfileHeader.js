/**
 * ============================================================================
 * COMPONENTE HEADER DE PERFIL DE USUARIO
 * ============================================================================
 * Header flotante que muestra la foto de perfil del usuario autenticado
 * y un dropdown con opciones de perfil, configuración y logout.
 * 
 * Características:
 * - Avatar con imagen de Google o placeholder
 * - Dropdown con información del usuario
 * - Manejo de clics fuera del dropdown
 * - Estados de carga
 * - Fallback para imágenes rotas
 */

'use client';

// Importaciones para autenticación, estado y iconos
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

/**
 * COMPONENTE HEADER DE PERFIL
 * Muestra avatar del usuario con dropdown de opciones
 * 
 * @returns {JSX.Element} - Header de perfil flotante
 */
export default function ProfileHeader() {
  // Hook de sesión para obtener datos del usuario autenticado
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * EFECTO PARA CERRAR DROPDOWN AL HACER CLIC FUERA
   * Agrega/remueve listener de eventos para manejar clics externos
   */
  useEffect(() => {
    function handleClickOutside(event) {
      // Si el clic fue fuera del dropdown, cerrarlo
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup: remover listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * ESTADO DE CARGA
   * Mostrar placeholder animado mientras se carga la sesión
   */
  if (status === 'loading') {
    return (
      <div className="absolute top-4 right-6 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }
  if (!session) {
    return null;
  }

  const defaultAvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format";
  const src = session.user.image || defaultAvatarUrl;

  return (
    <div className="absolute top-4 right-6 z-50" ref={dropdownRef}>
      <button
        className="flex items-center bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Open profile menu"
      >
        {
          <img
            src={src}
            alt={session.user.name || "User avatar"}
            className="w-10 h-10 rounded-full border border-gray-200"
            onError={() => setImageError(true)}
          />
        /* {(session.user?.image && !imageError) ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || "User avatar"} 
            className="w-10 h-10 rounded-full border border-gray-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <img 
            src={defaultAvatarUrl}
            alt="Default avatar" 
            className="w-10 h-10 rounded-full border border-gray-200"
            onError={(e) => {
              // Si la imagen por defecto también falla, mostrar el ícono
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )} */}

        {/* Fallback icon si todas las imágenes fallan */}
        <div
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center text-gray-500"
          style={{ display: 'none' }}
        >
          <User size={20} />
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
          
          {/* INFORMACIÓN DEL USUARIO */}
          <div className="px-4 py-3 border-b border-gray-100">
            {/* Nombre del usuario */}
            <p className="text-sm font-medium text-gray-800">
              {session.user?.name || 'Usuario'}
            </p>
            
            {/* Email del usuario */}
            <p className="text-xs text-gray-500 truncate">
              {session.user?.email || ''}
            </p>
            
            {/* Cargo del usuario (si existe) */}
            {session.user?.cargo && (
              <p className="text-xs font-medium text-[#DB1515] mt-1">
                {session.user.cargo}
              </p>
            )}
          </div>

          <a href="/perfil" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <User size={16} className="mr-2 text-gray-500" />
            Mi Perfil
          </a>

          <a href="/configuracion" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Settings size={16} className="mr-2 text-gray-500" />
            Configuración
          </a>

          <div className="border-t border-gray-100">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}