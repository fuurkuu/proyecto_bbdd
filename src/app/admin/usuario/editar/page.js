import { getDepartamentos } from "@/app/functions/querys";
import UsuarioSearch from "@/app/components/usuario/search";
// import AddUsuario from "../components/usuario/add";
import { Users } from "lucide-react";
import { getIdUser } from "@/app/functions/functions.js";

export default async function UsuarioPage() {
  const idUser = await getIdUser();
  const departamentos = await getDepartamentos();

  return (
    <div className="flex flex-col relative">
      <main className="flex-1 p-8">
       
      </main>
    </div>
  );
}