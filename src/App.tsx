import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./pages/Index";
import Buy from "./pages/Buy";
import RublePayment from "./pages/RublePayment";
import Roulette from "./pages/Roulette";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import {useEffect} from "react";
import {apiService} from "@/utils/api.ts";

const queryClient = new QueryClient();

const App = () => {
    const isFullscreen = WebApp.isFullscreen;
    useEffect(() => {
        apiService.checkUser(WebApp.initDataUnsafe.start_param || "",)
        console.log(WebApp.initDataUnsafe.start_param)
    }, [])
    return (
        <TonConnectUIProvider manifestUrl="https://starsbuy.space/assets/tonconnect-manifest.json">
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster
                    />
                    <Sonner
                        toastOptions={{
                            style: {
                                marginTop: isFullscreen ? "80px" : "0px",
                            },
                        }}
                    />
                    <BrowserRouter>
                        <div className="pb-16">
                            <Routes>
                                <Route path="/" element={<Index/>}/>
                                <Route path="/buy" element={<Buy/>}/>
                                <Route path="/buy/rubles" element={<RublePayment/>}/>
                                <Route path="/roulette" element={<Roulette/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </div>
                        <Navigation/>
                    </BrowserRouter>
                </TooltipProvider>
            </QueryClientProvider>
        </TonConnectUIProvider>
    );
};

export default App;
