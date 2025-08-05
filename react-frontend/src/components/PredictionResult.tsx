import React from 'react';
import { TrendingUp, Shield, Clock } from 'lucide-react';
import type { PredictionData } from '../app';

interface PredictionResultProps {
  prediction: PredictionData;
  isDarkMode: boolean;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, isDarkMode }) => {
  const isRock = prediction.prediction === 'Rock';
  const confidencePercentage = (prediction.confidence * 100).toFixed(1);
  
  return (
    <div className={`rounded-xl p-6 transition-all duration-500 animate-pulse ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-100 shadow-lg'
    }`} style={{ animation: 'slideIn 0.5s ease-out' }}>
      <div className="text-center space-y-4">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
          isRock 
            ? isDarkMode ? 'bg-green-900/30 border-2 border-green-600' : 'bg-green-100 border-2 border-green-500'
            : isDarkMode ? 'bg-red-900/30 border-2 border-red-600' : 'bg-red-100 border-2 border-red-500'
        }`}>
          {isRock ? '🪨' : '💣'}
        </div>
        
        <div>
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {prediction.prediction}
          </h3>
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
            isRock 
              ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
              : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
          }`}>
            <Shield className="h-4 w-4" />
            <span>{confidencePercentage}% confidence</span>
          </div>
        </div>

        <div className={`space-y-3 pt-4 border-t transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Confidence Score
              </span>
            </div>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {confidencePercentage}%
            </span>
          </div>
          
          <div className={`w-full bg-gray-200 rounded-full h-2 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                isRock ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Clock className={`h-3 w-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {new Date(prediction.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isRock 
                ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
            }`}>
              {isRock ? 'Safe' : 'Danger'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;