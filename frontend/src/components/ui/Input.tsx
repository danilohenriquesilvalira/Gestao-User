// src/components/ui/Input.tsx
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "transition-all duration-200",
              icon && "pl-10",
              rightIcon && "pr-12",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';