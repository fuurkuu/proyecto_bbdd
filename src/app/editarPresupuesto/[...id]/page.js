'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, DollarSign, AlertCircle, CheckCircle, Loader2, FileText, Building, Hash, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function EditarPresupuestoPage({ params }) {
  const router = useRouter();
  // Usar un estado para el ID
  const [idPresupuesto, setIdPresupuesto] = useState('');

  // Esta es la forma recomendada para acceder a los parámetros de ruta en componentes client-side
  useEffect(() => {
    const getId = async () => {
      const { id } = await params;
      if (id) {
        setIdPresupuesto(Array.isArray(id) ? id[0] : id);
      }
    }
    getId();
  }, [params]);

  const [formData, setFormData] = useState({
    codigoOC: '',
    descripcion: '',
    proveedor: '',
    cantidad: '',
    fecha: '',
    es_inventariable: 'Si', // Cambiar estado por es_inventariable
    importe: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [presupuesto, setPresupuesto] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchPresupuesto = async () => {
      if (!idPresupuesto) {
        console.log("ID no disponible aún");
        return;
      }

      try {
        console.log("Cargando presupuesto con ID:", idPresupuesto);
        const response = await fetch(`/api/bolsa/getPresupuesto?id=${idPresupuesto}`);

        const statusCode = response.status;
        console.log("Status code de la respuesta:", statusCode);

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error en la respuesta:", errorData);
          throw new Error(`No se pudo cargar la información del presupuesto. Status: ${statusCode}`);
        }

        const data = await response.json();
        console.log("Datos de presupuesto recibidos:", data);
        setPresupuesto(data);

        // Obtener los detalles de la orden de compra si existe
        if (data.ordenCompra) {
          setFormData({
            codigoOC: data.ordenCompra?.codigo || '',
            descripcion: data.ordenCompra?.descripcion || '',
            proveedor: data.ordenCompra?.idProveedor || '',
            cantidad: data.ordenCompra?.cantidad || '',
            fecha: data.ordenCompra?.fecha ? new Date(data.ordenCompra?.fecha).toISOString().split('T')[0] : '',
            es_inventariable: data.ordenCompra?.inventariable || 'Si', // Usar inventariable en lugar de estado
            importe: data.ordenCompra?.importe || ''
          });
        } else {
          setFormData({
            codigoOC: '',
            descripcion: '',
            proveedor: '',
            cantidad: '',
            fecha: '',
            es_inventariable: 'Si',
            importe: ''
          });
        }

        // Cargar los proveedores
        const proveedoresResponse = await fetch('/api/proveedores/list');
        if (proveedoresResponse.ok) {
          const proveedoresData = await proveedoresResponse.json();
          setProveedores(proveedoresData.proveedores || []);
        }
      } catch (err) {
        console.error("Error al cargar el presupuesto:", err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchPresupuesto();
  }, [idPresupuesto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Actualizar los detalles de la orden de compra
      if (presupuesto.ordenCompra?.id) {
        console.log("Datos a enviar para actualización:", {
          id: presupuesto.ordenCompra.id,
          codigo: formData.codigoOC,
          descripcion: formData.descripcion,
          idProveedor: formData.proveedor,
          cantidad: formData.cantidad,
          fecha: formData.fecha,
          es_inventariable: formData.es_inventariable === 'Si' ? 1 : 0,
          importe: formData.importe
        });

        const ordenResponse = await fetch('/api/orden/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: presupuesto.ordenCompra.id,
            codigo: formData.codigoOC,
            descripcion: formData.descripcion,
            idProveedor: formData.proveedor,
            cantidad: formData.cantidad,
            fecha: formData.fecha,
            es_inventariable: formData.es_inventariable === 'Si' ? 1 : 0, // Convertir a 1/0 para la BD
            importe: formData.importe
          }),
        });

        if (!ordenResponse.ok) {
          const errorData = await ordenResponse.json();
          throw new Error(errorData.error || 'Error al actualizar la orden de compra');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB1515]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
          <Link href="#" onClick={() => router.back()} className="mr-4 text-gray-500 hover:text-[#DB1515] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <FileText size={24} className="text-[#2C3E8C] mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">EDITAR PRESUPUESTO</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start">
            <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-green-700">Presupuesto actualizado correctamente</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] py-4 px-6">
            <h2 className="text-white font-semibold">Información del Presupuesto</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Datos básicos del presupuesto */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-[#2C3E8C]">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-6 bg-[#2C3E8C] mr-3 rounded"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Datos Generales</h3>
                </div>

                {presupuesto && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Año:</p>
                      <p className="text-lg font-semibold text-gray-800">{presupuesto.ano}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Presupuesto inicial:</p>
                      <p className="text-lg font-semibold text-[#2C3E8C]">{presupuesto.dinero?.toLocaleString()}€</p>
                    </div>

                    {presupuesto.total !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total gastado:</p>
                        <p className="text-lg font-semibold text-[#2C3E8C]">{presupuesto.total.toLocaleString()}€</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Datos de la orden de compra */}
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-[#2C3E8C]">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-6 bg-[#2C3E8C] mr-3 rounded"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Datos de la Orden de Compra</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Hash size={16} className="mr-1 text-[#2C3E8C]" />
                    Código OC
                  </label>
                  <input
                    type="text"
                    name="codigoOC"
                    value={formData.codigoOC}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] transition-all duration-200"
                    placeholder="Ej: OC003"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FileText size={16} className="mr-1 text-[#2C3E8C]" />
                    Descripción / Equipamiento
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] transition-all duration-200"
                    placeholder="Ej: Equipamiento tecnológico"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Building size={16} className="mr-1 text-[#2C3E8C]" />
                    Proveedor
                  </label>
                  <div className="relative">
                    <select
                      name="proveedor"
                      value={formData.proveedor}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] appearance-none bg-white pr-10"
                    >
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Package size={16} className="mr-1 text-[#2C3E8C]" />
                      Cantidad
                    </label>
                    <input
                      type="number"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] transition-all duration-200"
                      placeholder="Ej: 8"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Calendar size={16} className="mr-1 text-[#2C3E8C]" />
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <CheckCircle size={16} className="mr-1 text-[#2C3E8C]" />
                      Inventariable
                    </label>
                    <div className="relative">
                      <select
                        name="es_inventariable"
                        value={formData.es_inventariable}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] appearance-none bg-white pr-10"
                      >
                        <option value="Si">Si</option>
                        <option value="No">No</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <DollarSign size={16} className="mr-1 text-[#2C3E8C]" />
                      Importe
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
                      <input
                        type="number"
                        name="importe"
                        value={formData.importe}
                        onChange={handleChange}
                        className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E8C] transition-all duration-200"
                        placeholder="Ej: 7500.25"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="py-3 px-6 bg-gradient-to-r from-[#2C3E8C] to-[#1A2A6B] text-white rounded-md flex items-center justify-center hover:from-[#253475] hover:to-[#142056] transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 