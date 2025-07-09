'use client'

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Truck, Tag } from "lucide-react";

export function InputProvedor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [nombreQuery, setNombreQuery] = useState(searchParams.get("n") || "");
    const [deptoQuery, setDeptoQuery] = useState(searchParams.get("d") || "");
    const [filteredProveedores, setFilteredProveedores] = useState({});


    const handleNombreSearch = (e) => {
        const newQuery = e.target.value;
        setNombreQuery(newQuery);

        const params = new URLSearchParams(searchParams.toString());
        if (newQuery && newQuery.trim() !== "") {
            params.set("n", newQuery);
        } else {
            params.delete("n");
        }

        router.replace(`?${params.toString()}`);
    };

    const handleDeptoSearch = (e) => {
        const newQuery = e.target.value;
        setDeptoQuery(newQuery);

        const params = new URLSearchParams(searchParams.toString());
        if (newQuery && newQuery.trim() !== "") {
            params.set("d", newQuery);
        } else {
            params.delete("d");
        }

        router.replace(`?${params.toString()}`);
    };

 
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Truck size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Nombre del proveedor"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                    value={nombreQuery}
                    onChange={handleNombreSearch}
                />
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Departamento"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB1515]"
                    value={deptoQuery}
                    onChange={handleDeptoSearch}
                />
            </div>
        </div>
    )

}