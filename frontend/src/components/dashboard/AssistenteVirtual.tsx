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
      text: "Olá! Sou seu assistente de diagnóstico de falhas. Digite o código ou descrição da falha:",
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
    const falhas = {
      'F001': 'Falha Hidráulica - Verifique pressão do sistema (15-20 bar). Possível vazamento na linha principal.',
      'F002': 'Falha Elétrica - Verificar alimentação 220V. Possível problema no quadro de comando.',
      'F003': 'Falha Comunicação - Verificar cabo de rede. Reiniciar switch VLAN.',
      'F004': 'Sensor Nível - Calibrar sensor ultrassônico. Verificar obstruções.',
      'F005': 'Motor Hidráulico - Verificar óleo. Temperatura operacional 40-60°C.',
      'hidraulica': 'Problemas hidráulicos: Verificar pressão (15-20 bar), filtros, vazamentos e temperatura do óleo.',
      'eletrica': 'Problemas elétricos: Verificar tensão 220V, disjuntores, contatores e cabos de alimentação.',
      'comunicacao': 'Problemas de rede: Verificar cabo Ethernet, status LED switch, configuração VLAN.',
      'sensor': 'Problemas sensores: Verificar alimentação 24V, cabos, calibração e limpeza.',
      'motor': 'Problemas motor: Verificar óleo hidráulico, filtros, temperatura e pressão.',
      'emergencia': 'EMERGÊNCIA: Acionar botão parada geral, isolar área, contactar supervisor imediatamente.',
      'manutencao': 'Manutenção preventiva: Verificar cronograma, óleo (500h), filtros (250h), sensores (1000h).',
      'regua': 'Eclusa Régua: Status crítico. Prioridade alta para reparo comunicação VLAN.',
      'crestuma': 'Eclusa Crestuma: Operacional. Próxima manutenção em 15 dias.',
      'carrapatelo': 'Eclusa Carrapatelo: Alerta comunicação instável. Verificar cabo de rede.',
      'valeira': 'Eclusa Valeira: Status normal. Sistema funcionando perfeitamente.',
      'pocinho': 'Eclusa Pocinho: Alerta inundação crítica. Verificar sensores nível.'
    };

    const inputLower = input.toLowerCase();
    
    for (const [key, value] of Object.entries(falhas)) {
      if (inputLower.includes(key)) {
        return value;
      }
    }
    
    return 'Falha não reconhecida. Digite: F001-F005 para códigos específicos, ou palavras como "hidraulica", "eletrica", "comunicacao", "sensor", "motor", ou nome da eclusa.';
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