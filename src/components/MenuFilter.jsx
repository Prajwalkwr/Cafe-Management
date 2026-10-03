const filters = ['All', 'Coffee', 'Tea', 'Nepali', 'Snacks', 'Main Course', 'Desserts'];

export default function MenuFilter({ value, onChange }) {
  return (
    <div className="sticky top-20 z-30 -mx-1 bg-cream/95 py-3 backdrop-blur" role="tablist" aria-label="Menu categories">
      <div className="flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((filter) => {
          const selected = value === filter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`shrink-0 rounded-full px-4 py-2 text-sm ${selected ? 'bg-ink text-cream' : 'bg-paper text-ink border border-line'}`}
              onClick={() => onChange(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
