import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import WebApp from "@twa-dev/sdk";
import {viewport} from "@telegram-apps/sdk";

// Ensure Buffer is available globally
globalThis.Buffer = Buffer;
window.Buffer = Buffer;

const tele = WebApp;
tele.ready();
viewport.mount.isAvailable()
tele.setHeaderColor("#0C0032");
tele.setBackgroundColor("#0C0032");
createRoot(document.getElementById("root")!).render(<App />);