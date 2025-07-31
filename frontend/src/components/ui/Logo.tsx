// src/components/ui/Logo.tsx
import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  fill?: string
}

export const Logo: React.FC<LogoProps> = ({ 
  width = 21, 
  height = 21, 
  className = "",
  fill = "currentColor" 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 21 21" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M8.86989 1H7.03427C7.03427 2.15566 7.03427 2.8329 7.03427 3.98856M8.86989 1H10.7449M8.86989 1V3.95926M8.86989 17.2524V3.95926M7.03427 17.2524C7.03427 12.092 7.03427 9.14899 7.03427 3.98856M7.03427 3.98856L2.80469 3.95926C2.80469 9.94354 2.80469 13.2987 2.80469 19.283V19.7517M8.86989 3.95926L11.0086 3.98856" 
        stroke={fill}
        strokeWidth="1"
      />
      <path 
        d="M11.0156 16.7668C14.5432 16.7668 17.4029 13.9071 17.4029 10.3795C17.4029 6.85189 14.5432 3.99219 11.0156 3.99219" 
        stroke={fill}
        strokeWidth="1"
      />
      <path 
        d="M10.7483 1H11.012C16.1902 1 20.3879 5.19772 20.3879 10.3759C20.3879 15.554 16.1902 19.7517 11.012 19.7517H2.80812H1V3.5438" 
        stroke={fill}
        strokeWidth="1"
      />
    </svg>
  )
}

// src/lib/constants.ts
export const PROJECT_CONFIG = {
  name: "IndustrialBackup Server",
  shortName: "IBS",
  description: "Servidor seguro de backup industrial para PLC, HMI, inversores e sistemas supervisórios",
  version: "1.0.0",
  author: "Danilo",
  
  // URLs
  urls: {
    local: "http://localhost:3000",
    tailscale: "http://100.77.52.45:3000",
    api: {
      local: "http://localhost:1337",
      tailscale: "http://100.77.52.45:1337"
    }
  },
  
  // Características do sistema
  features: [
    "Backup seguro de PLC",
    "Backup de inversores e drivers", 
    "Backup de HMI e supervisórios",
    "Controle de acesso industrial",
    "Monitoramento inteligente",
    "Compartilhamento seguro"
  ],
  
  // Segurança
  security: {
    encryption: true,
    privateFiles: true,
    accessControl: true,
    monitoring: true
  }
}

// public/logo.svg
export const logoSvg = `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.86989 1H7.03427C7.03427 2.15566 7.03427 2.8329 7.03427 3.98856M8.86989 1H10.7449M8.86989 1V3.95926M8.86989 17.2524V3.95926M7.03427 17.2524C7.03427 12.092 7.03427 9.14899 7.03427 3.98856M7.03427 3.98856L2.80469 3.95926C2.80469 9.94354 2.80469 13.2987 2.80469 19.283V19.7517M8.86989 3.95926L11.0086 3.98856" stroke="black"/>
<path d="M11.0156 16.7668C14.5432 16.7668 17.4029 13.9071 17.4029 10.3795C17.4029 6.85189 14.5432 3.99219 11.0156 3.99219" stroke="black"/>
<path d="M10.7483 1H11.012C16.1902 1 20.3879 5.19772 20.3879 10.3759C20.3879 15.554 16.1902 19.7517 11.012 19.7517H2.80812H1V3.5438" stroke="black"/>
</svg>`