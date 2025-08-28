import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Notification as CustomNotification, useNotification } from '@/components/ui/Notification'; 

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email ou usuário é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const { notification, showNotification, hideNotification } = useNotification();

  // Hook para detectar resolução da tela
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Atualiza no carregamento
    updateScreenSize();

    // Escuta mudanças no tamanho da janela
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Função para determinar o breakpoint atual
  const getCurrentBreakpoint = () => {
    const width = screenSize.width;
    if (width >= 2560) return '4K+ (2560px+)';
    if (width >= 2500) return '2500px+ (sua tela!)';
    if (width >= 1920) return '1920px+';
    if (width >= 1700) return '1700px+';
    if (width >= 1440) return '3xl (1440px+)';
    if (width >= 1280) return '2xl (1280px+)';
    if (width >= 1024) return 'xl (1024px+)';
    if (width >= 768) return 'lg (768px+)';
    if (width >= 640) return 'md (640px+)';
    if (width >= 480) return 'sm (480px+)';
    return 'xs (< 480px)';
  };

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const API_URL = window.location.origin.includes('localhost') 
        ? 'http://localhost:1337' 
        : 'https://c009668a8a39.ngrok-free.app';
      
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log('Login response:', result);
      
      if (response.ok && result.jwt) {
        login(result.jwt, result.user);
        navigate('/dashboard');
      } else {
        const errorMsg = result.error?.message || 'Credenciais inválidas';
        showNotification(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      showNotification('Erro interno do servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Notificação */}
      <CustomNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      {/* Debug da Resolução - Canto superior direito */}
      {screenSize.width > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-sm font-mono border border-gray-500">
          <div className="text-green-400 font-bold">🖥️ DEBUG SCREEN</div>
          <div>Resolução: {screenSize.width} x {screenSize.height}</div>
          <div>Breakpoint: <span className="text-yellow-400 font-bold">{getCurrentBreakpoint()}</span></div>
          <div className="text-xs text-gray-400 mt-1">Redimensione para testar</div>
        </div>
      )}

      {/* Fundo azul #131827 - 100% responsivo */}
      <div className="min-h-screen bg-[#131827] flex flex-col items-center justify-center p-4 relative">
        
        {/* Logo EDP no canto superior - Gigante saindo da tela */}
        <div className="absolute top-0 left-0 z-0 overflow-hidden">
          <img 
            src="/Login/EDP_Logo.svg" 
            alt="EDP Logo" 
            className="h-24 w-auto xs:h-32 sm:h-40 md:h-48 lg:h-64 xl:h-72 2xl:h-[40rem] 3xl:h-[36rem] 4xl:h-[60rem] 5xl:h-[120rem] opacity-100 object-contain transform -translate-x-4 -translate-y-4 xs:-translate-x-6 xs:-translate-y-6 sm:-translate-x-8 sm:-translate-y-8 3xl:-translate-x-16 3xl:-translate-y-12 4xl:-translate-x-32 4xl:-translate-y-24 5xl:-translate-x-40 5xl:-translate-y-32"
          />
        </div>

        {/* Seta Login no canto inferior direito - Gigante saindo da tela */}
        <div className="absolute bottom-0 right-0 z-0 overflow-hidden">
          <img 
            src="/Login/Seta_Login.svg" 
            alt="Seta Login" 
            className="h-16 w-auto xs:h-20 sm:h-24 md:h-32 lg:h-40 xl:h-44 2xl:h-[24rem] 3xl:h-[20rem] 4xl:h-[40rem] 5xl:h-[60rem] opacity-100 object-contain transform translate-x-2 translate-y-2 xs:translate-x-3 xs:translate-y-3 sm:translate-x-4 sm:translate-y-4 3xl:translate-x-8 3xl:translate-y-6 4xl:translate-x-16 4xl:translate-y-12 5xl:translate-x-20 5xl:translate-y-16"
          />
        </div>
        
        {/* Formulário moderno - Card com bordas elegantes */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg 2xl:max-w-xl 3xl:max-w-lg relative z-10 px-6 py-8 xs:px-7 xs:py-9 sm:px-8 sm:py-10 md:px-9 md:py-11 lg:px-8 lg:py-10 xl:px-9 xl:py-11 2xl:px-12 2xl:py-14 3xl:px-10 3xl:py-12 border border-white/25 rounded-2xl backdrop-blur-sm font-corporate">
          
          {/* Logo EDP - Dentro do card */}
          <div className="flex justify-center mb-6 xs:mb-7 sm:mb-8 md:mb-9 lg:mb-8 xl:mb-9 2xl:mb-12 3xl:mb-10">
            <img 
              src="/Login/Login_EDP.svg" 
              alt="Login EDP" 
              className="h-10 xs:h-11 sm:h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-24 3xl:h-100 w-auto object-contain filter brightness-110"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 lg:space-y-5 xl:space-y-6 2xl:space-y-8 3xl:space-y-6">
            
            {/* Input Email - Delicado */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-5 3xl:w-5 text-white/80" />
              <input
                {...register('identifier')}
                type="text"
                placeholder="Email ou usuário"
                className="w-full h-10 sm:h-11 md:h-12 lg:h-11 xl:h-12 2xl:h-14 3xl:h-12 pl-10 sm:pl-11 lg:pl-10 xl:pl-11 2xl:pl-12 3xl:pl-11 pr-3 text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg 3xl:text-base font-medium text-white placeholder:text-white/50 placeholder:font-normal bg-transparent border-b-2 border-white/30 focus:border-white/80 focus:outline-none transition-all duration-300"
              />
              {errors.identifier && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.identifier.message}
                </div>
              )}
            </div>

            {/* Input Senha - Delicado */}
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-5 3xl:w-5 text-white/80" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="w-full h-10 sm:h-11 md:h-12 lg:h-11 xl:h-12 2xl:h-14 3xl:h-12 pl-10 sm:pl-11 lg:pl-10 xl:pl-11 2xl:pl-12 3xl:pl-11 pr-10 sm:pr-11 lg:pr-10 xl:pr-11 2xl:pr-12 3xl:pr-11 text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg 3xl:text-base font-medium text-white placeholder:text-white/50 placeholder:font-normal bg-transparent border-b-2 border-white/30 focus:border-white/80 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 transition-opacity"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-5 3xl:w-5" />
                ) : (
                  <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6 3xl:h-5 3xl:w-5" />
                )}
              </button>
              {errors.password && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Botão Login - Delicado */}
            <div className="pt-4 xl:pt-4 2xl:pt-6 3xl:pt-5">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className="w-full h-11 sm:h-12 md:h-13 lg:h-12 xl:h-13 2xl:h-16 3xl:h-14 text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg 3xl:text-base font-semibold bg-[#34F51E] hover:bg-[#2dd419] text-black rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 2xl:space-x-3 3xl:space-x-2 shadow-lg"
              >
                {isLoading ? (
                  <span>Entrando...</span>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRightIcon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 3xl:h-4 3xl:w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Copyright - Dentro do card */}
          <div className="text-center mt-6 sm:mt-7 lg:mt-6 xl:mt-7 2xl:mt-10 3xl:mt-8">
            <p className="text-xs lg:text-xs xl:text-xs 2xl:text-sm 3xl:text-sm text-white/60 font-medium flex items-center justify-center space-x-1 2xl:space-x-1.5 3xl:space-x-1">
              <span>© 2025 Todos os direitos reservados</span>
              <span className="font-bold text-blue-300">EDP Portugal</span>
              <span>®</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
