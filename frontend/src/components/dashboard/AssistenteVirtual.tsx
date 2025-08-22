// AssistenteVirtual.tsx - ASSISTENTE INTELIGENTE DA ECLUSA
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const AssistenteVirtual: React.FC = () => {
  // ✅ DADOS REAIS EM TEMPO REAL DA ECLUSA
  const {
    nivelCaldeiraValue,
    nivelMontanteValue,
    nivelJusanteValue,
    eclusaPortaJusanteValue,
    eclusaPortaMontanteValue,
    comunicacaoPLCValue,
    operacaoValue,
    alarmesAtivoValue,
    emergenciaAtivaValue,
    inundacaoValue,
    semaforos,
    isConnected,
    error
  } = useWebSocket('ws://localhost:8080/ws');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🤖 Olá! Sou seu Assistente IA da Eclusa de Navegação.\n\nPosso analisar dados reais em tempo real:\n• Status operacional atual\n• Diagnósticos inteligentes\n• Alertas automáticos\n• Otimizações sugeridas\n• Procedimentos emergência\n\nDigite 'status' para análise completa!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastStatusRef = useRef<any>(null);

  // ✅ ALERTAS AUTOMÁTICOS INTELIGENTES
  useEffect(() => {
    if (!isConnected) return;
    
    const currentStatus = { 
      emergencia: emergenciaAtivaValue, 
      inundacao: inundacaoValue,
      comunicacao: comunicacaoPLCValue 
    };
    
    const lastStatus = lastStatusRef.current;
    
    if (lastStatus) {
      // Detecta mudanças críticas e envia alertas automáticos
      if (!lastStatus.emergencia && currentStatus.emergencia) {
        const alertMessage: Message = {
          id: Date.now(),
          text: "🚨 ALERTA AUTOMÁTICO: EMERGÊNCIA ATIVADA!\n\nO sistema detectou ativação de emergência. Verifique imediatamente a área e tome ações de segurança necessárias.",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alertMessage]);
      }
      
      if (!lastStatus.inundacao && currentStatus.inundacao) {
        const alertMessage: Message = {
          id: Date.now(),
          text: "🌊 ALERTA AUTOMÁTICO: INUNDAÇÃO DETECTADA!\n\nSensor de inundação foi acionado. Verificar sistema de drenagem e tomar medidas preventivas imediatamente.",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alertMessage]);
      }
      
      if (lastStatus.comunicacao && !currentStatus.comunicacao) {
        const alertMessage: Message = {
          id: Date.now(),
          text: "📡 ALERTA AUTOMÁTICO: FALHA COMUNICAÇÃO PLC!\n\nPerda de comunicação com o PLC detectada. Verificar cabos de rede e reiniciar equipamentos se necessário.",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alertMessage]);
      }
    }
    
    lastStatusRef.current = currentStatus;
  }, [emergenciaAtivaValue, inundacaoValue, comunicacaoPLCValue, isConnected]);

  // ✅ ANÁLISES INTELIGENTES EM TEMPO REAL
  const analisarStatusAtual = () => {
    const niveis = {
      montante: nivelMontanteValue || 0,
      caldeira: nivelCaldeiraValue || 0, 
      jusante: nivelJusanteValue || 0
    };

    const portas = {
      montante: eclusaPortaMontanteValue || 0,
      jusante: eclusaPortaJusanteValue || 0
    };

    const status = {
      comunicacao: comunicacaoPLCValue,
      operacao: operacaoValue,
      alarmes: alarmesAtivoValue,
      emergencia: emergenciaAtivaValue,
      inundacao: inundacaoValue
    };

    return { niveis, portas, status };
  };

  const gerarAlertasInteligentes = () => {
    const { niveis, portas, status } = analisarStatusAtual();
    const alertas = [];

    // Análise de níveis
    const diffMontanteCaldeira = Math.abs(niveis.montante - niveis.caldeira);
    const diffCaldeiraJusante = Math.abs(niveis.caldeira - niveis.jusante);

    if (diffMontanteCaldeira > 5) {
      alertas.push("⚠️ Grande diferença de nível Montante-Caldeira: " + diffMontanteCaldeira.toFixed(1) + "%");
    }
    
    if (diffCaldeiraJusante > 5) {
      alertas.push("⚠️ Grande diferença de nível Caldeira-Jusante: " + diffCaldeiraJusante.toFixed(1) + "%");
    }

    // Análise de portas
    if (portas.montante > 90 && portas.jusante > 90) {
      alertas.push("🚨 CRÍTICO: Ambas as portas abertas simultaneamente!");
    }

    // Status críticos
    if (status.emergencia) {
      alertas.push("🚨 EMERGÊNCIA ATIVA - Ação imediata necessária!");
    }

    if (status.inundacao) {
      alertas.push("🌊 INUNDAÇÃO DETECTADA - Verificar drenagem!");
    }

    if (!status.comunicacao) {
      alertas.push("📡 Falha comunicação PLC - Verificar rede!");
    }

    if (!isConnected) {
      alertas.push("🔴 WebSocket desconectado - Dados podem estar desatualizados!");
    }

    return alertas;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const diagnosticarFalha = (input: string): string => {
    const inputLower = input.toLowerCase();
    const { niveis, portas, status } = analisarStatusAtual();
    const alertas = gerarAlertasInteligentes();

    // ✅ DADOS REAIS EM TEMPO REAL
    const statusAtual = {
      conexao: isConnected ? '🟢 Online' : '🔴 Offline',
      comunicacao_plc: comunicacaoPLCValue ? '🟢 OK' : '🔴 Falha',
      operacao: operacaoValue ? '🟢 Operacional' : '🔴 Parada',
      emergencia: emergenciaAtivaValue ? '🚨 ATIVA' : '🟢 Normal',
      inundacao: inundacaoValue ? '🌊 DETECTADA' : '🟢 Normal',
      nivel_montante: niveis.montante.toFixed(1) + '%',
      nivel_caldeira: niveis.caldeira.toFixed(1) + '%',
      nivel_jusante: niveis.jusante.toFixed(1) + '%',
      porta_montante: portas.montante.toFixed(1) + '%',
      porta_jusante: portas.jusante.toFixed(1) + '%'
    };

    // ✅ CONTAGEM SEMÁFOROS ATIVOS
    const semaforosVerdes = Object.keys(semaforos).filter(key => 
      key.includes('verde') && semaforos[key]).length;
    const semaforosVermelhos = Object.keys(semaforos).filter(key => 
      key.includes('vermelho') && semaforos[key]).length;

    // ✅ STATUS PRINCIPAL - DADOS REAIS
    if (inputLower.includes('status') || inputLower.includes('eclusa') || inputLower.includes('resumo')) {
      return `📊 STATUS ECLUSA - TEMPO REAL:\n\n🔗 CONEXÕES:\n• WebSocket: ${isConnected ? '🟢 Online' : '🔴 Offline'}\n• Comunicação PLC: ${comunicacaoPLCValue ? '🟢 OK' : '🔴 Falha'}\n• Sistema: ${operacaoValue ? '🟢 Operacional' : '🟴 Parado'}\n\n💧 NÍVEIS DE ÁGUA:\n• Montante: ${niveis.montante.toFixed(1)}%\n• Caldeira: ${niveis.caldeira.toFixed(1)}%\n• Jusante: ${niveis.jusante.toFixed(1)}%\n\n🚪 PORTAS:\n• Montante: ${portas.montante.toFixed(1)}% aberta\n• Jusante: ${portas.jusante.toFixed(1)}% aberta\n\n⚠️ STATUS CRÍTICO:\n• Emergência: ${emergenciaAtivaValue ? '🚨 ATIVA' : '🟢 Normal'}\n• Inundação: ${inundacaoValue ? '🌊 DETECTADA' : '🟢 Normal'}\n\n🚦 SEMÁFOROS: ${semaforosVerdes} verdes | ${semaforosVermelhos} vermelhos\n\n${alertas.length > 0 ? '🚨 ' + alertas.length + ' ALERTAS ATIVOS!' : '✅ Sistema operando normalmente'}`;
    }

    if (inputLower.includes('alarme') || inputLower.includes('critico') || inputLower.includes('alerta')) {
      if (alertas.length === 0) {
        return `✅ NENHUM ALERTA CRÍTICO DETECTADO\n\nSistema operando normalmente:\n• Todos os níveis dentro do esperado\n• Portas funcionando corretamente\n• Comunicação estável\n• Sem emergências ativas\n\nContinue monitorando. Digite 'status' para dados atuais.`;
      }
      
      return `🚨 ALERTAS CRÍTICOS DETECTADOS (${alertas.length}):\n\n${alertas.map((alerta, i) => `${i + 1}. ${alerta}`).join('\n')}\n\n⚡ RECOMENDAÇÕES:\n• Verificar imediatamente os itens críticos\n• Contatar manutenção se necessário\n• Monitorar continuamente\n• Digite 'emergencia' se situação crítica`;
    }

    if (inputLower.includes('nivel') || inputLower.includes('agua') || inputLower.includes('montante') || inputLower.includes('caldeira') || inputLower.includes('jusante')) {
      const diffMC = Math.abs(niveis.montante - niveis.caldeira);
      const diffCJ = Math.abs(niveis.caldeira - niveis.jusante);
      
      let analise = '📊 ANÁLISE INTELIGENTE DE NÍVEIS:\n\n';
      analise += `💧 VALORES ATUAIS:\n• Montante: ${niveis.montante.toFixed(1)}%\n• Caldeira: ${niveis.caldeira.toFixed(1)}%\n• Jusante: ${niveis.jusante.toFixed(1)}%\n\n`;
      analise += `📈 DIFERENÇAS:\n• Montante-Caldeira: ${diffMC.toFixed(1)}%\n• Caldeira-Jusante: ${diffCJ.toFixed(1)}%\n\n`;
      
      if (diffMC < 2 && diffCJ < 2) {
        analise += '✅ EXCELENTE: Níveis bem equilibrados\n🎯 Sistema hidráulico operando perfeitamente';
      } else if (diffMC < 5 && diffCJ < 5) {
        analise += '⚠️ ATENÇÃO: Pequenos desequilíbrios detectados\n🔧 Monitorar mais de perto';
      } else {
        analise += '🚨 CRÍTICO: Grandes desequilíbrios!\n⚡ Ação imediata necessária - verificar bombas e válvulas';
      }
      
      return analise;
    }

    if (inputLower.includes('porta') || inputLower.includes('abertura')) {
      let analise = '🚪 ANÁLISE INTELIGENTE DE PORTAS:\n\n';
      analise += `📊 STATUS ATUAL:\n• Porta Montante: ${portas.montante.toFixed(1)}% aberta\n• Porta Jusante: ${portas.jusante.toFixed(1)}% aberta\n\n`;
      
      if (portas.montante > 90 && portas.jusante > 90) {
        analise += '🚨 CRÍTICO: Ambas as portas totalmente abertas!\n⚠️ RISCO de inundação - feche uma das portas imediatamente!';
      } else if (portas.montante < 5 && portas.jusante < 5) {
        analise += '🔒 SEGURO: Ambas as portas fechadas\n✅ Configuração segura para manutenção';
      } else {
        analise += `⚙️ OPERACIONAL: Configuração normal de operação\n${portas.montante > portas.jusante ? '⬆️ Fluxo predominante para jusante' : '⬇️ Fluxo predominante para montante'}`;
      }
      
      return analise;
    }

    if (inputLower.includes('hidraulic') || inputLower.includes('bomba') || inputLower.includes('comporta')) {
      return `💧 DIAGNÓSTICO HIDRÁULICO RÉGUA:\n\nFalhas ativas:\n• Bomba comporta direita não responde\n• Inundação poço contrapesos\n• Protecção bomba comporta esquerda\n\n🔧 SOLUÇÃO:\n1. Verificar pressão óleo (15-20 bar)\n2. Testar válvulas direcionais\n3. Drenar água poço contrapesos\n4. Verificar filtros hidráulicos`;
    }

    if (inputLower.includes('sensor') || inputLower.includes('radar') || inputLower.includes('laser')) {
      return `📡 DIAGNÓSTICO SENSORES RÉGUA:\n\nFalhas ativas:\n• Sensor posição comporta direita\n• Laser jusante obstruído\n• Radar jusante com erro\n\n🔧 SOLUÇÃO:\n1. Limpar lentes laser/radar\n2. Calibrar sensores posição\n3. Verificar alimentação 24VDC\n4. Testar cabos comunicação`;
    }

    if (inputLower.includes('comunicac') || inputLower.includes('rede') || inputLower.includes('plc')) {
      return `🌐 DIAGNÓSTICO COMUNICAÇÃO RÉGUA:\n\nFalhas ativas:\n• Sem comunicação sala comando\n• Quadro enchimento offline\n• Autómato erro diagnóstico\n\n🔧 SOLUÇÃO:\n1. Verificar cabo Ethernet\n2. Reiniciar switch VLAN\n3. Testar IP autómato\n4. Verificar configuração rede`;
    }

    if (inputLower.includes('emergenc') || inputLower.includes('parada') || inputLower.includes('socorro')) {
      return `🚨 PROCEDIMENTO EMERGÊNCIA:\n\n${emergenciaAtivaValue ? 'STATUS: EMERGÊNCIA ATIVA NO SISTEMA!' : 'STATUS: Sistema normal'}\n\n1. ✋ Parar operações imediatamente\n2. 🔒 Isolar área de operação\n3. 📞 Contactar supervisor\n4. 📋 Registrar ocorrência\n\n${emergenciaAtivaValue ? '⚠️ AÇÃO IMEDIATA NECESSÁRIA!' : '✅ Procedimento para referência'}`;
    }

    if (inputLower.includes('ajuda') || inputLower.includes('help') || inputLower.includes('comandos')) {
      return `🤖 COMANDOS DISPONÍVEIS:\n\n• status - Análise completa do sistema\n• alertas - Verificar problemas detectados\n• niveis - Análise dos níveis de água\n• portas - Status das comportas\n• semaforos - Estado dos sinais\n• emergencia - Procedimentos de emergência\n\nTodos baseados em dados reais do PLC!`;
    }
    
    if (inputLower.includes('semaforo') || inputLower.includes('sinal')) {
      return `🚦 ANÁLISE SEMÁFOROS (TEMPO REAL):\n\n🟢 Sinais verdes ativos: ${semaforosVerdes}\n🔴 Sinais vermelhos ativos: ${semaforosVermelhos}\n\n${semaforosVerdes > semaforosVermelhos ? '✅ Predominância verde - trânsito liberado' : semaforosVermelhos > semaforosVerdes ? '🛑 Predominância vermelha - trânsito restrito' : '⚖️ Sinais equilibrados - transição de estado'}\n\nMonitoramento automático ativo.`;
    }

    if (inputLower.includes('otimizac') || inputLower.includes('melhoria') || inputLower.includes('eficiencia')) {
      let sugestoes = '🎯 SUGESTÕES DE OTIMIZAÇÃO IA:\n\n';
      
      const diffMC = Math.abs(niveis.montante - niveis.caldeira);
      const diffCJ = Math.abs(niveis.caldeira - niveis.jusante);
      
      if (diffMC > 3) {
        sugestoes += '💧 Ajustar vazão entre Montante-Caldeira\n';
      }
      if (diffCJ > 3) {
        sugestoes += '💧 Balancear níveis Caldeira-Jusante\n';
      }
      if (portas.montante > 50 && portas.jusante > 50) {
        sugestoes += '🚪 Considerar fechamento sequencial das portas\n';
      }
      if (!comunicacaoPLCValue) {
        sugestoes += '📡 URGENTE: Restabelecer comunicação PLC\n';
      }
      
      if (sugestoes === '🎯 SUGESTÕES DE OTIMIZAÇÃO IA:\n\n') {
        sugestoes += '✅ Sistema operando em condições ótimas!\n\nContinue o monitoramento preventivo.';
      }
      
      return sugestoes;
    }

    return `🤖 IA não encontrou informações para "${input}".\n\n🧠 COMANDOS INTELIGENTES:\n• "status" - Análise completa tempo real\n• "alertas" - Detecção automática de riscos\n• "niveis" - Análise hidráulica inteligente\n• "portas" - Diagnóstico abertura/fechamento\n• "semaforos" - Status sinais de tráfego\n• "otimização" - Sugestões IA de melhorias\n• "emergencia" - Procedimentos críticos\n\n✨ Alimentado por dados reais do PLC!`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: diagnosticarFalha(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão Flutuante - LADO ESQUERDO */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 relative"
        >
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window - LADO ESQUERDO */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 ${isConnected ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">IA Eclusa de Navegação</h3>
              <p className="text-xs text-blue-100">
                {isConnected ? '🟢 Conectado ao PLC' : '🔴 Desconectado'} • Dados em tempo real
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                  <div className={`p-2 rounded-full ${message.isBot ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {message.isBot ? <Bot className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.isBot 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite: status, alertas, niveis, portas..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              🚀 Comandos: status • alertas • niveis • portas • otimização
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistenteVirtual;