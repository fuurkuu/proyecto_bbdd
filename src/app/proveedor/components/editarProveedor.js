'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Save, XCircle, Building, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarProveedor({ id, proveedorData, allDepartamentos }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [nombre, setNombre] = useState(proveedorData?.nombre || '');
    const [selectedDepts, setSelectedDepts] = useState(proveedorData?.departamentos?.map(d => d.id) || []);
    const [departamentos, setDepartamentos] = useState(allDepartamentos || []);

    useEffect(() => {
        if (proveedorData) {
            setNombre(proveedorData.nombre || '');
            setSelectedDepts(proveedorData.departamentos?.map(d => d.id) || []);
        }

        if (allDepartamentos) {
            setDepartamentos(allDepartamentos);
        }
    }, [proveedorData, allDepartamentos]);

    const handleDepartamentoChange = (e) => {
        const deptoId = parseInt(e.target.value);
        if (deptoId === 0) return;

        if (selectedDepts.includes(deptoId)) {
            setSelectedDepts(selectedDepts.filter(id => id !== deptoId));
        } else {
            setSelectedDepts([...selectedDepts, deptoId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || nombre.trim() === '') {
            setError('El nombre del proveedor es requerido');
            return;
        }

        if (selectedDepts.length === 0) {
            setError('Debe seleccionar al menos un departamento');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/proveedor/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    nombre,
                    departamentos: selectedDepts
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);

                // Hide success message after 3 seconds and redirect back
                setTimeout(() => {
                    router.push('/proveedor');
                    router.refresh();
                }, 3000);
            } else {
                setError(data.error || 'Error al actualizar proveedor');
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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Truck size={24} className="mr-2 text-[#DB1515]" />
                    Editar Proveedor
                </h2>

                <p className="text-gray-600">
                    Modifique los campos necesarios y haga clic en "Actualizar Proveedor" para guardar los cambios.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Truck size={16} className="mr-1 text-[#DB1515]" />
                        Nombre del Proveedor
                    </label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] transition-all duration-200"
                        placeholder="Nombre del proveedor"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Building size={16} className="mr-1 text-[#DB1515]" />
                    Departamentos
                </label>
                <div className="relative">
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white pr-10"
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

                {selectedDepts.length > 0 ? (
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
                                    <XCircle size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">No hay departamentos seleccionados</p>
                )}
            </div>

            {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    <span>Proveedor actualizado correctamente</span>
                </div>
            )}

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex justify-between items-center mt-8">
                <Link
                    href="/proveedor"
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Volver a Proveedores
                </Link>

                <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors flex items-center disabled:opacity-70"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Save size={18} className="mr-2" />
                            Actualizar Proveedor
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}