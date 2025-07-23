import { useCallback } from 'react';

/**
 * Custom hook for toast notifications
 * Uses global window functions set by ToastNotification component
 */
export const useToast = () => {
  const showToast = useCallback((message, type = 'success') => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(message, type);
    } else {
      console.warn('Toast system not initialized. Make sure ToastNotification component is mounted.');
    }
  }, []);

  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  const showWarning = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  const showInfo = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  const clearAllToasts = useCallback(() => {
    if (typeof window !== 'undefined' && window.clearAllToasts) {
      window.clearAllToasts();
    }
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts
  };
};

export default useToast;
