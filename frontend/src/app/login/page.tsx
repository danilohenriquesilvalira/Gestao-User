'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // ✅ Removido XMarkIcon e ExclamationTriangleIcon não utilizados
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import Image from 'next/image';

// Importa o componente EdpLogo
import { EdpLogo } from '@/components/ui/LogoAnimado';
import { Notification as CustomNotification, useNotification } from '@/components/ui/Notification'; 

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email ou usuário é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

// Debug Component
function ScreenDebug() {
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getBreakpoint = (width: number) => {
    if (width >= 3840) return '6xl (3840px+)';
    if (width >= 2560) return '5xl (2560px+)';
    if (width >= 1920) return '4xl (1920px+)';
    if (width >= 1440) return '3xl (1440px+)';
    if (width >= 1280) return '2xl (1280px+)';
    if (width >= 1024) return 'xl (1024px+)';
    if (width >= 768) return 'lg (768px+)';
    if (width >= 425) return 'md (425px+)';
    if (width >= 375) return 'sm (375px+)';
    if (width >= 320) return 'xs (320px+)';
    return 'Menor que xs';
  };

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded-lg text-xs font-mono-tech z-50 border border-gray-800">
      <div className="text-tech-600">Resolução: {screenInfo.width} x {screenInfo.height}</div>
      <div className="text-gray-300">Breakpoint: {getBreakpoint(screenInfo.width)}</div>
    </div>
  );
}

