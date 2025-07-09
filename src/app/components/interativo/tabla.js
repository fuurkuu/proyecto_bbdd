'use client';

import Link from "next/link";
import { MessageSquare } from "lucide-react";
//import { FileText, Edit, Trash } from "lucide-react";
import { ErrorTabla } from "./Error";
import { BotonesInversion, OpenModal } from "./boton";
import { useState } from "react";

// Componente para mostrar comentarios con botón desplegable
function ComentariosBoton({ ordenId }) {
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [cargando, setCargando] = useState(false);

    const toggleComentarios = async () => {
        if (!mostrarComentarios && comentarios.length === 0) {
            setCargando(true);
            try {
                const response = await fetch(`/api/comentarios/${ordenId}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setComentarios(data.comentarios || []);
                } else {
                    console.error('Error al cargar comentarios');
                }
            } catch (error) {
                console.error('Error al cargar comentarios:', error);
            } finally {
                setCargando(false);
            }
        }
        setMostrarComentarios(!mostrarComentarios);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleComentarios}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Ver comentarios"
            >
                <MessageSquare size={16} />
            </button>
            
            {mostrarComentarios && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white bg-opacity-90 backdrop-blur-lg border border-gray-300 rounded-lg shadow-2xl w-96 max-h-80 overflow-y-auto pointer-events-auto">
                        <div className="p-3 border-b border-gray-200 bg-gray-100 bg-opacity-70 flex justify-between items-center">
                            <h4 className="font-medium text-gray-800">Comentarios</h4>
                            <button
                                onClick={() => setMostrarComentarios(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-3">
                            {cargando ? (
                                <p className="text-gray-500 text-sm">Cargando comentarios...</p>
                            ) : comentarios.length === 0 ? (
                                <p className="text-gray-500 text-sm">No hay comentarios para esta orden</p>
                            ) : (
                                <div className="space-y-2">
                                    {comentarios.map((comentario, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                                            <p className="text-sm text-gray-800">{comentario.comentario}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {comentario.nombre} {comentario.apellido}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(comentario.fecha_creacion).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Tabla({ data, session, typo }) {
    const inversion = !!data[0]?.cod_inversion;
    const permisos = session?.user.isAdmin || session?.user?.permisos?.w;

    if (!data || data.length === 0) {
        return <ErrorTabla />;
    }

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg 
            shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white">
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Código</th>
                                {inversion && <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Cod. Inversión</th>}
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Nombre del Producto</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Proveedor</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Inventariable</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Importe</th>
                                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 align-middle">{item.cod_compra}</td>
                                    {inversion && <td className="px-6 py-4 text-sm text-gray-700 align-middle">{item.cod_inversion}</td>}
                                    <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-xs align-middle">{item.observacion}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 break-words align-middle">{item.proveedor}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 align-middle">{item.cantidad}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap align-middle">{new Date(item.fecha).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.inventariable === 'Si' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.inventariable}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[#2C3E8C] align-middle">{item.importe}€</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 text-center align-middle">
                                        <div className="flex items-center justify-center space-x-3">
                                            <ComentariosBoton ordenId={item.id} />
                                            <OpenModal item={item}/>
                                            {permisos && (<BotonesInversion item={item} typo={typo}/>)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}