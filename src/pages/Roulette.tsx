
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import RouletteWheel from '../components/roulette/RouletteWheel';
import RouletteSelector from '../components/roulette/RouletteSelector';
import RouletteResult from '../components/roulette/RouletteResult';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";

// Sample data for the roulette
const rouletteData = [
  {
    'chance': 'yes',
    'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json'
  },
];

const rouletteOptions = [
  {
    id: 'basic',
    title: 'Обычная рулетка',
    description: 'Испытайте свою удачу с шансом выигрыша',
  },
  {
    id: 'premium',
    title: 'Премиум рулетка',
    description: 'Увеличенные шансы на выигрыш',
  },
  {
    id: 'vip',
    title: 'VIP рулетка',
    description: 'Эксклюзивные призы для VIP игроков',
  }
];

const Roulette = () => {
  const [selectedRouletteType, setSelectedRouletteType] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'selecting' | 'playing' | 'result'>('selecting');
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const isFullscreen = WebApp.isFullscreen;

  const handleSelectRouletteType = (type: string) => {
    setSelectedRouletteType(type);
    setGameState('playing');
  };

  const handleSpinResult = (result: any) => {
    setResult(result);
    setGameState('result');
    
    if (result.chance === 'yes') {
      toast({
        title: "Поздравляем!",
        description: "Вы выиграли приз!",
      });
    } else {
      toast({
        title: "Не повезло",
        description: "Попробуйте еще раз!",
      });
    }
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setResult(null);
  };

  const handleBack = () => {
    if (gameState === 'playing' || gameState === 'result') {
      setGameState('selecting');
      setSelectedRouletteType(null);
      setResult(null);
    }
  };

  return (
    <div className="relative min-h-screen pt-4 pb-24" style={{
      marginTop: isFullscreen ? "80px" : "0px",
    }}>
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center mb-6">
          {(gameState === 'playing' || gameState === 'result') && (
            <button 
              onClick={handleBack}
              className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            {gameState === 'selecting' 
              ? 'Звёздная Рулетка' 
              : selectedRouletteType === 'basic' 
                ? 'Обычная рулетка'
                : selectedRouletteType === 'premium'
                  ? 'Премиум рулетка'
                  : 'VIP рулетка'}
          </motion.h1>
        </div>

        {gameState === 'selecting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/70 text-sm mb-6">
              Испытайте удачу и выиграйте звезды! Выберите тип рулетки, чтобы начать игру.
            </p>
            
            <RouletteSelector 
              options={rouletteOptions} 
              onSelect={handleSelectRouletteType} 
            />
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <RouletteWheel 
              items={rouletteData}
              onSpin={handleSpinResult} 
            />
          </motion.div>
        )}

        {gameState === 'result' && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <RouletteResult 
              result={result}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Roulette;
