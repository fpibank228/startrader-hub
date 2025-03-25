
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
        
        <div className="my-6 mx-auto w-32 h-32 flex items-center justify-center">
          <img 
            src={result.link} 
            alt="Prize" 
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/100?text=Prize";
            }}
          />
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
