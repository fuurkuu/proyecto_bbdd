'use client';

import Desplegable from "@/app/components/interativo/desplegable";
import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";

export default function Card({ data, menu }) {
    const [isEditing, setIsEditing] = useState(false);
    const [dinero, setDinero] = useState(data?.dinero || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Determinar si es inversión o presupuesto basado en la URL
    const esInversion = typeof window !== 'undefined' && window.location.pathname.includes('inversion');
    const tipo = esInversion ? 'inversion' : 'presupuesto';

    if (!data) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB1515]"></div>
        </div>
    );
    
    if (data.length === 0) return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <p>No hay datos disponibles</p>
        </div>
    );
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Resumen</h2>
                </div>
                <div className="flex items-center">
                    <div className="relative">
                        <Desplegable talwind={"appearance-none bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white py-2 px-4 pr-8 rounded-md font-medium shadow-sm"} menu={menu} />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span className="text-green-700 text-sm font-medium">
                            Actualizado correctamente
                        </span>
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center">
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                        <span className="text-red-700 text-sm font-medium">
                            {error}
                        </span>
                    </div>
                )}
                
                <div className="text-center mb-6">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Presupuesto Total</h2>
                    <p className="text-4xl font-bold text-[#DB1515] mt-2">{data.dinero || 0}€</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Invertido</h3>
                        <p className="text-xl text-[#2C3E8C] font-semibold">{data.total || 0}€</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-[#2C3E8C] h-2 rounded-full" style={{ width: `${Math.min(100, ((data.total || 0)/(data.dinero || 1))*100)}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Restante</h3>
                        <p className="text-xl text-[#DB1515] font-semibold">{(data.dinero || 0) - (data.total || 0)}€</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-[#DB1515] h-2 rounded-full" style={{ width: `${Math.min(100, (((data.dinero || 0)-(data.total || 0))/(data.dinero || 1))*100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}