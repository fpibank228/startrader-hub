import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import WebApp from "@twa-dev/sdk";

// Ensure Buffer is available globally
globalThis.Buffer = Buffer;
window.Buffer = Buffer;
try {
    const tele = WebApp;
    tele.ready();
    tele.setHeaderColor("#000");
    tele.setBackgroundColor("#0C0032");
    tele.setBottomBarColor("#0C0032");
    tele.requestFullscreen()
    tele.isClosingConfirmationEnabled = true
    tele.isOrientationLocked = true
    tele.safeAreaInset.top = 800
    tele.isVerticalSwipesEnabled = false
    tele.expand()
    console.log(tele.safeAreaInset.top)
} catch (e) {
    console.error(e);
}
createRoot(document.getElementById("root")!).render(<App />);