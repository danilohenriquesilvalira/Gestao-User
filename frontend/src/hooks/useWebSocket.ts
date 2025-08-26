import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketReturn {
  // ✅ NOVOS NÍVEIS DA ECLUSA
  nivelCaldeiraValue: number | null;
  nivelMontanteValue: number | null;
  nivelJusanteValue: number | null;
  
  // ✅ RADARES DA ECLUSA
  radarCaldeiraDistanciaValue: number | null;
  radarCaldeiraVelocidadeValue: number | null;
  radarMontanteDistanciaValue: number | null;
  radarMontanteVelocidadeValue: number | null;
  radarJusanteDistanciaValue: number | null;
  radarJusanteVelocidadeValue: number | null;
  
  // ✅ PORTAS DA ECLUSA
  eclusaPortaJusanteValue: number | null;
  eclusaPortaMontanteValue: number | null;
  
  // ✅ LASERS DA ECLUSA
  laserMontanteValue: number | null;
  laserJusanteValue: number | null;
  
  // ✅ STATUS DA ECLUSA
  comunicacaoPLCValue: boolean | null;
  operacaoValue: boolean | null;
  alarmesAtivoValue: boolean | null;
  emergenciaAtivaValue: boolean | null;
  inundacaoValue: boolean | null;
  
  // Valores legados (mantidos para compatibilidade)
  nivelValue: number | null;
  motorValue: number | null;
  contrapesoDirectoValue: number | null;
  contrapesoEsquerdoValue: number | null;
  motorDireitoValue: number | null;
  motorEsquerdoValue: number | null;
  
  // Novos valores para Porta Montante
  portaMontanteValue: number | null;
  portaMontanteContrapesoDirectoValue: number | null;
  portaMontanteContrapesoEsquerdoValue: number | null;
  portaMontanteMotorDireitoValue: number | null;
  portaMontanteMotorEsquerdoValue: number | null;
  
  // Novo valor para Radar
  radarDistanciaValue: number | null;
  
  // Valores das Cotas
  cotaMontanteValue: number | null;
  cotaCaldeiraValue: number | null;
  cotaJusanteValue: number | null;
  
  semaforos: Record<string, boolean>;
  
  // ✅ Array PipeSystem [0..23]
  pipeSystem: boolean[];
  
  // ✅ Array ValvulasOnOFF [0..5]
  valvulasOnOff: number[];
  
  // ✅ NOVO: Estado indicando se dados iniciais estão prontos
  isDataReady: boolean;
  
  isConnected: boolean;
  error: string | null;
  lastMessage: string | null;
}

// ✅ WEBSOCKET SINGLETON GLOBAL - Evita múltiplas conexões
let globalWebSocket: WebSocket | null = null;
let globalListeners: Set<(data: any) => void> = new Set();
let reconnectTimeout: NodeJS.Timeout | null = null;
let isConnecting = false;
let reconnectAttempts = 0;

// ✅ CACHE GLOBAL DOS ÚLTIMOS DADOS RECEBIDOS
let lastReceivedData: any = null;

// ✅ ESTADO GLOBAL PARA INDICAR SE DADOS INICIAIS ESTÃO PRONTOS
let isInitialDataReceived = false;
let connectionTimeout: NodeJS.Timeout | null = null;

