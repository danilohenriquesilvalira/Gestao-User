// src/components/ui/Checkbox.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded',
            'transition-colors duration-200',
            className
          )}
          {...props}
        />
        {label && (
          <span className="ml-2 text-sm text-gray-700">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';