'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X, PlusCircle, MessageSquare, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import { SuccessAlert, ErrorAlert } from '@/app/components/interativo/alert';

export default function From({ proveedores, infomracion }) {
    console.log('Proveedores:', infomracion);
    const [formData, setFormData] = useState({
        ano: infomracion[1],
        departamento: infomracion[0],
        codigo: '',
        proveedor: '0',
        fecha: '',
        cantidad: '',
        codigoInversion: '',
        importe: '',
        inventariable: '',
        observacion: ''
    });

    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [editandoComentario, setEditandoComentario] = useState(null);
    const [comentarioEditado, setComentarioEditado] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ano: infomracion[1],
            departamento: infomracion[0],
        }));

    }, [infomracion]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/orden/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    data: formData,
                    comentarios: comentarios.map(c => ({ comentario: c.comentario }))
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form
                setFormData({
                    ...formData,
                    codigo: '',
                    proveedor: '0',
                    fecha: '',
                    cantidad: '',
                    codigoInversion: '',
                    importe: '',
                    inventariable: '',
                    ano: infomracion[1],
                    departamento: infomracion[0]
                });
                setComentarios([]);
                setNuevoComentario('');
                setEditandoComentario(null);
                setComentarioEditado('');

                // Show success message using the custom alert component
                setSuccessMessage('Orden creada correctamente');
                setShowSuccess(true);

                // Hide the success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } else {
                // Show error message using the custom alert component
                setErrorMessage(data.error || 'Error al crear la orden');
                setShowError(true);

                // Hide the error message after 3 seconds
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            }
        } catch (error) {
            // Show error message using the custom alert component
            setErrorMessage('Error al enviar el formulario');
            setShowError(true);

            // Hide the error message after 3 seconds
            setTimeout(() => {
                setShowError(false);
            }, 3000);

            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            ...formData,
            ano: infomracion[1],
            departamento: infomracion[0],
            codigo: '',
            proveedor: '0',
            fecha: '',
            cantidad: '',
            codigoInversion: '',
            importe: '',
            inventariable: '',
            observacion: ''
        });
        setComentarios([]);
        setNuevoComentario('');
        setEditandoComentario(null);
        setComentarioEditado('');
    };

    const agregarComentario = () => {
        if (nuevoComentario.trim()) {
            const comentario = {
                id: Date.now(), // ID temporal
                comentario: nuevoComentario,
                fecha_creacion: new Date().toISOString(),
                temporal: true // Marca para identificar comentarios no guardados
            };
            setComentarios([...comentarios, comentario]);
            setNuevoComentario('');
        }
    };

    const editarComentario = (id) => {
        const comentario = comentarios.find(c => c.id === id);
        setEditandoComentario(id);
        setComentarioEditado(comentario.comentario);
    };

    const guardarEdicionComentario = () => {
        if (comentarioEditado.trim()) {
            setComentarios(comentarios.map(c => 
                c.id === editandoComentario 
                    ? { ...c, comentario: comentarioEditado, fecha_modificacion: new Date().toISOString() }
                    : c
            ));
            setEditandoComentario(null);
            setComentarioEditado('');
        }
    };

    const cancelarEdicionComentario = () => {
        setEditandoComentario(null);
        setComentarioEditado('');
    };

    const eliminarComentario = (id) => {
        setComentarios(comentarios.filter(c => c.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="bg-[#FAFAFA] p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ShoppingBag className="mr-2 text-[#DB1515]" size={20} />
                    Datos de la Orden
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                            placeholder="Ej: OC-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Producto <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200 resize-none"
                            placeholder="Nombre del producto"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                    <div className="relative">
                        <select
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white pr-10"
                        >
                            <option value="0">Seleccione un proveedor</option>
                            {proveedores.length > 0 && proveedores.map((dep) => (
                                <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                            placeholder="Ej: 10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código de Inversión</label>
                        <input
                            type="text"
                            name="codigoInversion"
                            value={formData.codigoInversion}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                            placeholder="Ej: INV-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Importe</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
                            <input
                                type="number"
                                name="importe"
                                value={formData.importe}
                                onChange={handleChange}
                                className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                                placeholder="Ej: 1000"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inventariable</label>
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
            </div>

            {/* Sección de Comentarios */}
            <div className="bg-[#FAFAFA] p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MessageSquare className="mr-2 text-[#DB1515]" size={20} />
                    Comentarios
                </h3>

                {/* Agregar nuevo comentario */}
                <div className="mb-4">
                    <div className="flex gap-2">
                        <textarea
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200 resize-none"
                            placeholder="Escribir un comentario..."
                            rows="3"
                        />
                        <button
                            type="button"
                            onClick={agregarComentario}
                            className="px-4 py-2 bg-[#DB1515] text-white rounded-md hover:bg-[#C41313] transition-colors duration-200 flex items-center self-start"
                            disabled={!nuevoComentario.trim()}
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Agregar
                        </button>
                    </div>
                </div>

                {/* Lista de comentarios */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comentarios.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay comentarios aún</p>
                    ) : (
                        comentarios.map((comentario) => (
                            <div key={comentario.id} className="bg-white p-4 rounded-md border border-gray-200">
                                {editandoComentario === comentario.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={comentarioEditado}
                                            onChange={(e) => setComentarioEditado(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] resize-none"
                                            rows="3"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={guardarEdicionComentario}
                                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center text-sm"
                                            >
                                                <Save size={14} className="mr-1" />
                                                Guardar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelarEdicionComentario}
                                                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center text-sm"
                                            >
                                                <XCircle size={14} className="mr-1" />
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-800 mb-2">{comentario.comentario}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {comentario.fecha_modificacion ? 
                                                    `Editado: ${new Date(comentario.fecha_modificacion).toLocaleString()}` :
                                                    `Creado: ${new Date(comentario.fecha_creacion).toLocaleString()}`
                                                }
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => editarComentario(comentario.id)}
                                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                    title="Editar comentario"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarComentario(comentario.id)}
                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    title="Eliminar comentario"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    type="button"
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                >
                    <X size={18} className="mr-2" />
                    Desechar
                </button>

                <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors duration-200 flex items-center shadow-md disabled:opacity-70"
                    disabled={isSubmitting}
                >
                    <PlusCircle size={18} className="mr-2" />
                    {isSubmitting ? 'Procesando...' : 'Agregar Orden'}
                </button>
            </div>

            {/* Alertas */}
            <SuccessAlert
                message={successMessage}
                show={showSuccess}
                onClose={() => setShowSuccess(false)}
                duration={3000}
            />

            <ErrorAlert
                message={errorMessage}
                show={showError}
                onClose={() => setShowError(false)}
            />
        </form>
    );
}