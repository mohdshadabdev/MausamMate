import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <AlertTriangle size={48} className="text-red-400 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
      <p className="text-white/70 mb-6 text-center max-w-md">{message}</p>
      <button 
        onClick={onRetry}
        className="px-6 py-3 bg-white/15 hover:bg-white/25 rounded-lg transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;