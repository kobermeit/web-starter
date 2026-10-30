import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "#client/App.tsx";
import { registerTodoWrites } from "#client/features/todos/todos.api.ts";
import "#client/styles.css";

registerTodoWrites();

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  void navigator.serviceWorker.register("/sw.js");
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
