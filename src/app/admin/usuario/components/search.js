'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Trash, Edit, Users, UserCog, Shield, Building, Mail, Briefcase} from "lucide-react";
import Link from "next/link";
import { confirm, SuccessAlert, ErrorAlert } from "@/app/components/interativo/alert";

export default function UsuarioSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = async (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        const params = new URLSearchParams(searchParams);

        if (newQuery) {
            params.set("q", newQuery);
        } else {
            params.delete("q");
        }

        router.replace(`?${params.toString()}`);
    };

    const deleteUsuario = async (id) => {
        const confirmado = await confirm(
            "¿Está seguro que desea eliminar este usuario? Esta acción no puede deshacerse.",
            { 
                title: "Confirmar eliminación de usuario",
                confirmText: "Sí, eliminar",
                cancelText: "Cancelar" 
            }
        );
        
        if (!confirmado) {
            return;
        }

        try {
            setDeleting(id);
            const response = await fetch(`/api/usuario/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== id));
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setErrorMessage(data.error || 'Error al eliminar usuario');
                setShowError(true);
                setTimeout(() => setShowError(false), 3000);
                setError(data.error || 'Error al eliminar usuario');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage('Error en la comunicación con el servidor');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            setError('Error en la comunicación con el servidor');
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeleting(null);
        }
    }

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/usuario/view`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            setUsuarios(data.result);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError('Error al cargar usuarios');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsuarios();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [query]);

    // Función para determinar qué mostrar en el campo de departamentos
    const getDepartamentosDisplay = (usuario) => {
        // Si el usuario tiene permisos de Administrador o Contable, mostrar "Todos departamentos"
        if (usuario.permisos && (usuario.permisos.includes("Administrador") || usuario.permisos.includes("Contable"))) {
            return 'Todos departamentos';
        }
        // De lo contrario, mostrar los departamentos o "Sin departamentos"
        return usuario.departamentos || 'Sin departamentos';
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                <h2 className="text-white font-semibold flex items-center">
                    <Users size={18} className="mr-2" />
                    Buscar Usuarios
                </h2>
            </div>

            <div className="p-6">
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar usuario por nombre..."
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 p-2.5 focus:ring-[#DB1515] focus:border-[#DB1515] outline-none"
                        onChange={handleSearch}
                        value={query}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
                        <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DB1515]"></div>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Users size={40} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No se encontraron usuarios</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {usuarios.map((usuario) => (
                            <div key={usuario.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between">
                                    <div className="mb-2 sm:mb-0">
                                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                                            <UserCog size={18} className="text-[#DB1515] mr-2" />
                                            {usuario.nombre}
                                        </h3>

                                        <div className="mt-2 space-y-1">
                                            {usuario.email && (
                                                <div className="flex items-start">
                                                    <Mail size={14} className="text-gray-500 mr-1 mt-0.5" />
                                                    <span className="text-sm text-gray-600">
                                                        {usuario.email}
                                                    </span>
                                                </div>
                                            )}

                                            {usuario.cargo && (
                                                <div className="flex items-start">
                                                    <Briefcase size={14} className="text-gray-500 mr-1 mt-0.5" />
                                                    <span className="text-sm text-gray-600">
                                                        {usuario.cargo}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Usando la función para mostrar departamentos */}
                                            <div className="flex items-start">
                                                <Building size={14} className="text-gray-500 mr-1 mt-0.5" />
                                                <span className="text-sm text-gray-600">
                                                    {getDepartamentosDisplay(usuario)}
                                                </span>
                                            </div>

                                            {usuario.permisos && (
                                                <div className="flex items-start">
                                                    <Shield size={14} className="text-gray-500 mr-1 mt-0.5" />
                                                    <span className="text-sm text-gray-600">
                                                        {usuario.permisos || 'Sin permisos'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 items-center">
                                        <Link
                                            className="p-1.5 text-[#2C3E8C] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors  h-10 w-10 flex items-center justify-center"
                                            title="Editar usuario"
                                            href={`./usuario/editar/${usuario.id}`}
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            className="p-1.5 text-[#DB1515] bg-red-50 rounded-md hover:bg-red-100 transition-colors h-10 w-10 flex items-center justify-center"
                                            onClick={() => deleteUsuario(usuario.id)}
                                            disabled={deleting === usuario.id}
                                            title="Eliminar usuario"
                                        >
                                            {deleting === usuario.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#DB1515]"></div>
                                            ) : (
                                                <Trash size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Componentes de alerta */}
                <SuccessAlert
                    message="Usuario eliminado correctamente"
                    show={showSuccess}
                    onClose={() => setShowSuccess(false)}
                />
                
                <ErrorAlert
                    message={errorMessage}
                    show={showError}
                    onClose={() => setShowError(false)}
                    title="Error al eliminar usuario"
                />
            </div>
        </div>
    )
}