import React, { useState, useCallback } from 'react';
import { Upload, Moon, Sun, Zap, FileText, BarChart3, AlertCircle, CheckCircle, X } from 'lucide-react';
import FeatureForm from './components/FeatureForm';
import CSVUpload from './components/CSVUpload';
import PredictionResult from './components/PredictionResult';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import { useDarkMode } from './hooks/UseDarkMode';
import { useToast } from './hooks/UseToast';
import axios from 'axios';

export interface SonarFeatures {
  [key: string]: number;
}

export interface PredictionData {
  prediction: 'Rock' | 'Mine';
  confidence: number;
  timestamp: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toasts, addToast, removeToast } = useToast();

  const simulatePrediction = useCallback(async (features: SonarFeatures): Promise<PredictionData> => {
    const featureArray = Object.values(features);
    const response = await axios.post('http://127.0.0.1:5000/predict', {
    features: featureArray
    });
    const predictionRaw = response.data.prediction[0];
    const prediction: 'Rock' | 'Mine' = predictionRaw === 1 ? 'Mine' : 'Rock';
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction based on first few features
    const featureValues = Object.values(features);
    const avgValue = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
    const isRock = avgValue > 0.5;
    
    return {
      prediction: isRock ? 'Rock' : 'Mine',
      confidence: Math.random() * 0.3 + (isRock ? 0.7 : 0.6), // 60-100% confidence
      timestamp: new Date().toISOString()
    };
  }, []);

  const handlePrediction = useCallback(async (features: SonarFeatures) => {
    setIsLoading(true);
    setPrediction(null);
    
    try {
      const result = await simulatePrediction(features);
      setPrediction(result);
      addToast({
        type: 'success',
        message: `Prediction complete: ${result.prediction} (${(result.confidence * 100).toFixed(1)}% confidence)`
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Prediction failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [simulatePrediction, addToast]);

  const handleCSVUpload = useCallback(async (csvData: SonarFeatures[]) => {
    if (csvData.length === 0) {
      addToast({
        type: 'error',
        message: 'No valid data found in CSV file'
      });
      return;
    }

    addToast({
      type: 'success',
      message: `CSV uploaded successfully with ${csvData.length} record(s)`
    });

    // Use first record for prediction
    await handlePrediction(csvData[0]);
  }, [handlePrediction, addToast]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Sonar Signal Classifier
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Rock vs Mine Detection using XGBoost
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100'
            }`}>
              {/* Tab Navigation */}
              <div className={`border-b transition-colors duration-300 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === 'manual'
                        ? isDarkMode 
                          ? 'border-blue-400 text-blue-400' 
                          : 'border-blue-500 text-blue-600'
                        : isDarkMode 
                          ? 'border-transparent text-gray-400 hover:text-gray-300' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Manual Entry</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('csv')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                      activeTab === 'csv'
                        ? isDarkMode 
                          ? 'border-blue-400 text-blue-400' 
                          : 'border-blue-500 text-blue-600'
                        : isDarkMode 
                          ? 'border-transparent text-gray-400 hover:text-gray-300' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>CSV Upload</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'manual' ? (
                  <FeatureForm 
                    onSubmit={handlePrediction} 
                    isLoading={isLoading}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <CSVUpload 
                    onUpload={handleCSVUpload} 
                    isLoading={isLoading}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && <LoadingSpinner isDarkMode={isDarkMode} />}
            
            {/* Prediction Result */}
            {prediction && !isLoading && (
              <PredictionResult 
                prediction={prediction} 
                isDarkMode={isDarkMode}
              />
            )}

            {/* Info Card */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-100 shadow-lg'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <Zap className={`h-5 w-5 ${
                    isDarkMode ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                <h3 className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How it works
                </h3>
              </div>
              <ul className={`space-y-2 text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>• Enter 60 sonar signal features manually</li>
                <li>• Upload CSV files with multiple records</li>
                <li>• XGBoost model classifies signals as rocks or mines</li>
                <li>• Get confidence scores for each prediction</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}

export default App;