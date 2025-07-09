import Card from "./card";
import { InputProvedor } from "@/app/components/interativo/inputs";
import { Truck , Tag} from "lucide-react";

export default function ProveedorSearch({ proveedores, session }) {
    return (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-4">
                <h2 className="text-white font-semibold flex items-center">
                    <Truck size={18} className="mr-2" />
                    Buscar Proveedores
                </h2>
            </div>

            <div className="p-6">
                <InputProvedor className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" />
                
                <div className="max-h-96 overflow-y-auto pr-1">
                    {Object.keys(proveedores).length > 0 ? (
                        <div className="space-y-3">
                            {Object.keys(proveedores).map((id) => {
                                const item = proveedores[id];
                                return (
                                    <Card key={id} item={item} session={session} id={id} />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Truck size={40} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 mb-1">No se encontraron proveedores</p>
                            <p className="text-sm text-gray-400">Intente con otra búsqueda o agregue un nuevo proveedor</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}