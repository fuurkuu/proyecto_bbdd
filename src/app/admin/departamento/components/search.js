'use client';

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link";
import { Search, Trash, Edit, Building } from "lucide-react";
import Add from "./add";
import { alert, confirm } from "@/app/components/interativo/alert";

export default function DepartmentSearch({ departamentos, loading, refreshDepartamentos }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [deleting, setDeleting] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editError, setEditError] = useState("");
    const [editLoading, setEditLoading] = useState(false);

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
        refreshDepartamentos();
    };

    const deleteDepartamento = async (id) => {
        const confirmado = await confirm("¿Está seguro que desea eliminar este departamento?", {
            title: "Confirmar eliminación",
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar"
        });
        
        if (!confirmado) {
            return;
        }
        
        try {
            setDeleting(id);
            const response = await fetch(`/api/departamento/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            });
            const data = await response.json();
            if (response.ok) {
                await refreshDepartamentos();
                setDeleting(null);
            } else {
                console.error("Error:", data.error);
                alert("No se pudo eliminar el departamento", { type: 'error' });
                setDeleting(null);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al procesar la solicitud", { type: 'error' });
            setDeleting(null);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.nombre);
        setEditError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditError("");
    };

    const saveEdit = async (id) => {
        if (!editName || editName.trim() === "") {
            setEditError("El nombre del departamento es requerido");
            return;
        }
        setEditLoading(true);
        try {
            const response = await fetch(`/api/departamento/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, name: editName }),
            });
            const data = await response.json();
            if (response.ok) {
                await refreshDepartamentos();
                cancelEdit();
            } else {
                setEditError(data.error || "Error al actualizar departamento");
            }
        } catch (error) {
            setEditError("Error al procesar la solicitud");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                    <h2 className="text-white font-semibold flex items-center">
                        <Building size={18} className="mr-2" />
                        Buscar Departamentos
                    </h2>
                </div>
                <div className="p-4">
                    <div className="relative flex items-center mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar departamento..."
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 p-2.5 focus:ring-[#DB1515] focus:border-[#DB1515] outline-none"
                            onChange={handleSearch}
                            value={query}
                        />
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DB1515]"></div>
                        </div>
                    ) : departamentos.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <Building size={40} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No se encontraron departamentos</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {departamentos.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center">
                                    {editingId === item.id ? (
                                        <div className="flex-1 flex flex-col gap-2">
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded px-2 py-1"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                disabled={editLoading}
                                            />
                                            {editError && <span className="text-xs text-red-600">{editError}</span>}
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    className="px-3 py-1 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded hover:from-[#C41313] hover:to-[#8A090C] text-sm"
                                                    onClick={() => saveEdit(item.id)}
                                                    disabled={editLoading}
                                                >{editLoading ? "Guardando..." : "Guardar"}</button>
                                                <button
                                                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                                                    onClick={cancelEdit}
                                                    disabled={editLoading}
                                                >Cancelar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href={`/inicio/${item.id}`} className="text-gray-800 font-medium hover:text-[#DB1515] transition-colors flex-1">
                                            {item.nombre}
                                        </Link>
                                    )}
                                    <div className="flex items-center space-x-3 ml-4">
                                        <button 
                                            className="text-gray-500 hover:text-[#2C3E8C] transition-colors"
                                            title="Editar departamento"
                                            onClick={() => startEdit(item)}
                                            disabled={editingId !== null && editingId !== item.id}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            className="text-gray-500 hover:text-[#DB1515] transition-colors"
                                            onClick={() => deleteDepartamento(item.id)}
                                            disabled={deleting === item.id || editingId !== null}
                                            title="Eliminar departamento"
                                        >
                                            {deleting === item.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#DB1515]"></div>
                                            ) : (
                                                <Trash size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}