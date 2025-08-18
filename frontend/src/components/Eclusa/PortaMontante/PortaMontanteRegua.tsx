import React, { useState } from 'react';
import ResponsiveWrapper from '@/components/ResponsiveWrapper';

interface PortaMontanteReguaProps {
  editMode?: boolean;
  componentId?: string;
  abertura?: number; // Prop para receber o valor do WebSocket (0-100)
}

const PortaMontanteRegua: React.FC<PortaMontanteReguaProps> = ({ 
  editMode = false,
  componentId = 'porta-montante-regua',
  abertura: aberturaExterna 
}) => {
  // Estado interno para quando não recebe o valor via prop
  const [aberturaInterna, setAberturaInterna] = useState(100); // Estado inicial: 100% (fechada)

  // Usa o valor externo se fornecido, senão usa o interno
  const abertura = aberturaExterna !== undefined ? aberturaExterna : aberturaInterna;

  const handleAberturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAberturaInterna(Number(event.target.value));
  };

  // Agora a lógica é invertida: 
  // 100% = fechada (porta em cima, sem linha)
  // 0% = aberta (porta embaixo, linha estendida ao máximo)
  
  // Dimensões base do SVG original
  const SVG_WIDTH = 558;
  const SVG_HEIGHT = 336;
  const CONTAINER_HEIGHT = 500;
  
  // Calcular o fator de escala baseado no ResponsiveWrapper
  // O ResponsiveWrapper ajusta automaticamente o tamanho, então precisamos usar 100% das dimensões
  const deslocamentoYPercentual = (abertura / 100) * (CONTAINER_HEIGHT - SVG_HEIGHT);
  const comprimentoLinhaPercentual = deslocamentoYPercentual + (SVG_HEIGHT * 0.5); // 50% adicional para linhas mais longas

  return (
    <ResponsiveWrapper
      componentId={componentId}
      editMode={editMode}
      defaultConfig={{
        xs: { x: 300, y: 200, width: 280, height: 250, scale: 0.5, zIndex: 8, opacity: 1, rotation: 0 },
        sm: { x: 350, y: 250, width: 320, height: 280, scale: 0.55, zIndex: 8, opacity: 1, rotation: 0 },
        md: { x: 400, y: 300, width: 360, height: 320, scale: 0.6, zIndex: 8, opacity: 1, rotation: 0 },
        lg: { x: 450, y: 350, width: 400, height: 350, scale: 0.65, zIndex: 8, opacity: 1, rotation: 0 },
        xl: { x: 500, y: 400, width: 440, height: 380, scale: 0.7, zIndex: 8, opacity: 1, rotation: 0 },
        '2xl': { x: 550, y: 450, width: 480, height: 420, scale: 0.75, zIndex: 8, opacity: 1, rotation: 0 },
        '3xl': { x: 600, y: 500, width: 520, height: 450, scale: 0.8, zIndex: 8, opacity: 1, rotation: 0 },
        '4xl': { x: 650, y: 550, width: 560, height: 500, scale: 0.85, zIndex: 8, opacity: 1, rotation: 0 }
      }}
    >
      <div className="porta-montante-regua-wrapper" style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Container com posição relativa para posicionar o SVG - agora 100% responsivo */}
        <div 
          className="relative w-full h-full"
          style={{
            minHeight: '400px', // Altura mínima para garantir espaço para movimento
          }}
        >
          {/* Elemento para as linhas - Agora posicionado ANTES da porta para que esteja atrás */}
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: 0 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${CONTAINER_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
              {/* Linha esquerda com animação suave */}
              <line 
                x1="18.5" 
                y1="0" 
                x2="18.5" 
                y2={comprimentoLinhaPercentual}
                stroke="black" 
                strokeWidth="5"
                strokeDasharray={comprimentoLinhaPercentual}
                strokeDashoffset={abertura === 101 ? comprimentoLinhaPercentual : "0"}
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
              />
              
              {/* Linha direita com animação suave */}
              <line 
                x1="543.5" 
                y1="0" 
                x2="543.5" 
                y2={comprimentoLinhaPercentual}
                stroke="black" 
                strokeWidth="5"
                strokeDasharray={comprimentoLinhaPercentual}
                strokeDashoffset={abertura === 101 ? comprimentoLinhaPercentual : "0"}
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
              />
            </svg>
          </div>

          {/* SVG da Porta Montante com movimento vertical */}
          <div
            style={{
              width: '100%',
              height: `${(SVG_HEIGHT / CONTAINER_HEIGHT) * 100}%`, // Altura proporcional
              position: 'absolute',
              top: '0',
              left: '0',
              transform: `translateY(${(deslocamentoYPercentual / CONTAINER_HEIGHT) * 100}%)`, // Agora usa porcentagem
              transition: 'transform 0.5s linear', // Suaviza a animação
              zIndex: 1,
            }}
          >
            {/* SVG integrado diretamente no componente - agora responsivo */}
            <svg width="100%" height="100%" viewBox="0 0 558 336" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              {/* Retângulos pretos do topo */}
              <rect x="12" y="1" width="13" height="20" fill="black"/>
              <rect x="537" width="13" height="20" fill="black"/>
              
              <rect x="0.5" y="17.1338" width="556.721" height="317.942" fill="#7F7F7F" stroke="black"/>
              <rect x="7.04658" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="url(#paint0_linear_1738_3297)" strokeWidth="0.1"/>
              <rect x="99.0002" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="58.6242" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="304.414" width="83.858" height="18.4318" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="87.885" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="123.973" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="160.062" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="196.15" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="232.238" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="7.04658" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="99.0002" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="190.954" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="282.908" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="374.863" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <rect x="466.817" y="268.326" width="83.858" height="24.284" fill="#4D4D4D" stroke="white" strokeWidth="0.1"/>
              <path d="M1.75479 47.1914V47.2424H2.00479H24.6022L149.809 297.606L150.033 298.053L150.256 297.606L275.448 47.2424H283.551L291.184 62.5046L408.758 297.606L408.982 298.053L409.205 297.606L534.397 47.2424H557.437L557.637 47.2922L413.395 335.75H404.479L397.304 321.4L397.348 321.318L397.29 321.202L279.731 86.0999L279.507 85.6527L279.284 86.0999L154.446 335.75H145.619L140.381 325.299L140.381 325.299L138.341 321.212L138.117 321.324L138.341 321.212L1.36205 47.2909L1.75479 47.1914Z" fill="url(#paint1_radial_1738_3297)" stroke="black" strokeWidth="0.5"/>
              <rect y="18.584" width="557.721" height="27.31" fill="#4D4D4D"/>
              <path d="M2.54711 41.9926H1.47378C1.22416 41.9926 0.999512 41.8915 0.999512 41.7524L0.999512 18.584H2.9964L2.9964 41.7524C3.02137 41.8788 2.82168 41.9926 2.54711 41.9926Z" fill="url(#paint2_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M61.2921 41.9926H59.6821C59.3077 41.9926 58.9707 41.8915 58.9707 41.7524L58.9707 18.584H61.966L61.966 41.7524C62.0035 41.8788 61.704 41.9926 61.2921 41.9926Z" fill="url(#paint3_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M116.264 41.9926H114.654C114.28 41.9926 113.943 41.8915 113.943 41.7524V18.584H116.938V41.7524C116.976 41.8788 116.676 41.9926 116.264 41.9926Z" fill="url(#paint4_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M171.237 41.9926H169.627C169.253 41.9926 168.916 41.8915 168.916 41.7524V18.584H171.911V41.7524C171.948 41.8788 171.649 41.9926 171.237 41.9926Z" fill="url(#paint5_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M226.209 41.9926H224.599C224.225 41.9926 223.888 41.8915 223.888 41.7524V18.584H226.883V41.7524C226.92 41.8788 226.621 41.9926 226.209 41.9926Z" fill="url(#paint6_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M281.182 41.9926H279.572C279.197 41.9926 278.86 41.8915 278.86 41.7524V18.584H281.856V41.7524C281.893 41.8788 281.594 41.9926 281.182 41.9926Z" fill="url(#paint7_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M336.154 41.018H334.544C334.17 41.018 333.833 40.9169 333.833 40.7778V17.6094H336.828V40.7778C336.866 40.9042 336.566 41.018 336.154 41.018Z" fill="url(#paint8_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M391.127 41.018H389.517C389.143 41.018 388.806 40.9169 388.806 40.7778V17.6094H391.801V40.7778C391.838 40.9042 391.539 41.018 391.127 41.018Z" fill="url(#paint9_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M446.099 42.9682H444.489C444.115 42.9682 443.778 42.8671 443.778 42.728V19.5596H446.773V42.728C446.811 42.8544 446.511 42.9682 446.099 42.9682Z" fill="url(#paint10_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M501.072 42.9682H499.462C499.087 42.9682 498.75 42.8671 498.75 42.728V19.5596H501.746V42.728C501.783 42.8544 501.484 42.9682 501.072 42.9682Z" fill="url(#paint11_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M555.045 41.9926H553.435C553.061 41.9926 552.724 41.8915 552.724 41.7524V18.584H555.719V41.7524C555.756 41.8788 555.457 41.9926 555.045 41.9926Z" fill="url(#paint12_linear_1738_3297)" stroke="#4D4D4D" strokeWidth="0.75" strokeMiterlimit="10"/>
              <path d="M-0.000122273 45.5482L-0.000122132 42.406C-0.0001221 41.6752 2.40906 41.0176 5.72162 41.0176L557.721 41.0176L557.721 46.8636L5.72162 46.8636C2.7102 46.9366 -0.000122309 46.352 -0.000122273 45.5482Z" fill="url(#paint13_linear_1738_3297)"/>
              <path d="M-0.000122274 18.2386L-0.000122133 15.0964C-0.0001221 14.3657 2.40906 13.708 5.72162 13.708L557.721 13.708L557.721 19.554L5.72162 19.554C2.7102 19.6271 -0.00012231 19.0425 -0.000122274 18.2386Z" fill="url(#paint14_linear_1738_3297)"/>
              
              {/* Defs para os gradientes */}
              <defs>
                <linearGradient id="paint0_linear_1738_3297" x1="6.99658" y1="67.8401" x2="90.9546" y2="67.8401" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1"/>
                </linearGradient>
                <radialGradient id="paint1_radial_1738_3297" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(279.5 191.435) rotate(90) scale(144.565 278.5)">
                  <stop offset="0.625" stopColor="#C4C4C4"/>
                  <stop offset="0.89" stopColor="#4D4D4D"/>
                </radialGradient>
                <linearGradient id="paint2_linear_1738_3297" x1="1.02447" y1="30.2828" x2="3.02137" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1738_3297" x1="59.0081" y1="30.2828" x2="62.0035" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint4_linear_1738_3297" x1="113.98" y1="30.2828" x2="116.976" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint5_linear_1738_3297" x1="168.953" y1="30.2828" x2="171.948" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint6_linear_1738_3297" x1="223.925" y1="30.2828" x2="226.92" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint7_linear_1738_3297" x1="278.898" y1="30.2828" x2="281.893" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint8_linear_1738_3297" x1="333.87" y1="29.3082" x2="336.866" y2="29.3082" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint9_linear_1738_3297" x1="388.843" y1="29.3082" x2="391.838" y2="29.3082" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint10_linear_1738_3297" x1="443.815" y1="31.2584" x2="446.811" y2="31.2584" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint11_linear_1738_3297" x1="498.788" y1="31.2584" x2="501.783" y2="31.2584" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint12_linear_1738_3297" x1="552.761" y1="30.2828" x2="555.756" y2="30.2828" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint13_linear_1738_3297" x1="278.991" y1="41.0906" x2="278.991" y2="46.9366" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
                <linearGradient id="paint14_linear_1738_3297" x1="278.991" y1="13.7811" x2="278.991" y2="19.6271" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="0.5" stopColor="white"/>
                  <stop offset="1" stopColor="#333333"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Controle deslizante para abertura - só exibido se não receber valor externo */}
        {aberturaExterna === undefined && (
          <div className="flex items-center gap-4 mt-4" style={{ zIndex: 10, position: 'relative' }}>
            <span className="text-black font-bold">Aberta</span>
            <input
              type="range"
              min="0"
              max="100"
              value={aberturaInterna}
              onChange={handleAberturaChange}
              className="cursor-pointer"
            />
            <span className="text-black font-bold">Fechada</span>
            <span className="text-black ml-2 font-bold">Abertura: {aberturaInterna}%</span>
          </div>
        )}

      </div>
    </ResponsiveWrapper>
  );
};

export default PortaMontanteRegua;
