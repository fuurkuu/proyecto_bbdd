import Link from "next/link";
import { DollarSign, TrendingUp, Eye, Building, ArrowRight, Settings, Users, ShoppingCart, Truck, XSquareIcon } from 'lucide-react';


export function InfoCard({ ruta, dinero, total, name }) {
    const percentage = dinero ? Math.round((total / dinero) * 100) : 0;
    const isPresupuesto = name === "Presupuesto";

    const safeTotal = isNaN(total) ? 0 : Number(total);
    const safeDinero = isNaN(dinero) ? 0 : Number(dinero);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-[#DB1515] flex items-center justify-center text-white mr-3">
                    <TrendingUp size={18} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`h-2 ${isPresupuesto ? 'bg-[#2C3E8C]' : 'bg-[#DB1515]'}`}></div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            {isPresupuesto ? (
                                <DollarSign size={20} className="mr-2 text-[#2C3E8C]" />
                            ) : (
                                <TrendingUp size={20} className="mr-2 text-[#DB1515]" />
                            )}
                            {name}
                        </h2>
                    </div>

                    <div className="mb-6 text-center">
                        <p className={`text-4xl font-bold ${isPresupuesto ? 'text-[#2C3E8C]' : 'text-[#DB1515]'}`}>
                            {safeTotal.toLocaleString()} €
                        </p>
                        <p className="text-sm text-gray-500 mt-1">de {safeDinero.toLocaleString()} € disponibles</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-gray-600">Porcentaje utilizado</span>
                            <span className={`font-medium ${isPresupuesto ? 'text-[#2C3E8C]' : 'text-[#DB1515]'}`}>
                                {percentage}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${isPresupuesto ? 'bg-[#2C3E8C]' : 'bg-[#DB1515]'}`}
                                style={{ width: `${Math.min(100, percentage)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link href={ruta}>
                            <button className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${isPresupuesto ? 'bg-[#2C3E8C] hover:bg-[#1A2A6B]' : 'bg-[#DB1515] hover:bg-[#9E0B0F]'} text-white ${ruta === "#" ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={ruta === "#"}>
                                <Eye size={16} className="mr-2" />
                                Ver Detalles
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function DepartamentoCards(departamento) {
    const { index, dept } = departamento;

    const getIcon = (index) => {
        const icons = [
            <Building size={24} className="text-white" />,
            <Users size={24} className="text-white" />,
            <ShoppingCart size={24} className="text-white" />,
            <TrendingUp size={24} className="text-white" />,
            <DollarSign size={24} className="text-white" />,
            <Truck size={24} className="text-white" />
        ];
        return icons[index % icons.length];
    };

    const getGradient = (index) => {
        const gradients = [
            'from-[#DB1515] to-[#9E0B0F]',
            'from-[#2C3E8C] to-[#1A2A6B]',
            'from-purple-600 to-purple-800',
            'from-green-600 to-green-800',
            'from-amber-500 to-amber-700',
            'from-teal-500 to-teal-700'
        ];
        return gradients[index % gradients.length];
    };
    return (
        <div
            key={dept.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 `}>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getGradient(index)} mr-4`}>
                        {getIcon(index)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{dept.nombre}</h2>
                </div>

                <div className="mt-6">
                    <Link href={`/inicio/${dept.id}`}
                        className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                    >

                        <div className="flex items-center">
                            <span>Acceder al panel</span>
                            <ArrowRight size={18} className="ml-2" />
                        </div>

                    </Link>
                </div>
            </div>
        </div>
    )
}