import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminField } from "./AdminFields.jsx";

export function StringListEditor({ label, items, onChange, placeholder = "Add item" }) {
  function updateItem(index, value) {
    onChange(items.map((item, currentIndex) => (currentIndex === index ? value : item)));
  }

  function removeItem(index) {
    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  }

  function move(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    onChange(nextItems);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <button type="button" className="admin-button-muted" onClick={() => onChange([...items, ""])}>
          <Plus size={16} />
          Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="admin-card flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-[220px] flex-1">
              <AdminField
                label={`${label} ${index + 1}`}
                value={item}
                placeholder={placeholder}
                onChange={(event) => updateItem(index, event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="admin-button-muted" onClick={() => move(index, -1)}>
                <ArrowUp size={16} />
              </button>
              <button type="button" className="admin-button-muted" onClick={() => move(index, 1)}>
                <ArrowDown size={16} />
              </button>
              <button type="button" className="admin-button-muted" onClick={() => removeItem(index)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ObjectListEditor({ label, items, onChange, fields }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, currentIndex) => (currentIndex === index ? { ...item, [key]: value } : item)));
  }

  function removeItem(index) {
    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  }

  function move(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    onChange(nextItems);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <button
          type="button"
          className="admin-button-muted"
          onClick={() =>
            onChange([
              ...items,
              fields.reduce((acc, field) => {
                acc[field.key] = "";
                return acc;
              }, {})
            ])
          }
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="admin-card space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <AdminField
                  key={`${label}-${field.key}-${index}`}
                  label={field.label}
                  value={item[field.key] || ""}
                  placeholder={field.placeholder}
                  onChange={(event) => updateItem(index, field.key, event.target.value)}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="admin-button-muted" onClick={() => move(index, -1)}>
                <ArrowUp size={16} />
                Up
              </button>
              <button type="button" className="admin-button-muted" onClick={() => move(index, 1)}>
                <ArrowDown size={16} />
                Down
              </button>
              <button type="button" className="admin-button-muted" onClick={() => removeItem(index)}>
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
