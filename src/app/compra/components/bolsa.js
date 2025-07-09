'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Building, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function Bolsa({ departamento }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bolsa, setBolsa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [values, setValues] = useState({
        departamentoId: new URLSearchParams(searchParams).get("dep") || "0",
        anoId: new URLSearchParams(searchParams).get("an") || "0",
    });

    const departamentoChange = async (e) => {
        const newValue = e.target.value;
        setValues({ ...values, departamentoId: newValue, anoId: "0" });
        setLoading(true);
        setError('');
        
        try {
            const result = await viewApi(newValue);
            setBolsa(result);
            
            if (result.length === 0) {
                setError('No hay bolsas disponibles para este departamento');
            }
        } catch (err) {
            setError('Error al cargar las bolsas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const viewApi = async (deptId = values.departamentoId) => {
        try {
            const response = await fetch(`/api/bolsa/getAno`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: deptId })
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }

    const getBolsa = (e) => {
        const newValue = e.target.value;
        setValues({ ...values, anoId: newValue });
    }
    
    useEffect(() => {
        const fetchData = async () => {
            if (values.departamentoId !== "0") {
                setLoading(true);
                setError('');
                
                try {
                    const result = await viewApi();
                    setBolsa(result);
                    
                    if (result.length === 0) {
                        setError('No hay bolsas disponibles para este departamento');
                    }
                } catch (err) {
                    setError('Error al cargar las bolsas');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchData();
        
        const params = new URLSearchParams(searchParams);
        if (values.anoId !== "0" && values.departamentoId !== "0") {
            params.set("an", values.anoId);
            params.set("dep", values.departamentoId);
        } else {
            params.delete("an");
            params.delete("dep");
        }
        router.replace(`?${params.toString()}`);
    }, [values]);
    
    return (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-[#DB1515]">
            <div className="flex items-center mb-4">
                <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-800">Selección de Partida Presupuestaria</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building size={18} className="text-gray-500" />
                        </div>
                        <select
                            name="departamento"
                            onChange={departamentoChange}
                            value={values.departamentoId}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none bg-white pr-10 shadow-sm"
                            disabled={loading}
                        >
                            <option value="0">Seleccione un departamento</option>
                            {departamento.length > 0 && departamento.map((dep) => (
                                <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            {loading ? (
                                <Loader2 size={18} className="animate-spin text-[#DB1515]" />
                            ) : (
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-gray-500" />
                        </div>
                        <select
                            name="bolsa"
                            onChange={getBolsa}
                            value={values.anoId}
                            className={`w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB1515] appearance-none pr-10 shadow-sm ${values.departamentoId === "0" || loading || error ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                            disabled={values.departamentoId === "0" || loading || error}
                        >
                            <option value="0" disabled>Seleccione un año</option>
                            {loading ? (
                                <option value="" disabled>Cargando...</option>
                            ) : (
                                bolsa.length > 0 && bolsa.map((bls) => (
                                    <option key={bls.id} value={bls.ano}>{bls.ano}</option>
                                ))
                            )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            {loading ? (
                                <Loader2 size={18} className="animate-spin text-[#DB1515]" />
                            ) : (
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>
                    {values.departamentoId === "0" && (
                        <p className="mt-1 text-sm text-[#DB1515] flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            Seleccione primero un departamento
                        </p>
                    )}
                    {error && (
                        <p className="mt-1 text-sm text-[#DB1515] flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {error}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Coemntado */}
            {/* {(values.departamentoId !== "0" && values.anoId !== "0") && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    <span className="text-sm text-green-700">
                        Selección completa: Departamento <strong>{departamento.find(d => d.id == values.departamentoId)?.nombre}</strong> y Año <strong>{values.anoId}</strong>
                    </span>
                </div>
            )} */}
        </div>
    );
}