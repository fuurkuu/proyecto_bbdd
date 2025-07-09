/**
 * ============================================================================
 * COMPONENTE SELECTOR DE DEPARTAMENTOS
 * ============================================================================
 * Interfaz que permite al usuario seleccionar entre los departamentos
 * a los que tiene acceso. Muestra las opciones en formato de tarjetas
 * con información clara y llamadas a la acción.
 * 
 * Características:
 * - Grid responsivo de tarjetas de departamentos
 * - Estado vacío cuando no hay departamentos asignados
 * - Información del sistema en la parte inferior
 * - Diseño moderno con gradientes institucionales
 */

// Importaciones de iconos y componentes
import { Building, Users} from 'lucide-react';
import {DepartamentoCards} from './card';
import { InfoSistema } from '@/app/components/interativo/info';

/**
 * COMPONENTE DEPARTAMENTOS INICIO
 * Renderiza la interfaz de selección de departamentos
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.departamentos - Lista de departamentos disponibles para el usuario
 * @returns {JSX.Element} - Interfaz completa de selección de departamentos
 */
export default function DepartamentosInicio({ departamentos }) {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        
        {/* ================================================================
            HEADER DE LA PÁGINA
            ================================================================ */}
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Building size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">SELECCIONA UN DEPARTAMENTO</h1>
        </div>

        {/* ================================================================
            ESTADO VACÍO - SIN DEPARTAMENTOS ASIGNADOS
            ================================================================ */}
        {departamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              {/* Icono ilustrativo */}
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Building size={48} className="text-gray-400" />
              </div>
              
              {/* Mensaje informativo */}
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No tienes departamentos asignados
              </h3>
              <p className="text-gray-500 mb-4">
                No se encontraron departamentos asociados a tu cuenta.
              </p>
              
              {/* Botón de acción para contactar admin */}
              <button
                //onClick={() => router.push('')} // TODO: Implementar redirección
                className="px-4 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-all duration-200 shadow flex items-center"
              >
                <Users size={18} className="mr-2" />
                Contactar con Administrador
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             INTERFAZ PRINCIPAL - CON DEPARTAMENTOS DISPONIBLES
             ================================================================ */
          <>
            {/* Descripción de la funcionalidad */}
            <p className="text-gray-600 mb-6">
              Selecciona uno de los departamentos a los que tienes acceso para gestionar sus presupuestos e inversiones.
            </p>

            {/* Grid de tarjetas de departamentos */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Renderizar cada departamento como una tarjeta */}
              {departamentos.map((dept, index) => (
                <DepartamentoCards index={index} dept={dept} key={index} />
              ))}
            </div>
          </>
        )}
        
        {/* ================================================================
            INFORMACIÓN DEL SISTEMA (footer)
            ================================================================ */}
        <InfoSistema/>
      </main>
    </div>
  );
}