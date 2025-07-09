/**
 * ============================================================================
 * PÁGINA DE INICIO DE SESIÓN
 * ============================================================================
 * Página principal de autenticación que permite a los usuarios iniciar sesión
 * usando su cuenta de Google. Incluye manejo de errores, estados de carga y
 * redirecciones automáticas para usuarios ya autenticados.
 * 
 * Características:
 * - Autenticación con Google OAuth
 * - Manejo detallado de errores de autenticación
 * - Estados de carga visual
 * - Redirección automática post-login
 * - Diseño responsive con branding institucional
 */

'use client';

// Importaciones para autenticación y navegación
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Mail, Info, AlertTriangle } from 'lucide-react';

/**
 * COMPONENTE PÁGINA DE LOGIN
 * Maneja todo el flujo de autenticación desde la interfaz de usuario
 * 
 * @returns {JSX.Element} - Página completa de login
 */
export default function LoginPage() {
  // ========================================================================
  // HOOKS Y ESTADO LOCAL
  // ========================================================================
  
  // Hook de sesión para verificar estado de autenticación
  const { data: session, status } = useSession();
  
  // Hooks de navegación
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/inicio"; // URL de retorno tras login
  
  // Estados locales para UI
  const [isLoading, setIsLoading] = useState(false);    // Estado de carga
  const [error, setError] = useState("");               // Mensajes de error
  const [showAlert, setShowAlert] = useState(false);   // Mostrar alerta de error

  // ========================================================================
  // EFECTOS Y LÓGICA DE NEGOCIO
  // ========================================================================

  /**
   * EFECTO PARA MANEJO DE ERRORES Y REDIRECCIONES
   * Se ejecuta cuando cambia el estado de la sesión o los parámetros de URL
   */
  useEffect(() => {
    // Verificar si hay errores en la URL (desde NextAuth)
    const errorFromUrl = searchParams.get("error");
    if (errorFromUrl) {
      setShowAlert(true);
      
      // Mapear diferentes tipos de error a mensajes user-friendly
      switch (errorFromUrl) {
        case "AccessDenied":
          const errorMessage = "Tu correo electrónico no está registrado en el sistema. Contacta con el administrador para solicitar acceso.";
          setError(errorMessage);
          break;
        case "Verification":
          setError("Error de verificación. Por favor, intenta de nuevo.");
          break;
        case "CredentialsSignin":
          const notRegisteredMessage = "El correo electrónico no está registrado en nuestra base de datos.";
          setError(notRegisteredMessage);
          break;
        default:
          setError("Error de inicio de sesión. Por favor, intenta de nuevo.");
      }
    }
    
    // Redirigir automáticamente si el usuario ya está autenticado
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl, searchParams]);

  /**
   * FUNCIÓN PARA MANEJAR EL INICIO DE SESIÓN
   * Ejecuta el flujo de autenticación con Google y maneja errores
   */
  const handleLogin = async () => {
    try {
      // Activar estado de carga y limpiar errores previos
      setIsLoading(true);
      setError("");
      setShowAlert(false);
      
      // Intentar iniciar sesión con Google
      const result = await signIn("google", { 
        callbackUrl,     // URL de retorno tras autenticación exitosa
        redirect: false  // No redirigir automáticamente para manejar errores
      });
            
      // Manejar respuesta de la autenticación
      if (result?.error) {
        setError(result.error);
        setShowAlert(true);
        
        // Personalizar mensaje de error según el tipo
        let modalMsg = "";
        if (result.error === "AccessDenied") {
          modalMsg = "Tu correo electrónico no está registrado en el sistema. Contacta con el administrador para solicitar acceso.";
        } else {
          modalMsg = "Error de inicio de sesión. Por favor, intenta de nuevo.";
        }
        
      } else if (result?.url) {
        // Redirigir manualmente si la autenticación fue exitosa
        router.push(result.url);
      }
    } catch (error) {
      // Manejar errores de red o JavaScript
      console.error("Error durante la autenticación:", error);
      setError("Error durante la autenticación. Inténtalo de nuevo.");
      setShowAlert(true);
    } finally {
      // Desactivar estado de carga
      setIsLoading(false);
    }
  };

  // ========================================================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* FONDO DECORATIVO CON LOGO */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-5"></div>
      </div>     
      
      {/* CONTENEDOR PRINCIPAL DE LOGIN */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl w-96 border-t-4 border-[#DB1515]">
        
        {/* LOGO INSTITUCIONAL */}
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Salesianos Logo" className="h-24" />
        </div>
        
        {/* TÍTULO Y SUBTÍTULO */}
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Sistema de Gestión</h1>
        <p className="text-center text-gray-600 mb-6">Salesianos Zaragoza</p>
        
        {/* ALERTA DE ERROR PROMINENTE (para errores críticos) */}
        {showAlert && error  && (
          <div className="mb-4">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertTriangle size={24} className="mr-3 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium mb-1">Acceso denegado</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* ALERTA DE ERROR SIMPLE (para errores menores) */}
        {!showAlert && error  && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start">
            <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* BOTÓN DE INICIO DE SESIÓN CON GOOGLE */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full ${
            isLoading 
              ? "bg-gray-300"  // Estado deshabilitado
              : "bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C]" // Estado normal
          } text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-md`}
        >
          {isLoading ? (
            /* Estado de carga con spinner animado */
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </>
          ) : (
            /* Estado normal con icono de Google */
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Iniciar sesión con Google
            </>
          )}
        </button>
    
        {/* PIE DE PÁGINA CON COPYRIGHT */}
        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 Salesianos Zaragoza - Todos los derechos reservados.
        </div>
        
        {/* INFORMACIÓN DE DEBUG (solo en desarrollo) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-gray-400 border-t pt-4">
            Estado: {status === "loading" ? "Cargando..." : status}
          </div>
        )} */}
      </div>
    </div>
  );
}