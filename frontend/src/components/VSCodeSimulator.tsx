'use client';

import { useState, useEffect } from 'react';

const VSCodeSimulator = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState(0);

  const files = [
    {
      name: 'danilo-experience.ts',
      content: [
        "// Danilo Lira - Especialista Automação Industrial & Full-Stack",
        "// +10 anos experiência | 5 empresas | 2 países",
        "",
        "interface ProfessionalProfile {",
        "  name: 'Danilo Lira';",
        "  specialization: 'Industrial Automation & Full-Stack';",
        "  experience: '10+ years';",
        "  companies: 5;",
        "  countries: 2;",
        "}",
        "",
        "class DaniloLiraProfile {",
        "  // Experiência Profissional Atual",
        "  private currentRole = {",
        "    position: 'Especialista Automação Industrial',",
        "    company: 'RLS Automação Industrial',",
        "    location: 'Lisboa, Portugal',",
        "    period: 'jun 2024 - presente (1 ano)',",
        "    stack: ['PLC', 'SCADA', 'HMI', 'Industrial IoT']",
        "  };",
        "",
        "  // Experiência Anterior - Grandes Corporações",
        "  private previousRoles = [",
        "    {",
        "      position: 'Técnico Manutenção Elétrica & Automação',",
        "      company: 'Central de Cervejas (Sagres)',",
        "      location: 'Vialonga, Portugal',",
        "      period: 'dez 2023 - jun 2024 (7 meses)'",
        "    },",

        "}"
      ]
    }
  ];

  const terminalCommands = [
    "$ git log --oneline | head -5",
    "a4b8c9e feat: implementa controle PID adaptativo cervejaria",
    "b7d2e1f fix: otimiza comunicação Profinet S7-1500",
    "c3f4a8d feat: desenvolve HMI responsiva para produção",
    "d9e6b2a refactor: migra SCADA legacy para Industrial 4.0",
    "$ docker ps | grep industrial",
    "industrial-hmi      latest      Up 24 hours     0.0.0.0:3000->3000/tcp",
    "plc-gateway         v2.1.0      Up 24 hours     0.0.0.0:502->502/tcp",
    "$ curl -X GET https://api.industrial.danilo-lira.com/status",
    "{'status':'online','plc':'S7-1500','cpu_load':'12%','io_status':'OK'}",
    "$ npm run deploy:production",
    "✓ Building industrial automation project...",
    "✓ Deploying to Azure Industrial IoT...",
    "✓ PLC connection established - S7-1500",
    "✓ SCADA dashboard online - 99.9% uptime",
    "$ tail -f /var/log/production.log",
    "2024-01-31 14:30:15 [INFO] Temp sensor: 23.4°C ✓",
    "2024-01-31 14:30:16 [INFO] Pressure: 2.1 bar ✓",
    "2024-01-31 14:30:17 [INFO] Production rate: 1,500 bottles/hr ✓",
    "2024-01-31 14:30:18 [INFO] Quality check: PASS ✓"
  ];

  useEffect(() => {
    const codeInterval = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % files[currentFile].content.length);
    }, 800);

    const terminalInterval = setInterval(() => {
      setTerminalOutput(prev => {
        const newOutput = [...prev];
        const randomCmd = terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
        newOutput.push(randomCmd);
        return newOutput.slice(-6);
      });
    }, 2500);

    return () => {
      clearInterval(codeInterval);
      clearInterval(terminalInterval);
    };
  }, [currentFile]);

  const currentFileContent = files[currentFile].content;

  return (
    // Agora o contêiner principal usa 'absolute inset-0' para preencher exatamente
    // o pai, que já tem as classes de largura e altura corretas no LoginPage.tsx
    <div className="absolute inset-0 bg-gray-900 flex flex-col overflow-hidden">
      
      {/* VS Code Title Bar */}
      <div className="h-8 bg-gray-700 border-b border-gray-600 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-6 text-white text-xs">
          {files[currentFile].name}
        </div>
        <div className="ml-auto text-gray-400 text-xs">
          Danilo Lira - Industrial Automation Specialist
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-12 bg-gray-800 border-r border-gray-600 flex flex-col items-center py-3 gap-4">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-blue-400">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3.75a.5.5 0 0 1 .5.5v3h3.75a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-.5.5H2.5A1.5 1.5 0 0 1 1 12.5v-10Z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Code Editor */}
          <div className="flex-1 bg-gray-900 p-4 overflow-hidden">
            <div className="text-gray-100 text-xs font-mono leading-relaxed h-full overflow-auto">
              {currentFileContent.map((line, i) => (
                <div key={i} className="flex hover:bg-gray-800/50">
                  <span className="text-gray-500 w-10 text-right pr-3 select-none">{i + 1}</span>
                  <span className={
                    line.includes('// Danilo Lira') ? 'text-green-400' :
                    line.includes('interface') || line.includes('class') ? 'text-blue-400' :
                    line.includes('private') || line.includes('public') ? 'text-purple-400' :
                    line.includes("'") ? 'text-orange-400' :
                    line.includes('//') ? 'text-gray-500' :
                    'text-white'
                  }>
                    {line}
                  </span>
                  {i === currentLine && (
                    <span className="bg-white w-1 h-4 inline-block animate-pulse ml-1"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div className="h-40 bg-black border-t border-gray-600">
            <div className="h-7 bg-gray-800 border-b border-gray-600 flex items-center px-4">
              <span className="text-blue-400 text-xs font-mono">TERMINAL</span>
              <span className="text-gray-500 text-xs ml-4">bash - Danilo Lira Industrial Projects</span>
            </div>
            
            <div className="h-33 p-3 overflow-auto">
              <div className="text-green-400 text-xs font-mono leading-tight">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="mb-1">
                    {line.startsWith('$') ? (
                      <div className="text-white">
                        <span className="text-gray-400">danilo@industrial:~/projects$ </span>
                        {line.substring(2)}
                      </div>
                    ) : line.startsWith('✓') ? (
                      <span className="text-green-400">{line}</span>
                    ) : line.startsWith('2024') ? (
                      <span className="text-yellow-400">{line}</span>
                    ) : (
                      <span className="text-blue-400">{line}</span>
                    )}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-gray-400">danilo@industrial:~/projects$ </span>
                  <span className="bg-green-400 w-2 h-4 inline-block animate-pulse ml-1"></span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="h-6 bg-blue-600 flex items-center justify-between px-4 text-white text-xs">
            <div className="flex items-center gap-4">
              <span>TypeScript</span>
              <span>Ln {currentLine + 1}, Col 1</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span>🟢 AB InBev | Sagres | Font Salem</span>
              <span>⚡ 10+ Years Experience</span>
              <span>🇵🇹 Lisboa, Portugal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSCodeSimulator;