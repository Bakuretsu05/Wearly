interface SummaryCardProps {
  categories: string[];
}

export function SummaryCard({ categories }: SummaryCardProps) {
  const parseCategory = (category: string) => {
    // Parse category like "light grey T-shirt" or "purple Shorts"
    const parts = category.split(' ');
    const color = parts.length > 1 ? parts.slice(0, -1).join(' ') : null;
    const item = parts[parts.length - 1];
    return { color, item };
  };

  return (
    <div className="card">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Outfit Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category, index) => {
          const { color, item } = parseCategory(category);
          return (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">{item}</div>
                {color && (
                  <div className="text-sm text-gray-600 capitalize">{color}</div>
                )}
                {!color && (
                  <div className="text-xs text-gray-400">No color detected</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

