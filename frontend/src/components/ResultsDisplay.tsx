import { AnalysisResult, LoadingState } from '../types';
import { SummaryCard } from './SummaryCard';
import { VisualizationPanel } from './VisualizationPanel';
import { AttributesSection } from './AttributesSection';
import { ColorAnalysisSection } from './ColorAnalysisSection';
import { StyleEvaluationPanel } from './StyleEvaluationPanel';
import { AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  loadingState: LoadingState;
  error: string | null;
  uploadedImage: string | null;
}

export function ResultsDisplay({
  result,
  loadingState,
  error,
  uploadedImage,
}: ResultsDisplayProps) {
  if (loadingState === 'idle') {
    return (
      <div className="card text-center py-8 sm:py-12">
        <p className="text-gray-500 text-base sm:text-lg">
          Upload an image to begin analysis
        </p>
      </div>
    );
  }

  if (loadingState === 'error' || error) {
    return (
      <div className="card border-2 border-error">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-error flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-error mb-2">Error</h3>
            <p className="text-gray-700 text-sm sm:text-base">{error || 'An unknown error occurred'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result || !result.success) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Card */}
      {result.categories && result.categories.length > 0 && (
        <SummaryCard categories={result.categories} />
      )}

      {/* Visualization Panel */}
      <VisualizationPanel
        originalImage={uploadedImage}
        parsedRegionsPath={result.visualizations?.parsed_regions}
      />

      {/* Attributes Section */}
      {result.attributes && (
        <AttributesSection attributes={result.attributes} />
      )}

      {/* Color Analysis Section */}
      {result.region_colors && result.color_confidence && (
        <ColorAnalysisSection
          regionColors={result.region_colors}
          colorConfidence={result.color_confidence}
        />
      )}

      {/* Style Evaluation Panel */}
      {result.style_evaluation && (
        <StyleEvaluationPanel evaluation={result.style_evaluation} />
      )}
    </div>
  );
}
