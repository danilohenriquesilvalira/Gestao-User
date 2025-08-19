// Dashboard.tsx
import { useState, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import EclusasGrid from '@/components/dashboard/EclusasGrid';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Clock, Wifi, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <NotificationProvider>
      <DashboardContent />
      <NotificationContainer />
      <AssistenteVirtual />
    </NotificationProvider>
  );
}

function DashboardContent() {
  const { isConnected, error } = useWebSocket('ws://localhost:8080/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  // Timeline conectividade tempo real
  const vlanData = [
    { hora: '20:01', Crestuma: 99.8, Carrapatelo: 98.1, Regua: 78.2, Valeira: 99.9, Pocinho: 99.2 },
    { hora: '21:01', Crestuma: 99.5, Carrapatelo: 97.8, Regua: 82.1, Valeira: 99.7, Pocinho: 98.9 },
    { hora: '22:01', Crestuma: 99.9, Carrapatelo: 98.3, Regua: 85.4, Valeira: 99.8, Pocinho: 99.1 },
    { hora: '23:01', Crestuma: 99.7, Carrapatelo: 97.9, Regua: 79.8, Valeira: 99.6, Pocinho: 98.8 },
    { hora: '24:01', Crestuma: 99.8, Carrapatelo: 98.2, Regua: 83.5, Valeira: 99.9, Pocinho: 99.0 },
    { hora: '25:01', Crestuma: 99.6, Carrapatelo: 97.7, Regua: 81.2, Valeira: 99.7, Pocinho: 98.9 },
    { hora: '26:01', Crestuma: 99.9, Carrapatelo: 98.4, Regua: 84.8, Valeira: 99.8, Pocinho: 99.2 }
  ];

  // Alarmes e avisos
  const alarmes = [
    {
      id: 1,
      tipo: 'CRÍTICO',
      titulo: 'Falha no motor principal - RÉGUA',
      data: '26/06/2025 - 14:30',
      cor: 'bg-red-50 border-red-200 text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />
    },
    {
      id: 2,
      tipo: 'ATENÇÃO',
      titulo: 'Nível de água baixo - POCINHO',
      data: '26/06/2025 - 13:15',
      cor: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />
    },
    {
      id: 3,
      tipo: 'INFO',
      titulo: 'Manutenção programada concluída - RÉGUA',
      data: '25/06/2025 - 16:00',
      cor: 'bg-green-50 border-green-200 text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      id: 4,
      tipo: 'SISTEMA',
      titulo: 'Backup automático realizado com sucesso',
      data: '25/06/2025 - 02:00',
      cor: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">

          {/* Cards Eclusas */}
          <div className="mb-8">
            <EclusasGrid />
          </div>

          {/* Layout Principal 1+1 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Alarmes e Avisos */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Alarmes - Avisos</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {alarmes.map((alarme) => (
                  <div 
                    key={alarme.id}
                    className={`p-6 rounded-xl border-2 ${alarme.cor} transition-all duration-300 hover:shadow-lg cursor-pointer`}
                  >
                    <div className="flex items-start gap-4">
                      {alarme.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white bg-opacity-70">
                            {alarme.tipo}
                          </span>
                        </div>
                        <p className="font-semibold text-lg mb-1">{alarme.titulo}</p>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <Clock className="w-4 h-4" />
                          <span>{alarme.data}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conectividade VLAN */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Conectividade VLAN</h3>
                  <p className="text-gray-500 text-sm mt-1">Monitoramento em Tempo Real</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Online</span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={vlanData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hora" 
                    stroke="#64748b" 
                    fontSize={12}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    domain={[70, 100]} 
                    stroke="#64748b" 
                    fontSize={12}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="Crestuma" 
                    stroke="#60BBF8" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#60BBF8', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#60BBF8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Carrapatelo" 
                    stroke="#FF886C" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#FF886C', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#FF886C' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Regua" 
                    stroke="#EF4444" 
                    strokeWidth={5} 
                    dot={{ r: 8, fill: '#EF4444', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 10, fill: '#EF4444' }}
                    strokeDasharray="0"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Valeira" 
                    stroke="#10B981" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#10B981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Pocinho" 
                    stroke="#8B5CF6" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Legenda */}
              <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                {[
                  { nome: 'Crestuma', cor: '#60BBF8' },
                  { nome: 'Carrapatelo', cor: '#FF886C' },
                  { nome: 'Régua', cor: '#EF4444' },
                  { nome: 'Valeira', cor: '#10B981' },
                  { nome: 'Pocinho', cor: '#8B5CF6' }
                ].map((eclusa, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md" 
                      style={{ backgroundColor: eclusa.cor }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{eclusa.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}