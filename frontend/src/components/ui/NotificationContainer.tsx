
import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-6 right-6 z-[10000] space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            pointer-events-auto transform transition-all duration-300 ease-out
            animate-in slide-in-from-right-full
            min-w-[400px] max-w-[500px] p-4 rounded-xl shadow-2xl backdrop-blur-sm
            ${notification.type === 'success' ? 'bg-green-500/90 text-white border border-green-400/30' : ''}
            ${notification.type === 'error' ? 'bg-red-500/90 text-white border border-red-400/30' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-500/90 text-white border border-yellow-400/30' : ''}
            ${notification.type === 'info' ? 'bg-blue-500/90 text-white border border-blue-400/30' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-6 h-6 mt-0.5">
              {notification.type === 'success' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              )}
              {notification.type === 'info' && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-5">{notification.title}</h4>
              <p className="text-sm opacity-90 mt-1 leading-4">{notification.message}</p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
