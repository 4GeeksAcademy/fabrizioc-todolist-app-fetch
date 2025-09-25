import { useEffect, useMemo, useState, useTransition } from "react";
import Home from "./Home";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import EmptyState from "./EmptyState";
import {
  ensureUser,
  getTodos,
  createTodo,
  deleteTodo,
  clearAllTodos,
} from "./TodoAPI.jsx";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("idle");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      setStatus("loading");
      setError("");
      try {
        await ensureUser();
        const data = await getTodos();
        setTasks(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (err) {
        setError(err.message || "Failed to load tasks");
        setStatus("error");
      }
    })();
  }, []);

  const refresh = async () => {
    const items = await getTodos();
    setTasks(items);
  };

  const addTask = (label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        await createTodo(trimmed);
        await refresh();
      } catch (err) {
        setError(err.message || "Failed to add task");
      }
    });
  };

  const removeTask = (id) => {
    startTransition(async () => {
      try {
        await deleteTodo(id);
        await refresh();
      } catch (err) {
        setError(err.message || "Failed to delete task");
      }
    });
  };

  const clearAll = () => {
    if (!confirm("Delete ALL tasks? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await clearAllTodos();
        await refresh();
      } catch (err) {
        setError(err.message || "Failed to clear tasks");
      }
    });
  };

  const remaining = useMemo(
    () => tasks.filter((t) => !t.is_done && !t.done).length,
    [tasks]
  );

  return (
    <Home>
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="display-6 fw-semibold m-0">Todo List</h1>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setStatus("loading");
              refresh()
                .then(() => setStatus("ready"))
                .catch((e) => {
                  setError(e.message || "Failed to refresh");
                  setStatus("error");
                });
            }}
            disabled={status === "loading" || isPending}
            title="Reload from server"
          >
            Refresh
          </button>
        </div>

        <TodoInput onAdd={addTask} disabled={status !== "ready" || isPending} />

        <div className="card shadow-sm mt-3">
          <div className="card-body p-0">
            {status === "loading" && (
              <div className="p-4 text-center text-body-secondary">
                Loading tasks…
              </div>
            )}

            {status === "error" && (
              <div className="p-3 alert alert-danger mb-0" role="alert">
                {error || "Something went wrong."}
              </div>
            )}

            {status === "ready" && (tasks?.length ?? 0) === 0 && <EmptyState />}

            {status === "ready" && tasks.length > 0 && (
              <TodoList
                tasks={tasks}
                onDelete={removeTask}
                onToggleDone={() => {}}
              />
            )}
          </div>

          <div className="card-footer d-flex justify-content-between align-items-center small gap-2">
            <span className="text-body-secondary">
              {tasks.length === 0
                ? "No tasks"
                : `${remaining} of ${tasks.length} remaining`}
            </span>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={clearAll}
                disabled={tasks.length === 0 || status !== "ready" || isPending}
                title="Delete ALL tasks on server"
              >
                Clear all
              </button>
              <span className="text-body-secondary">
                (Delete shows on hover)
              </span>
            </div>
          </div>
        </div>

        {(isPending || status === "loading") && (
          <div className="mt-2 small text-body-secondary">Syncing…</div>
        )}
      </div>
    </Home>
  );
}
