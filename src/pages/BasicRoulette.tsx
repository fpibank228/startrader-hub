
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import WheelRoulette from '../components/roulette/WheelRoulette';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";
import { staticGiftItems } from '../data/rouletteData';

const BasicRoulette = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;
  const [winningItem, setWinningItem] = useState(staticGiftItems.find(item => item.isWin) || staticGiftItems[0]);
  // Random position between 0-5 where the wheel will stop
  const [stopPosition, setStopPosition] = useState(Math.floor(Math.random() * 6));

  // Generate a new random stop position when the component mounts
  useEffect(() => {
    setStopPosition(Math.floor(Math.random() * 6));
  }, []);

  const handleBack = () => {
    navigate('/roulette');
  };

  const handleSpin = (result: any) => {
    setWinningItem(result);
    // Generate a new random stop position for next spin
    // Using setTimeout to ensure the position changes after the current spin
    setTimeout(() => {
      setStopPosition(Math.floor(Math.random() * 6));
    }, 100);
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
          <WheelRoulette 
            items={staticGiftItems}
            onSpin={handleSpin}
            stopPosition={stopPosition}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BasicRoulette;