function connectGlobalWebSocket(url: string) {
  if (globalWebSocket?.readyState === WebSocket.OPEN || isConnecting) {
    console.log('🔄 WebSocket já conectado, reutilizando...');
    return;
  }

  if (globalWebSocket) {
    globalWebSocket.close();
    globalWebSocket = null;
  }

  isConnecting = true;
  console.log(`🔌 Conectando WebSocket GLOBAL: ${url}`);

  try {
    globalWebSocket = new WebSocket(url);

    globalWebSocket.onopen = () => {
      console.log('✅ WebSocket GLOBAL conectado');
      isConnecting = false;
      reconnectAttempts = 0;
      notifyGlobalListeners({ type: 'connected', connected: true });
      
      // ✅ TIMEOUT DE 2 SEGUNDOS PARA MARCAR COMO PRONTO MESMO SEM DADOS
      connectionTimeout = setTimeout(() => {
        if (!isInitialDataReceived) {
          console.log('⚡ Timeout: marcando dados como prontos após 2s de conexão');
          isInitialDataReceived = true;
          notifyGlobalListeners({ type: 'data_ready', ready: true });
        }
      }, 2000);
      
      // ✅ ENVIA DADOS EM CACHE PARA NOVOS LISTENERS (se existirem)
      if (lastReceivedData) {
        console.log('📤 Enviando dados em cache para novos listeners');
        notifyGlobalListeners({ type: 'data', ...lastReceivedData });
      }
    };

    globalWebSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // ✅ SALVA DADOS NO CACHE GLOBAL E MARCA COMO PRONTO
        if (!data.ping) {
          lastReceivedData = data;
          if (!isInitialDataReceived) {
            isInitialDataReceived = true;
            console.log('💾 Dados salvos no cache e marcados como prontos:', data);
            if (connectionTimeout) {
              clearTimeout(connectionTimeout);
              connectionTimeout = null;
            }
            notifyGlobalListeners({ type: 'data_ready', ready: true });
          }
        }
        
        notifyGlobalListeners({ type: 'data', ...data });
      } catch (err) {
        console.error('❌ Erro ao processar mensagem:', err);
      }
    };

    globalWebSocket.onclose = (event) => {
      console.log(`🔒 WebSocket fechado: código ${event.code}, razão: ${event.reason}`);
      isConnecting = false;
      notifyGlobalListeners({ type: 'disconnected', connected: false });
      
      // Só reconecta se ainda houver listeners E não foi fechamento intencional
      if (globalListeners.size > 0 && event.code !== 1000) {
        const delay = Math.min(2000 * Math.pow(1.5, reconnectAttempts), 10000);
        reconnectAttempts++;
        console.log(`🔄 Reconectando em ${delay}ms (tentativa ${reconnectAttempts})`);
        
        reconnectTimeout = setTimeout(() => {
          connectGlobalWebSocket(url);
        }, delay);
      }
    };

    globalWebSocket.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
      isConnecting = false;
      notifyGlobalListeners({ type: 'error', error: 'WebSocket desconectado' });
    };

  } catch (err) {
    isConnecting = false;
    console.error('❌ Erro ao criar WebSocket:', err);
    notifyGlobalListeners({ type: 'error', error: 'Erro ao conectar WebSocket' });
  }
}

function notifyGlobalListeners(data: any) {
  globalListeners.forEach(listener => {
    try {
      listener(data);
    } catch (err) {
      console.error('❌ Erro no listener:', err);
    }
  });
}

function addGlobalListener(callback: (data: any) => void) {
  globalListeners.add(callback);
  console.log(`👂 Listener adicionado. Total: ${globalListeners.size}`);
  
  // ✅ ENVIA DADOS EM CACHE IMEDIATAMENTE PARA NOVOS LISTENERS (SE DISPONÍVEL)
  if (lastReceivedData && isInitialDataReceived) {
    console.log('📤 Enviando dados em cache para novo listener');
    setTimeout(() => {
      callback({ type: 'data', ...lastReceivedData });
      callback({ type: 'data_ready', ready: true });
    }, 100); // Pequeno delay para garantir que o component está montado
  } else {
    console.log('📡 Novo listener aguardando dados iniciais do PLC...');
    setTimeout(() => {
      callback({ type: 'data_ready', ready: false });
    }, 100);
  }
}

function removeGlobalListener(callback: (data: any) => void) {
  globalListeners.delete(callback);
  console.log(`❌ Listener removido. Total: ${globalListeners.size}`);
  
  // Se não há mais listeners, fecha conexão após delay
  if (globalListeners.size === 0) {
    setTimeout(() => {
      if (globalListeners.size === 0) {
        console.log('🔌 Fechando WebSocket - sem listeners');
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        if (globalWebSocket) {
          globalWebSocket.close(1000, 'No more listeners');
          globalWebSocket = null;
        }
        // ✅ MANTÉM CACHE MESMO APÓS DESCONEXÃO
        // lastReceivedData permanece para próximas conexões
      }
    }, 1000);
  }
}

