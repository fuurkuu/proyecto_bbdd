import From from "./components/from";
import Bolsa from "./components/bolsa";
import { getDepartamentos, getDepartamentosProveedores } from "../functions/querys";
import { ShoppingCart } from "lucide-react";
import { getIdUser,getReadOnly } from "@/app/functions/functions";
export default async function CompraPage({ searchParams }) {
  await getReadOnly();
  const session = await getIdUser();
  const idUser = session[0];
  const admin = session[1];
  const departamento = await getDepartamentos(idUser, admin);
  const {an, dep} = await searchParams || {an: 0, dep: 0};
  const proveedores = await getDepartamentosProveedores(idUser, admin);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <ShoppingCart size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">AGREGAR ORDEN DE COMPRA</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] py-4 px-6">
            <h2 className="text-white font-semibold">Nueva Orden de Compra</h2>
          </div>
          
          <div className="p-6">
            <Bolsa departamento={departamento} />
            <From proveedores={proveedores} infomracion={[dep, an]} />
          </div>
        </div>
      </div>
    </div>
  );
}