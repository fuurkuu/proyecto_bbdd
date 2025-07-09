import { Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EditarProveedor from '@/app/proveedor/components/editarProveedor';
import { getProveedorById } from '@/app/functions/querys';
import { ErrorProveedorEditar } from '@/app/components/interativo/error';
import { InfoProveedorEditar } from '@/app/components/interativo/info';


export default async function EditarProveedorPage({ params }) {
    const { id } = await params;


    const data = await getProveedorById(id);
    if (!data) {
        return (
            <ErrorProveedorEditar />
        );
    }
    return (
        <main className="h-full w-full p-8 bg-gray-50 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Truck size={24} className="text-[#DB1515] mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">Editar Proveedor</h1>
                    </div>

                    <Link
                        href="/proveedor"
                        className="flex items-center text-[#2C3E8C] hover:text-[#1A2A6B] transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        <span>Volver a Proveedores</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] py-4 px-6">
                        <h2 className="text-white font-semibold flex items-center">
                            Proveedor: {data.proveedor.nombre}
                        </h2>
                    </div>

                    <EditarProveedor
                        id={id}
                        proveedorData={data.proveedor}
                        allDepartamentos={data.allDepartamentos}
                    />

                </div>
                <InfoProveedorEditar />
            </div>
        </main>
    );

}