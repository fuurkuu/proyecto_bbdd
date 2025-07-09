import ChartElement from "@/app/components/interativo/chart";
import Card from "./card";

export default function HeaderBolsa({ menu, chartData, name, data }) {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 border-t-3 border-[#DB1515] transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                    <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
                    <h2 className="text-xl font-semibold text-gray-700">{name} mensual</h2>
                </div>
                <div style={{ height: '250px' }} className="relative">
                    <ChartElement chartData={chartData} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-3 border-[#DB1515] transform transition-all duration-300 hover:shadow-lg">
                <Card menu={menu} data={data}/>
            </div>
        </div>
    )
}