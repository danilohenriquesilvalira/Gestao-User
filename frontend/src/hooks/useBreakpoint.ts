// hooks/useBreakpoint.ts
'use client';
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('lg');
  
  useEffect(() => {
    const getBreakpoint = (width: number): string => {
      if (width >= 1920) return '4xl';
      if (width >= 1440) return '3xl';  
      if (width >= 1280) return '2xl';
      if (width >= 1024) return 'xl';
      if (width >= 768) return 'lg';
      if (width >= 425) return 'md';
      if (width >= 375) return 'sm';
      return 'xs';
    };
    
    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};