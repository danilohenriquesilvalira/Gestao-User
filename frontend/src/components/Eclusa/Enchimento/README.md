# PipeSystem Component

## Descrição
Componente React que renderiza um sistema complexo de tubulações para o sistema de enchimento. Segue todos os padrões estabelecidos no projeto, incluindo integração com WebSocket, ResponsiveWrapper e suporte a modo de edição.

## Características

### ✅ Padrões Implementados
- **WebSocket Integration**: Conecta-se ao PLC para dados em tempo real
- **ResponsiveWrapper**: Sistema responsivo completo
- **Edit Mode**: Suporte ao modo de edição global
- **EDP Standards**: Segue padrões visuais da EDP
- **TypeScript**: Tipagem completa e segura

### 🎨 Visual Features
- **24 Pipes Independentes**: Cada pipe pode ser controlado individualmente
- **Estados Visuais**: Cores diferentes para ativo (laranja #FC6500) e inativo (marrom #753E00)
- **Design Limpo**: SVG otimizado sem corner radius desnecessários
- **Hover Effects**: Efeitos visuais ao passar o mouse
- **Smooth Transitions**: Transições suaves entre estados
- **Interactive**: Cliques em pipes podem executar ações

## Uso

### Básico
```tsx
import { PipeSystem } from '@/components/Eclusa/Enchimento';

function EnchimentoPage() {
  return (
    <PipeSystem />
  );
}
```

### Avançado
```tsx
import { PipeSystem } from '@/components/Eclusa/Enchimento';

function EnchimentoPage() {
  const [pipeStates, setPipeStates] = useState({
    pipe1: 1,  // Ativo
    pipe2: 0,  // Inativo
    pipe3: 1,  // Ativo
    // ... outros pipes
  });

  const handlePipeClick = (pipeId: string) => {
    // Alternar estado do pipe
    setPipeStates(prev => ({
      ...prev,
      [pipeId]: prev[pipeId] === 1 ? 0 : 1
    }));
    
    // Enviar comando para PLC
    sendPipeCommand(pipeId);
  };

  return (
    <PipeSystem
      editMode={editMode}
      pipeStates={pipeStates}
      onPipeClick={handlePipeClick}
      className="custom-styles"
    />
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `pipeStates` | `{[key: string]: 0 \| 1}` | `{}` | Estados dos pipes (0=inativo, 1=ativo) |
| `onPipeClick` | `(pipeId: string) => void` | `undefined` | Callback ao clicar em um pipe |
| `width` | `number` | `1278` | Largura do SVG |
| `height` | `number` | `424` | Altura do SVG |
| `className` | `string` | `''` | Classes CSS adicionais |
| `editMode` | `boolean` | `false` | Ativa o modo de edição |

## Pipes Disponíveis

O sistema possui 24 pipes numerados de `pipe1` a `pipe24`:

- **pipe1-pipe6**: Sistema de alimentação principal
- **pipe7-pipe12**: Circuito de distribuição secundário  
- **pipe13-pipe18**: Sistema de retorno
- **pipe19-pipe24**: Circuito de controle

## Integração WebSocket

O componente se conecta automaticamente ao WebSocket do PLC:
- **URL**: `ws://localhost:8080/ws`
- **Status**: Monitora conexão em tempo real
- **Dados**: Preparado para receber estados dos pipes do PLC

## Estados dos Pipes

### Visual
- **Ativo (1)**: Cor laranja `#FC6500`
- **Inativo (0)**: Cor marrom `#753E00`

### Lógica
```tsx
// Estado de um pipe
type PipeState = 0 | 1;

// Coleção de estados
type PipeStates = {
  [key: string]: PipeState;
};
```

## Eventos

### onClick
```tsx
const handlePipeClick = (pipeId: string) => {
  console.log(`Pipe ${pipeId} foi clicado`);
  // Implementar lógica específica
};
```

## Responsividade

O componente utiliza o `ResponsiveWrapper` que permite:
- **Zoom**: Ajuste automático para diferentes tamanhos de tela
- **Drag & Drop**: Reposicionamento em modo edição
- **Scale**: Redimensionamento proporcional
- **Mobile**: Otimização para dispositivos móveis

## Exemplos de Uso

### 1. Sistema Básico
```tsx
<PipeSystem />
```

### 2. Com Estados Personalizados
```tsx
<PipeSystem 
  pipeStates={{
    pipe1: 1,
    pipe5: 1,
    pipe10: 0
  }}
/>
```

### 3. Interativo
```tsx
<PipeSystem 
  onPipeClick={(id) => togglePipe(id)}
  editMode={isEditing}
/>
```

### 4. Customizado
```tsx
<PipeSystem 
  width={1500}
  height={500}
  className="border rounded-lg shadow-lg"
/>
```

## Arquitetura

```
PipeSystem/
├── PipeSystem.tsx     # Componente principal
├── index.ts           # Exportações
└── README.md          # Documentação
```

## Próximos Passos

1. **Integração PLC**: Conectar estados reais dos pipes
2. **Animações**: Adicionar fluxo animado nos pipes ativos  
3. **Sensores**: Integrar dados de sensores
4. **Alarmes**: Sistema de alertas visuais
5. **Histórico**: Logs de estados dos pipes

## Compatibilidade

- ✅ React 18+
- ✅ TypeScript 5+
- ✅ Next.js 14+
- ✅ Tailwind CSS
- ✅ ResponsiveWrapper
- ✅ WebSocket Integration
