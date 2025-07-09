import Link from "next/link"
import { TrendingUp, DollarSign, ShoppingCart, Truck, AlertTriangle, Compass, Building, ArrowRight, Settings } from "lucide-react";
export function InfoUsuario() {
    return (<>
        <div className="bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] p-4">
            <h2 className="text-white font-semibold">Información de Usuarios</h2>
        </div>
        <div className="p-6">
            <div className="space-y-4">
                <p className="text-gray-700">
                    Los <strong>usuarios</strong> son las personas que tienen acceso al sistema de gestión financiera de Salesianos Zaragoza.
                    Cada usuario puede pertenecer a uno o más departamentos y tener diferentes niveles de permisos.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Tipos de permisos</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Lectura:</strong> Permite ver información sin modificarla</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Escritura:</strong> Permite crear y modificar información</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Administrador:</strong> Acceso completo al sistema</span>
                        </li>
                    </ul>
                </div>

                <p className="text-gray-700">
                    Para gestionar los permisos de un usuario, edite su perfil haciendo clic en el icono de edición en la lista de usuarios.
                </p>
            </div>
        </div>
    </>)
}
export function InfoDepartamento() {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">Información</h3>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
                <p>
                    Los departamentos son unidades organizativas fundamentales en el sistema de gestión. Cada departamento puede tener asignado un presupuesto y administrar sus propias inversiones.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Funcionalidades</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Creación y gestión de departamentos</li>
                        <li>Asignación de presupuestos por año</li>
                        <li>Vinculación con proveedores específicos</li>
                        <li>Seguimiento de inversiones</li>
                    </ul>
                </div>

                <p>
                    Para ver el detalle de un departamento, haga clic en su nombre en la lista de búsqueda.
                </p>
            </div>
        </>
    )
}

export function InfoProveedor() {
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] p-4">
            <h2 className="text-white font-semibold">Información</h2>
        </div>
        <div className="p-6">
            <div className="space-y-4">
                <p className="text-gray-700">
                    Los <strong>proveedores</strong> son empresas o entidades que suministran productos o servicios a Salesianos Zaragoza. Cada proveedor puede estar asociado a uno o más departamentos.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Funcionalidades</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Búsqueda por nombre y departamento</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Creación rápida de proveedores</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-[#DB1515] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Asignación a departamentos específicos</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        )
}

        export function InfoInicio({departamento, ano, inversion, presupuesto}) {
    return (
        <>
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                    <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
                    <h2 className="text-lg font-semibold text-gray-800">Resumen del Departamento</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Información General</h3>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Departamento:</span>
                                <span className="font-medium text-gray-800">{departamento[0].nombre}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Año:</span>
                                <span className="font-medium text-gray-800">{ano}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Total asignado:</span>
                                <span className="font-medium text-[#2C3E8C]">{(inversion.dinero || 0) + (presupuesto.dinero || 0)}€</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Total invertido:</span>
                                <span className="font-medium text-[#DB1515]">{(inversion.total || 0) + (presupuesto.total || 0)}€</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-3">Acciones Rápidas</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/compra" className="bg-[#DB1515] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#9E0B0F] transition-colors">
                                <ShoppingCart size={16} className="mr-1" />
                                <span className="text-sm">Nueva Orden</span>
                            </Link>
                            <Link href={inversion.id ? `/inversion/${inversion.id}?an=${ano}` : "#"} className={`${!inversion.id ? 'opacity-50 cursor-not-allowed' : ''} bg-[#2C3E8C] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#1A2A6B] transition-colors`}>
                                <TrendingUp size={16} className="mr-1" />
                                <span className="text-sm">Ver Inversiones</span>
                            </Link>
                            <Link href="/proveedor" className="bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <Truck size={16} className="mr-1" />
                                <span className="text-sm">Proveedores</span>
                            </Link>
                            <Link href={presupuesto.id ? `/presupuesto/${presupuesto.id}?an=${ano}` : "#"} className={`${!presupuesto.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-gray-700 transition-colors`}>
                                <DollarSign size={16} className="mr-1" />
                                <span className="text-sm">Ver Presupuesto</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
}


        export function InfoBolsa({name}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-8">
                <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
                    <DollarSign size={24} className="text-[#DB1515] mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                </div>
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] p-5">
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <h2 className="text-white text-xl font-semibold">Selección requerida</h2>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center mb-8">
                            <div className="bg-amber-50 rounded-full p-4 mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                                <Compass size={60} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Seleccione un departamento primero</h3>
                                <p className="text-gray-600">
                                    Para acceder a la información de presupuestos, es necesario seleccionar primero un departamento.
                                    Cada departamento tiene asignados sus propios presupuestos y bolsas económicas.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-lg mb-8">
                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                                    <Building size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">¿Cómo proceder?</h4>
                                    <p className="text-blue-700 mb-3">
                                        Siga estos pasos para acceder a la información de presupuestos:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-2 text-blue-700">
                                        <li>Diríjase a la página de inicio</li>
                                        <li>Seleccione uno de los departamentos disponibles</li>
                                        <li>Acceda a la sección de presupuestos desde el panel del departamento</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Link
                                href="/inicio"
                                className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] hover:from-[#C41313] hover:to-[#8A090C] text-white px-6 py-3 rounded-lg flex items-center font-medium shadow-md transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <Building size={18} className="mr-2" />
                                <span>Ir a selección de departamentos</span>
                                <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>)
}


        export function InfoSistema() {
    return (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-[#2C3E8C] flex items-center justify-center text-white mr-3">
                    <Settings size={18} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Información del Sistema</h2>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm text-blue-800">
                            El sistema de gestión financiera de Salesianos Zaragoza permite administrar presupuestos, inversiones y órdenes de compra por departamentos. Cada usuario tiene acceso a los departamentos asignados según sus permisos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        )
}


        export function InfoProveedorEditar() {
    return (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg shadow-sm">
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
                            La edición de un proveedor permite modificar su nombre y los departamentos asociados. Esto afectará a qué departamentos pueden realizar órdenes de compra con este proveedor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        )
}