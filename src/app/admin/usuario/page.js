import { getDepartamentos } from "../../functions/querys";
import UsuarioSearch from "./components/search";
import AddUsuario from "./components/add";
import { Users } from "lucide-react";
import { InfoUsuario } from "../../components/interativo/info";
import { isAdmin } from "@/app/functions/functions";


export default async function UsuariosPage({ searchParams }) {
  const idUser = await isAdmin();
  const departamentos = await getDepartamentos(idUser[0], true);
  
  return (
    <div className="flex flex-col relative">
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Users size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">GESTIÓN DE USUARIOS</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UsuarioSearch />

          <div className="space-y-8">
            <AddUsuario departamentos={departamentos} />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <InfoUsuario />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}