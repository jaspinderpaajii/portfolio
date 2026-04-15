function StatusBadge({ active, trueLabel = "Published", falseLabel = "Draft" }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {active ? trueLabel : falseLabel}
    </span>
  );
}

export default StatusBadge;
