// Dashboard.tsx - Mobile-First Delicado
import { useState, useRef, useEffect } from 'react';
import ModernSidebar from '@/components/layout/ModernSidebar';
import ModernHeader from '@/components/layout/ModernHeader';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationContainer from '@/components/ui/NotificationContainer';
import AssistenteVirtual from '@/components/dashboard/AssistenteVirtual';
import { AlertTriangle, XCircle, AlertCircle, User, Settings, Ship } from 'lucide-react';

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
  const { 
    isConnected, 
    motorValue, 
    motorDireitoValue, 
    motorEsquerdoValue,
    portaMontanteValue,
    portaMontanteMotorDireitoValue,
    portaMontanteMotorEsquerdoValue
  } = useWebSocket('ws://localhost:1337/ws');

  const handleLogout = () => {
    window.location.replace('/');
  };

  // Níveis do WebSocket
  const [niveis] = useState({
    caldeira: 14.2,
    jusante: 12.8,
    montante: 16.5
  });

  // Falhas ativas da eclusa por grupos
  const [falhasAtivas] = useState([
    // SALA DE COMANDO
    { id: 1, grupo: 'SALA_COMANDO', tipo: 'CRITICA', mensagem: 'Emergência activada', timestamp: '14:32', ativo: true },
    { id: 2, grupo: 'SALA_COMANDO', tipo: 'FALHA', mensagem: 'Sem alimentação 220VDC', timestamp: '14:28', ativo: true },
    { id: 3, grupo: 'SALA_COMANDO', tipo: 'AVISO', mensagem: 'Protecção 24V entradas analógicas disparou', timestamp: '14:15', ativo: true },
    
    // PORTA JUSANTE
    { id: 4, grupo: 'PORTA_JUSANTE', tipo: 'CRITICA', mensagem: 'Bomba comporta direita não responde', timestamp: '14:10', ativo: true },
    { id: 5, grupo: 'PORTA_JUSANTE', tipo: 'FALHA', mensagem: 'Sensor posição comporta direita avariado', timestamp: '13:58', ativo: true },
    { id: 6, grupo: 'PORTA_JUSANTE', tipo: 'AVISO', mensagem: 'Protecção bomba comporta direita disparou', timestamp: '13:45', ativo: false },
    
    // PORTA MONTANTE
    { id: 7, grupo: 'PORTA_MONTANTE', tipo: 'FALHA', mensagem: 'Variador motor direito avariado', timestamp: '13:30', ativo: true },
    { id: 8, grupo: 'PORTA_MONTANTE', tipo: 'AVISO', mensagem: 'Laser montante necessita limpeza', timestamp: '13:15', ativo: true },
    
    // ENCHIMENTO
    { id: 9, grupo: 'ENCHIMENTO', tipo: 'CRITICA', mensagem: 'Nível do poço muito alto', timestamp: '13:00', ativo: true },
    { id: 10, grupo: 'ENCHIMENTO', tipo: 'FALHA', mensagem: 'Arranques frequentes das bombas', timestamp: '12:45', ativo: false },
    
    // ESVAZIAMENTO  
    { id: 11, grupo: 'ESVAZIAMENTO', tipo: 'AVISO', mensagem: 'Sistema em manual há mais de 15 minutos', timestamp: '12:30', ativo: true }
  ]);

  // Filtros ativos
  const [filtroAtivo, setFiltroAtivo] = useState('TODOS');
  
  // Estado para indicadores de paginação do swiper
  const [cardAtivo, setCardAtivo] = useState(0);
  const totalCards = 5; // Total de cards no swiper
  const scrollRef = useRef<HTMLDivElement>(null);

  // Detectar qual card está visível no scroll horizontal
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild?.offsetWidth + 12; // largura do card + gap
      const activeIndex = Math.round(scrollLeft / cardWidth);
      setCardAtivo(Math.min(activeIndex, totalCards - 1));
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ModernSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ModernHeader title="Dashboard" onLogout={handleLogout} />
        
        <main className="flex-1 min-h-0 pb-16 md:pb-0 overflow-hidden">
          
          {/* LAYOUT TIPO APP MOBILE 2025 */}
          <div className="h-full flex flex-col p-1 xs:p-2 sm:p-3 md:p-4 gap-1 xs:gap-2">
            
            {/* CONTROLE OPERACIONAL - COMPACTO */}
            <div className="flex-shrink-0 bg-white rounded-lg xs:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* RETÂNGULO EMERALD EM CIMA */}
              <div className="h-1.5 xs:h-2 bg-emerald-500"></div>
              
              {/* CONTEÚDO DELICADO E COMPACTO */}
              <div className="p-2 xs:p-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm xs:text-base font-bold text-gray-900">Controle Operacional</h2>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className="text-xs text-emerald-600">{isConnected ? 'ON' : 'OFF'}</span>
                  </div>
                </div>
                
                {/* 3 INFORMAÇÕES ESSENCIAIS */}
                <div className="grid grid-cols-3 gap-2 xs:gap-3">
                  
                  {/* OPERADOR */}
                  <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg p-1.5 xs:p-2 border border-blue-100">
                    <User className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-blue-600 opacity-80">Operador</div>
                      <div className="text-xs font-bold text-blue-700 truncate">danilo</div>
                    </div>
                  </div>

                  {/* MODO */}
                  <div className="flex items-center gap-1.5 bg-green-50 rounded-lg p-1.5 xs:p-2 border border-green-100">
                    <Settings className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-green-600 opacity-80">Modo</div>
                      <div className="text-xs font-bold text-green-700">TELECOM</div>
                    </div>
                  </div>

                  {/* BARCOS */}
                  <div className="flex items-center gap-1.5 bg-cyan-50 rounded-lg p-1.5 xs:p-2 border border-cyan-100">
                    <Ship className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-cyan-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-cyan-600 opacity-80">Hoje</div>
                      <div className="text-xs font-bold text-cyan-700">47</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SWIPER DE CARDS HORIZONTAL COM INDICADORES */}
            <div className="flex-shrink-0">
              <div 
                ref={scrollRef}
                className="flex gap-2 xs:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
              >
                
                {/* CARD NÍVEIS - ESTILO PADRONIZADO */}
                <div className="flex-shrink-0 w-40 xs:w-48 sm:w-56 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden snap-start">
                  <div className="h-1.5 xs:h-2 bg-blue-500"></div>
                  <div className="p-2 xs:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs xs:text-sm font-bold text-gray-900">Níveis de Água</h3>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-1.5 xs:space-y-2">
                      {Object.entries(niveis).map(([nome, valor]) => (
                        <div key={nome} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 capitalize">{nome}</span>
                          <div className="flex items-center gap-1 xs:gap-1.5">
                            <div className="w-8 xs:w-10 h-1 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  nome === 'caldeira' ? 'bg-indigo-500' :
                                  nome === 'jusante' ? 'bg-blue-500' : 'bg-cyan-500'
                                }`}
                                style={{ width: `${(valor / 20) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-gray-800 min-w-fit">{valor}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CARD PORTAS - ESTILO PADRONIZADO */}
                <div className="flex-shrink-0 w-40 xs:w-48 sm:w-56 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden snap-start">
                  <div className="h-1.5 xs:h-2 bg-green-500"></div>
                  <div className="p-2 xs:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs xs:text-sm font-bold text-gray-900">Status Portas</h3>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Jusante</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-orange-600">{motorValue || 0}%</span>
                          <div className="flex gap-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${motorDireitoValue ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-1.5 h-1.5 rounded-full ${motorEsquerdoValue ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Montante</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-purple-600">{portaMontanteValue || 0}%</span>
                          <div className="flex gap-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${portaMontanteMotorDireitoValue ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-1.5 h-1.5 rounded-full ${portaMontanteMotorEsquerdoValue ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD SISTEMA - ESTILO PADRONIZADO */}
                <div className="flex-shrink-0 w-40 xs:w-48 sm:w-56 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden snap-start">
                  <div className="h-1.5 xs:h-2 bg-indigo-500"></div>
                  <div className="p-2 xs:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs xs:text-sm font-bold text-gray-900">Sistema</h3>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Uptime</span>
                        <span className="text-xs font-bold text-green-600">99.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">CPU</span>
                        <span className="text-xs font-bold text-blue-600">42°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Memória</span>
                        <span className="text-xs font-bold text-indigo-600">68%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD COMUNICAÇÃO - NOVO */}
                <div className="flex-shrink-0 w-40 xs:w-48 sm:w-56 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden snap-start">
                  <div className="h-1.5 xs:h-2 bg-purple-500"></div>
                  <div className="p-2 xs:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs xs:text-sm font-bold text-gray-900">Comunicação</h3>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">WebSocket</span>
                        <span className="text-xs font-bold text-green-600">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">PLC</span>
                        <span className="text-xs font-bold text-green-600">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Ping</span>
                        <span className="text-xs font-bold text-blue-600">12ms</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD ENERGIA - NOVO */}
                <div className="flex-shrink-0 w-40 xs:w-48 sm:w-56 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden snap-start">
                  <div className="h-1.5 xs:h-2 bg-yellow-500"></div>
                  <div className="p-2 xs:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs xs:text-sm font-bold text-gray-900">Energia</h3>
                      <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-500"></div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">400V</span>
                        <span className="text-xs font-bold text-green-600">OK</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">24VDC</span>
                        <span className="text-xs font-bold text-green-600">23.8V</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">220VDC</span>
                        <span className="text-xs font-bold text-green-600">218V</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* INDICADORES DE PAGINAÇÃO (BOLINHAS) */}
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: totalCards }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-all duration-300 ${
                      index === cardAtivo ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* FALHAS ATIVAS - ESTILO STATUS ECLUSA */}
            <div className="flex-1 min-h-0 bg-white rounded-lg xs:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* RETÂNGULO VERMELHO EM CIMA */}
              <div className="h-1.5 xs:h-2 bg-red-500"></div>
              
              {/* HEADER COM FILTROS */}
              <div className="flex-shrink-0 p-2 xs:p-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 xs:w-5 xs:h-5 text-red-500" />
                    <h3 className="text-sm xs:text-base font-bold text-gray-900">Falhas Ativas</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs text-red-600 font-medium">
                      {falhasAtivas.filter(f => f.ativo).length} Ativas
                    </span>
                  </div>
                </div>
                
                {/* CHIPS DE FILTRO POR GRUPO */}
                <div className="flex gap-1 xs:gap-2 overflow-x-auto scrollbar-hide">
                  <button 
                    onClick={() => setFiltroAtivo('TODOS')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'TODOS' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('SALA_COMANDO')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'SALA_COMANDO' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white'
                    }`}
                  >
                    Sala Cmd
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('PORTA_JUSANTE')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'PORTA_JUSANTE' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    P.Jusante
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('PORTA_MONTANTE')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'PORTA_MONTANTE' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white'
                    }`}
                  >
                    P.Montante
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('ENCHIMENTO')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'ENCHIMENTO' ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-cyan-500 hover:text-white'
                    }`}
                  >
                    Enchimento
                  </button>
                  <button 
                    onClick={() => setFiltroAtivo('ESVAZIAMENTO')}
                    className={`flex-shrink-0 px-2 xs:px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filtroAtivo === 'ESVAZIAMENTO' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white'
                    }`}
                  >
                    Esvaziamento
                  </button>
                </div>
              </div>

              {/* LISTA DE FALHAS - SCROLLBAR FORÇADA */}
              <div 
                className="flex-1 min-h-0 p-2 xs:p-3"
                style={{
                  overflowY: 'scroll',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#ef4444 #f1f5f9'
                }}
              >
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .falhas-scroll::-webkit-scrollbar {
                      width: 8px;
                    }
                    .falhas-scroll::-webkit-scrollbar-track {
                      background: #f1f5f9;
                      border-radius: 4px;
                    }
                    .falhas-scroll::-webkit-scrollbar-thumb {
                      background: #ef4444;
                      border-radius: 4px;
                    }
                    .falhas-scroll::-webkit-scrollbar-thumb:hover {
                      background: #dc2626;
                    }
                  `
                }} />
                <div className="falhas-scroll space-y-1.5 xs:space-y-2" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  
                  {falhasAtivas
                    .filter(falha => falha.ativo && (filtroAtivo === 'TODOS' || falha.grupo === filtroAtivo))
                    .map((falha) => (
                    <div key={falha.id} className="flex items-start gap-2 p-2 xs:p-2.5 rounded-lg bg-gray-50 border-l-2 border-red-400 hover:bg-gray-100 transition-colors">
                      
                      {/* ÍCONES LUCIDE MODERNOS */}
                      <div className="flex-shrink-0 mt-0.5">
                        {falha.tipo === 'CRITICA' ? (
                          <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-red-600" />
                        ) : falha.tipo === 'FALHA' ? (
                          <AlertTriangle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-orange-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-yellow-500" />
                        )}
                      </div>
                      
                      {/* CONTEÚDO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${
                            falha.tipo === 'CRITICA' ? 'bg-red-600' :
                            falha.tipo === 'FALHA' ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}>
                            {falha.tipo}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            falha.grupo === 'SALA_COMANDO' ? 'bg-purple-100 text-purple-700' :
                            falha.grupo === 'PORTA_JUSANTE' ? 'bg-orange-100 text-orange-700' :
                            falha.grupo === 'PORTA_MONTANTE' ? 'bg-indigo-100 text-indigo-700' :
                            falha.grupo === 'ENCHIMENTO' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-teal-100 text-teal-700'
                          }`}>
                            {falha.grupo.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{falha.timestamp}</span>
                        </div>
                        <p className="text-xs xs:text-sm text-gray-700 font-medium leading-tight">
                          {falha.mensagem}
                        </p>
                      </div>
                      
                    </div>
                  ))}
                  
                  {/* ESTADO VAZIO */}
                  {falhasAtivas.filter(f => f.ativo && (filtroAtivo === 'TODOS' || f.grupo === filtroAtivo)).length === 0 && (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold text-green-600 mb-1">
                        {filtroAtivo === 'TODOS' ? 'Sistema OK!' : `${filtroAtivo.replace('_', ' ')} OK!`}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {filtroAtivo === 'TODOS' ? 'Nenhuma falha ativa no sistema' : `Nenhuma falha em ${filtroAtivo.replace('_', ' ')}`}
                      </p>
                    </div>
                  )}
                  
                </div>
              </div>

            </div>
            
          </div>

        </main>
      </div>
    </div>
  );
}