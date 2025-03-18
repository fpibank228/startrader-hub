import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Index from "./pages/Index";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Roulette from "./pages/Roulette";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import {TonConnectUIProvider} from "@tonconnect/ui-react";

const queryClient = new QueryClient();

const App = () => (
    <TonConnectUIProvider manifestUrl="https://starsbuy.space/assets/tonconnect-manifest.json">

        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster/>
                <Sonner/>
                <BrowserRouter>
                    <div className="pb-16"> {/* Add padding bottom for the navigation */}
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            <Route path="/buy" element={<Buy/>}/>
                            <Route path="/sell" element={<Sell/>}/>
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

export default App;
