'use client'
import { Trash, Edit, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import PDFModal from "../PDFModal";
import { useRouter } from "next/navigation";
import { confirm, alert } from "./alert";

export function BotonesProveedero({ id, departamentosInfo = [], session }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [filteredProveedores, setFilteredProveedores] = useState({}); 
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const router = useRouter();

    const isAdmin = session?.user?.isAdmin;
    const permisos = session?.user?.permisos;
    const puedeElegirDept = isAdmin || (departamentosInfo && departamentosInfo.length > 1);

    useEffect(() => {
        if (shouldRefresh) {
            if (router && router.refresh) router.refresh();
            setShouldRefresh(false);
        }
    }, [shouldRefresh, router]);

    const handleDelete = async (id, departamentoIds = null) => {
        if ((!departamentoIds || departamentoIds.length === 0) && puedeElegirDept) {
            setShowDeptModal(true);
            return;
        }
        const confirmado = await confirm(
            "¿Está seguro de que desea eliminar este proveedor" + (departamentoIds && departamentoIds.length > 0 ? " de los departamentos seleccionados?" : "?"), 
            {
                title: "Confirmar eliminación",
                confirmText: "Sí, eliminar",
                cancelText: "Cancelar"
            }
        );
        if (!confirmado) {
            setShowDeptModal(false);
            return;
        }
        try {
            setIsDeleting(id);
            const response = await fetch('/api/proveedor/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(departamentoIds && departamentoIds.length > 0 ? { id, departamentoIds } : { id }),
            });
            const data = await response.json();
            if (response.ok) {
                setShowSuccess(true);
                setShouldRefresh(true);
                setTimeout(() => setShowSuccess(false), 2000);
            } else {
                console.error("Error deleting proveedor:", data.error);
                alert("Error al eliminar el proveedor: " + (data.error || "Error desconocido"), { type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting proveedor:", error);
            alert("Error al procesar la solicitud", { type: 'error' });
        } finally {
            setIsDeleting(null);
            setShowDeptModal(false);
        }
    };

    return (
        <div className="flex space-x-3 relative">
            <Link href={`/proveedor/editar/${id}`}
                className="p-1.5 text-[#2C3E8C] bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                title="Editar proveedor"
            >
                <Edit size={16} />
            </Link>
            <button
                className="p-1.5 text-[#DB1515] bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                onClick={() => handleDelete(id)}
                disabled={isDeleting === id}
                title="Eliminar proveedor"
            >
                {isDeleting === id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#DB1515]"></div>
                ) : (
                    <Trash size={16} />
                )}
            </button>
            {showDeptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#545454a9] bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
                        <h2 className="text-lg font-bold mb-4">Selecciona los departamentos</h2>
                        <div className="mb-4 max-h-60 overflow-y-auto flex flex-col gap-2">
                            {departamentosInfo.map(dept => (
                                <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={dept.id}
                                        checked={selectedDept.includes(dept.id)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedDept(prev => [...prev, dept.id]);
                                            } else {
                                                setSelectedDept(prev => prev.filter(id => id !== dept.id));
                                            }
                                        }}
                                    />
                                    <span>{dept.nombre}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setShowDeptModal(false)}
                            >Cancelar</button>
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded hover:from-[#C41313] hover:to-[#8A090C]"
                                disabled={selectedDept.length === 0}
                                onClick={() => handleDelete(id, selectedDept)}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            {showSuccess && (
                <div className="absolute top-0 right-0 mt-8 mr-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50">
                    Proveedor eliminado correctamente
                </div>
            )}
        </div>
    );
}


export function BotonesInversion({ item, typo }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const router = useRouter();

    useEffect(() => {
        console.log("Item en BotonesInversion:", item);
        if (item) {
            console.log("bolsaId:", item.bolsaId);
            console.log("Tipo:", typo);
            console.log("URL de edición:", typo === 'inversion' ? `/editarInversion/${item.bolsaId}` : `/editarPresupuesto/${item.bolsaId}`);
        }
    }, [item, typo]);

    const handleDelete = async () => {
        const confirmado = await confirm(
            `¿Está seguro de que desea eliminar esta ${typo === 'inversion' ? 'inversión' : 'compra'}?`,
            {
                title: "Confirmar eliminación",
                confirmText: "Sí, eliminar",
                cancelText: "Cancelar"
            }
        );
        if (!confirmado) {
            return;
        }

        try {
            setIsDeleting(item.id);
            const response = await fetch('/api/bolsa/deleteOrden', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: item.id, type: typo }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`${typo === 'inversion' ? 'Inversión' : 'Compra'} eliminada exitosamente`, { type: 'success' });
                router.refresh();
            } else {
                alert(`Error al eliminar la ${typo === 'inversion' ? 'inversión' : 'compra'}: ${data.error || "Error desconocido"}`, { type: 'error' });
            }
        } catch (error) {
            alert("Error al procesar la solicitud", { type: 'error' });
        } finally {
            setIsDeleting(null);
        }
    }

    // Asegurarse de que item.bolsaId es un valor válido (no undefined, null o "")
    const hasValidBolsaId = item && item.bolsaId !== undefined && item.bolsaId !== null && item.bolsaId !== "";
    
    // Construir la URL solo si tenemos un ID válido
    const editUrl = hasValidBolsaId
        ? (typo === 'inversion' ? `/editarInversion/${item.bolsaId}` : `/editarPresupuesto/${item.bolsaId}`)
        : '#';

    return (
        <div className="flex items-center space-x-3">
            <Link 
                className="text-[#2C3E8C] hover:text-[#4D61AA] transition-colors" 
                href={editUrl}
                title={`Editar ${typo === 'inversion' ? 'inversión' : 'presupuesto'}`}
                onClick={(e) => {
                    console.log("Click en editar, bolsaId:", item?.bolsaId, "URL:", editUrl);
                    
                    if (!hasValidBolsaId) {
                        e.preventDefault();
                        alert('No se puede editar: ID de bolsa no disponible', { type: 'warning' });
                    }
                }}
            >
                <Edit size={18} />
            </Link>
            <button
                className="text-[#DB1515] hover:text-[#9E0B0F] transition-colors hover:cursor-pointer"
                onClick={handleDelete}
                title={`Eliminar ${typo === 'inversion' ? 'inversión' : 'presupuesto'}`}
            >
                <Trash size={18} />
            </button>
        </div>
    );
}

export function OpenModal({ item }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (<>
        <button
            className="text-gray-500 hover:text-gray-700 transition-colors hover:cursor-pointer"
            onClick={openModal}
            title="Ver/Añadir documentos"
        >
            <FileText size={18} />
        </button>
        <PDFModal
            isOpen={isModalOpen}
            onClose={closeModal}
            itemId={item.id}
        />
    </>
    );
}