'use client'; 

import { useState, useEffect, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';


export function SuccessAlert({ message, show, onClose, duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slide-in-right">
      <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-md flex items-start">
        <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-green-500 hover:text-green-700 transition-colors ml-2"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * ErrorAlert - Muestra un mensaje de error
 * Ahora aparece en la esquina inferior derecha
 */
export function ErrorAlert({ message, show, onClose, title = "Error" }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slide-in-right">
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md flex items-start">
        <XCircle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h3 className="font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-red-700 text-sm">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-red-500 hover:text-red-700 transition-colors ml-2"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * InfoAlert - Muestra un mensaje informativo
 * Ahora aparece en la esquina inferior derecha
 */
export function InfoAlert({ message, show, onClose, title = "Información" }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slide-in-right">
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md flex items-start">
        <Info size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h3 className="font-medium text-blue-800">{title}</h3>
          <p className="mt-1 text-blue-700 text-sm">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-blue-500 hover:text-blue-700 transition-colors ml-2"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * ConfirmDialog - Muestra un diálogo de confirmación
 * Este componente permanece centrado en la pantalla
 */
export function ConfirmDialog({ 
  message, 
  show, 
  onConfirm, 
  onCancel, 
  title = "Confirmar acción", 
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonStyle = "bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C]"
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#000000b5] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4 rounded-t-lg">
          <h3 className="text-white font-semibold flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            {title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-yellow-100 p-2 rounded-full mr-4">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <p className="text-gray-700">{message}</p>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${confirmButtonStyle} text-white rounded-md transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ToastContainer - Sistema de notificaciones tipo toast
 * Ya estaba en la esquina inferior derecha
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Añadir un nuevo toast
  const addToast = (type, message, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  // Eliminar un toast por su id
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Añadir métodos de toast al objeto window para acceso global
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.toast = {
        success: (message, duration) => addToast('success', message, duration),
        error: (message, duration) => addToast('error', message, duration),
        info: (message, duration) => addToast('info', message, duration),
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.toast;
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-6 z-50 space-y-3">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`p-3 rounded-lg shadow-md flex items-center max-w-xs animate-fade-in transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={16} className="text-green-500 mr-2" />}
          {toast.type === 'error' && <XCircle size={16} className="text-red-500 mr-2" />}
          {toast.type === 'info' && <Info size={16} className="text-blue-500 mr-2" />}
          
          <p className="text-sm">{toast.message}</p>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className={`ml-2 ${
              toast.type === 'success' ? 'text-green-500 hover:text-green-700' :
              toast.type === 'error' ? 'text-red-500 hover:text-red-700' :
              'text-blue-500 hover:text-blue-700'
            } transition-colors`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function confirm(message, options = {}) {
  return new Promise((resolve) => {
    // Crear contenedor si no existe
    let container = document.getElementById('confirm-dialog-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confirm-dialog-container';
      document.body.appendChild(container);
    }
    
    // Crear un div para el componente
    const div = document.createElement('div');
    container.appendChild(div);
    
    // Función para eliminar el diálogo
    const cleanup = () => {
      if (container.contains(div)) {
        container.removeChild(div);
        if (container.childNodes.length === 0) {
          document.body.removeChild(container);
        }
      }
    };
    
    // Renderizar el diálogo usando React
    const root = createRoot(div);
    
    const handleConfirm = () => {
      resolve(true);
      cleanup();
    };
    
    const handleCancel = () => {
      resolve(false);
      cleanup();
    };
    
    const dialogProps = {
      message,
      show: true,
      title: options.title || "Confirmar acción",
      confirmText: options.confirmText || "Confirmar",
      cancelText: options.cancelText || "Cancelar",
      confirmButtonStyle: options.confirmButtonStyle,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    };
    
    // Renderizar el diálogo
    root.render(createElement(ConfirmDialog, dialogProps));
  });
}

/**
 * Alert - Muestra un mensaje de alerta personalizado que reemplaza al alert nativo
 * @param {string} message - El mensaje a mostrar
 * @param {object} options - Opciones adicionales como título, tipo, etc.
 */
export function alert(message, options = {}) {
  return new Promise((resolve) => {
    // Crear contenedor si no existe
    let container = document.getElementById('alert-dialog-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'alert-dialog-container';
      document.body.appendChild(container);
    }
    
    // Crear un div para el componente
    const div = document.createElement('div');
    container.appendChild(div);
    
    // Función para eliminar el diálogo
    const cleanup = () => {
      if (container.contains(div)) {
        container.removeChild(div);
        if (container.childNodes.length === 0) {
          document.body.removeChild(container);
        }
      }
    };
    
    // Renderizar el diálogo usando React
    const root = createRoot(div);
    
    const handleConfirm = () => {
      resolve(true);
      cleanup();
    };
    
    // Determinar el tipo de alerta (success, error, info)
    const type = options.type || 'info';
    let icon, headerClass, iconClass;
    
    switch(type) {
      case 'success':
        icon = CheckCircle;
        headerClass = 'bg-gradient-to-r from-green-500 to-green-700';
        iconClass = 'text-green-600 bg-green-100';
        break;
      case 'error':
        icon = XCircle;
        headerClass = 'bg-gradient-to-r from-red-500 to-red-700';
        iconClass = 'text-red-600 bg-red-100';
        break;
      case 'warning':
        icon = AlertTriangle;
        headerClass = 'bg-gradient-to-r from-yellow-500 to-yellow-700';
        iconClass = 'text-yellow-600 bg-yellow-100';
        break;
      default: // info
        icon = Info;
        headerClass = 'bg-gradient-to-r from-blue-500 to-blue-700';
        iconClass = 'text-blue-600 bg-blue-100';
    }
    
    // Crear componente personalizado para la alerta
    const AlertDialog = () => (
      <div className="fixed inset-0 bg-[#000000b5] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
          <div className={`${headerClass} p-4 rounded-t-lg`}>
            <h3 className="text-white font-semibold flex items-center">
              {createElement(icon, { size: 18, className: "mr-2" })}
              {options.title || (type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : type === 'warning' ? 'Advertencia' : 'Información')}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="flex items-start mb-6">
              <div className={`${iconClass} p-2 rounded-full mr-4`}>
                {createElement(icon, { size: 24 })}
              </div>
              <p className="text-gray-700">{message}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                {options.confirmText || 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    
    // Renderizar la alerta
    root.render(<AlertDialog />);
  });
}

export const alertStyles = `
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
`;

// Exportación por defecto que incluye todas las funciones
const Alert = {
  Success: SuccessAlert,
  Error: ErrorAlert,
  Info: InfoAlert,
  Confirm: ConfirmDialog,
  Toast: ToastContainer,
  confirm,
  alert
};

export default Alert;