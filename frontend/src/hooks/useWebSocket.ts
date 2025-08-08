'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketReturn {
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
  semaforos: Record<string, boolean>;
  // ✅ NOVO: Array PipeSystem [0..23]
  pipeSystem: boolean[];
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
      
      // ✅ ENVIA DADOS EM CACHE PARA NOVOS LISTENERS (se existirem)
      if (lastReceivedData) {
        console.log('📤 Enviando dados em cache para novos listeners');
        notifyGlobalListeners({ type: 'data', ...lastReceivedData });
      }
    };

    globalWebSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // ✅ SALVA DADOS NO CACHE GLOBAL
        if (!data.ping && data.semaforos) {
          lastReceivedData = data;
          console.log('💾 Dados salvos no cache:', data);
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
  
  // ✅ ENVIA DADOS EM CACHE IMEDIATAMENTE PARA NOVOS LISTENERS
  if (lastReceivedData) {
    console.log('📤 Enviando dados em cache para novo listener');
    setTimeout(() => {
      callback({ type: 'data', ...lastReceivedData });
    }, 100); // Pequeno delay para garantir que o component está montado
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
  const [nivelValue, setNivelValue] = useState<number | null>(null);
  const [motorValue, setMotorValue] = useState<number | null>(null);
  const [contrapesoDirectoValue, setContrapesoDirectoValue] = useState<number | null>(null);
  const [contrapesoEsquerdoValue, setContrapesoEsquerdoValue] = useState<number | null>(null);
  const [motorDireitoValue, setMotorDireitoValue] = useState<number | null>(null);
  const [motorEsquerdoValue, setMotorEsquerdoValue] = useState<number | null>(null);
  
  // Novos estados para Porta Montante
  const [portaMontanteValue, setPortaMontanteValue] = useState<number | null>(null);
  const [portaMontanteContrapesoDirectoValue, setPortaMontanteContrapesoDirectoValue] = useState<number | null>(null);
  const [portaMontanteContrapesoEsquerdoValue, setPortaMontanteContrapesoEsquerdoValue] = useState<number | null>(null);
  const [portaMontanteMotorDireitoValue, setPortaMontanteMotorDireitoValue] = useState<number | null>(null);
  const [portaMontanteMotorEsquerdoValue, setPortaMontanteMotorEsquerdoValue] = useState<number | null>(null);
  
  const [semaforos, setSemaforos] = useState<Record<string, boolean>>({});
  // ✅ NOVO: Array PipeSystem [0..23] - inicializado com 24 elementos false
  const [pipeSystem, setPipeSystem] = useState<boolean[]>(new Array(24).fill(false));
  const [isConnected, setIsConnected] = useState(false);
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
    } else if (data.type === 'data') {
      // Filtra ping messages
      if (data.ping) return;
      
      console.log('📊 Processando dados do PLC no hook:', data);
      
      // Processa dados do PLC com validação de ranges
      if (data.nivelValue !== undefined) {
        const limitedNivel = Math.max(0, Math.min(100, data.nivelValue));
        console.log(`💧 Atualizando nível: ${data.nivelValue} -> ${limitedNivel}`);
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
    nivelValue,
    motorValue,
    contrapesoDirectoValue,
    contrapesoEsquerdoValue,
    motorDireitoValue,
    motorEsquerdoValue,
    // Novos valores da Porta Montante
    portaMontanteValue,
    portaMontanteContrapesoDirectoValue,
    portaMontanteContrapesoEsquerdoValue,
    portaMontanteMotorDireitoValue,
    portaMontanteMotorEsquerdoValue,
    semaforos,
    // ✅ NOVO: Array PipeSystem [0..23]
    pipeSystem,
    isConnected,
    error,
    lastMessage
  };
}