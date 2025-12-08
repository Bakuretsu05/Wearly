import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ClothingAttributes } from '../types';

interface AttributesSectionProps {
  attributes: ClothingAttributes;
}

export function AttributesSection({ attributes }: AttributesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const clothingAttrs = [
    { label: 'Sleeve Length', value: attributes.sleeve_length },
    { label: 'Lower Length', value: attributes.lower_length },
    { label: 'Fabric (Top)', value: attributes.fabric_0 },
    { label: 'Fabric (Pants)', value: attributes.fabric_1 },
    { label: 'Pattern', value: attributes.color_0 },
    { label: 'Neckline', value: attributes.neckline },
  ];

  const accessories = [
    { label: 'Hat', value: attributes.hat },
    { label: 'Glasses', value: attributes.glasses },
    { label: 'Neckwear', value: attributes.neckwear },
    { label: 'Wristwear', value: attributes.wristwear },
    { label: 'Ring', value: attributes.ring },
    { label: 'Waist Accessory', value: attributes.waist_accessory },
  ].filter((item) => item.value !== 'NA' && item.value !== 'no');

  const formatValue = (value: string) => {
    if (value === 'NA') return 'N/A';
    return value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Clothing Attributes</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-6">
          {/* Clothing Attributes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Clothing Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clothingAttrs.map((attr, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">{attr.label}:</span>
                  <span className="font-medium text-gray-900">
                    {formatValue(attr.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessories */}
          {accessories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Accessories
              </h3>
              <div className="flex flex-wrap gap-2">
                {accessories.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {formatValue(item.label)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

