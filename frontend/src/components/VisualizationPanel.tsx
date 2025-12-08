import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getImageUrl } from '../utils/api';

interface VisualizationPanelProps {
  originalImage: string | null;
  parsedRegionsPath?: string;
}

export function VisualizationPanel({
  originalImage,
  parsedRegionsPath,
}: VisualizationPanelProps) {
  const [showParsed, setShowParsed] = useState(false);

  if (!originalImage && !parsedRegionsPath) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Visualization</h2>
        {parsedRegionsPath && (
          <button
            onClick={() => setShowParsed(!showParsed)}
            className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-gray-600 hover:text-primary active:text-primary-dark transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
          >
            {showParsed ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Show Original</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Show Parsed Regions</span>
                <span className="sm:hidden">Parsed View</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 touch-pan-x touch-pan-y">
        {showParsed && parsedRegionsPath ? (
          <img
            src={getImageUrl(parsedRegionsPath)}
            alt="Parsed regions"
            className="w-full h-auto"
          />
        ) : originalImage ? (
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-auto"
          />
        ) : null}
      </div>
    </div>
  );
}

