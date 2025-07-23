import React, { useState, useCallback } from 'react';
import { CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ToastNotification = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random(); // Ensure unique ID
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id) => {
    // Add fade-out animation before removing
    const element = document.querySelector(`[data-toast-id="${id}"]`);
    if (element) {
      element.classList.add('animate-slideOutRight');
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    } else {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Expose functions to global scope for easy access
  React.useEffect(() => {
    window.showToast = showToast;
    window.clearAllToasts = clearAllToasts;
    
    return () => {
      delete window.showToast;
      delete window.clearAllToasts;
    };
  }, [showToast, clearAllToasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          data-toast-id={toast.id}
          className={`relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm transform transition-all duration-500 ease-out animate-slideInRight ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
              : toast.type === 'error' 
              ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
              : toast.type === 'warning'
              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
          }`}
          style={{
            boxShadow: toast.type === 'success' 
              ? '0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04)'
              : toast.type === 'error' 
              ? '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)'
              : toast.type === 'warning'
              ? '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)'
              : '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)'
          }}
        >
          {/* Progress Bar */}
          <div className={`absolute bottom-0 left-0 h-1 animate-pulse ${
            toast.type === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
            : toast.type === 'error' ? 'bg-gradient-to-r from-red-400 to-rose-500'
            : toast.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
            : 'bg-gradient-to-r from-blue-400 to-indigo-500'
          }`} 
          style={{
            width: '100%',
            animation: 'progress-bar 6s linear forwards'
          }} />
          
          {/* Accent Bar */}
          <div className={`absolute top-0 left-0 w-full h-1 ${
            toast.type === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
            : toast.type === 'error' ? 'bg-gradient-to-r from-red-400 to-rose-500'
            : toast.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
            : 'bg-gradient-to-r from-blue-400 to-indigo-500'
          }`} />
          
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon with background */}
              <div className={`flex-shrink-0 p-1.5 rounded-full ${
                toast.type === 'success' ? 'bg-green-100' 
                : toast.type === 'error' ? 'bg-red-100'
                : toast.type === 'warning' ? 'bg-yellow-100'
                : 'bg-blue-100'
              }`}>
                {toast.type === 'success' && (
                  <CheckIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                )}
                {toast.type === 'error' && (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
                )}
                {toast.type === 'warning' && (
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                )}
                {toast.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 20 20">
                    <path fill="currentColor" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-relaxed ${
                  toast.type === 'success' ? 'text-green-800' 
                  : toast.type === 'error' ? 'text-red-800'
                  : toast.type === 'warning' ? 'text-yellow-800'
                  : 'text-blue-800'
                }`}>
                  {toast.message}
                </p>
              </div>
              
              {/* Close Button */}
              <button
                className={`flex-shrink-0 p-1.5 rounded-full transition-colors duration-200 ${
                  toast.type === 'success' ? 'text-green-400 hover:text-green-600 hover:bg-green-100' 
                  : toast.type === 'error' ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                  : toast.type === 'warning' ? 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100'
                  : 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => removeToast(toast.id)}
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
