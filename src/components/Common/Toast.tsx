import React, { useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: FaCheck,
      bg: '#d4edda',
      color: '#155724',
      border: '#c3e6cb',
    },
    error: {
      icon: FaTimes,
      bg: '#f8d7da',
      color: '#721c24',
      border: '#f5c6cb',
    },
    warning: {
      icon: FaExclamationTriangle,
      bg: '#fff3cd',
      color: '#856404',
      border: '#ffeaa7',
    },
    info: {
      icon: FaInfoCircle,
      bg: '#d1ecf1',
      color: '#0c5460',
      border: '#bee5eb',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className="fixed top-4 right-4 z-50 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon className="flex-shrink-0 mt-0.5" size={18} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

export default Toast;

