'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { UserCog, Mail, Building, Shield, Briefcase, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function MiPerfilPage() {
  const { data: session, status } = useSession();
  const [departamentos, setDepartamentos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        setLoading(true);
        try {
          // Fetch user details including departments and permissions
          const response = await fetch('/api/usuario/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: session.user.id }),
          });

          if (!response.ok) {
            throw new Error('Error al cargar datos del usuario');
          }

          const data = await response.json();
          setDepartamentos(data.departamentos || []);
          setPermisos(data.permisos || []);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('No se pudieron cargar los datos del perfil. Por favor, inténtelo de nuevo más tarde.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-8">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
            <UserCog size={24} className="text-[#DB1515] mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">MI PERFIL</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB1515]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-[#DB1515]" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sesión no iniciada</h2>
            <p className="mb-4 text-gray-600">Debe iniciar sesión para ver esta página.</p>
            <Link href="/login" className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white px-4 py-2 rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-8">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
            <UserCog size={24} className="text-[#DB1515] mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">MI PERFIL</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertTriangle size={24} className="mr-3 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-medium mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white rounded-md hover:from-[#C41313] hover:to-[#8A090C] transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <UserCog size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">MI PERFIL</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tarjeta de perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-6 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-20 h-20 rounded-full" />
                    ) : (
                      <UserCog size={48} className="text-[#DB1515]" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{session.user?.name || "Usuario"}</h2>
                  {session.user?.cargo && (
                    <p className="text-sm opacity-80 mt-1">{session.user.cargo}</p>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="text-[#DB1515] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Correo electrónico</p>
                      <p className="font-medium">{session.user?.email || "No disponible"}</p>
                    </div>
                  </div>
                  
                  {session.user?.cargo && (
                    <div className="flex items-center">
                      <Briefcase size={18} className="text-[#DB1515] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Cargo</p>
                        <p className="font-medium">{session.user.cargo}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Clock size={18} className="text-[#DB1515] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Última sesión</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <Shield size={18} className="text-[#DB1515] mr-3" />
                    <p className="font-medium">Nivel de acceso</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    {session.user?.isAdmin && (
                      <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm inline-flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Administrador
                      </div>
                    )}
                    {session.user?.permisos?.r && (
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm inline-flex items-center ml-2">
                        <CheckCircle size={14} className="mr-1" />
                        Lectura
                      </div>
                    )}
                    {session.user?.permisos?.w && (
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm inline-flex items-center ml-2">
                        <CheckCircle size={14} className="mr-1" />
                        Escritura
                      </div>
                    )}
                    {session.user?.permisos?.c && (
                      <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm inline-flex items-center ml-2">
                        <CheckCircle size={14} className="mr-1" />
                        Contable
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="lg:col-span-2 space-y-8">
            {/* Departamentos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] p-4">
                <h2 className="text-white font-semibold flex items-center">
                  <Building size={18} className="mr-2" />
                  Departamentos Asignados
                </h2>
              </div>
              
              <div className="p-6">
                {departamentos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departamentos.map(dept => (
                      <div key={dept.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Building size={18} className="text-[#2C3E8C]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{dept.nombre}</h3>
                            <Link href={`/inicio/${dept.id}`} className="text-sm text-[#2C3E8C] hover:underline">
                              Ver departamento
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Building size={36} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay departamentos asignados</p>
                    <p className="text-sm text-gray-400 mt-1">Contacte con el administrador para obtener acceso a departamentos</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Permisos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] p-4">
                <h2 className="text-white font-semibold flex items-center">
                  <Shield size={18} className="mr-2" />
                  Permisos del Sistema
                </h2>
              </div>
              
              <div className="p-6">
                {permisos.length > 0 ? (
                  <div className="space-y-4">
                    {permisos.map(permiso => (
                      <div key={permiso.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Shield size={18} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{permiso.tipo}</h3>
                            <p className="text-sm text-gray-500">
                              {permiso.tipo === 'Lectura' && 'Permite ver información sin modificarla'}
                              {permiso.tipo === 'Escritura' && 'Permite crear y modificar información'}
                              {permiso.tipo === 'Administrador' && 'Acceso completo al sistema'}
                              {permiso.tipo === 'Contable' && 'Acceso a funciones contables del sistema'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Shield size={36} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay permisos asignados</p>
                    <p className="text-sm text-gray-400 mt-1">Contacte con el administrador para obtener permisos</p>
                  </div>
                )}
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Información</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Si necesita modificar sus permisos o acceder a otros departamentos, comuníquese con el administrador del sistema.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}