export function useWebSocket(url: string): UseWebSocketReturn {
  // ✅ ESTADOS INICIALIZADOS COM NULL - SÓ RENDERIZAM APÓS DADOS REAIS
  const [nivelCaldeiraValue, setNivelCaldeiraValue] = useState<number | null>(null);
  const [nivelMontanteValue, setNivelMontanteValue] = useState<number | null>(null);
  const [nivelJusanteValue, setNivelJusanteValue] = useState<number | null>(null);
  
  // ✅ RADARES INICIALIZADOS COM NULL
  const [radarCaldeiraDistanciaValue, setRadarCaldeiraDistanciaValue] = useState<number | null>(null);
  const [radarCaldeiraVelocidadeValue, setRadarCaldeiraVelocidadeValue] = useState<number | null>(null);
  const [radarMontanteDistanciaValue, setRadarMontanteDistanciaValue] = useState<number | null>(null);
  const [radarMontanteVelocidadeValue, setRadarMontanteVelocidadeValue] = useState<number | null>(null);
  const [radarJusanteDistanciaValue, setRadarJusanteDistanciaValue] = useState<number | null>(null);
  const [radarJusanteVelocidadeValue, setRadarJusanteVelocidadeValue] = useState<number | null>(null);
  
  // ✅ PORTAS INICIALIZADAS COM NULL
  const [eclusaPortaJusanteValue, setEclusaPortaJusanteValue] = useState<number | null>(null);
  const [eclusaPortaMontanteValue, setEclusaPortaMontanteValue] = useState<number | null>(null);
  
  // ✅ LASERS INICIALIZADOS COM NULL
  const [laserMontanteValue, setLaserMontanteValue] = useState<number | null>(null);
  const [laserJusanteValue, setLaserJusanteValue] = useState<number | null>(null);
  
  // ✅ STATUS DA ECLUSA INICIALIZADOS COM NULL
  const [comunicacaoPLCValue, setComunicacaoPLCValue] = useState<boolean | null>(null);
  const [operacaoValue, setOperacaoValue] = useState<boolean | null>(null);
  const [alarmesAtivoValue, setAlarmesAtivoValue] = useState<boolean | null>(null);
  const [emergenciaAtivaValue, setEmergenciaAtivaValue] = useState<boolean | null>(null);
  const [inundacaoValue, setInundacaoValue] = useState<boolean | null>(null);
  
  // ✅ Estados legados inicializados com NULL
  const [nivelValue, setNivelValue] = useState<number | null>(null);
  const [motorValue, setMotorValue] = useState<number | null>(null);
  const [contrapesoDirectoValue, setContrapesoDirectoValue] = useState<number | null>(null);
  const [contrapesoEsquerdoValue, setContrapesoEsquerdoValue] = useState<number | null>(null);
  const [motorDireitoValue, setMotorDireitoValue] = useState<number | null>(null);
  const [motorEsquerdoValue, setMotorEsquerdoValue] = useState<number | null>(null);
  
  // ✅ Estados para Porta Montante inicializados com NULL
  const [portaMontanteValue, setPortaMontanteValue] = useState<number | null>(null);
  const [portaMontanteContrapesoDirectoValue, setPortaMontanteContrapesoDirectoValue] = useState<number | null>(null);
  const [portaMontanteContrapesoEsquerdoValue, setPortaMontanteContrapesoEsquerdoValue] = useState<number | null>(null);
  const [portaMontanteMotorDireitoValue, setPortaMontanteMotorDireitoValue] = useState<number | null>(null);
  const [portaMontanteMotorEsquerdoValue, setPortaMontanteMotorEsquerdoValue] = useState<number | null>(null);
  const [radarDistanciaValue, setRadarDistanciaValue] = useState<number | null>(null);
  const [cotaMontanteValue, setCotaMontanteValue] = useState<number | null>(null);
  const [cotaCaldeiraValue, setCotaCaldeiraValue] = useState<number | null>(null);
  const [cotaJusanteValue, setCotaJusanteValue] = useState<number | null>(null);
  
  const [semaforos, setSemaforos] = useState<Record<string, boolean>>({});
  
  // ✅ Array PipeSystem [0..23] - inicializado com 24 elementos false
  const [pipeSystem, setPipeSystem] = useState<boolean[]>(new Array(24).fill(false));
  
  // ✅ Array ValvulasOnOFF [0..5] - inicializado com 6 elementos 0
  const [valvulasOnOff, setValvulasOnOff] = useState<number[]>(new Array(6).fill(0));
  
  // ✅ NOVO: Estado indicando se dados iniciais estão prontos
  const [isDataReady, setIsDataReady] = useState(false);
  
  const [isConnected, setIsConnected] = useState(true); // Inicia como conectado
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  
  const handlerRef = useRef<(data: any) => void | null>(null);

  const handleMessage = useCallback((data: any) => {
    console.log('📨 Mensagem recebida no hook:', data.type, data);
    
    if (data.type === 'connected') {
      setIsConnected(true);
      setError(null);
      console.log('🟢 Hook: WebSocket conectado');
    } else if (data.type === 'disconnected') {
      setIsConnected(false);
      console.log('🔴 Hook: WebSocket desconectado');
    } else if (data.type === 'error') {
      setError(data.error);
      setIsConnected(false);
      console.log('❌ Hook: Erro WebSocket');
    } else if (data.type === 'data_ready') {
      setIsDataReady(data.ready);
      console.log(`📊 Hook: Dados ${data.ready ? 'prontos' : 'não prontos'}`);
    } else if (data.type === 'data') {
      // Filtra ping messages
      if (data.ping) return;
      
      console.log('📊 Processando dados do PLC no hook:', data);
      
      // ✅ MARCA DADOS COMO PRONTOS NA PRIMEIRA RECEPÇÃO VÁLIDA
      if (!isDataReady) {
        setIsDataReady(true);
        console.log('✅ Primeira recepção de dados - marcando como prontos');
      }
      
      // ✅ PROCESSA NOVOS NÍVEIS DA ECLUSA
      if (data.nivelCaldeiraValue !== undefined) {
        const limitedNivel = Math.max(0, Math.min(100, data.nivelCaldeiraValue));
        console.log(`💧 Atualizando nível caldeira: ${data.nivelCaldeiraValue} -> ${limitedNivel}`);
        setNivelCaldeiraValue(limitedNivel);
      }
      
      if (data.nivelMontanteValue !== undefined) {
        const limitedNivel = Math.max(0, Math.min(100, data.nivelMontanteValue));
        console.log(`💧 Atualizando nível montante: ${data.nivelMontanteValue} -> ${limitedNivel}`);
        setNivelMontanteValue(limitedNivel);
      }
      
      if (data.nivelJusanteValue !== undefined) {
        const limitedNivel = Math.max(0, Math.min(100, data.nivelJusanteValue));
        console.log(`💧 Atualizando nível jusante: ${data.nivelJusanteValue} -> ${limitedNivel}`);
        setNivelJusanteValue(limitedNivel);
      }
      
      // ✅ PROCESSA RADARES DA ECLUSA
      if (data.radarCaldeiraDistanciaValue !== undefined) {
        console.log(`📡 Atualizando radar caldeira distância: ${data.radarCaldeiraDistanciaValue}`);
        setRadarCaldeiraDistanciaValue(data.radarCaldeiraDistanciaValue);
      }
      
      if (data.radarCaldeiraVelocidadeValue !== undefined) {
        console.log(`📡 Atualizando radar caldeira velocidade: ${data.radarCaldeiraVelocidadeValue}`);
        setRadarCaldeiraVelocidadeValue(data.radarCaldeiraVelocidadeValue);
      }
      
      if (data.radarMontanteDistanciaValue !== undefined) {
        console.log(`📡 Atualizando radar montante distância: ${data.radarMontanteDistanciaValue}`);
        setRadarMontanteDistanciaValue(data.radarMontanteDistanciaValue);
      }
      
      if (data.radarMontanteVelocidadeValue !== undefined) {
        console.log(`📡 Atualizando radar montante velocidade: ${data.radarMontanteVelocidadeValue}`);
        setRadarMontanteVelocidadeValue(data.radarMontanteVelocidadeValue);
      }
      
      if (data.radarJusanteDistanciaValue !== undefined) {
        console.log(`📡 Atualizando radar jusante distância: ${data.radarJusanteDistanciaValue}`);
        setRadarJusanteDistanciaValue(data.radarJusanteDistanciaValue);
      }
      
      if (data.radarJusanteVelocidadeValue !== undefined) {
        console.log(`📡 Atualizando radar jusante velocidade: ${data.radarJusanteVelocidadeValue}`);
        setRadarJusanteVelocidadeValue(data.radarJusanteVelocidadeValue);
      }
      
      // ✅ PROCESSA PORTAS DA ECLUSA
      if (data.eclusaPortaJusanteValue !== undefined) {
        const limitedPorta = Math.max(0, Math.min(100, data.eclusaPortaJusanteValue));
        console.log(`🚪 Atualizando eclusa porta jusante: ${data.eclusaPortaJusanteValue} -> ${limitedPorta}`);
        setEclusaPortaJusanteValue(limitedPorta);
      }
      
      if (data.eclusaPortaMontanteValue !== undefined) {
        const limitedPorta = Math.max(0, Math.min(100, data.eclusaPortaMontanteValue));
        console.log(`🚪 Atualizando eclusa porta montante: ${data.eclusaPortaMontanteValue} -> ${limitedPorta}`);
        setEclusaPortaMontanteValue(limitedPorta);
      }
      
      // ✅ PROCESSA LASERS DA ECLUSA
      if (data.laserMontanteValue !== undefined) {
        console.log(`🔬 Atualizando laser montante: ${data.laserMontanteValue}`);
        setLaserMontanteValue(data.laserMontanteValue);
      }
      
      if (data.laserJusanteValue !== undefined) {
        console.log(`🔬 Atualizando laser jusante: ${data.laserJusanteValue}`);
        setLaserJusanteValue(data.laserJusanteValue);
      }
      
      // ✅ PROCESSA STATUS DA ECLUSA
      if (data.comunicacaoPLCValue !== undefined) {
        console.log(`📡 Atualizando comunicação PLC: ${data.comunicacaoPLCValue}`);
        setComunicacaoPLCValue(data.comunicacaoPLCValue);
      }
      
      if (data.operacaoValue !== undefined) {
        console.log(`⚙️ Atualizando operação: ${data.operacaoValue}`);
        setOperacaoValue(data.operacaoValue);
      }
      
      if (data.alarmesAtivoValue !== undefined) {
        console.log(`🚨 Atualizando alarmes ativo: ${data.alarmesAtivoValue}`);
        setAlarmesAtivoValue(data.alarmesAtivoValue);
      }
      
      if (data.emergenciaAtivaValue !== undefined) {
        console.log(`🆘 Atualizando emergência ativa: ${data.emergenciaAtivaValue}`);
        setEmergenciaAtivaValue(data.emergenciaAtivaValue);
      }
      
      if (data.inundacaoValue !== undefined) {
        console.log(`🌊 Atualizando inundação: ${data.inundacaoValue}`);
        setInundacaoValue(data.inundacaoValue);
      }
      
      // Processa dados legados do PLC com validação de ranges
      if (data.nivelValue !== undefined) {
        const limitedNivel = Math.max(0, Math.min(100, data.nivelValue));
        console.log(`💧 Atualizando nível legado: ${data.nivelValue} -> ${limitedNivel}`);
        setNivelValue(limitedNivel);
      }
      
      if (data.motorValue !== undefined) {
        const limitedMotor = Math.max(0, Math.min(100, data.motorValue));
        console.log(`⚙️ Atualizando motor: ${data.motorValue} -> ${limitedMotor}`);
        setMotorValue(limitedMotor);
      }
      
      if (data.contrapesoDirectoValue !== undefined) {
        const limitedContrapeso = Math.max(0, Math.min(100, data.contrapesoDirectoValue));
        console.log(`⚖️ Atualizando contrapeso direito: ${data.contrapesoDirectoValue} -> ${limitedContrapeso}`);
        setContrapesoDirectoValue(limitedContrapeso);
      }
      
      if (data.contrapesoEsquerdoValue !== undefined) {
        const limitedContrapeso = Math.max(0, Math.min(100, data.contrapesoEsquerdoValue));
        console.log(`⚖️ Atualizando contrapeso esquerdo: ${data.contrapesoEsquerdoValue} -> ${limitedContrapeso}`);
        setContrapesoEsquerdoValue(limitedContrapeso);
      }
      
      if (data.motorDireitoValue !== undefined) {
        const limitedMotor = Math.max(0, Math.min(2, data.motorDireitoValue));
        console.log(`🔧 Atualizando motor direito: ${data.motorDireitoValue} -> ${limitedMotor}`);
        setMotorDireitoValue(limitedMotor);
      }
      
      if (data.motorEsquerdoValue !== undefined) {
        const limitedMotor = Math.max(0, Math.min(2, data.motorEsquerdoValue));
        console.log(`🔧 Atualizando motor esquerdo: ${data.motorEsquerdoValue} -> ${limitedMotor}`);
        setMotorEsquerdoValue(limitedMotor);
      }

      // ✅ PROCESSA VALORES DA PORTA MONTANTE
      if (data.portaMontanteValue !== undefined) {
        const limitedPorta = Math.max(0, Math.min(100, data.portaMontanteValue));
        console.log(`🚪 Atualizando porta montante: ${data.portaMontanteValue} -> ${limitedPorta}`);
        setPortaMontanteValue(limitedPorta);
      }

      if (data.portaMontanteContrapesoDirectoValue !== undefined) {
        const limitedContrapeso = Math.max(0, Math.min(100, data.portaMontanteContrapesoDirectoValue));
        console.log(`⚖️ Atualizando contrapeso direito montante: ${data.portaMontanteContrapesoDirectoValue} -> ${limitedContrapeso}`);
        setPortaMontanteContrapesoDirectoValue(limitedContrapeso);
      }

      if (data.portaMontanteContrapesoEsquerdoValue !== undefined) {
        const limitedContrapeso = Math.max(0, Math.min(100, data.portaMontanteContrapesoEsquerdoValue));
        console.log(`⚖️ Atualizando contrapeso esquerdo montante: ${data.portaMontanteContrapesoEsquerdoValue} -> ${limitedContrapeso}`);
        setPortaMontanteContrapesoEsquerdoValue(limitedContrapeso);
      }

      if (data.portaMontanteMotorDireitoValue !== undefined) {
        const limitedMotor = Math.max(0, Math.min(2, data.portaMontanteMotorDireitoValue));
        console.log(`🔧 Atualizando motor direito montante: ${data.portaMontanteMotorDireitoValue} -> ${limitedMotor}`);
        setPortaMontanteMotorDireitoValue(limitedMotor);
      }

      if (data.portaMontanteMotorEsquerdoValue !== undefined) {
        const limitedMotor = Math.max(0, Math.min(2, data.portaMontanteMotorEsquerdoValue));
        console.log(`🔧 Atualizando motor esquerdo montante: ${data.portaMontanteMotorEsquerdoValue} -> ${limitedMotor}`);
        setPortaMontanteMotorEsquerdoValue(limitedMotor);
      }

      // ✅ PROCESSA VALOR DO RADAR
      if (data.radarDistanciaValue !== undefined) {
        const limitedRadar = Math.max(0, Math.min(100, data.radarDistanciaValue));
        console.log(`📡 Atualizando radar distância: ${data.radarDistanciaValue} -> ${limitedRadar}`);
        setRadarDistanciaValue(limitedRadar);
      }

      // ✅ PROCESSA VALORES DAS COTAS
      if (data.cotaMontanteValue !== undefined) {
        const limitedCota = Math.max(0, Math.min(25, data.cotaMontanteValue));
        console.log(`⬆️ Atualizando cota montante: ${data.cotaMontanteValue} -> ${limitedCota}`);
        setCotaMontanteValue(limitedCota);
      }

      if (data.cotaCaldeiraValue !== undefined) {
        const limitedCota = Math.max(0, Math.min(25, data.cotaCaldeiraValue));
        console.log(`🔄 Atualizando cota caldeira: ${data.cotaCaldeiraValue} -> ${limitedCota}`);
        setCotaCaldeiraValue(limitedCota);
      }

      if (data.cotaJusanteValue !== undefined) {
        const limitedCota = Math.max(0, Math.min(25, data.cotaJusanteValue));
        console.log(`⬇️ Atualizando cota jusante: ${data.cotaJusanteValue} -> ${limitedCota}`);
        setCotaJusanteValue(limitedCota);
      }
      
      // ✅ NOVO: PROCESSA ARRAY PIPESYSTEM [0..23]
      const newPipeSystem = new Array(24).fill(false);
      let hasPipeSystemData = false;
      
      for (let i = 0; i < 24; i++) {
        const key = `pipe_system_${i}`;
        if (data[key] !== undefined) {
          newPipeSystem[i] = Boolean(data[key]);
          hasPipeSystemData = true;
        }
      }
      
      if (hasPipeSystemData) {
        console.log('🔧 Atualizando PipeSystem array:', newPipeSystem);
        setPipeSystem(newPipeSystem);
      }
      
      // ✅ PROCESSA ARRAY VALVULASONOFF [0..5]
      const newValvulasOnOff = new Array(6).fill(0);
      let hasValvulasData = false;
      
      for (let i = 0; i < 6; i++) {
        const key = `valvulas_onoff_${i}`;
        if (data[key] !== undefined) {
          newValvulasOnOff[i] = Number(data[key]);
          hasValvulasData = true;
        }
      }
      
      if (hasValvulasData) {
        console.log('⚡ Atualizando ValvulasOnOff array:', newValvulasOnOff);
        setValvulasOnOff(newValvulasOnOff);
      }
      
      // ✅ PROCESSA SEMÁFOROS COM LOG DETALHADO
      if (data.semaforos) {
        console.log('🚦 Processando semáforos:', data.semaforos);
        setSemaforos(prevSemaforos => {
          const hasChanges = Object.keys(data.semaforos).some(
            key => prevSemaforos[key] !== data.semaforos[key]
          );
          
          if (hasChanges) {
            console.log('🚦 SEMÁFOROS ATUALIZADOS NO HOOK:', data.semaforos);
            return { ...prevSemaforos, ...data.semaforos };
          }
          return prevSemaforos;
        });
      }
      
      setLastMessage(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    console.log('🎯 useWebSocket montado');
    handlerRef.current = handleMessage;
    addGlobalListener(handleMessage);
    connectGlobalWebSocket(url);

    return () => {
      console.log('🔥 useWebSocket desmontado');
      if (handlerRef.current) {
        removeGlobalListener(handlerRef.current);
      }
    };
  }, [url, handleMessage]);

  // ✅ DEBUG: Log dos valores atuais
  useEffect(() => {
    console.log('🎯 Estado atual do hook:', {
      isConnected,
      nivelValue,
      motorValue,
      contrapesoDirectoValue,
      contrapesoEsquerdoValue,
      motorDireitoValue,
      motorEsquerdoValue,
      semaforos: Object.keys(semaforos).length > 0 ? semaforos : 'vazio'
    });
  }, [isConnected, nivelValue, motorValue, contrapesoDirectoValue, contrapesoEsquerdoValue, motorDireitoValue, motorEsquerdoValue, semaforos]);

  return {
    // ✅ NOVOS VALORES DOS NÍVEIS DA ECLUSA
    nivelCaldeiraValue,
    nivelMontanteValue,
    nivelJusanteValue,
    
    // ✅ NOVOS VALORES DOS RADARES DA ECLUSA
    radarCaldeiraDistanciaValue,
    radarCaldeiraVelocidadeValue,
    radarMontanteDistanciaValue,
    radarMontanteVelocidadeValue,
    radarJusanteDistanciaValue,
    radarJusanteVelocidadeValue,
    
    // ✅ NOVOS VALORES DAS PORTAS DA ECLUSA
    eclusaPortaJusanteValue,
    eclusaPortaMontanteValue,
    
    // ✅ NOVOS VALORES DOS LASERS DA ECLUSA
    laserMontanteValue,
    laserJusanteValue,
    
    // ✅ NOVOS VALORES DO STATUS DA ECLUSA
    comunicacaoPLCValue,
    operacaoValue,
    alarmesAtivoValue,
    emergenciaAtivaValue,
    inundacaoValue,
    
    // Valores legados (mantidos para compatibilidade)
    nivelValue,
    motorValue,
    contrapesoDirectoValue,
    contrapesoEsquerdoValue,
    motorDireitoValue,
    motorEsquerdoValue,
    
    // Valores da Porta Montante
    portaMontanteValue,
    portaMontanteContrapesoDirectoValue,
    portaMontanteContrapesoEsquerdoValue,
    portaMontanteMotorDireitoValue,
    portaMontanteMotorEsquerdoValue,
    
    radarDistanciaValue,
    cotaMontanteValue,
    cotaCaldeiraValue,
    cotaJusanteValue,
    semaforos,
    
    // ✅ Arrays de dados
    pipeSystem,
    valvulasOnOff,
    
    // ✅ Estado de dados prontos
    isDataReady,
    
    isConnected,
    error,
    lastMessage
  };
}