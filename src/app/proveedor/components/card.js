import { Tag } from "lucide-react";
import { BotonesProveedero } from "@/app/components/interativo/boton";

export default function ProveedorCard({ id, item, session }) {
    const boton = session?.user.isAdmin || session?.user.permisos.w;
    return (
        <div key={id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center">
                            <Tag size={14} className="mr-1 text-gray-500" />
                            {item.departamentos.join(", ")}
                        </span>
                    </div>
                </div>

                {boton && (<BotonesProveedero id={id} departamentosInfo={item.departamentosInfo} session={session} />)}
            </div>
        </div>
    );
}