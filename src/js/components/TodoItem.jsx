export default function TodoItem({ task, onDelete, onToggle }) {
  return (
    <li className="list-group-item d-flex align-items-center justify-content-between todo-item">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={`todo-${task.id}`}
          checked={task.done}
          onChange={onToggle}
        />
        <label
          className={`form-check-label ms-2 ${
            task.done ? "text-decoration-line-through text-body-secondary" : ""
          }`}
          htmlFor={`todo-${task.id}`}
          style={{ cursor: "pointer" }}
        >
          {task.label}
        </label>
      </div>

      <button
        type="button"
        className="btn btn-sm btn-outline-danger delete-btn"
        aria-label="Delete task"
        onClick={onDelete}
      >
        <i className="bi bi-trash"></i>
      </button>
    </li>
  );
}