// Typing Effect
const TypingEffect = ({ startTyping }: { startTyping: boolean }) => {
  const primaryText = "Gestao das Eclusas de Navegação";
  const secondaryText = "Sistema de Gerenciamento Centralizado";
  const [displayedPrimaryText, setDisplayedPrimaryText] = useState("");
  const [displayedSecondaryText, setDisplayedSecondaryText] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(0);

  useEffect(() => {
    if (!startTyping) return;

    if (primaryIndex < primaryText.length) {
      const timeout = setTimeout(() => {
        setDisplayedPrimaryText((prev) => prev + primaryText.charAt(primaryIndex));
        setPrimaryIndex((prev) => prev + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
    if (primaryIndex === primaryText.length && secondaryIndex < secondaryText.length) {
      const timeout = setTimeout(() => {
        setDisplayedSecondaryText((prev) => prev + secondaryText.charAt(secondaryIndex));
        setSecondaryIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [startTyping, primaryIndex, secondaryIndex, primaryText, secondaryText]);

  return (
    <div className="text-center mt-16 md:mt-20 lg:mt-24 xl:mt-28 2xl:mt-32">
      <span className="inline-block text-edp-neon font-mono-tech text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl whitespace-nowrap overflow-hidden pr-2">
        {displayedPrimaryText}
        {primaryIndex < primaryText.length && (
          <span className="inline-block border-r-2 border-edp-neon animate-typing-cursor-primary"></span>
        )}
      </span>
      {primaryIndex === primaryText.length && (
        <>
          <br />
          <span className="inline-block text-edp-cyan-300 font-tech text-base md:text-lg lg:text-xl whitespace-nowrap overflow-hidden pr-2">
            {displayedSecondaryText}
            <span className="inline-block border-r-2 border-edp-cyan-300 animate-typing-cursor-secondary"></span>
          </span>
        </>
      )}
    </div>
  );
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartTyping(true);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        showNotification('Credenciais inválidas', 'error');
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
      <style jsx global>{`
        @keyframes typing-cursor-primary {
          from { border-right-color: #55FD5B; }
          to { border-right-color: rgba(85, 253, 91, 0); }
        }
        .animate-typing-cursor-primary {
          animation: typing-cursor-primary 0.7s step-end infinite;
        }

        @keyframes typing-cursor-secondary {
          from { border-right-color: #53d3e0; }
          to { border-right-color: rgba(83, 211, 224, 0); }
        }
        .animate-typing-cursor-secondary {
          animation: typing-cursor-secondary 0.7s step-end infinite;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes spin-smooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-smooth 8s linear infinite;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <ScreenDebug />
      
      {/* Notificação */}
      <CustomNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <div className="min-h-screen bg-white flex font-tech">
        
        {/* Left Panel - Dark Rectangle with EDP Logos */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#212E3C] flex-col items-center justify-center p-8 lg:p-20 xl:p-24 bg-gradient-to-br from-[#212E3C] to-[#121A22]">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="flex items-center space-x-8 md:space-x-12 min-w-0">
              {/* Agora o componente EdpLogo é chamado com o efeito de rotação habilitado */}
              <div 
                className="relative h-28 md:h-36 lg:h-44 xl:h-52 2xl:h-64 3xl:h-72 w-auto opacity-0 animate-fadeInUp"
                style={{ animationDelay: '0.3s' }}
              >
                <EdpLogo 
                  width={300}
                  height={300}
                  effect="rotate" // A propriedade 'effect' é definida como 'rotate'
                  animated={true}
                />
              </div>
              {/* Mantendo o Image da letra como foi solicitado */}
              <div 
                className="relative h-24 md:h-32 lg:h-40 xl:h-48 2xl:h-60 3xl:h-68 w-auto opacity-0 animate-fadeInUp"
                style={{ animationDelay: '0.5s' }}
              >
                <Image
                  src="/Letra_EDP.svg"
                  alt="Letra EDP"
                  layout="fill"
                  objectFit="contain"
                  className="!relative !w-auto"
                />
              </div>
            </div>
            
            <TypingEffect startTyping={startTyping} />

            {/* Copyright Section for the left panel */}
            <div className="mt-auto text-center text-gray-400 text-sm md:text-base absolute bottom-4">
              <p className="flex items-center justify-center space-x-1">
                <span>© 2024 Todos os direitos reservados</span>
                <span className="font-bold text-edp-neon">EDP Portugal</span>
                <span className="text-xs">&reg;</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-16 bg-gray-50">
          <div className="w-full max-w-sm 3xl:max-w-md 4xl:max-w-lg 5xl:max-w-xl animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            
            {/* Login Card with Purple Border (ajustado para ser mais fino) */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-purple-600 rounded-2xl p-8 3xl:p-10 4xl:p-12 shadow-2xl shadow-gray-200/50">
              
              {/* Logos no card */}
              <div className="flex flex-col items-center justify-center space-y-4 mb-10">
                <div className="flex items-center space-x-4">
                  <div className="relative h-12 w-auto md:h-14 lg:h-16">
                    <Image 
                      src="/Logo_EDP.svg" 
                      alt="Logo EDP" 
                      layout="fill"
                      objectFit="contain"
                      className="!relative !w-auto"
                    />
                  </div>
                  <div className="relative h-10 w-auto md:h-12 lg:h-14">
                    <Image
                      src="/Letra_Azul_EDP.svg"
                      alt="Letra EDP"
                      layout="fill"
                      objectFit="contain"
                      className="!relative !w-auto"
                    />
                  </div>
                </div>
                <p className="text-gray-700 font-medium text-base 3xl:text-lg text-center mt-4">Sistema de Gerenciamento Centralizado</p>
              </div>

              {/* FORM CORRIGIDO - Volta ao sistema original que funciona */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 3xl:space-y-8 4xl:space-y-10">
                
                {/* Email Field - Voltando ao Input original */}
                <Input
                  {...register('identifier')}
                  label="Email ou Usuário"
                  placeholder="Digite seu email ou usuário"
                  icon={<UserIcon className="h-5 w-5 3xl:h-6 3xl:w-6 text-gray-400" />}
                  error={errors.identifier?.message}
                  className="h-12 3xl:h-14 4xl:h-16 text-base 3xl:text-lg rounded-xl border-gray-200 focus:border-edp-blue focus:ring-4 focus:ring-edp-blue/20 transition-all duration-200"
                />

                {/* Password Field - Voltando ao Input original */}
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  placeholder="Digite sua senha"
                  icon={<LockClosedIcon className="h-5 w-5 3xl:h-6 3xl:w-6 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 3xl:h-6 3xl:w-6" />
                      ) : (
                        <EyeIcon className="h-5 w-5 3xl:h-6 3xl:w-6" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  className="h-12 3xl:h-14 4xl:h-16 text-base 3xl:text-lg rounded-xl border-gray-200 focus:border-edp-blue focus:ring-4 focus:ring-edp-blue/20 transition-all duration-200"
                />

                {/* Options */}
                <div className="flex items-center justify-between pt-1">
                  <Checkbox 
                    label="Lembrar-me" 
                    className="text-sm 3xl:text-base text-gray-600" 
                  />
                  <button type="button" className="text-sm 3xl:text-base text-gray-600 hover:text-edp-blue font-medium transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  variant="default"
                  size="lg"
                  className="w-full h-12 text-base font-bold rounded-xl mt-6 bg-edp-green-600 hover:bg-edp-green-700 shadow-md shadow-edp-green-600/20 hover:shadow-lg hover:shadow-edp-green-600/30 transition-all duration-200"
                  icon={!isLoading && <ArrowRightIcon className="h-4 w-4" />}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}