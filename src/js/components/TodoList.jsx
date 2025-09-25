import TodoItem from "./TodoItem.jsx";

export default function TodoList({ tasks, onDelete, onToggleDone }) {
  return (
    <ul className="list-group list-group-flush">
      {tasks.map((t) => (
        <TodoItem
          key={t.id}
          task={t}
          onDelete={() => onDelete?.(t.id)}
          onToggle={() => onToggleDone?.(t.id)}
        />
      ))}
    </ul>
  );
}
