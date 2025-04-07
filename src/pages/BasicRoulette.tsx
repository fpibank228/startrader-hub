
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import WheelRoulette from '../components/roulette/WheelRoulette';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";
import { basicRouletteItems } from '../data/rouletteData';

const BasicRoulette = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;

  const handleBack = () => {
    navigate('/roulette');
  };

  // Add isWin property to one of the items
  const itemsWithWinner = basicRouletteItems.map((item, index) => {
    return {
      ...item,
      isWin: index === 0 // First item is the winner
    };
  });

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
          <WheelRoulette 
            items={itemsWithWinner}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BasicRoulette;
