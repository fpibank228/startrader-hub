import React, { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Buy from './pages/Buy';
import Profile from './pages/Profile';
import TopUpRublePayment from './pages/TopUpRublePayment.tsx';
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
import RublePayment from "@/pages/RublePayment.tsx";
import MiddleBasicRoulette from "@/pages/MiddleBasicRoulette.tsx";
import BigBasicRoulette from "@/pages/BigBasicRoulette.tsx";

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
                    <div className="">
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            <Route path="/buy" element={<Buy/>}/>
                            <Route path="/buy/rubles" element={<RublePayment/>}/>
                            <Route path="/topup/rubles" element={<TopUpRublePayment/>}/>
                            <Route path="/topup" element={<CryptoTopup/>}/>
                            <Route path="/roulette" element={<Roulette/>}/>
                            <Route path="/roulette/basic" element={<BasicRoulette/>}/>
                            <Route path="/roulette/middle" element={<MiddleBasicRoulette/>}/>
                            <Route path="/roulette/big" element={<BigBasicRoulette/>}/>
                            <Route path="/roulette/nft" element={<FixedRoulette/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/roulette/upgrade" element={<GiftUpgrade/>}/>
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
