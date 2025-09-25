import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

// Styles
import "../styles/index.css";

// Components
import TodoApp from "./components/TodoApp.jsx";

// Render the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TodoApp />
  </StrictMode>
);
