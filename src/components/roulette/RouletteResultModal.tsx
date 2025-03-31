
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LottieItem from './LottieItem';
import { RotateCw } from 'lucide-react';

interface RouletteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    chance: string;
    link: string;
    title: string;
  } | null;
  onPlayAgain: () => void;
}

const RouletteResultModal = ({ isOpen, onClose, result, onPlayAgain }: RouletteResultModalProps) => {
  if (!result) return null;
  
  const isWin = result.chance === 'yes';

  const handlePlayAgain = () => {
    onPlayAgain();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-customPurple/90 to-black/90 border border-white/20 p-6 text-center max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
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
            onClick={handlePlayAgain}
            className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90"
          >
            <RotateCw size={18} />
            Играть снова
          </button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default RouletteResultModal;
