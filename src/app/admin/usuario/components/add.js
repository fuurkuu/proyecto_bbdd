'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, UserPlus, Building, Shield, CheckCircle, AlertCircle, Loader2, Users, UserCog, Mail, Briefcase } from 'lucide-react';

export default function AddUsuario({ departamentos }) {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recentlyAdded, setRecentlyAdded] = useState([]);

    // Fetch permisos
    useEffect(() => {
        const fetchPermisos = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/usuario/permisos');
                if (!response.ok) {
                    throw new Error('Error al cargar permisos');
                }
                const data = await response.json();
                const lectura = data.result.find(permiso => permiso.tipo === 'Lectura');
                setPermisos(data.result);
                setSelectedPermisos(lectura ? [lectura.id] : []);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar permisos');
            } finally {
                setLoading(false);
            }
        };

        fetchPermisos();
    }, []);

    const handleDepartamentoChange = (e) => {
        const deptoId = parseInt(e.target.value);
        if (deptoId === 0) return;

        if (selectedDepts.includes(deptoId)) {
            setSelectedDepts(selectedDepts.filter(id => id !== deptoId));
        } else {
            setSelectedDepts([...selectedDepts, deptoId]);
        }
    };

    const handlePermisoChange = (e) => {
        const permisoId = parseInt(e.target.value);
        if (permisoId === 0) return;

        if (selectedPermisos.includes(permisoId)) {
            setSelectedPermisos(selectedPermisos.filter(id => id !== permisoId));
        } else {
            setSelectedPermisos([...selectedPermisos, permisoId]);
        }
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async () => {
        if (!nombre || nombre.trim() === '') {
            setError('El nombre del usuario es requerido');
            return;
        }

        if (email && !validateEmail(email)) {
            setError('El formato del email no es válido');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/usuario/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    cargo,
                    departamentos: selectedDepts,
                    permisos: selectedPermisos
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Add to recently added list
                setRecentlyAdded(prev => [
                    {
                        id: data.id,
                        nombre,
                        email,
                        cargo,
                        departamentos: selectedDepts.map(id => departamentos.find(d => d.id === id)?.nombre || '').filter(Boolean),
                        permisos: selectedPermisos.map(id => permisos.find(p => p.id === id)?.tipo || '').filter(Boolean)
                    },
                    ...prev.slice(0, 2)
                ]);

                // Reset form
                setNombre('');
                setEmail('');
                setCargo('');
                setSelectedDepts([]);
                setSelectedPermisos([]);
                setSuccess(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);

                // Refresh data
                router.refresh();
            } else {
                setError(data.error || 'Error al agregar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error en la comunicación con el servidor');
        } finally {
            setSubmitting(false);
        }
    };

    const getDepartamentoNombre = (id) => {
        const depto = departamentos.find(d => d.id === id);
        return depto ? depto.nombre : '';
    };

    const getPermisoNombre = (id) => {
        const permiso = permisos.find(p => p.id === id);
        return permiso ? permiso.tipo : '';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                <h2 className="text-white font-semibold flex items-center">
                    <UserPlus size={18} className="mr-2" />
                    Añadir Usuario
                </h2>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DB1515]"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <UserCog size={14} className="mr-1 text-[#DB1515]" />
                                Nombre del Usuario
                            </label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                                placeholder="Ej: Juan Pérez"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={submitting}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Mail size={14} className="mr-1 text-[#DB1515]" />
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                                placeholder="Ej: juan.perez@ejemplo.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={submitting}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Briefcase size={14} className="mr-1 text-[#DB1515]" />
                                Cargo
                            </label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                                placeholder="Ej: Director de Departamento"
                                value={cargo}
                                onChange={(e) => {
                                    setCargo(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Building size={14} className="mr-1 text-[#DB1515]" />
                                    Departamentos
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white"
                                        onChange={handleDepartamentoChange}
                                        value={0}
                                        disabled={submitting}
                                    >
                                        <option value={0}>Seleccionar departamento</option>
                                        {departamentos.map((depto) => (
                                            <option key={depto.id} value={depto.id} disabled={selectedDepts.includes(depto.id)}>
                                                {depto.nombre} {selectedDepts.includes(depto.id) ? '(Seleccionado)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {selectedDepts.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedDepts.map((deptoId) => (
                                            <div key={deptoId} className="flex items-center bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {getDepartamentoNombre(deptoId)}
                                                <button
                                                    type="button"
                                                    className="ml-1.5 text-blue-700 hover:text-blue-900"
                                                    onClick={() => setSelectedDepts(selectedDepts.filter(id => id !== deptoId))}
                                                    disabled={submitting}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Shield size={14} className="mr-1 text-[#DB1515]" />
                                    Permisos
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white"
                                        onChange={handlePermisoChange}
                                        value={0}
                                        disabled={submitting}
                                    >
                                        <option value={0}>Seleccionar permiso</option>
                                        {permisos.map((permiso) => (
                                            <option key={permiso.id} value={permiso.id} disabled={selectedPermisos.includes(permiso.id)}>
                                                {permiso.tipo} {selectedPermisos.includes(permiso.id) ? '(Seleccionado)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {selectedPermisos.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedPermisos.map((permisoId) => (
                                            <div key={permisoId} className="flex items-center bg-green-50 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {getPermisoNombre(permisoId)}
                                                {permisoId !== 1 && (
                                                    <button
                                                        type="button"
                                                        className="ml-1.5 text-green-700 hover:text-green-900"
                                                        onClick={() => setSelectedPermisos(selectedPermisos.filter(id => id !== permisoId))}
                                                        disabled={submitting}
                                                    >

                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
                                <AlertCircle size={16} className="mr-2 flex-shrink-0 text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
                                <CheckCircle size={16} className="mr-2 flex-shrink-0 text-green-500" />
                                <span>Usuario añadido correctamente</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${submitting
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white'
                                }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2" />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} className="mr-2" />
                                    <span>Agregar Usuario</span>
                                </>
                            )}
                        </button>

                        {/* Recently added users */}
                        {recentlyAdded.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Users size={14} className="mr-1 text-[#2C3E8C]" />
                                    Usuarios Recientes
                                </h3>
                                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                    {recentlyAdded.map((user) => (
                                        <div key={user.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-[#2C3E8C] text-white rounded-full w-8 h-8 flex items-center justify-center">
                                                    <UserCog size={14} />
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium text-gray-800">{user.nombre}</h4>
                                                    {user.email && (
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <Mail size={10} className="mr-1" />
                                                            {user.email}
                                                        </div>
                                                    )}
                                                    {user.cargo && (
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <Briefcase size={10} className="mr-1" />
                                                            {user.cargo}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {user.departamentos.map((depto, idx) => (
                                                            <span key={idx} className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                                                <Building size={10} className="mr-1" />
                                                                {depto}
                                                            </span>
                                                        ))}
                                                        {user.permisos.map((permiso, idx) => (
                                                            <span key={idx} className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                                                <Shield size={10} className="mr-1" />
                                                                {permiso}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800">Información</h4>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Los usuarios pueden pertenecer a múltiples departamentos y tener diferentes permisos de acceso.
                                        Los permisos definen qué acciones pueden realizar en el sistema.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}