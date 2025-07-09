/**
 * ============================================================================
 * COMPONENTE EDITOR DE COMENTARIOS
 * ============================================================================
 * Componente integrado para gestionar comentarios de órdenes de compra.
 * Permite agregar, editar y eliminar comentarios directamente desde
 * la interfaz de edición de órdenes.
 * 
 * FUNCIONALIDADES:
 * - Cargar comentarios existentes de una orden
 * - Agregar nuevos comentarios
 * - Editar comentarios propios (autor o admin)
 * - Eliminar comentarios con confirmación
 * - Interfaz optimizada para integración en formularios
 * 
 * PROPS:
 * - idOrden: ID de la orden de compra
 * - className: Clases CSS adicionales (opcional)
 */

'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, Save, X, User, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ComentariosEditor({ idOrden, className = '' }) {
    // Estados para gestión de comentarios
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [textoEditando, setTextoEditando] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingComentarios, setLoadingComentarios] = useState(true);
    const [error, setError] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Sesión del usuario para control de permisos
    const { data: session } = useSession();

    /**
     * CARGAR COMENTARIOS AL MONTAR EL COMPONENTE
     * Obtiene todos los comentarios asociados a la orden de compra
     */
    useEffect(() => {
        if (idOrden) {
            cargarComentarios();
        }
    }, [idOrden]);

    /**
     * FUNCIÓN: Cargar comentarios desde la API
     */
    const cargarComentarios = async () => {
        setLoadingComentarios(true);
        try {
            const response = await fetch(`/api/comentarios/${idOrden}`);
            const data = await response.json();
            
            if (data.success) {
                setComentarios(data.comentarios || []);
            } else {
                setError('Error al cargar comentarios');
            }
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            setError('Error de conexión al cargar comentarios');
        } finally {
            setLoadingComentarios(false);
        }
    };

    /**
     * FUNCIÓN: Agregar nuevo comentario
     */
    const agregarComentario = async () => {
        if (!nuevoComentario.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/comentarios/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idOrdenCompra: idOrden,
                    comentario: nuevoComentario.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Añadir el comentario nuevo a la lista
                setComentarios(prev => [data.comentario, ...prev]);
                setNuevoComentario('');
                setMostrarFormulario(false);
            } else {
                setError(data.error || 'Error al agregar comentario');
            }
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            setError('Error de conexión al agregar comentario');
        } finally {
            setLoading(false);
        }
    };

    /**
     * FUNCIÓN: Actualizar comentario existente
     */
    const actualizarComentario = async (id) => {
        if (!textoEditando.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/comentarios/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    comentario: textoEditando.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Actualizar el comentario en la lista
                setComentarios(prev => 
                    prev.map(com => 
                        com.id === id ? data.comentario : com
                    )
                );
                setEditandoId(null);
                setTextoEditando('');
            } else {
                setError(data.error || 'Error al actualizar comentario');
            }
        } catch (error) {
            console.error('Error al actualizar comentario:', error);
            setError('Error de conexión al actualizar comentario');
        } finally {
            setLoading(false);
        }
    };

    /**
     * FUNCIÓN: Eliminar comentario con confirmación
     */
    const eliminarComentario = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/comentarios/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (data.success) {
                // Remover el comentario de la lista
                setComentarios(prev => prev.filter(com => com.id !== id));
            } else {
                setError(data.error || 'Error al eliminar comentario');
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            setError('Error de conexión al eliminar comentario');
        } finally {
            setLoading(false);
        }
    };

    /**
     * FUNCIÓN: Iniciar edición de comentario
     */
    const iniciarEdicion = (comentario) => {
        setEditandoId(comentario.id);
        setTextoEditando(comentario.comentario);
    };

    /**
     * FUNCIÓN: Cancelar edición
     */
    const cancelarEdicion = () => {
        setEditandoId(null);
        setTextoEditando('');
    };

    /**
     * FUNCIÓN: Verificar si el usuario puede editar/eliminar un comentario
     */
    const puedeModificar = (comentario) => {
        if (!session) return false;
        return session.user.isAdmin || comentario.idUsuario_FK === session.user.id;
    };

    /**
     * FUNCIÓN: Formatear fecha de comentario
     */
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* HEADER DE LA SECCIÓN */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MessageSquare size={20} className="mr-2 text-[#DB1515]" />
                    Comentarios de la Orden
                    {comentarios.length > 0 && (
                        <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                            {comentarios.length}
                        </span>
                    )}
                </h3>
                
                {/* BOTÓN PARA AGREGAR COMENTARIO */}
                {session?.user?.permisos?.w || session?.user?.isAdmin ? (
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className="flex items-center px-3 py-2 bg-[#DB1515] text-white rounded-md hover:bg-[#C41313] transition-colors text-sm"
                        disabled={loading}
                    >
                        <Plus size={16} className="mr-1" />
                        Agregar
                    </button>
                ) : null}
            </div>

            {/* MENSAJE DE ERROR */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* FORMULARIO PARA NUEVO COMENTARIO */}
            {mostrarFormulario && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                        <textarea
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Escribe tu comentario aquí..."
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] resize-none"
                            rows={3}
                            disabled={loading}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setMostrarFormulario(false);
                                    setNuevoComentario('');
                                }}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={agregarComentario}
                                className="flex items-center px-4 py-2 bg-[#DB1515] text-white rounded-md hover:bg-[#C41313] transition-colors text-sm disabled:opacity-50"
                                disabled={loading || !nuevoComentario.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-1" />
                                        Guardar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LISTA DE COMENTARIOS */}
            <div className="max-h-96 overflow-y-auto">
                {loadingComentarios ? (
                    <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#DB1515] mx-auto mb-2"></div>
                        Cargando comentarios...
                    </div>
                ) : comentarios.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <MessageSquare size={24} className="mx-auto mb-2 text-gray-300" />
                        No hay comentarios para esta orden
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {comentarios.map((comentario) => (
                            <div key={comentario.id} className="p-4 hover:bg-gray-50 transition-colors">
                                {/* HEADER DEL COMENTARIO */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <User size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-800">
                                            {comentario.nombre || comentario.usuario_nombre}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <Calendar size={14} className="mr-1" />
                                            {formatearFecha(comentario.fecha_creacion)}
                                        </span>
                                    </div>
                                    
                                    {/* ACCIONES DEL COMENTARIO */}
                                    {puedeModificar(comentario) && (
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => iniciarEdicion(comentario)}
                                                className="p-1 text-gray-400 hover:text-[#DB1515] transition-colors"
                                                disabled={loading}
                                                title="Editar comentario"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => eliminarComentario(comentario.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                disabled={loading}
                                                title="Eliminar comentario"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* CONTENIDO DEL COMENTARIO */}
                                {editandoId === comentario.id ? (
                                    /* MODO EDICIÓN */
                                    <div className="space-y-2">
                                        <textarea
                                            value={textoEditando}
                                            onChange={(e) => setTextoEditando(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] resize-none text-sm"
                                            rows={2}
                                            disabled={loading}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={cancelarEdicion}
                                                className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
                                                disabled={loading}
                                            >
                                                <X size={12} className="mr-1" />
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => actualizarComentario(comentario.id)}
                                                className="flex items-center px-2 py-1 bg-[#DB1515] text-white rounded-md hover:bg-[#C41313] transition-colors text-xs disabled:opacity-50"
                                                disabled={loading || !textoEditando.trim()}
                                            >
                                                <Save size={12} className="mr-1" />
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* MODO VISUALIZACIÓN */
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {comentario.comentario}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 