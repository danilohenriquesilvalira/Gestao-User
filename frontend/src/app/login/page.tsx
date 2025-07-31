'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Checkbox } from '@/components/ui/Checkbox';
import VSCodeSimulator from '@/components/VSCodeSimulator';

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        alert('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScreenDebug />
      
      <div className="min-h-screen bg-white flex font-tech">
        
        {/* Left Panel - Full VS Code */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <VSCodeSimulator />
        </div>

        {/* Right Panel - Logo + Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-16 bg-gray-50">
          <div className="w-full max-w-sm 3xl:max-w-md 4xl:max-w-lg 5xl:max-w-xl">
            
            {/* Logo Centralizado e aumentado */}
            <div className="text-center mb-6 3xl:mb-8 4xl:mb-10 5xl:mb-12">
              <Logo 
                size="xl" 
                className="w-full h-auto mx-auto" 
              />
            </div>

            {/* Login Card - Melhorado */}
            <div className="bg-white border border-gray-100 rounded-2xl 3xl:rounded-3xl p-8 3xl:p-10 4xl:p-12 5xl:p-14 shadow-xl shadow-gray-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/70">
              <div className="space-y-6 3xl:space-y-6 4xl:space-y-8 5xl:space-y-10">
                
                {/* Email Field */}
                <div>
                  <Input
                    {...register('identifier')}
                    label="Email ou Usuário"
                    placeholder="Digite seu email ou usuário"
                    icon={<UserIcon className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 text-gray-400" />}
                    error={errors.identifier?.message}
                    className="h-12 3xl:h-14 4xl:h-16 5xl:h-18 text-base 3xl:text-lg 4xl:text-xl border-gray-200 focus:border-tech-500 focus:ring-tech-500/20 transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    label="Senha"
                    placeholder="Digite sua senha"
                    icon={<LockClosedIcon className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 text-gray-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7" />
                        ) : (
                          <EyeIcon className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7" />
                        )}
                      </button>
                    }
                    error={errors.password?.message}
                    className="h-12 3xl:h-14 4xl:h-16 5xl:h-18 text-base 3xl:text-lg 4xl:text-xl border-gray-200 focus:border-tech-500 focus:ring-tech-500/20 transition-all duration-200"
                  />
                </div>

                {/* Options */}
                <div className="flex items-center justify-between pt-1">
                  <Checkbox 
                    label="Lembrar-me" 
                    className="text-sm 3xl:text-base 4xl:text-lg text-gray-600" 
                  />
                  <button className="text-sm 3xl:text-base 4xl:text-lg text-tech-600 hover:text-tech-700 font-medium transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit(onSubmit)}
                  loading={isLoading}
                  variant="default"
                  size="lg"
                  className="w-full h-12 3xl:h-14 4xl:h-16 5xl:h-18 text-lg 3xl:text-lg 4xl:text-xl 5xl:text-2xl mt-8 shadow-md shadow-tech-500/20 hover:shadow-lg hover:shadow-tech-500/30 transition-all duration-200"
                  icon={!isLoading && <ArrowRightIcon className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7" />}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 xs:mt-10 sm:mt-12 space-y-4 3xl:space-y-4 4xl:space-y-6 5xl:space-y-8">
              <p className="text-sm 3xl:text-base 4xl:text-lg text-gray-500">
                Não tem acesso?{' '}
                <button className="text-gray-500 hover:text-tech-600 font-medium transition-colors underline decoration-1 underline-offset-2">
                  Solicitar credenciais
                </button>
              </p>
              
              <div className="flex items-center justify-center text-xs 3xl:text-sm 4xl:text-base text-gray-400">
                <ShieldCheckIcon className="h-4 w-4 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 mr-1.5 text-green-500" />
                <span className="font-mono-tech">SSL/TLS 256-bit</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}