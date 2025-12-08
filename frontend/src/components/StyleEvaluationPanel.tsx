import { StyleEvaluation } from '../types';
import { Star, TrendingUp, ExternalLink, ShoppingBag } from 'lucide-react';

interface StyleEvaluationPanelProps {
  evaluation: StyleEvaluation;
}

export function StyleEvaluationPanel({ evaluation }: StyleEvaluationPanelProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-primary';
      case 'fair':
        return 'text-warning';
      case 'poor':
        return 'text-error';
      default:
        return 'text-gray-600';
    }
  };

  const getRatingStars = (rating: string) => {
    const starCount = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 1,
    }[rating] || 0;

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < starCount ? 'fill-warning text-warning' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card border-2 border-primary/20">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <span>Style Evaluation</span>
      </h2>

      {/* Rating & Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Rating</div>
          <div className="flex items-center space-x-2 mb-1">
            {getRatingStars(evaluation.rating)}
          </div>
          <div className={`text-lg font-semibold capitalize ${getRatingColor(evaluation.rating)}`}>
            {evaluation.rating}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Score</div>
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-bold text-gray-900">{evaluation.score}</div>
            <div className="text-gray-400">/10</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                evaluation.score >= 7
                  ? 'bg-success'
                  : evaluation.score >= 5
                  ? 'bg-warning'
                  : 'bg-error'
              }`}
              style={{ width: `${(evaluation.score / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback */}
      {evaluation.feedback && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Feedback
          </h3>
          <p className="text-gray-700 leading-relaxed">{evaluation.feedback}</p>
        </div>
      )}

      {/* Suggestions */}
      {evaluation.suggestions && evaluation.suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Suggestions
          </h3>
          <ul className="space-y-2">
            {evaluation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shein Shopping Links */}
      {evaluation.shein_links && Object.keys(evaluation.shein_links).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Shop Similar Items on Shein</span>
          </h3>
          <div className="space-y-2">
            {Object.entries(evaluation.shein_links).map(([key, link]) => {
              if (!link) return null;
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <a
                  key={key}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors group touch-manipulation"
                >
                  <span className="text-gray-700 font-medium text-sm sm:text-base">{label}:</span>
                  <div className="flex items-center space-x-2 text-primary group-hover:text-primary-dark">
                    <span className="text-xs sm:text-sm">View on Shein</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Confidence Note */}
      {evaluation.color_confidence_note && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 italic">
            {evaluation.color_confidence_note}
          </div>
        </div>
      )}
    </div>
  );
}

