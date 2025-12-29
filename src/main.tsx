import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import test function (only loads in dev, tree-shaken in prod)
if (import.meta.env.DEV) {
  import("./lib/test-gemini-api.ts");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  throw error;
}

