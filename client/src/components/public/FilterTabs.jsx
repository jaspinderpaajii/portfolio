function FilterTabs({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm transition ${
              active
                ? "border-[var(--accent)] bg-[color:var(--accent)] text-black"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
            }`}
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
