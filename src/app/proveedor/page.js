'use server';
import ProveedorSearch from "./components/search";
import Add from "./components/add";
import { InfoProveedor } from "@/app/components/interativo/info";;
import { getProveedores, getProveedoresDepatamentos, getDepartamentos } from "@/app/functions/querys";
import { Truck } from "lucide-react";
import { getSession } from "../functions/functions";

export default async function ProveedorPage({ searchParams }) {
  const session = await getSession();
  const id = session?.user.id;
  const admin = session?.user.isAdmin;
  const { n, d } = await searchParams;
  const result = await getProveedores(id, n, d, admin);
  const departamentos = await getDepartamentos(id, admin);
  var proveedores = {};
  console.log(departamentos); 
  
  await Promise.all(result.map(async (item) => {
    var result2 = await getProveedoresDepatamentos(item.id, id, admin);
    if (result2.length === 0) {
      return
    }
    proveedores[item.id] = {
      nombre: item.nombre,
      departamentos: result2.map((item) => item.nombre),
      departamentosInfo: result2.map((item) => ({ id: item.id, nombre: item.nombre })),
    };
    result2 = null;
  }));
    
  
  return (
    <div className="flex flex-col relative">
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Truck size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">GESTIÓN DE PROVEEDORES</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProveedorSearch proveedores={proveedores} session={session}/>
          <div className="space-y-8">
            {(session?.user.isAdmin || session?.user.permisos.w) && (
              <Add departamento={departamentos} session={session} />
            )}
            <InfoProveedor />
          </div>
        </div>
      </main>
    </div>
  );
}