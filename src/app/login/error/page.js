'use client';
//             <div className="h-8 w-8 rounded-full bg-[#2C3E8C] flex items-center justify-center text-white mr-3">

import React, { useState } from 'react';
import { Trash2, Edit, DollarSign, UserPlus, PieChart, Calendar, Search, ArrowUp, CheckCircle, Clock, User, Plus, Receipt, UserCheck, Users, FileText, Share2, CreditCard } from 'lucide-react';

const FinanzasApp = () => {
  const [activeTab, setActiveTab] = useState('gastos');
  const [contactos, setContactos] = useState([
    { id: 1, nombre: 'Carlos Rodríguez', avatar: '👨🏻‍💼' },
    { id: 2, nombre: 'María López', avatar: '👩🏻‍🦰' },
    { id: 3, nombre: 'Juan Gómez', avatar: '🧑🏽‍🦱' }
  ]);
  
  const [gastos, setGastos] = useState([
    { 
      id: 1, 
      concepto: 'Cena en restaurante', 
      monto: 90, 
      fecha: '10/05/2025', 
      pagadoPor: 'Yo',
      asignadoA: [
        { id: 1, nombre: 'Carlos Rodríguez', avatar: '👨🏻‍💼', monto: 30 },
        { id: 2, nombre: 'María López', avatar: '👩🏻‍🦰', monto: 30 },
        { id: 0, nombre: 'Yo', avatar: '🧑', monto: 30 }
      ],
      categoria: 'Comida'
    },
    { 
      id: 2, 
      concepto: 'Entradas al cine', 
      monto: 45, 
      fecha: '01/05/2025', 
      pagadoPor: 'Carlos Rodríguez',
      asignadoA: [
        { id: 0, nombre: 'Yo', avatar: '🧑', monto: 22.5 },
        { id: 1, nombre: 'Carlos Rodríguez', avatar: '👨🏻‍💼', monto: 22.5 }
      ],
      categoria: 'Ocio'
    },
    { 
      id: 3, 
      concepto: 'Compras supermercado', 
      monto: 120, 
      fecha: '28/04/2025', 
      pagadoPor: 'Yo',
      asignadoA: [
        { id: 2, nombre: 'María López', avatar: '👩🏻‍🦰', monto: 60 },
        { id: 0, nombre: 'Yo', avatar: '🧑', monto: 60 }
      ],
      categoria: 'Comida'
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredGastos = gastos.filter(
    gasto => gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
             gasto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcula el total que me deben 
  const calcularDeudas = () => {
    let deudaTotal = 0;
    
    gastos.forEach(gasto => {
      if (gasto.pagadoPor === 'Yo') {
        // Si yo pagué, sumar lo que otros me deben
        gasto.asignadoA.forEach(persona => {
          if (persona.nombre !== 'Yo') {
            deudaTotal += persona.monto;
          }
        });
      } else {
        // Si otra persona pagó, restar lo que yo le debo
        gasto.asignadoA.forEach(persona => {
          if (persona.nombre === 'Yo') {
            deudaTotal -= persona.monto;
          }
        });
      }
    });
    
    return deudaTotal;
  };
  
  const totalDeuda = calcularDeudas();
  
  // Calcular balances por persona
  const calcularBalancesPorPersona = () => {
    const balances = {};
    
    gastos.forEach(gasto => {
      if (gasto.pagadoPor === 'Yo') {
        // Si yo pagué, los demás me deben
        gasto.asignadoA.forEach(persona => {
          if (persona.nombre !== 'Yo') {
            if (!balances[persona.nombre]) {
              balances[persona.nombre] = {
                nombre: persona.nombre,
                avatar: persona.avatar,
                balance: 0
              };
            }
            balances[persona.nombre].balance += persona.monto;
          }
        });
      } else {
        // Si otro pagó, yo le debo
        gasto.asignadoA.forEach(persona => {
          if (persona.nombre === 'Yo') {
            if (!balances[gasto.pagadoPor]) {
              // Buscar el avatar de la persona que pagó
              const pagador = contactos.find(c => c.nombre === gasto.pagadoPor) || { avatar: '👤' };
              balances[gasto.pagadoPor] = {
                nombre: gasto.pagadoPor,
                avatar: pagador.avatar,
                balance: 0
              };
            }
            balances[gasto.pagadoPor].balance -= persona.monto;
          }
        });
      }
    });
    
    return Object.values(balances);
  };
  
  const balancesPersonas = calcularBalancesPorPersona();

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <DollarSign size={20} />
            </div>
            <h1 className="text-xl font-bold">MisGastos</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-white bg-opacity-20 p-2 rounded-full">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Summary */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-500 text-white p-5 shadow-lg rounded-b-3xl">
        <h2 className="font-semibold mb-4 opacity-90">Balance general</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">{totalDeuda >= 0 ? 'Te deben' : 'Debes'}</p>
            <p className="text-3xl font-bold">{Math.abs(totalDeuda)} €</p>
            <div className="flex items-center mt-1 text-emerald-200 text-xs">
              <ArrowUp size={12} className="mr-1" />
              <span>Último movimiento: 15/05</span>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white bg-opacity-10 p-3 rounded-xl">
            <p className="text-3xl font-bold">{gastos.length}</p>
            <p className="text-xs opacity-80">Gastos</p>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <button 
        className="fixed bottom-20 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20 hover:shadow-xl"
        onClick={() => setShowAddModal(true)}
      >
        <Plus size={24} />
      </button>
      
      {/* Search Bar */}
      <div className="px-4 -mt-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar gasto o categoría..."
            className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-4 mb-3">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button 
            className={`py-2 px-4 font-medium rounded-lg flex items-center ${activeTab === 'gastos' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 bg-white'}`}
            onClick={() => setActiveTab('gastos')}
          >
            <Receipt size={16} className="mr-2" />
            Gastos
          </button>
          <button 
            className={`py-2 px-4 font-medium rounded-lg flex items-center ${activeTab === 'balances' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 bg-white'}`}
            onClick={() => setActiveTab('balances')}
          >
            <UserCheck size={16} className="mr-2" />
            Balances
          </button>
          <button 
            className={`py-2 px-4 font-medium rounded-lg flex items-center ${activeTab === 'contactos' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 bg-white'}`}
            onClick={() => setActiveTab('contactos')}
          >
            <Users size={16} className="mr-2" />
            Amigos
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-4 pb-20">
        {activeTab === 'gastos' && (
          <>
            <h3 className="font-medium text-gray-500 mb-3 ml-1 text-sm">Gastos recientes</h3>
            <div className="space-y-3">
              {filteredGastos.map(gasto => (
                <div key={gasto.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3 flex-shrink-0">
                      {gasto.categoria === 'Comida' ? '🍽️' : gasto.categoria === 'Ocio' ? '🎬' : '🛒'}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">{gasto.concepto}</h3>
                        <span className="font-bold text-indigo-600">{gasto.monto}€</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <CreditCard size={14} className="text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">Pagó: {gasto.pagadoPor}</p>
                      </div>
                      <div className="flex flex-wrap mt-2 gap-1">
                        {gasto.asignadoA.map((persona, idx) => (
                          <div key={idx} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-lg">
                            <span className="mr-1">{persona.avatar}</span>
                            <span>{persona.nombre}: {persona.monto}€</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock size={12} className="mr-1" />
                          <span>{gasto.fecha}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredGastos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <Receipt size={48} className="mb-3 text-indigo-300" />
                <p>No se encontraron gastos</p>
                <p className="text-sm mt-1">Añade uno nuevo usando el botón +</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'balances' && (
          <>
            <h3 className="font-medium text-gray-500 mb-3 ml-1 text-sm">Cuentas con amigos</h3>
            <div className="space-y-3">
              {balancesPersonas.map((persona, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3 flex-shrink-0">
                      {persona.avatar}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{persona.nombre}</h3>
                        <span className={`font-bold ${persona.balance > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {persona.balance > 0 ? `+${persona.balance}€` : `${persona.balance}€`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {persona.balance > 0 ? 'Te debe' : 'Le debes'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-gray-200">
                      <FileText size={14} className="mr-1" />
                      Detalles
                    </button>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-indigo-200">
                      <Share2 size={14} className="mr-1" />
                      Recordar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {balancesPersonas.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <UserCheck size={48} className="mb-3 text-indigo-300" />
                <p>No hay balances activos</p>
                <p className="text-sm mt-1">Añade un gasto compartido para comenzar</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'contactos' && (
          <>
            <h3 className="font-medium text-gray-500 mb-3 ml-1 text-sm">Mis amigos</h3>
            <div className="space-y-3">
              {contactos.map(contacto => (
                <div key={contacto.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3 flex-shrink-0">
                      {contacto.avatar}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{contacto.nombre}</h3>
                    </div>
                    <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="bg-gray-100 rounded-xl p-4 w-full flex items-center justify-center text-indigo-600 hover:bg-gray-200">
                <UserPlus size={18} className="mr-2" />
                <span>Añadir contacto</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-3 rounded-t-xl shadow-lg max-w-md mx-auto">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-indigo-600">
            <DollarSign size={22} />
            <span className="text-xs mt-1 font-medium">Deudas</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Calendar size={22} />
            <span className="text-xs mt-1">Calendario</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <PieChart size={22} />
            <span className="text-xs mt-1">Estadísticas</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default FinanzasApp;