'use client';
import { useState, useEffect } from "react";
import DepartmentSearch from "./components/search";
import Add from "./components/add";
import { Building } from "lucide-react";
import { InfoDepartamento } from "../../components/interativo/info";

export default function DepartamentoPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para refrescar la lista de departamentos
  const refreshDepartamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/departamento/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "" })
      });
      const data = await response.json();
      setDepartamentos(data.result || []);
    } catch (error) {
      setDepartamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDepartamentos();
  }, []);

  return (
    <div className="flex flex-col relative">
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Building size={24} className="text-[#DB1515] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">DEPARTAMENTOS</h1>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
          <DepartmentSearch departamentos={departamentos} loading={loading} refreshDepartamentos={refreshDepartamentos} />
          <div className="w-full md:w-1/2">
            <Add onAddSuccess={refreshDepartamentos} />
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <InfoDepartamento />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}