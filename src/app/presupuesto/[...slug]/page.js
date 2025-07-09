import Tabla from "@/app/components/interativo/tabla";
import HeaderBolsa from "@/app/components/interativo/headerBolsa";
import { seletPresupuesto, getAnosPresupuesto, seletDepatamentoPresupuesto, selectCompraPresupuesto } from "@/app/functions/querys";
import { getSession, isVerificacion, chartData } from "@/app/functions/functions";
import { ErrorInicio } from "@/app/components/interativo/error";

export default async function GET({ params, searchParams }) {
  const session = await getSession();
  const { slug } = await params;
  const [id] = slug;
  if (!await isVerificacion(id)) {
    return <ErrorInicio msg="No tienes acceso a esta bolsa de presupuesto" />;
  }

  const menu = await getAnosPresupuesto(id);
  if (!menu || menu.length === 0) {
    return <ErrorInicio msg="No hay datos disponibles para esta bolsa de presupuesto" />;
  }

  const { an } = await searchParams || { an: menu[0]?.ANO };
  const [presupuesto] = await seletPresupuesto(id, an);
  const tablaData = await selectCompraPresupuesto(an);
  const chart = chartData(tablaData);

  return (
      <main className="h-full w-full p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Presupuesto</h1>
          </div>
          <HeaderBolsa menu={menu} chartData={chart} name={'Presupuesto'} data={presupuesto} />
          <div className="mt-6">
            <Tabla data={tablaData} session={session} typo={'presupuesto'} />
          </div>
        </div>
      </main>
  );
}
