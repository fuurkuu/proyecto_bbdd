'use client';
import { useState, useTransition, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Plus, PlusCircle, Loader2, Building, CheckCircle, XCircle } from 'lucide-react';

export default function Add({ onAddSuccess }) {
    const [name, setName] = useState('');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recentlyAdded, setRecentlyAdded] = useState([]);

    // Function to add department
    const addDepartment = async () => {
        if (!name || name.trim() === '') {
            setError('El nombre del departamento es requerido');
            return;
        }
        
        try {
            setError('');
            const response = await fetch(`/api/departamento/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name })
            });
            
            const data = await response.json();
          
            if (response.status === 200) {
                // Add to recently added list
                setRecentlyAdded(prev => [
                    { id: Date.now(), name: name },
                    ...prev.slice(0, 4) // Keep only the 5 most recent
                ]);
                
                setName('');
                setSuccess(true);
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                
                startTransition(() => {
                    router.refresh();
                });
                if (onAddSuccess) onAddSuccess();
                return data;
            } else {
                setError(data.error || 'Error al agregar departamento');
            }
        } catch (error) {
            setError('Error en la comunicación con el servidor');
            return [];
        }
    }

    // Function to handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isPending) {
            e.preventDefault();
            addDepartment();
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                <h2 className="text-white font-semibold flex items-center">
                    <PlusCircle size={18} className="mr-2" />
                    Añadir Departamento
                </h2>
            </div>
            
            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Departamento
                    </label>
                    <div className="relative flex">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 p-2.5 focus:ring-[#DB1515] focus:border-[#DB1515] outline-none shadow-sm"
                            placeholder="Ej: Recursos Humanos"
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            value={name}
                            disabled={isPending}
                            onKeyDown={handleKeyDown}
                        />
                        <button 
                            className={`ml-2 p-2.5 rounded-lg flex items-center justify-center transition-colors ${
                                isPending 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white shadow-sm'
                            }`} 
                            onClick={addDepartment}
                            disabled={isPending}
                            title="Agregar departamento"
                        >
                            {isPending ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Plus size={20} />
                            )}
                        </button>
                    </div>
                    
                    {error && (
                        <p className="mt-2 text-sm text-[#DB1515] flex items-center">
                            <XCircle size={14} className="mr-1 flex-shrink-0" />
                            <span>{error}</span>
                        </p>
                    )}
                    
                    {success && (
                        <p className="mt-2 text-sm text-green-600 flex items-center">
                            <CheckCircle size={14} className="mr-1 flex-shrink-0" />
                            <span>Departamento añadido correctamente</span>
                        </p>
                    )}
                </div>
                
                {/* Recently added departments */}
                {recentlyAdded.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Building size={14} className="mr-1 text-[#2C3E8C]" />
                            Departamentos Recientes
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                            {recentlyAdded.map(dept => (
                                <div key={dept.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                    <span className="w-2 h-2 bg-[#DB1515] rounded-full mr-2"></span>
                                    <span className="text-sm text-gray-700">{dept.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-6 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>
                            Los departamentos son unidades organizativas que pueden tener asignados presupuestos e inversiones. 
                            Al crear un departamento, se creará una entrada en el sistema que podrá ser utilizada en la gestión de bolsas y proveedores.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}