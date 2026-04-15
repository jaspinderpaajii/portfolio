export function AdminField({ label, hint, ...props }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      <input className="admin-input" {...props} />
    </label>
  );
}

export function AdminTextarea({ label, hint, ...props }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      <textarea className="admin-textarea" {...props} />
    </label>
  );
}

export function AdminToggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">Control whether this content is visible on the public site.</p>
      </div>
      <button
        type="button"
        className={`relative h-8 w-14 rounded-full transition ${checked ? "bg-slate-900" : "bg-slate-300"}`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${checked ? "left-7" : "left-1"}`}
        />
      </button>
    </div>
  );
}
