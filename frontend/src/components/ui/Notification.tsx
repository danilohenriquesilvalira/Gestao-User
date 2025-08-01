import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getColors()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotification = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};

// CSS para animação
const NotificationStyles = () => (
  <style jsx global>{`
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
);

// Exemplo de uso
export const NotificationExample = () => {
  const { notification, showNotification, hideNotification } = useNotification();

  return (
    <div className="p-8 space-y-4">
      <NotificationStyles />
      
      <div className="space-x-4">
        <button 
          onClick={() => showNotification('Credenciais inválidas', 'error')}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Erro
        </button>
        <button 
          onClick={() => showNotification('Login realizado com sucesso!', 'success')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sucesso
        </button>
        <button 
          onClick={() => showNotification('Verificar dados', 'warning')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Aviso
        </button>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};