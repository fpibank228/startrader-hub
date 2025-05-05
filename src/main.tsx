import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import WebApp from "@twa-dev/sdk";
import {
    backButton,
    viewport,
    themeParams,
    miniApp,
    initData,
    $debug,
    init as initSDK,
} from '@telegram-apps/sdk-react';

// Ensure Buffer is available globally
globalThis.Buffer = Buffer;
window.Buffer = Buffer;
try {
    initSDK()

    backButton.mount();
    miniApp.mount();
    themeParams.mount();
    initData.restore();
    void viewport
        .mount()
        .catch(e => {
            console.error('Something went wrong mounting the viewport', e);
        })
        .then(() => {
            viewport.bindCssVars();
        });

    // Define components-related CSS variables.
    miniApp.bindCssVars();
    themeParams.bindCssVars();
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
} catch (e) {
    console.error(e);
}
createRoot(document.getElementById("root")!).render(<App />);