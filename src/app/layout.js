/**
 * ============================================================================
 * LAYOUT PRINCIPAL DE LA APLICACIÓN
 * ============================================================================
 * Este es el layout raíz que envuelve todas las páginas de la aplicación.
 * Define la estructura HTML básica, fuentes y proveedores globales.
 * 
 * Componentes principales:
 * - SessionProvider: Maneja la autenticación con NextAuth
 * - Layout HTML base con fuentes personalizadas
 * - Navegación lateral y header de perfil
 * - Layout diferenciado para páginas de login vs páginas autenticadas
 * 
 * NOTA: Los metadatos se configuran desde metadata.js para separar
 * el contenido del servidor del contenido del cliente.
 */

'use client';

// Importaciones de NextAuth y componentes
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav/nav";                    // Navegación lateral
import Footer from "./components/footer/footer";           // Pie de página
import ProfileHeader from "./components/profile/ProfileHeader"; // Header con perfil de usuario
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google'

/**
 * CONFIGURACIÓN DE FUENTES
 * Define las fuentes utilizadas en toda la aplicación
 */
const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

/**
 * COMPONENTE LAYOUT RAÍZ
 * Define dos tipos de layout:
 * 1. Layout simple para páginas de login/404 (sin navegación)
 * 2. Layout completo para páginas autenticadas (con nav, header, footer)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que se renderizarán dentro del layout
 * @returns {JSX.Element} - Estructura HTML completa de la aplicación
 */
export default function RootLayout({ children }) {
  // Obtener la ruta actual para determinar qué tipo de layout usar
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/404';
  
  return (
    <html lang="es"> {/* Idioma español para la aplicación */}
      <head>
        {/* METADATOS BÁSICOS - Configurados inline para client component */}
        <title>Sistema de Gestión</title>
        <meta name="description" content="Sistema de gestión de compras, inversiones y presupuestos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}>
        {/* 
          PROVEEDOR DE SESIÓN DE NEXTAUTH
          Envuelve toda la aplicación para proporcionar contexto de autenticación
          a todos los componentes hijos
        */}
        <SessionProvider>
          {isLoginPage ? (
            /* ================================================================
               LAYOUT SIMPLE - Para páginas de login y error
               ================================================================ */
            <div className="min-h-screen bg-gray-50">
              {children} {/* Renderizar solo el contenido de la página */}
            </div>
          ) : (
            /* ================================================================
               LAYOUT COMPLETO - Para páginas autenticadas
               ================================================================ */
            <div className="flex flex-row min-h-screen max-w-screen bg-gray-50 text-gray-900">
              {/* NAVEGACIÓN LATERAL */}
              <Nav />
              
              {/* ÁREA PRINCIPAL DE CONTENIDO */}
              <div className="w-full flex flex-col min-h-screen">
                {/* HEADER CON PERFIL DE USUARIO */}
                <ProfileHeader />
                
                {/* CONTENEDOR PRINCIPAL CON FONDO DECORATIVO */}
                <div className="flex flex-col flex-1 relative">
                  {/* FONDO DECORATIVO CON LOGO Y DEGRADADO */}
                  <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                    <div className="h-full w-full bg-gradient-to-b from-blue-50 to-transparent"></div>
                  </div>
                  
                  {/* CONTENIDO DE LA PÁGINA ACTUAL */}
                  <div className="relative z-10 flex-1">
                    {children} {/* Aquí se renderiza el contenido específico de cada página */}
                  </div>
                </div>
                
                {/* PIE DE PÁGINA */}
                <Footer />
              </div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}