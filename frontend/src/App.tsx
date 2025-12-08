import { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AnalysisResult, LoadingState } from './types';
import { analyzeImage } from './utils/api';

function App() {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleAnalysis = async (imageFile: File, evaluateStyle: boolean) => {
    setLoadingState('uploading');
    setError(null);
    setResult(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(imageFile);
    setUploadedImage(previewUrl);

    try {
      setLoadingState('processing');
      
      const data = await analyzeImage(imageFile, evaluateStyle);
      
      setResult(data);
      setLoadingState('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoadingState('error');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUploadedImage(null);
    setLoadingState('idle');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Clothing Analysis System</h1>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">AI-powered outfit detection and style evaluation</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Upload Section */}
          <div className="lg:col-span-1">
            <UploadSection
              onAnalyze={handleAnalysis}
              loadingState={loadingState}
              uploadedImage={uploadedImage}
              onReset={handleReset}
            />
          </div>

          {/* Right Side - Results Display */}
          <div className="lg:col-span-2">
            <ResultsDisplay
              result={result}
              loadingState={loadingState}
              error={error}
              uploadedImage={uploadedImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

