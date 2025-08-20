// EclusasGrid.tsx
import React from 'react';
import EclusaCard from '@/components/ui/EclusaCard';

export const EclusasGrid: React.FC = () => {
  const eclusasData = [
    {
      name: 'Crestuma',
      color: '#60BBF8',
      status: 'Operacional' as const,
      userLogado: 'Maria Santos',
      cotaMontante: '15.2m',
      cotaCaldeira: '12.8m',
      cotaJusante: '10.5m',
      eficiencia: 98,
      proximaManutencao: '15 dias',
      alarmes: false,
      comunicacao: 'Online' as const,
      inundacao: 'Normal' as const,
      emergencia: false
    },
    {
      name: 'Carrapatelo',
      color: '#FF886C',
      status: 'Operacional' as const,
      userLogado: 'Pedro Lima',
      cotaMontante: '14.8m',
      cotaCaldeira: '12.2m',
      cotaJusante: '9.8m',
      eficiencia: 95,
      proximaManutencao: '8 dias',
      alarmes: true,
      comunicacao: 'Instável' as const,
      inundacao: 'Normal' as const,
      emergencia: false
    },
    {
      name: 'Régua',
      color: '#4AE800',
      status: 'Manutenção' as const,
      userLogado: 'Carlos Mendes',
      cotaMontante: '16.1m',
      cotaCaldeira: '13.5m',
      cotaJusante: '11.2m',
      eficiencia: 85,
      proximaManutencao: 'Em andamento',
      alarmes: false,
      comunicacao: 'Offline' as const,
      inundacao: 'Alerta' as const,
      emergencia: true
    },
    {
      name: 'Valeira',
      color: '#FF5402',
      status: 'Operacional' as const,
      userLogado: 'Ana Ferreira',
      cotaMontante: '15.8m',
      cotaCaldeira: '13.1m',
      cotaJusante: '10.9m',
      eficiencia: 97,
      proximaManutencao: '22 dias',
      alarmes: false,
      comunicacao: 'Online' as const,
      inundacao: 'Normal' as const,
      emergencia: false
    },
    {
      name: 'Pocinho',
      color: '#FEFE00',
      status: 'Operacional' as const,
      userLogado: 'João Rodrigues',
      cotaMontante: '14.5m',
      cotaCaldeira: '11.9m',
      cotaJusante: '9.5m',
      eficiencia: 99,
      proximaManutencao: '30 dias',
      alarmes: true,
      comunicacao: 'Online' as const,
      inundacao: 'Crítico' as const,
      emergencia: false
    },
  ];

  return (
    <div className="w-full">
      {/* Grid responsivo para 5 eclusas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {eclusasData.map((eclusa, index) => (
          <div key={eclusa.name} className="h-80">
            <EclusaCard
              name={eclusa.name}
              color={eclusa.color}
              status={eclusa.status}
              userLogado={eclusa.userLogado}
              cotaMontante={eclusa.cotaMontante}
              cotaCaldeira={eclusa.cotaCaldeira}
              cotaJusante={eclusa.cotaJusante}
              eficiencia={eclusa.eficiencia}
              proximaManutencao={eclusa.proximaManutencao}
              alarmes={eclusa.alarmes}
              comunicacao={eclusa.comunicacao}
              inundacao={eclusa.inundacao}
              emergencia={eclusa.emergencia}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EclusasGrid;