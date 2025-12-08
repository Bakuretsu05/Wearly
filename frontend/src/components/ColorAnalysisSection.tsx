import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { RegionColors, ColorConfidence } from '../types';

interface ColorAnalysisSectionProps {
  regionColors: RegionColors;
  colorConfidence: ColorConfidence;
}

export function ColorAnalysisSection({
  regionColors,
  colorConfidence,
}: ColorAnalysisSectionProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-success';
    if (confidence >= 0.4) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.7) return '✓ High';
    if (confidence >= 0.4) return '⚠ Medium';
    return '✗ Low';
  };

  const copyToClipboard = (text: string, region: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(region);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const regions = [
    { key: 'shirt' as const, label: 'Shirt' },
    { key: 'pants' as const, label: 'Pants' },
    { key: 'shoes' as const, label: 'Shoes' },
  ];

  return (
    <div className="card">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Color Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {regions.map(({ key, label }) => {
          const color = regionColors[key];
          const confidence = colorConfidence.per_region[key] || 0;

          if (!color || !color.hex) {
            return (
              <div
                key={key}
                className="border-2 border-gray-200 rounded-lg p-4 text-center"
              >
                <div className="text-gray-400 mb-2">{label}</div>
                <div className="text-sm text-gray-500">No color detected</div>
                {confidence > 0 && (
                  <div className={`text-xs mt-2 ${getConfidenceColor(confidence)}`}>
                    {getConfidenceBadge(confidence)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={key}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="text-center mb-3">
                <div className="text-lg font-semibold text-gray-900 mb-2">{label}</div>
                <div
                  className="w-full h-16 rounded-lg mb-2 border-2 border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-sm font-medium text-gray-700 capitalize mb-1">
                  {color.name}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {color.hex}
                  </code>
                  <button
                    onClick={() => copyToClipboard(color.hex!, key)}
                    className="text-gray-500 hover:text-primary transition-colors"
                    title="Copy hex code"
                  >
                    {copiedHex === key ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className={`text-xs mt-2 font-medium ${getConfidenceColor(confidence)}`}>
                  {getConfidenceBadge(confidence)} ({(confidence * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Confidence:</span>
          <span
            className={`text-sm font-semibold ${getConfidenceColor(
              colorConfidence.overall
            )}`}
          >
            {(colorConfidence.overall * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

