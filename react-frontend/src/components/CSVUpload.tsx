import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertTriangle } from 'lucide-react';
import type { SonarFeatures } from '../app';

interface CSVUploadProps {
  onUpload: (data: SonarFeatures[]) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUpload, isLoading, isDarkMode }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const parseCSV = useCallback((csvText: string): SonarFeatures[] => {
    const lines = csvText.trim().split('\n');
    const data: SonarFeatures[] = [];

    // Skip header if it exists
    const startIndex = lines[0].includes('feature') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length >= 60) {
        const features: SonarFeatures = {};
        for (let j = 0; j < 60; j++) {
          const value = parseFloat(values[j]);
          if (!isNaN(value)) {
            features[`feature_${j + 1}`] = value;
          }
        }
        
        if (Object.keys(features).length === 60) {
          data.push(features);
        }
      }
    }

    return data;
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);
      onUpload(parsedData);
    };
    reader.readAsText(file);
  }, [parseCSV, onUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Upload CSV File
        </h3>
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Upload a CSV file with 60 sonar features per row
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? isDarkMode 
              ? 'border-blue-400 bg-blue-900/20' 
              : 'border-blue-400 bg-blue-50'
            : isDarkMode 
              ? 'border-gray-600 hover:border-gray-500' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive
              ? isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Upload className={`h-6 w-6 transition-colors duration-300 ${
              dragActive
                ? 'text-white'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          
          <div>
            <p className={`text-lg font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {dragActive ? 'Drop your CSV file here' : 'Drag and drop your CSV file'}
            </p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              or click to browse files
            </p>
          </div>
          
          {fileName && (
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-300 ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <FileText className="h-4 w-4" />
              <span className="text-sm">{fileName}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode ? 'bg-amber-900/20 border border-amber-700' : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
            isDarkMode ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <div>
            <h4 className={`font-medium text-sm ${
              isDarkMode ? 'text-amber-300' : 'text-amber-800'
            }`}>
              CSV Format Requirements
            </h4>
            <ul className={`mt-1 text-sm space-y-1 ${
              isDarkMode ? 'text-amber-200' : 'text-amber-700'
            }`}>
              <li>• Each row should contain exactly 60 numerical features</li>
              <li>• Features should be comma-separated values</li>
              <li>• Optional header row with feature names</li>
              <li>• Example: 0.123,0.456,0.789,...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;