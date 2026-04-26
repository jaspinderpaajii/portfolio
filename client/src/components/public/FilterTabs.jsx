function FilterTabs({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm transition duration-300 ${
              active
                ? "border-[rgba(var(--accent-rgb),0.55)] text-black shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            }`}
            style={
              active
                ? {
                    background:
                      "linear-gradient(180deg, rgba(var(--accent-rgb), 0.9), rgba(var(--accent-rgb), 0.78))"
                  }
                : undefined
            }
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
