
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import RouletteWheel from '../components/roulette/RouletteWheel';
import RouletteResult from '../components/roulette/RouletteResult';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";

const BasicRoulette = () => {
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;

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
    navigate('/roulette');
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
            Обычная рулетка
          </motion.h1>
        </div>

        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <RouletteWheel 
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

export default BasicRoulette;
