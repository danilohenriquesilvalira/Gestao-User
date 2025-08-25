import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// 1. Definir os tipos de item de navegação
type NavItem = 'dashboard' | 'eclusa' | 'enchimento' | 'porta_jusante' | 'porta_montante' | 'configuracoes' | 'usuarios' | 'tags_admin';

export default function ModernSidebar() {
  const { isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  // 2. Usar o tipo 'NavItem' para o estado 'activeItem'
  const [activeItem, setActiveItem] = useState<NavItem>('dashboard');

  // Detectar a página atual automaticamente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;

      if (pathname === '/dashboard' || pathname === '/') {
        setActiveItem('dashboard');
      } else if (pathname === '/eclusa' || pathname === '/caldeira-eclusa') {
        setActiveItem('eclusa');
      } else if (pathname === '/porta_jusante') {
        setActiveItem('porta_jusante');
      } else if (pathname === '/porta_montante') {
        setActiveItem('porta_montante');
      } else if (pathname === '/enchimento') {
        setActiveItem('enchimento');
      } else if (pathname === '/configuracoes') {
        setActiveItem('configuracoes');
      } else if (pathname === '/usuarios') {
        setActiveItem('usuarios');
      } else if (pathname === '/tags-admin') {
        setActiveItem('tags_admin');
      } else {
        // Para outras páginas, considerar como 'dashboard'
        setActiveItem('dashboard');
      }
    }
  }, []);

  // 3. Tipar o parâmetro 'itemId' com 'NavItem'
  const handleItemClick = (itemId: NavItem) => {
    setActiveItem(itemId);
    console.log(`Navegando para: ${itemId}`);

    // Navegação corrigida
    if (typeof window !== 'undefined') {
      switch (itemId) {
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'eclusa':
          window.location.href = '/caldeira-eclusa';
          break;
        case 'configuracoes':
          window.location.href = '/configuracoes';
          break;
        case 'porta_jusante':
          window.location.href = '/porta_jusante';
          break;
        case 'porta_montante':
          window.location.href = '/porta_montante';
          break;
        case 'enchimento':
          window.location.href = '/enchimento';
          break;
        case 'usuarios':
          window.location.href = '/usuarios';
          break;
        case 'tags_admin':
          window.location.href = '/tags-admin';
          break;
        default:
          console.log(`Navegação não implementada para: ${itemId}`);
      }
    }
  };

  // 4. Tipar o parâmetro 'itemId' com 'NavItem'
  const getIconColor = (itemId: NavItem) => {
    return activeItem === itemId ? '#3CFF01' : 'white';
  };

  return (
    <div
      className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 hidden md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container principal */}
      <div className={`relative transition-all duration-300 ease-out ${
        isHovered ? 'translate-x-0' : '-translate-x-[52px]'
      }`}>
        
        {/* 3 Traços quando recuado */}
        <div className={`absolute left-[36px] top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-7 h-1 bg-green-400 rounded-full shadow-md"></div>
          <div className="w-7 h-1 bg-cyan-400 rounded-full shadow-md"></div>
          <div className="w-7 h-1 bg-purple-400 rounded-full shadow-md"></div>
        </div>

        {/* SVG Container */}
        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} drop-shadow-lg`}>
          <svg width="88" height="620" viewBox="0 0 88 620" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.175 52C15.543 44 2.878 14 0 0V310H88V94C88 67 70.867 59.6 43.175 52Z" fill="#131827"/>
            <path d="M43.175 568C15.543 576 2.878 606 0 620V310H88V526C88 553 70.867 560.4 43.175 568Z" fill="#131827"/>
          </svg>

          {/* Navigation Icons */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 py-12">
            
            {/* Dashboard Principal */}
            <button 
              className="p-3 hover:scale-110 transition-all duration-200 cursor-pointer"
              onClick={() => handleItemClick('dashboard')}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" 
                  fill={getIconColor('dashboard')} 
                />
              </svg>
            </button>

            {/* Caldeira Eclusa */}
            <button 
              className="p-2 hover:scale-110 transition-all duration-200 cursor-pointer"
              onClick={() => handleItemClick('eclusa')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.46932 6.09748V3.65757H5.5561L5.00673 6.13799C5.00371 6.15824 4.99968 6.1773 4.99363 6.19517L1.78011 20.7215C2.28612 21.1492 2.87784 21.3731 3.47458 21.391C4.1681 21.4125 4.86865 21.1527 5.44525 20.613C6.02788 20.0031 6.73953 19.6552 7.46935 19.5742V6.09645L7.46932 6.09748ZM6.42099 1.41652C6.27886 1.41652 6.16294 1.27951 6.16294 1.11153C6.16294 0.943549 6.27886 0.806542 6.42099 0.806542H7.32618V0.304989C7.32618 0.137007 7.4421 0 7.58423 0C7.72636 0 7.84229 0.137007 7.84229 0.304989V0.806542H9.53273V0.304989C9.53273 0.137007 9.64865 0 9.79078 0C9.93291 0 10.0488 0.137007 10.0488 0.304989V0.806542H11.7393V0.304989C11.7393 0.137007 11.8552 0 11.9973 0C12.1395 0 12.2554 0.137007 12.2554 0.304989V0.806542H13.9458V0.304989C13.9458 0.137007 14.0618 0 14.2039 0C14.346 0 14.4619 0.137007 14.4619 0.304989V0.806542H16.1524V0.304989C16.1524 0.137007 16.2683 0 16.4104 0C16.5526 0 16.6685 0.137007 16.6685 0.304989V0.806542H17.5737C17.7158 0.806542 17.8317 0.943549 17.8317 1.11153C17.8317 1.27951 17.7158 1.41652 17.5737 1.41652H16.6685V2.74133C16.6685 2.90931 16.5526 3.04632 16.4104 3.04632H7.58222C7.44009 3.04632 7.32417 2.90931 7.32417 2.74133V1.41652H6.41897H6.42099ZM16.1544 1.41652H14.464V2.43634H16.1544V1.41652ZM13.9479 1.41652H12.2575V2.43634H13.9479V1.41652ZM11.7413 1.41652H10.0509V2.43634H11.7413V1.41652ZM9.5348 1.41652H7.84435V2.43634H9.5348V1.41652ZM16.0124 3.65748H7.98752V5.78408H16.0134V3.65748H16.0124ZM13.0851 8.75171C13.2665 8.96496 13.4802 9.13532 13.7121 9.25564C13.9721 9.39026 14.2574 9.46294 14.5487 9.46294C14.84 9.46294 15.1253 9.39026 15.3854 9.25564C15.6172 9.13531 15.8309 8.96376 16.0124 8.75171V6.39518H13.085L13.0851 8.75171ZM16.0124 9.538C15.8794 9.64522 15.7392 9.73815 15.5931 9.81439C15.2675 9.98357 14.9117 10.0753 14.5488 10.0753C14.1859 10.0753 13.83 9.98476 13.5045 9.81439C13.3583 9.73815 13.2182 9.64522 13.0851 9.538V21.1858C13.3936 21.056 13.6879 20.8653 13.9561 20.614C14.5468 19.9957 15.2705 19.6466 16.0114 19.5715V9.538H16.0124ZM7.98752 8.75171C8.16896 8.96496 8.38265 9.13532 8.61451 9.25564C8.87457 9.39145 9.15985 9.46294 9.45116 9.46294C9.74248 9.46294 10.0278 9.39026 10.2878 9.25564C10.5197 9.13412 10.7334 8.96376 10.9148 8.75171V6.39518H7.98747L7.98752 8.75171ZM10.9149 9.53681C10.7818 9.64403 10.6417 9.73696 10.4955 9.8132C10.1689 9.98238 9.81411 10.0741 9.45121 10.0741C9.08832 10.0741 8.73249 9.98357 8.4069 9.8132C8.26074 9.73696 8.12062 9.64522 7.98757 9.53681V19.5609C8.71233 19.6038 9.43003 19.9075 10.0379 20.4818C10.307 20.7629 10.6024 20.9774 10.9148 21.1275L10.9149 9.53681ZM0.00106837 22.2451C0.238961 22.3011 0.474826 22.3868 0.701628 22.5024C0.989923 22.6477 1.26712 22.8431 1.52819 23.0898C2.08765 23.6747 2.78016 23.9785 3.47669 23.9988C4.17021 24.0202 4.87077 23.7617 5.44736 23.2208C6.09551 22.5417 6.90393 22.1879 7.71943 22.1641C8.53389 22.1403 9.35646 22.4452 10.0379 23.0886C10.5973 23.6735 11.2898 23.9773 11.9864 23.9976C12.6799 24.019 13.3804 23.7605 13.957 23.2196C14.6052 22.5417 15.4136 22.1867 16.2291 22.1629C17.0436 22.1391 17.8661 22.444 18.5475 23.0874C19.107 23.6723 19.7995 23.9761 20.496 23.9964C21.1896 24.0178 21.8901 23.7593 22.4667 23.2184C22.7177 22.9563 22.9929 22.7407 23.2812 22.5763C23.512 22.444 23.7529 22.3428 23.9989 22.2737V20.2948C23.8295 20.3508 23.6642 20.4247 23.5049 20.5164C23.258 20.657 23.0231 20.8404 22.8033 21.0704L22.6683 21.1919C22.0171 21.7518 21.247 22.0187 20.4839 21.9961C19.6684 21.9722 18.86 21.6172 18.2118 20.9393C17.6504 20.4127 16.972 20.1542 16.2462 20.1614C15.5446 20.1828 14.8521 20.4854 14.2927 21.0716C13.6113 21.7161 12.7887 22.0211 11.9742 21.9973C11.1587 21.9735 10.3503 21.6184 9.70216 20.9406C9.13264 20.4068 8.44214 20.1483 7.7214 20.1638C7.02286 20.1888 6.33739 20.4926 5.78299 21.0728C5.10158 21.7173 4.27904 22.0223 3.46355 21.9985C2.71055 21.9759 1.96362 21.6721 1.3205 21.0704C1.27514 21.0263 1.23281 20.9846 1.19148 20.9418C0.97677 20.7404 0.742906 20.5772 0.497963 20.4533C0.335671 20.3711 0.169359 20.3067 0 20.2591V22.2451L0.00106837 22.2451ZM1.34072 20.3151L4.42031 6.39387H0.00117161V19.6371C0.239065 19.6943 0.474929 19.78 0.700725 19.8944C0.92148 20.0064 1.13619 20.147 1.34082 20.3162L1.34072 20.3151ZM24 19.6693V6.39411H19.5809L22.6806 20.4068C22.8701 20.2364 23.0727 20.0911 23.2824 19.972C23.5132 19.8397 23.7541 19.7384 24 19.6693ZM22.238 20.8095L19.0054 6.19505C18.9993 6.17718 18.9953 6.15812 18.9923 6.13786L18.4429 3.65626H16.5297V19.562C17.2444 19.6121 17.95 19.9159 18.5487 20.4806C19.1082 21.0655 19.8007 21.3693 20.4972 21.3908C21.101 21.4086 21.7109 21.2156 22.2381 20.8082L22.238 20.8095ZM12.5701 21.3432V6.3939H11.431V21.3145C11.6145 21.3598 11.8 21.386 11.9864 21.392C12.181 21.3979 12.3765 21.3825 12.569 21.3431L12.5701 21.3432Z" 
                  fill={getIconColor('eclusa')} 
                />
              </svg>
            </button>

            {/* Enchimento */}
            <button 
              className="p-2 hover:scale-110 transition-all duration-200"
              onClick={() => handleItemClick('enchimento')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M197.016 64.3825H375.388C377.947 64.3825 380.507 63.0425 381.787 61.1543C383.127 59.2051 383.127 54.0888 383.127 54.0888L366.978 5.7864C365.698 1.94912 362.529 0 359.3 0H213.109C209.27 0 206.649 2.55818 205.37 5.7864L189.283 54.0888C188.673 56.6469 189.283 59.2051 190.563 61.1543C191.842 63.0424 197.016 64.3825 197.016 64.3825ZM133.275 171.827H466.791V172.437C470.021 172.437 472.58 171.157 473.921 168.599C475.2 165.98 473.921 160.864 473.921 160.864L451.374 117.74C450.094 115.182 444.305 113.232 444.305 113.232H148.089C144.25 113.232 141.629 115.182 140.35 118.41L125.542 161.534C124.932 163.422 125.542 166.65 126.821 168.599C128.101 170.487 133.275 171.827 133.275 171.827ZM466.183 362.966C473.251 368.752 482.269 371.311 490.619 371.311V372.59C499.637 372.59 508.047 369.362 514.445 364.245L523.464 357.789C553.079 335.252 596.224 334.643 627.79 356.51C631.019 359.068 636.138 358.459 638.698 355.231L736.625 234.872C738.514 232.922 739.184 229.085 737.904 226.527C736.625 223.908 730.775 222.019 730.775 222.019H67.58C64.3503 222.019 61.7909 223.908 60.5112 225.857C59.2315 227.806 60.5112 233.592 60.5112 233.592L138.39 368.082C139.731 370.031 142.9 371.919 145.52 371.919C155.148 372.589 164.167 370.031 171.906 363.574L180.255 357.118C211.151 333.972 254.966 333.972 286.531 357.118L294.88 362.965C308.408 373.868 328.395 373.868 343.204 362.965L351.553 356.509C383.118 333.363 426.872 333.363 457.768 356.509L466.183 362.966ZM7.74333 529H831.261C835.1 529 839 525.833 839 521.325V422.163C839 418.326 835.77 414.489 831.931 414.489C829.311 413.819 823.522 411.87 823.522 411.87L773.308 386.774C759.78 379.709 744.301 380.988 731.443 390.002L716.026 401.575C685.069 425.391 641.315 425.391 609.75 401.575L600.731 395.18C586.593 384.886 566.606 384.886 553.077 395.18L544.059 401.575C512.554 425.391 468.739 425.391 437.843 401.575L429.494 395.18C414.686 384.886 395.369 384.886 381.17 395.18L372.821 401.575C341.925 425.391 298.11 425.391 266.545 401.575L257.526 395.18C243.998 384.216 224.072 384.886 209.262 395.18L200.914 401.575C169.957 425.391 126.203 425.391 94.6377 401.575L85.6189 395.18C72.0906 384.886 51.4936 384.886 37.9651 395.18L3.22972 420.883C1.27969 422.162 0 427.34 0 427.34V521.323C0 525.161 3.23394 529 7.74333 529Z" 
                fill={getIconColor('enchimento')}
                transform="scale(0.04) translate(-20, -20)" 
              />
            </svg>
            </button>

            {/* Porta Jusante */}
            <button 
              className="p-2 hover:scale-110 transition-all duration-200"
              onClick={() => handleItemClick('porta_jusante')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 2L5.5 22L18.5 22L18.5 2L5.5 2Z" fill={getIconColor('porta_jusante')} />
                <path d="M5.5 2L5.5 22L18.5 22L18.5 2L5.5 2Z" stroke={getIconColor('porta_jusante')} strokeWidth="1" />
                <circle cx="9.5" cy="6.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
                <circle cx="14.5" cy="6.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
                <circle cx="9.5" cy="12.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
                <circle cx="14.5" cy="12.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
                <circle cx="9.5" cy="18.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
                <circle cx="14.5" cy="18.5" r="1.5" fill="black" stroke="white" strokeWidth="0.5" />
              </svg>
            </button>

            {/* Porta Montante */}
            <button 
              className="p-2 hover:scale-110 transition-all duration-200"
              onClick={() => handleItemClick('porta_montante')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Contorno principal */}
                <rect x="2" y="2" width="20" height="20" fill={getIconColor('porta_montante')} stroke={getIconColor('porta_montante')} strokeWidth="1"/>
                
                {/* Barra superior */}
                <rect x="2" y="2" width="20" height="3" fill="#4D4D4D"/>
                
                {/* Grid 3x3 de painéis */}
                <rect x="3" y="6" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="9.5" y="6" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="16" y="6" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                
                <rect x="3" y="11" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="9.5" y="11" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="16" y="11" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                
                <rect x="3" y="16" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="9.5" y="16" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
                <rect x="16" y="16" width="5" height="4" fill="#4D4D4D" stroke="white" strokeWidth="0.5"/>
              </svg>
            </button>

            {/* Usuários */}
            <div className="mt-8">
              <button 
                className="p-2 hover:scale-110 transition-all duration-200"
                onClick={() => handleItemClick('usuarios')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.592 15.2031C13.281 15.2031 16.434 15.7621 16.434 17.9951C16.434 20.2281 13.302 20.8031 9.592 20.8031C5.902 20.8031 2.75 20.2491 2.75 18.0151C2.75 15.7811 5.881 15.2031 9.592 15.2031Z" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.59303 12.02C7.17103 12.02 5.20703 10.057 5.20703 7.635C5.20703 5.213 7.17103 3.25 9.59303 3.25C12.014 3.25 13.978 5.213 13.978 7.635C13.987 10.048 12.037 12.011 9.62403 12.02H9.59303Z" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.4844 10.8852C18.0854 10.6602 19.3184 9.28619 19.3214 7.62319C19.3214 5.98419 18.1264 4.62419 16.5594 4.36719" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5977 14.7344C20.1487 14.9654 21.2317 15.5094 21.2317 16.6294C21.2317 17.4004 20.7217 17.9004 19.8977 18.2134" stroke={getIconColor('usuarios')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Tags Admin - PLC Tags (Apenas Admin) */}
            {isAdmin() && (
              <div className="flex justify-center mb-4" title="Tags Admin - PLC">
                <button 
                  className="p-2 hover:scale-110 transition-all duration-200"
                  onClick={() => handleItemClick('tags_admin')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke={getIconColor('tags_admin')} strokeWidth="1.5"/>
                    <path d="M7 8h10M7 12h8M7 16h6" stroke={getIconColor('tags_admin')} strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="18" cy="8" r="1.5" fill={getIconColor('tags_admin')} opacity="0.6"/>
                    <circle cx="18" cy="12" r="1.5" fill={getIconColor('tags_admin')} opacity="0.8"/>
                    <circle cx="18" cy="16" r="1.5" fill={getIconColor('tags_admin')}/>
                    <path d="M3 4L21 20" stroke={getIconColor('tags_admin')} strokeWidth="0.5" opacity="0.3"/>
                  </svg>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}