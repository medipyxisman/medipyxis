import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg space-x-3 z-50 ${
      type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;