import React, { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { SonarFeatures } from '../app';

interface FeatureFormProps {
  onSubmit: (features: SonarFeatures) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

const FeatureForm: React.FC<FeatureFormProps> = ({ onSubmit, isLoading, isDarkMode }) => {
  const [features, setFeatures] = useState<SonarFeatures>(() => {
    const initialFeatures: SonarFeatures = {};
    for (let i = 1; i <= 60; i++) {
      initialFeatures[`feature_${i}`] = 0;
    }
    return initialFeatures;
  });

  const handleInputChange = useCallback((key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFeatures(prev => ({ ...prev, [key]: numValue }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(features);
  }, [features, onSubmit]);

  const handleReset = useCallback(() => {
    const resetFeatures: SonarFeatures = {};
    for (let i = 1; i <= 60; i++) {
      resetFeatures[`feature_${i}`] = 0;
    }
    setFeatures(resetFeatures);
  }, []);

  const generateRandomData = useCallback(() => {
    const randomFeatures: SonarFeatures = {};
    for (let i = 1; i <= 60; i++) {
      randomFeatures[`feature_${i}`] = Math.random();
    }
    setFeatures(randomFeatures);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Sonar Features (60 values)
        </h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={generateRandomData}
            className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            Random Data
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={`p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-1">
        {Object.entries(features).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className={`block text-xs font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <input
              type="number"
              step="0.001"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className={`w-full px-2 py-1 text-sm rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="0.000"
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300 ${
            isLoading
              ? isDarkMode 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="h-5 w-5" />
          <span>{isLoading ? 'Predicting...' : 'Predict Signal'}</span>
        </button>
      </div>
    </form>
  );
};

export default FeatureForm;