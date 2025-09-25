const BASE = "https://playground.4geeks.com/todo";
const USERNAME = "niko";

async function parseOrThrow(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const msg =
      data?.msg || data?.message || res.statusText || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Create user if missing
export async function ensureUser() {
  // Try GET first; if 404 then POST to create
  const userUrl = `${BASE}/users/${USERNAME}`;
  let res = await fetch(userUrl, { method: "GET" });
  if (res.ok) return parseOrThrow(res);
  if (res.status === 404) {
    res = await fetch(userUrl, { method: "POST" }); // creates { name, id }
    return parseOrThrow(res);
  }
  return parseOrThrow(res);
}

// Load todos: GET /users/{user_name}  -> { name, id, todos: [...] }
export async function getTodos() {
  const url = `${BASE}/users/${USERNAME}`;
  const res = await fetch(url, { method: "GET" });
  const data = await parseOrThrow(res);
  // API returns {name, id, todos: [{ id, label, is_done }]}
  return Array.isArray(data?.todos) ? data.todos : [];
}

// Create todo: POST /todos/{user_name} { label }
export async function createTodo(label) {
  const url = `${BASE}/todos/${USERNAME}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });
  return parseOrThrow(res);
}

// Delete single todo by id
export async function deleteTodo(id) {
  const url = `${BASE}/todos/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  return parseOrThrow(res);
}

// Clear all todos for the user.
// Some deployments support DELETE /todos/{user_name}. If not, we fall back to deleting each item.
export async function clearAllTodos() {
  const bulkUrl = `${BASE}/todos/${USERNAME}`;
  const tryBulk = await fetch(bulkUrl, { method: "DELETE" });
  if (tryBulk.ok) return parseOrThrow(tryBulk);

  // Fallback: delete one by one
  const items = await getTodos();
  await Promise.allSettled(items.map((t) => deleteTodo(t.id)));
  return { msg: "cleared-by-iteration", count: items.length };
}
