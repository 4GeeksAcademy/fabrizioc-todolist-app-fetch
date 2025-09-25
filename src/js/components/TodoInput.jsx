import { useState } from "react";

export default function TodoInput({ onAdd, disabled }) {
  const [value, setValue] = useState("");

  const commit = () => {
    if (!value.trim() || disabled) return;
    onAdd?.(value);
    setValue("");
  };

  return (
    <div className="input-group">
      <input
        className="form-control"
        placeholder="Add a task and press Enter…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        aria-label="New task"
        disabled={disabled}
      />
      <button
        className="btn btn-primary"
        type="button"
        onClick={commit}
        disabled={disabled}
      >
        Add
      </button>
    </div>
  );
}
