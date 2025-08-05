import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isDarkMode: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDarkMode }) => {
  return (
    <div className={`rounded-xl p-8 text-center transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-100 shadow-lg'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`relative ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div>
          <h3 className={`font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analyzing Signal
          </h3>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Processing features through XGBoost model...
          </p>
        </div>
        
        <div className={`w-full max-w-xs transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        } rounded-full h-1 overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"
            style={{
              animation: 'loadingBar 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;