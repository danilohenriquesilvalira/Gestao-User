// AssistenteVirtual.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const AssistenteVirtual: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🤖 Olá! Sou seu Assistente Inteligente da Eclusa Régua.\n\nPosso ajudar com:\n• Status em tempo real\n• Diagnóstico de falhas\n• Procedimentos emergência\n• Análise de eficiência\n• Cronogramas manutenção\n\nDigite 'status' para começar!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const diagnosticarFalha = (input: string): string => {
    const inputLower = input.toLowerCase();
    
    // Falhas reais da Eclusa Régua integradas ao assistente
    const falhasReguaAtuais = [
      'Protecção 24V entradas analógicas disparou',
      'Protecção sobretensão descarregador disparou', 
      'Sem comunicação com sala comando',
      'Emergência activada',
      'Bomba comporta direita não responde',
      'Sensor posição comporta direita avariado',
      'Autómato - erro diagnóstico',
      'Laser jusante - obstrução detectada',
      'Porta desnivelada - paragem',
      'Inundação poço contrapesos porta montante',
      'Radar jusante com erro'
    ];

    // Status atual da Eclusa Régua
    const statusRegua = {
      eficiencia: '87%',
      operador: 'Carlos Mendes',
      comunicacao: 'Online',
      alarmes_ativos: 11,
      nivel_montante: '16.1m',
      nivel_caldeira: '13.5m', 
      nivel_jusante: '11.2m'
    };

    // Diagnósticos inteligentes baseados em contexto
    if (inputLower.includes('status') || inputLower.includes('regua') || inputLower.includes('resumo')) {
      return `📊 STATUS RÉGUA ATUAL:\n\n✅ Operacional (${statusRegua.eficiencia} eficiência)\n👤 Operador: ${statusRegua.operador}\n🔴 ${statusRegua.alarmes_ativos} alarmes ativos\n💧 Níveis: M:${statusRegua.nivel_montante} | C:${statusRegua.nivel_caldeira} | J:${statusRegua.nivel_jusante}\n\nPrioridades: Comunicação sala comando, Proteções elétricas`;
    }

    if (inputLower.includes('alarme') || inputLower.includes('critico')) {
      return `🚨 ALARMES CRÍTICOS RÉGUA:\n\n1. Emergência activada (12:58)\n2. Protecção sobretensão disparou (13:42)\n3. Sem comunicação sala comando (13:15)\n4. Bomba comporta direita falhou (12:30)\n\n⚡ AÇÃO: Verificar quadro elétrico e cabo comunicação`;
    }

    if (inputLower.includes('eletric') || inputLower.includes('protec') || inputLower.includes('24v')) {
      return `⚡ DIAGNÓSTICO ELÉTRICO RÉGUA:\n\nFalhas ativas:\n• Protecção 24V entradas analógicas\n• Protecção sobretensão descarregador\n• Fonte 400VAC/24VDC avariada\n\n🔧 SOLUÇÃO:\n1. Verificar tensão entrada (400VAC)\n2. Testar fonte 24VDC\n3. Inspecionar cabos analógicos\n4. Resetar proteções após reparo`;
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
      return `🚨 PROCEDIMENTO EMERGÊNCIA ATIVADO:\n\n1. ✋ PARAR todas operações imediatamente\n2. 🔒 Isolar área de operação\n3. 📞 Contactar supervisor: Ext. 2001\n4. 🚨 Activar sirene evacuação se necessário\n5. 📋 Registar evento no livro ocorrências\n\n⚠️ NÃO restabelecer sem autorização!`;
    }

    if (inputLower.includes('manutenc') || inputLower.includes('preventiv') || inputLower.includes('cronograma')) {
      return `🔧 MANUTENÇÃO PREVENTIVA RÉGUA:\n\n📅 Próxima: 5 dias\n\nTarefas pendentes:\n• Trocar óleo hidráulico (500h)\n• Limpar filtros ar (250h)\n• Calibrar sensores (1000h)\n• Testar sistema emergência\n• Verificar cabos elétricos\n\n📊 Histórico: 87% conformidade`;
    }

    if (inputLower.includes('eficienc') || inputLower.includes('performance') || inputLower.includes('87')) {
      return `📈 ANÁLISE EFICIÊNCIA RÉGUA:\n\nAtual: 87% (Bom)\nMédia semana: 89%\nMeta: 90%\n\n📉 Fatores impacto:\n• Falhas elétricas (-2%)\n• Comunicação instável (-1%)\n• Manutenções programadas\n\n✅ Recomendação: Resolver comunicação`;
    }

    // Pesquisa por falha específica
    const falhaEncontrada = falhasReguaAtuais.find(falha => 
      inputLower.includes(falha.toLowerCase().split(' ')[0]) ||
      inputLower.includes(falha.toLowerCase().split(' ')[1]) ||
      falha.toLowerCase().includes(inputLower)
    );

    if (falhaEncontrada) {
      return `🔍 FALHA ENCONTRADA: "${falhaEncontrada}"\n\nStatus: ATIVA\nSistema: Régua\nPrioridade: ALTA\n\n🔧 Consulte manual técnico seção correspondente ou contacte manutenção.`;
    }
    
    return `🤖 Não encontrei informações específicas para "${input}".\n\n💡 Tente:\n• "status" - Resumo geral\n• "alarmes" - Falhas críticas\n• "eletrica" - Diagnóstico elétrico\n• "hidraulica" - Sistema hidráulico\n• "sensores" - Instrumentação\n• "emergencia" - Procedimentos\n• "manutencao" - Cronograma`;
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
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Assistente de Diagnóstico</h3>
              <p className="text-xs text-blue-100">Diagnóstico de falhas em tempo real</p>
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
                placeholder="Digite código da falha ou descrição..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Exemplos: F001, hidraulica, regua, emergencia
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistenteVirtual;