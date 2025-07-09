'use client';

import { useState } from 'react';
import { Trash, Edit, Save, Plus, AlertTriangle, Info } from 'lucide-react';
import Alert, { SuccessAlert, ErrorAlert, InfoAlert, ConfirmDialog, confirm } from '../components/interativo/alert';

export default function AlertExample() {
  // Estados para controlar la visibilidad de las alertas
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Manejadores para los diferentes tipos de alertas
  const handleShowSuccess = () => {
    setShowSuccess(true);
    // Se cerrará automáticamente después de 3 segundos
  };
  
  const handleShowError = () => {
    setShowError(true);
  };
  
  const handleShowInfo = () => {
    setShowInfo(true);
  };
  
  const handleDeleteWithConfirm = () => {
    setShowConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    setShowConfirm(false);
    // Simular operación exitosa después de confirmar
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };
  
  // Demostración de confirm basado en promesas
  const handlePromiseConfirm = async () => {
    const confirmado = await confirm(
      "¿Está seguro que desea realizar esta acción? Este proceso no se puede revertir.",
      { 
        title: "Confirmar operación",
        confirmText: "Sí, continuar",
        cancelText: "No, cancelar"
      }
    );
    
    if (confirmado) {
      // Simular operación exitosa después de confirmar
      setTimeout(() => {
        setShowSuccess(true);
      }, 500);
    }
  };
  
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Componentes de Alertas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Alerta de éxito */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Save size={18} className="text-green-600" />
              </div>
              Alerta de Éxito
            </h2>
            <p className="text-gray-600 mb-4">
              Muestra un mensaje de éxito que desaparece automáticamente después de 3 segundos.
            </p>
            <button
              onClick={handleShowSuccess}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white rounded-md transition-colors flex items-center justify-center"
            >
              <Save size={16} className="mr-2" />
              Guardar y mostrar éxito
            </button>
          </div>
          
          {/* Alerta de error */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              Alerta de Error
            </h2>
            <p className="text-gray-600 mb-4">
              Muestra un mensaje de error cuando ocurre un problema.
            </p>
            <button
              onClick={handleShowError}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white rounded-md transition-colors flex items-center justify-center"
            >
              <AlertTriangle size={16} className="mr-2" />
              Simular error
            </button>
          </div>
          
          {/* Alerta informativa */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Info size={18} className="text-blue-600" />
              </div>
              Alerta Informativa
            </h2>
            <p className="text-gray-600 mb-4">
              Muestra información importante para el usuario.
            </p>
            <button
              onClick={handleShowInfo}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] hover:from-[#253475] hover:to-[#142056] text-white rounded-md transition-colors flex items-center justify-center"
            >
              <Info size={16} className="mr-2" />
              Mostrar información
            </button>
          </div>
          
          {/* Diálogo de confirmación */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <Trash size={18} className="text-yellow-600" />
              </div>
              Diálogo de Confirmación
            </h2>
            <p className="text-gray-600 mb-4">
              Solicita confirmación antes de realizar una acción importante.
            </p>
            <button
              onClick={handleDeleteWithConfirm}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center"
            >
              <Trash size={16} className="mr-2" />
              Eliminar con confirmación
            </button>
          </div>
        </div>
        
        {/* Confirm basado en promesas */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm basado en Promesas</h2>
          <p className="text-gray-600 mb-4">
            Una forma más limpia de usar confirmaciones con async/await, sin necesidad de manejar estados.
          </p>
          <button
            onClick={handlePromiseConfirm}
            className="w-full py-2 px-4 bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] hover:from-[#253475] hover:to-[#142056] text-white rounded-md transition-colors flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" />
            Probar confirm con Promise
          </button>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplo de código:</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
              {`import { confirm } from '@/components/alert';

const handleDelete = async () => {
  const isConfirmed = await confirm(
    "¿Está seguro que desea eliminar este elemento?",
    { 
      title: "Confirmar eliminación",
      confirmText: "Sí, eliminar", 
      cancelText: "Cancelar" 
    }
  );
  
  if (isConfirmed) {
    try {
      await deleteItem(id);
      // Mostrar éxito
    } catch (error) {
      // Mostrar error
    }
  }
}`}
            </pre>
          </div>
        </div>
        
        {/* Renderizar las alertas */}
        <SuccessAlert 
          message="Operación completada correctamente" 
          show={showSuccess} 
          onClose={() => setShowSuccess(false)} 
        />
        
        <ErrorAlert 
          message="Ha ocurrido un error al procesar su solicitud. Por favor verifique los datos e intente nuevamente." 
          show={showError} 
          onClose={() => setShowError(false)} 
        />
        
        <InfoAlert 
          message="Esta acción puede tardar hasta 5 minutos en completarse. No cierre esta ventana hasta que finalice el proceso." 
          show={showInfo} 
          onClose={() => setShowInfo(false)} 
        />
        
        <ConfirmDialog 
          message="¿Está seguro que desea eliminar este elemento? Esta acción no se puede deshacer." 
          show={showConfirm} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setShowConfirm(false)} 
          title="Confirmar eliminación"
          confirmText="Sí, eliminar" 
          cancelText="No, cancelar" 
        />
      </div>
    </div>
  );
}