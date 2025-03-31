
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import RouletteWheel from '../components/roulette/RouletteWheel';
import RouletteResultModal from '../components/roulette/RouletteResultModal';
import { useToast } from '../hooks/use-toast';
import WebApp from "@twa-dev/sdk";
import { basicRouletteItems } from '../data/rouletteData';

const BasicRoulette = () => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isFullscreen = WebApp.isFullscreen;

  const handleSpinResult = (result: any) => {
    setResult(result);
    setShowResultModal(true);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setResult(null);
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <RouletteWheel 
            onSpin={handleSpinResult}
            items={basicRouletteItems}
          />
        </motion.div>

        {/* Модальное окно с результатом вместо отдельной страницы */}
        <RouletteResultModal 
          isOpen={showResultModal}
          onClose={handleCloseModal}
          result={result}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    </div>
  );
};

export default BasicRoulette;
