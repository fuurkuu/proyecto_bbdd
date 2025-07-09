export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import EditarUsuarioComponent from '@/app/components/usuario/editar';
import { getUsuario } from '@/app/functions/querys';
import { UserCog, ArrowLeft } from 'lucide-react';
import Link from 'next/link';



export default async function EditarUsuarioPage({ params }) {
  const { id } = await params;
  const usuario = await getUsuario(id);

  if (!usuario) {
    notFound();//cambair po aler un 404
  }

  return (
    <main className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <UserCog size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">EDITAR USUARIO</h1>
        </div>

        <Link
          href="./usuario"
          className="flex items-center text-[#2C3E8C] hover:text-[#1A2A6B] transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Volver a Usuarios</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-1 rounded-lg shadow-md mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#DB1515]">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#2C3E8C] text-white rounded-full w-10 h-10 flex items-center justify-center">
                <UserCog size={20} />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-800">{usuario.nombre}</h2>
                <p className="text-sm text-gray-600">ID: {usuario.id}</p>
              </div>
            </div>
          </div>
        </div>

        <EditarUsuarioComponent id={id} />
      </div>
    </main>
  );
}