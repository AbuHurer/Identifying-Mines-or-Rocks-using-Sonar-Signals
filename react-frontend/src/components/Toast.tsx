import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
  isDarkMode: boolean;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose, isDarkMode }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = toast.type === 'success';

  return (
    <div 
      className={`flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 opacity-100 min-w-80 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}
      style={{ 
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div className={`flex-shrink-0 ${
        isSuccess 
          ? 'text-green-500' 
          : 'text-red-500'
      }`}>
        {isSuccess ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>
      
      <div className="ml-3 flex-1">
        <p className={`text-sm font-medium transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {toast.message}
        </p>
      </div>
      
      <button
        onClick={onClose}
        className={`ml-4 flex-shrink-0 rounded-md p-1 transition-colors duration-200 ${
          isDarkMode 
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;