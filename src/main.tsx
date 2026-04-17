import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import "./i18n";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
