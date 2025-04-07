
import React, { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner'
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Buy from './pages/Buy';
import Profile from './pages/Profile';
import RublePayment from './pages/RublePayment';
import Roulette from './pages/Roulette';
import CryptoTopup from './pages/CryptoTopup';
import BasicRoulette from './pages/BasicRoulette';
import FixedRoulette from './pages/FixedRoulette';
import GiftUpgrade from './pages/GiftUpgrade';
import NotFound from './pages/NotFound';
import './App.css';
import WebApp from '@twa-dev/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiService } from './utils/api';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

const App = () => {
    const isFullscreen = WebApp.isFullscreen;
    useEffect(() => {
        apiService.checkUser(WebApp.initDataUnsafe.start_param || "");
        console.log(WebApp.initDataUnsafe.start_param);
    }, [])
    return (
        <TonConnectUIProvider manifestUrl="https://starsbuy.space/assets/tonconnect-manifest.json">
            <QueryClientProvider client={queryClient}>
                <Toaster />
                <BrowserRouter>
                    <div className="pb-16">
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            <Route path="/buy" element={<Buy/>}/>
                            <Route path="/buy/rubles" element={<RublePayment/>}/>
                            <Route path="/topup" element={<CryptoTopup/>}/>
                            <Route path="/roulette" element={<Roulette/>}/>
                            <Route path="/roulette/basic" element={<BasicRoulette/>}/>
                            <Route path="/roulette/fixed" element={<FixedRoulette/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/upgrade" element={<GiftUpgrade/>}/>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </div>
                    <Navigation/>
                </BrowserRouter>
            </QueryClientProvider>
        </TonConnectUIProvider>
    );
};

export default App;
