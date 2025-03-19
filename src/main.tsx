import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import WebApp from "@twa-dev/sdk";

// Ensure Buffer is available globally
globalThis.Buffer = Buffer;
window.Buffer = Buffer;

// const tele = WebApp;
// tele.ready();
// tele.setHeaderColor("#000");
// tele.setBackgroundColor("#000");
createRoot(document.getElementById("root")!).render(<App />);