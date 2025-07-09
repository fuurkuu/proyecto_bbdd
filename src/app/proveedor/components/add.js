'use client';
import { useState, useTransition, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { PlusCircle, Building, Truck, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

export default function AddProveedor({departamento}) {
    const [name, setName] = useState('');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [recentlyAdded, setRecentlyAdded] = useState([]);

    const updateFecht = async () => {
        if (!name || name.trim() === '') {
            setError('El nombre del proveedor es requerido');
            return;
        }
        
        if (!selectedDepts.length) {
            setError('Debe seleccionar al menos un departamento');
            return;
        }
        
        try {
            setError('');
            setSuccess(false);
            setSuccessMessage('');
            
            const response = await fetch(`/api/proveedor/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    name: name, 
                    departamentos: selectedDepts 
                }),
            });
            
            const data = await response.json();
          
            if (response.status === 200) {
                // Obtener nombres de departamentos
                const deptNames = selectedDepts.map(depId => 
                    departamento.find(d => d.id == depId)?.nombre || 'Departamento'
                );
                
                // Actualizar mensaje según si es nuevo o existente
                const message = data.isNewProvider 
                    ? 'Proveedor añadido correctamente' 
                    : 'Departamentos añadidos al proveedor existente';
                
                setSuccessMessage(message);
                
                // Agregar a recientes
                setRecentlyAdded(prev => {
                    // Verificar si ya existe en recientes
                    const existingIndex = prev.findIndex(p => p.id === data.id);
                    
                    if (existingIndex >= 0) {
                        // Si existe, actualizar sus departamentos
                        const updated = [...prev];
                        const existingDepts = new Set(updated[existingIndex].departments);
                        deptNames.forEach(dept => existingDepts.add(dept));
                        
                        updated[existingIndex] = {
                            ...updated[existingIndex],
                            departments: Array.from(existingDepts)
                        };
                        
                        return updated;
                    } else {
                        // Si no existe, agregar como nuevo
                        return [
                            { 
                                id: data.id || Date.now(), 
                                name: name,
                                departments: deptNames
                            },
                            ...prev.slice(0, 4) // Keep only the 5 most recent
                        ];
                    }
                });
                
                setName('');
                setSelectedDepts([]);
                setSuccess(true);
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                
                startTransition(() => {
                    router.refresh();
                });
                
                return data;
            } else {
                setError(data.error || 'Error al agregar proveedor');
            }
        } catch (error) {
            setError('Error en la comunicación con el servidor');
            console.error('Error submitting form:', error);
            return [];
        }
    }

    // Function to handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isPending && name && selectedDepts.length > 0) {
            e.preventDefault();
            updateFecht();
        }
    };

    // Función para manejar la selección de departamentos
    const handleDepartamentoChange = (e) => {
        const deptoId = parseInt(e.target.value);
        if (deptoId === 0) return;
        
        if (selectedDepts.includes(deptoId)) {
            setSelectedDepts(selectedDepts.filter(id => id !== deptoId));
        } else {
            setSelectedDepts([...selectedDepts, deptoId]);
        }
    };

    // Función para eliminar un departamento seleccionado
    const removeDepartment = (deptId) => {
        setSelectedDepts(selectedDepts.filter(id => id !== deptId));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                <h2 className="text-white font-semibold flex items-center">
                    <PlusCircle size={18} className="mr-2" />
                    Agregar Proveedor
                </h2>
            </div>
            
            <div className="p-6">
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Truck size={14} className="mr-1 text-[#DB1515]" />
                        Nombre del Proveedor
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Truck size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                            placeholder="Ej: Tecnológica SA"
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            value={name}
                            disabled={isPending}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Building size={14} className="mr-1 text-[#DB1515]" />
                        Departamentos Asociados
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building size={16} className="text-gray-400" />
                        </div>
                        <select
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white"
                            value={0}
                            onChange={handleDepartamentoChange}
                            disabled={isPending}
                        >
                            <option value={0}>Seleccionar departamentos</option>
                            {departamento.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre} {selectedDepts.includes(item.id) ? '(Seleccionado)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Mostrar departamentos seleccionados como etiquetas */}
                    {selectedDepts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedDepts.map(deptId => {
                                const deptName = departamento.find(d => d.id === deptId)?.nombre || 'Departamento';
                                return (
                                    <div key={deptId} className="flex items-center bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {deptName}
                                        <button
                                            type="button"
                                            className="ml-1.5 text-blue-700 hover:text-blue-900"
                                            onClick={() => removeDepartment(deptId)}
                                            disabled={isPending}
                                        >
                                            <XCircle size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Error and success messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-start">
                        <XCircle size={16} className="mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">{error}</div>
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-start">
                        <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">{successMessage || 'Operación completada correctamente'}</div>
                    </div>
                )}
                
                {/* Recently added providers */}
                {recentlyAdded.length > 0 && (
                    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Truck size={14} className="mr-1 text-[#2C3E8C]" />
                            Proveedores Recientes
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                            {recentlyAdded.map(prov => (
                                <div key={prov.id} className="flex flex-col p-2 bg-white rounded-md border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="w-2 h-2 bg-[#DB1515] rounded-full mr-2"></span>
                                            <span className="text-sm font-medium text-gray-700">{prov.name}</span>
                                        </div>
                                    </div>
                                    {prov.departments && prov.departments.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {prov.departments.map((dept, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                                    {dept}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <button 
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                        isPending 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white'
                    }`}
                    onClick={updateFecht}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <PlusCircle size={18} className="mr-2" />
                            <span>Agregar Proveedor</span>
                        </>
                    )}
                </button>
                
                <div className="mt-4">
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="mb-1 font-medium">Información importante</p>
                            <p>Los proveedores pueden estar asociados a múltiples departamentos simultáneamente. Si ingresa un nombre de proveedor existente, se añadirán los departamentos seleccionados a ese proveedor.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}