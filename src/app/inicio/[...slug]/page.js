import Desplegable from "@/app/components/interativo/desplegable";
import { InfoCard } from "../components/card";
import { seletDepatamento, getAnos, seletPresupuesto, seletInversion } from "@/app/functions/querys.js";
import { ErrorInicio } from "@/app/components/interativo/error";
import { InfoInicio } from "@/app/components/interativo/info";
import { Building, Calendar } from "lucide-react";
import { isVerificacion } from "@/app/functions/functions";


export default async function InicioPage({ params, searchParams }) {
    const { slug } = await params;
    const [id] = slug;
    await isVerificacion(id);
    const departamento = await seletDepatamento(id);

    if (!departamento || departamento.length === 0) {
        return <ErrorInicio msg={"Departamento no encontrado"} />;
    }

    const menu = await getAnos(id);

    if (!menu || menu.length === 0) {
        return <ErrorInicio msg={"Este departamento no tiene bolsas asignadas"} />;
    }

    const { an } = await searchParams;
    const ano = an || menu[0]?.ANO;
    const presupuestoData = await seletPresupuesto(id, ano);
    const inversionData = await seletInversion(id, ano);
    const presupuesto = presupuestoData && presupuestoData.length > 0 ? presupuestoData[0] : { id: null, dinero: 0, total: 0 };
    const inversion = inversionData && inversionData.length > 0 ? inversionData[0] : { id: null, dinero: 0, total: 0 };
   
    return (
        <div className="flex flex-col relative">
            <main className="flex-1 p-8">
                <div className="flex flex-row gap-8 justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Building size={24} className="text-[#DB1515] mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                    </div>

                    <div className="flex items-center bg-white rounded-lg shadow-sm px-4 py-2 mx-6">
                        <div className="flex items-center mr-4">
                            <Building size={18} className="text-gray-500 mr-2" />
                            <span className="font-medium text-gray-800">{departamento[0].nombre}</span>
                        </div>

                        <div className="flex items-center">
                            <Calendar size={18} className="text-gray-500 mr-2" />
                            <Desplegable menu={menu} talwind={"appearance-none bg-gradient-to-r from-[#DB1515] to-[#9E0B0F] text-white py-1 px-3 rounded-md font-medium shadow-sm text-sm flex "} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoCard
                        ruta={inversion.id ? `/inversion/${id}?an=${ano}` : "#"}
                        dinero={inversion.dinero || 0}
                        total={inversion.total || 0}
                        name={"Inversión"}
                    />

                    <InfoCard
                        ruta={presupuesto.id ? `/presupuesto/${id}?an=${ano}` : "#"}
                        dinero={presupuesto.dinero || 0}
                        total={presupuesto.total || 0}
                        name={"Presupuesto"}
                    />
                </div>

                <InfoInicio
                    departamento={departamento}
                    ano={ano}
                    inversion={inversion}
                    presupuesto={presupuesto}
                />

            </main>
        </div>
    );
}