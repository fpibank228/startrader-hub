
import { motion } from 'framer-motion';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';
import { RotateCw } from 'lucide-react';

interface RouletteResultProps {
  result: {
    chance: string;
    link: string;
  };
  onPlayAgain: () => void;
}

const RouletteResult = ({ result, onPlayAgain }: RouletteResultProps) => {
  const isWin = result.chance === 'yes';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <StarCard className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">
          {isWin ? '🎉 Поздравляем! Вы выиграли!' : 'К сожалению, не повезло'}
        </h2>
        
        <div className="my-6 mx-auto w-40 h-40">
          <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
            isWin ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)]' : 'border-white/30'
          }`}>
            <LottieItem 
              animationData={result.link} 
              className="w-full h-full"
            />
          </div>
        </div>
        
        <p className="text-white/80 mb-6">
          {isWin 
            ? 'Ваш приз зачислен на счет!'
            : 'Попробуйте еще раз, удача обязательно улыбнется!'}
        </p>
        
        <button
          onClick={onPlayAgain}
          className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90"
        >
          <RotateCw size={18} />
          Играть снова
        </button>
      </StarCard>
    </motion.div>
  );
};

export default RouletteResult;
