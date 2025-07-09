/**
 * ============================================================================
 * COMPONENTE EDITOR DE ÓRDENES DE COMPRA CON COMENTARIOS INTEGRADOS
 * ============================================================================
 * Formulario completo para editar órdenes de compra incluyendo:
 * - Datos básicos de la orden (código, observación, proveedor, etc.)
 * - Gestión integrada de comentarios (agregar, editar, eliminar)
 * - Interfaz unificada para una experiencia de usuario completa
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * - Edición de campos de orden de compra
 * - Gestión de comentarios en tiempo real
 * - Validaciones y control de permisos
 * - Estados de carga y mensajes de feedback
 * 
 * PROPS:
 * - orden: Objeto con datos de la orden a editar
 * - proveedor: Array de proveedores disponibles
 */

'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Save, XCircle, Calendar, Hash, FileText, Users, Package, PlusCircle, DollarSign, ClipboardCheck, MessageSquare } from 'lucide-react';
import ComentariosEditor from '../../api/comentarios/ComentariosEditor'; // Importar el componente de comentarios

export default function EditarOrden({ orden, proveedor }) {
    const [formData, setFormData] = useState({
        codigo: '',
        observacion: '',
        proveedor: '',
        fecha: '',
        cantidad: '',
        codigoInversion: '',
        importe: '',
        inventariable: ''
    });

    const [proveedores, setProveedores] = useState(proveedor);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [mostrarComentarios, setMostrarComentarios] = useState(false); // Estado para mostrar/ocultar comentarios

    useEffect(() => {
        if (orden) {
            const fechaFormateada = orden.fecha ?
                new Date(orden.fecha).toISOString().split('T')[0] : '';

            setFormData({
                codigo: orden.cod_compra || '',
                observacion: orden.observacion || '',
                proveedor: orden.proveedor || '',
                fecha: fechaFormateada,
                cantidad: orden.cantidad || '',
                codigoInversion: orden.cod_inversion || '',
                importe: orden.importe || '',
                inventariable: orden.inventariable?.toLowerCase() || ''
            });
        }
    }, [orden]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Simulación de envío al backend
        setTimeout(() => {
            try {
                const ordenActualizada = {
                    cod_compra: formData.codigo,
                    cod_inversion: formData.codigoInversion,
                    observacion: formData.observacion,
                    proveedor: formData.proveedor,
                    cantidad: Number(formData.cantidad),
                    fecha: new Date(formData.fecha).toISOString(),
                    importe: Number(formData.importe),
                    inventariable: formData.inventariable === 'si' ? 'Si' : 'No'
                };
    
                
                setSuccess(true);
                setLoading(false);
                
                // Ocultar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Error:', error);
                setError('Ha ocurrido un error al actualizar la orden');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* ================================================================
                FORMULARIO PRINCIPAL DE EDICIÓN DE ORDEN
                ================================================================ */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <ShoppingBag size={24} className="mr-2 text-[#DB1515]" />
                        Editar Orden de Compra
                    </h2>
                    
                    <p className="text-gray-600">
                        Modifique los campos necesarios y haga clic en "Actualizar Orden" para guardar los cambios.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Hash size={16} className="mr-1 text-[#DB1515]" />
                            Código
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FileText size={16} className="mr-1 text-[#DB1515]" />
                            Observación
                        </label>
                        <input
                            type="text"
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Users size={16} className="mr-1 text-[#DB1515]" />
                        Proveedor
                    </label>
                    <div className="relative">
                        <select
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white pr-10"
                        >
                            <option value="0">Seleccione un proveedor</option>
                            {proveedores.length > 0 && proveedores.map((prov) => (
                                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Calendar size={16} className="mr-1 text-[#DB1515]" />
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Package size={16} className="mr-1 text-[#DB1515]" />
                            Cantidad
                        </label>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <PlusCircle size={16} className="mr-1 text-[#DB1515]" />
                            Código de Inversión
                        </label>
                        <input
                            type="text"
                            name="codigoInversion"
                            value={formData.codigoInversion}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <DollarSign size={16} className="mr-1 text-[#DB1515]" />
                            Importe
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
                            <input
                                type="number"
                                name="importe"
                                value={formData.importe}
                                onChange={handleChange}
                                className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <ClipboardCheck size={16} className="mr-1 text-[#DB1515]" />
                        Inventariable
                    </label>
                    <div className="relative">
                        <select
                            name="inventariable"
                            value={formData.inventariable}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white pr-10"
                        >
                            <option value="" disabled>Seleccione una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {success && (
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Orden actualizada correctamente</span>
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
                        <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* BOTÓN PARA MOSTRAR/OCULTAR COMENTARIOS */}
                <div className="mb-6 border-t border-gray-200 pt-6">
                    <button
                        type="button"
                        onClick={() => setMostrarComentarios(!mostrarComentarios)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                        <MessageSquare size={16} className="mr-2" />
                        {mostrarComentarios ? 'Ocultar Comentarios' : 'Gestionar Comentarios'}
                    </button>
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                        onClick={() => window.history.back()}
                    >
                        <XCircle size={18} className="mr-2" />
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors flex items-center disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Actualizar Orden
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* ================================================================
                SECCIÓN DE GESTIÓN DE COMENTARIOS (CONDICIONAL)
                ================================================================ */}
            {mostrarComentarios && orden?.id && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ComentariosEditor 
                        idOrden={orden.id}
                        className="border-0 shadow-none"
                    />
                </div>
            )}
        </div>
    );
}