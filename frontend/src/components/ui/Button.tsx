// src/components/ui/Button.tsx
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'md', loading, icon, className, ...props }, ref) => {
    const variants = {
      default: [
        'bg-primary-600 text-white shadow-sm',
        'hover:bg-primary-700 hover:shadow-md',
        'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        'active:bg-primary-800 active:scale-[0.98]'
      ].join(' '),
      
      secondary: [
        'bg-gray-100 text-gray-900 shadow-sm border border-gray-200',
        'hover:bg-gray-200 hover:shadow-md',
        'focus:ring-2 focus:ring-gray-500/20',
        'active:bg-gray-300 active:scale-[0.98]'
      ].join(' '),
      
      outline: [
        'border border-gray-300 bg-white text-gray-700 shadow-sm',
        'hover:bg-gray-50 hover:border-gray-400 hover:shadow-md',
        'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        'active:bg-gray-100 active:scale-[0.98]'
      ].join(' '),
      
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100',
        'focus:ring-2 focus:ring-gray-500/20',
        'active:bg-gray-200 active:scale-[0.98]'
      ].join(' ')
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
      md: 'px-4 py-2 text-sm font-medium rounded-lg',
      lg: 'px-6 py-2.5 text-base font-medium rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'transition-all duration-150 ease-in-out',
          'focus:outline-none focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'select-none relative overflow-hidden',
          
          // Variants e sizes
          variants[variant],
          sizes[size],
          
          // Loading state
          loading && 'pointer-events-none',
          
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Content wrapper with opacity for loading */}
        <div className={cn(
          'flex items-center gap-2',
          loading && 'opacity-0'
        )}>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </div>
        
        {/* Ripple effect overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';