'use client';

import { useState, useEffect, useRef } from 'react';

interface UseWebSocketReturn {
  nivelValue: number | null;
  motorValue: number | null;
  isConnected: boolean;
  error: string | null;
  lastMessage: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [nivelValue, setNivelValue] = useState<number | null>(null);
  const [motorValue, setMotorValue] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    try {
      console.log(`🔌 WEBSOCKET: Conectando ao ${url}`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WEBSOCKET: Conectado com sucesso');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = event.data;
          console.log('📨 WEBSOCKET RAW MESSAGE:', message);
          setLastMessage(message);
          
          // 🔍 REGEX DEBUG - Processa o formato: "Nivel:75,Motor:1"
          const nivelMatch = message.match(/Nivel:(\d+)/);
          const motorMatch = message.match(/Motor:(\d+)/);
          
          console.log('🔍 REGEX RESULTS:', {
            nivelMatch,
            motorMatch,
            message
          });
          
          if (nivelMatch) {
            const value = parseInt(nivelMatch[1]);
            const normalizedValue = Math.max(0, Math.min(100, value));
            setNivelValue(normalizedValue);
            console.log(`📊 NIVEL ATUALIZADO: ${normalizedValue}%`);
          } else {
            console.warn('⚠️ NIVEL não encontrado na mensagem');
          }
          
          if (motorMatch) {
            const value = parseInt(motorMatch[1]);
            const normalizedValue = Math.max(0, Math.min(2, value));
            setMotorValue(normalizedValue);
            console.log(`⚙️ MOTOR ATUALIZADO: ${normalizedValue} (${value === 0 ? 'INATIVO' : value === 1 ? 'OPERANDO' : 'FALHA'})`);
          } else {
            console.warn('⚠️ MOTOR não encontrado na mensagem');
          }
          
          // 🔄 Fallback para formato antigo
          if (!nivelMatch && !motorMatch) {
            const oldMatch = message.match(/Valor do PLC: (\d+)/);
            if (oldMatch) {
              const value = parseInt(oldMatch[1]);
              const normalizedValue = Math.max(0, Math.min(100, value));
              setNivelValue(normalizedValue);
              console.log(`📊 NIVEL (formato antigo): ${normalizedValue}%`);
            } else {
              console.error('❌ FORMATO DE MENSAGEM NÃO RECONHECIDO:', message);
            }
          }
          
        } catch (err) {
          console.error('❌ ERRO ao processar mensagem:', err);
          setError('Erro ao processar dados');
        }
      };

      ws.onclose = (event) => {
        console.log(`🔌 WEBSOCKET DESCONECTADO. Código: ${event.code}`);
        setIsConnected(false);
        
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        
        console.log(`🔄 RECONECTANDO em ${delay}ms (tentativa ${reconnectAttempts.current})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };

      ws.onerror = (error) => {
        console.error('❌ ERRO WEBSOCKET:', error);
        setError('Erro de conexão WebSocket');
        setIsConnected(false);
      };

    } catch (err) {
      console.error('❌ ERRO ao criar WebSocket:', err);
      setError('Erro ao conectar WebSocket');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      console.log('🧹 LIMPANDO WebSocket...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return { nivelValue, motorValue, isConnected, error, lastMessage };
}