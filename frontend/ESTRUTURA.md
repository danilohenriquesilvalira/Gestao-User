# Frontend - Estrutura Organizada

## 📁 Estrutura de Diretórios

```
src/
├── app/                          # App Router do Next.js
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard principal
│   ├── login/
│   │   └── page.tsx             # Página de login
│   └── layout.tsx               # Layout global
│
├── components/                   # Componentes organizados por categoria
│   ├── core/                    # Componentes fundamentais
│   │   └── ResponsiveWrapper.tsx # Wrapper responsivo para layouts
│   ├── dashboard/               # Componentes específicos do dashboard
│   │   └── FloatingEditorDialog.tsx # Dialog de edição flutuante
│   ├── industrial/              # Componentes industriais/PLC
│   │   ├── Nivel.tsx           # Componente de nível de água
│   │   └── Motor.tsx           # Componente de motor
│   ├── layout/                  # Componentes de layout
│   │   ├── ModernHeader.tsx    # Cabeçalho moderno
│   │   └── ModernSidebar.tsx   # Sidebar moderna
│   ├── ui/                      # Componentes UI reutilizáveis
│   │   ├── Button.tsx          # Botão customizado
│   │   ├── Input.tsx           # Input customizado
│   │   ├── Checkbox.tsx        # Checkbox customizado
│   │   ├── Logo.tsx            # Logo EDP
│   │   ├── LogoAnimado.tsx     # Logo animado
│   │   ├── Notification.tsx    # Sistema de notificações
│   │   └── index.ts            # Exports dos componentes UI
│   └── index.ts                # Exports principais
│
├── contexts/                    # Contextos React
│   └── LayoutLoadingContext.tsx # Contexto para loading global
│
├── hooks/                       # Custom hooks
│   ├── useBreakpoint.ts        # Hook para breakpoints responsivos
│   └── useWebSocket.ts         # Hook para conexão WebSocket
│
└── lib/                        # Utilitários e bibliotecas
    └── utils.ts                # Funções utilitárias
```

## 🧹 Limpeza Realizada

### Arquivos Removidos:
- `components/EditorControls.tsx` - Não utilizado
- `components/ui/StatusCard.tsx` - Não utilizado
- `hooks/useLayoutConfig.ts` - Substituído por lógica no ResponsiveWrapper
- `hooks/usePLC.ts` - Não utilizado
- `lib/layoutService.ts` - Não utilizado
- `components/Eclusa/` - Pasta movida para industrial/

### Reorganização:
- **Core**: Componentes fundamentais do sistema
- **Dashboard**: Componentes específicos do dashboard
- **Industrial**: Componentes relacionados ao controle industrial
- **Layout**: Componentes de estrutura da página
- **UI**: Componentes de interface reutilizáveis

## 🚀 Funcionalidades Principais

### ResponsiveWrapper
- Sistema de layout responsivo
- Salvamento automático no Strapi v5
- Suporte a múltiplos breakpoints
- Modo de edição visual

### Loading System
- Tela de loading global elegante
- Timeout automático de 1 segundo
- Carregamento coordenado de componentes

### Componentes Industriais
- **Nivel**: Medidor de nível de água com WebSocket
- **Motor**: Controle de motor com status visual

### WebSocket Integration
- Conexão em tempo real com PLC
- Reconexão automática
- Estados de conexão visual

## 📦 Packages Utilizados

- Next.js 15.4.5
- React 18
- TypeScript
- Tailwind CSS
- @types/node (para process.env)

## 🎯 Próximos Passos

1. ✅ Estrutura organizada
2. ✅ Limpeza de código
3. ✅ Sistema de loading melhorado
4. ✅ Build funcionando
5. 🔄 Testes funcionais
6. 🔄 Otimizações de performance
