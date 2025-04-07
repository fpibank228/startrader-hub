
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import WheelRoulette from '../components/roulette/WheelRoulette';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";
import { staticGiftItems } from '../data/rouletteData';
import StarCard from '../components/StarCard';

const BasicRoulette = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;
  const [winningItem, setWinningItem] = useState(staticGiftItems.find(item => item.isWin) || staticGiftItems[0]);

  const handleBack = () => {
    navigate('/roulette');
  };

  const handleSpin = (result: any) => {
    setWinningItem(result);
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
          {/* Display winning item separately */}
          <StarCard className="mb-6 p-4">
            <h3 className="text-center text-lg font-medium mb-3">Выигрышный предмет</h3>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.4)] bg-white/10">
                <img 
                  src={winningItem.link}
                  alt={winningItem.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-md font-medium">{winningItem.title}</div>
              <div className="text-sm text-yellow-400 font-medium">{winningItem.price} TON</div>
            </div>
          </StarCard>
          
          <WheelRoulette 
            items={staticGiftItems}
            onSpin={handleSpin}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BasicRoulette;
