/**
 * ============================================================================
 * COMPONENTE MODAL PARA GESTIÓN DE ARCHIVOS PDF
 * ============================================================================
 * Modal que permite visualizar, subir y eliminar archivos PDF asociados
 * a órdenes de compra específicas. Incluye feedback visual, validaciones
 * y manejo de estados de carga.
 * 
 * Características:
 * - Visualización de PDFs en iframe embebido
 * - Subida múltiple de archivos con validación
 * - Eliminación con confirmación
 * - Estados de carga y progreso
 * - Notificaciones de éxito/error
 * - Validación de tipos de archivo
 */

'use client';

// Importaciones para estado, efectos e iconos
import { useState, useEffect } from 'react';
import { X, Upload, FileText, Trash, CheckCircle, FilePlus, AlertTriangle } from 'lucide-react';
import { confirm, alert } from "@/app/components/interativo/alert";

/**
 * COMPONENTE MODAL PDF
 * Gestiona la visualización y manipulación de archivos PDF
 * 
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {number} props.itemId - ID del elemento (orden de compra) asociado
 * @returns {JSX.Element|null} - Modal completo o null si está cerrado
 */
export default function PDFModal({ isOpen, onClose, itemId }) {
  // ========================================================================
  // ESTADOS DEL COMPONENTE
  // ========================================================================
  
  // Lista de PDFs asociados al elemento
  const [pdfs, setPdfs] = useState([]);
  
  // Estados de carga para diferentes operaciones
  const [loading, setLoading] = useState(false);              // Cargando lista de PDFs
  const [uploadLoading, setUploadLoading] = useState(false);  // Subiendo archivos
  const [deleteLoading, setDeleteLoading] = useState(null);   // Eliminando archivo específico
  
  // Archivos seleccionados para subir
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Estados para notificaciones de éxito
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  
  // Progreso de subida de archivos
  const [uploadProgress, setUploadProgress] = useState(0);

  // ========================================================================
  // EFECTOS
  // ========================================================================
  
  /**
   * EFECTO PARA CARGAR PDFS AL ABRIR EL MODAL
   * Se ejecuta cuando el modal se abre y hay un itemId válido
   */
  useEffect(() => {
    if (isOpen && itemId) {
      fetchPDFs();
    }
  }, [isOpen, itemId]);

  // ========================================================================
  // FUNCIONES DE API
  // ========================================================================

  /**
   * OBTENER LISTA DE PDFS DEL SERVIDOR
   * Consulta todos los PDFs asociados al elemento actual
   */
  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pdf/list?itemId=${itemId}`);
      if (response.ok) {
        const data = await response.json();
        setPdfs(data.pdfs);
      } else {
        console.error('Error al cargar los PDFs');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // FUNCIONES DE MANEJO DE ARCHIVOS
  // ========================================================================

  /**
   * MANEJAR SELECCIÓN DE ARCHIVOS
   * Valida que los archivos seleccionados sean PDFs válidos
   * 
   * @param {Event} e - Evento del input de archivo
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.includes('pdf'));
    
    // Validar que hay archivos PDF válidos
    if (validFiles.length === 0) {
      alert('Por favor, selecciona archivos PDF válidos', { type: 'error' });
      return;
    }
    
    // Advertir si algunos archivos no son PDFs
    if (validFiles.length !== files.length) {
      alert('Solo se han seleccionado los archivos PDF válidos', { type: 'warning' });
    }
    
    setSelectedFiles(validFiles);
  };

  /**
   * SUBIR ARCHIVOS AL SERVIDOR
   * Procesa la subida de múltiples archivos PDF con feedback de progreso
   */
  const handleFileUpload = async () => {
    // Validar que hay archivos seleccionados
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo PDF válido', { type: 'error' });
      return;
    }

    setUploadLoading(true);
    let filesUploaded = 0;
    let totalFiles = selectedFiles.length;
    
    try {
      // Ocultar notificaciones previas
      setShowDeleteSuccess(false);
      
      // Subir cada archivo individualmente para mejor control
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('itemId', itemId);
        
        const response = await fetch('/api/pdf/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Error al subir el PDF ${file.name}:`, error);
          continue; // Continuar con el siguiente archivo
        }
        
        filesUploaded++;
        // Actualizar progreso visual
        setUploadProgress(Math.round((filesUploaded / totalFiles) * 100));
      }
      
      // Recargar la lista de PDFs para mostrar los nuevos archivos
      fetchPDFs();
      setSelectedFiles([]);
      
      // Mostrar mensaje de éxito apropiado
      if (filesUploaded === totalFiles) {
        setSuccessMessage(`${filesUploaded} ${filesUploaded === 1 ? 'PDF subido' : 'PDFs subidos'} correctamente`);
      } else {
        setSuccessMessage(`${filesUploaded} de ${totalFiles} PDFs subidos correctamente`);
      }
      setShowSuccess(true);
      
      // Auto-ocultar notificación después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      // Limpiar el input de archivo y resetear progreso
      const fileInput = document.getElementById('pdf-upload');
      if (fileInput) fileInput.value = '';
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir los archivos', { type: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  /**
   * ELIMINAR ARCHIVO PDF
   * Solicita confirmación y elimina un archivo específico del servidor
   * 
   * @param {string} filename - Nombre del archivo a eliminar
   */
  const handleDeletePDF = async (filename) => {
    // Solicitar confirmación antes de eliminar
    const confirmado = await confirm(
      '¿Está seguro de que desea eliminar este documento?',
      {
        title: 'Confirmar eliminación',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    );
    
    if (!confirmado) {
      return;
    }
    
    setDeleteLoading(filename);
    try {
      // Ocultar notificaciones de subida
      setShowSuccess(false);
      
      const response = await fetch('/api/pdf/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      if (response.ok) {
        // Extraer nombre limpio del archivo para el mensaje
        const displayName = filename.split('_').slice(2).join('_');
        
        // Actualizar lista local eliminando el archivo
        setPdfs(pdfs.filter(pdf => pdf.filename !== filename));
        
        // Mostrar mensaje de éxito
        setDeleteSuccessMessage(`"${displayName}" eliminado correctamente`);
        setShowDeleteSuccess(true);
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 3000);
      } else {
        const error = await response.json();
        alert(`Error al eliminar el PDF: ${error.message || 'Error desconocido'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el archivo', { type: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // ========================================================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================================================
  return (
    <div className="fixed inset-0 bg-[#000000b5] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        {/* ================================================================
            HEADER DEL MODAL
            ================================================================ */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Documentos PDF</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================================
            CONTENIDO PRINCIPAL DEL MODAL
            ================================================================ */}
        <div className="p-4">
          
          {/* NOTIFICACIONES DE ÉXITO */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
              <CheckCircle size={18} className="text-green-500 mr-2" />
              <span className="text-green-700 text-sm font-medium">{successMessage}</span>
            </div>
          )}
          
          {showDeleteSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
              <CheckCircle size={18} className="text-green-500 mr-2" />
              <span className="text-green-700 text-sm font-medium">{deleteSuccessMessage}</span>
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="pdf-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFiles.length > 0 
                      ? `${selectedFiles.length} ${selectedFiles.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}`
                      : 'Seleccionar PDFs'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Haz clic para seleccionar archivos
                  </span>
                </div>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadLoading}
                />
              </label>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="max-h-28 overflow-y-auto bg-gray-50 rounded-md p-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center py-1 px-2 rounded hover:bg-gray-100">
                        <FilePlus size={14} className="text-[#DB1515] mr-2" />
                        <span className="text-xs text-gray-800 truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleFileUpload}
                    disabled={uploadLoading}
                    className="bg-[#DB1515] hover:bg-[#c01212] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center w-full"
                  >
                    {uploadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Subiendo... {uploadProgress > 0 ? `${uploadProgress}%` : ''}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        <span>Subir {selectedFiles.length} {selectedFiles.length === 1 ? 'PDF' : 'PDFs'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Documentos disponibles
            </h4>
            
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DB1515]"></div>
              </div>
            ) : pdfs.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {pdfs.map((pdf) => (
                  <li key={pdf.id} className="py-3">
                    <div className="flex items-center hover:bg-gray-50 p-2 rounded transition-colors">
                      <a
                        href={`/api/pdf/view?filename=${pdf.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center flex-grow max-w-[calc(100%-40px)]"
                      >
                        <FileText className="h-5 w-5 text-[#DB1515] mr-3 flex-shrink-0" />
                        <div className="min-w-0 overflow-hidden">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {pdf.filename.split('_').slice(2).join('_')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(pdf.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </a>
                      <button
                        onClick={() => handleDeletePDF(pdf.filename)}
                        disabled={deleteLoading === pdf.filename}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                        title="Eliminar documento"
                      >
                        {deleteLoading === pdf.filename ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash size={18} />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No hay documentos disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);
}