import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import RouletteWheel from '../components/roulette/RouletteWheel';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";
import { staticGiftItems } from '../data/rouletteData';
import TONBalanceDisplay from "@/components/roulette/TONBalanceDisplay.tsx";
import {apiService} from "@/utils/api.ts";
import MiddleRouletteWheel from "@/components/roulette/MiddleRouletteWheel.tsx";

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  price: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
  number?: number;
  gift_id?: string;
  isWin?: boolean;
}

interface UserData {
  user_id: string;
  username: string;
  full_name: string;
  ref_id: string;
  balance: number;
}

const MiddleBasicRoulette = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;
  const [winningItem, setWinningItem] = useState(staticGiftItems.find(item => item.isWin) || staticGiftItems[0]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [items, setItems] = useState<RouletteItem[]>([]);

  const shuffleItems = () => {
    const winItem = items[-1]
    if (!winItem) return items;

    const otherItems = items.slice(0, -1);

    for (let i = otherItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherItems[i], otherItems[j]] = [otherItems[j], otherItems[i]];
    }
    
    while (otherItems.length < 4) {
      otherItems.push({
        chance: 'no',
        link: 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168103777563050263/1x/000.png',
        title: 'Placeholder',
        price: 0.2,
      });
    }
    console.log(otherItems);
    const winIndex = 4;
    const result = [...otherItems];
    if (result.length <= winIndex) {
      result.push(winItem);
    } else {
      result.splice(winIndex, 0, winItem);
      if (result.length > 6) {
        result.splice(6);
      }
    }
    
    return result;
  };

  const fetchData = async () => {
    try {
      const itms = await apiService.createMediumDefaultGiftSpinInvoice();
      
      if (itms.data['user_data']) {
        setUserData(itms.data['user_data']);
      }
      console.log(itms);
      setItems(itms.data['gifts']);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      setItems(shuffleItems());
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const refreshItems = () => {
    setItems(shuffleItems());
    fetchData();
  };

  const handleBack = () => {
    navigate('/roulette');
  };

  const handleSpin = (result: any) => {
    setWinningItem(result);
    fetchData();
  };

  return (
    <div className="relative min-h-screen pt-4 pb-24" style={{
      marginTop: isFullscreen ? "80px" : "0px",
    }}>
      <StarBackground />

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Колесо Удачи
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <TONBalanceDisplay balance={userData ? userData.balance : 0} />

          <MiddleRouletteWheel
            items={items}
            onSpin={handleSpin}
            onPlayAgain={refreshItems}
            userData={userData}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default MiddleBasicRoulette;
