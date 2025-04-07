
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Gift } from "lucide-react"; // Replacing Confetti with Gift which exists in lucide-react
import LottieItem from './LottieItem';

interface RouletteItem {
  chance?: string;
  link?: string;
  title?: string;
  price?: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
  number?: number;
  name?: string;
}

interface RouletteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RouletteItem | null;
  onPlayAgain?: () => void;
}

// Helper function to check if a URL is for a Lottie animation
const isLottieAnimation = (url: string): boolean => {
  return url?.toLowerCase().endsWith('.json');
};

const RouletteResultModal = ({ isOpen, onClose, result, onPlayAgain }: RouletteResultModalProps) => {
  if (!result) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-customMidBlue to-customPurple/90 border-none max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl text-center">Ваш выигрыш!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center p-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="relative w-52 h-52 mb-4"
          >
            {/* Animated stars in the background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-full">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* The prize item - support both Lottie and images */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 rounded-lg bg-white/10 p-4 border border-white/20 flex items-center justify-center overflow-hidden">
                {/* Different display based on what data we have */}
                {result.name ? (
                  // Display with name (Lottie)
                  <LottieItem 
                    animationData={`https://nft.fragment.com/gift/${result.name.toLowerCase()}.lottie.json`}
                    className="w-full h-full"
                    loop={true}
                  />
                ) : result.link && isLottieAnimation(result.link) ? (
                  // Direct Lottie URL
                  <LottieItem 
                    animationData={result.link}
                    className="w-full h-full"
                    loop={true}
                  />
                ) : result.link ? (
                  // Regular image
                  <img 
                    src={result.link} 
                    alt={result.title || "Prize"}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://placehold.co/100x100/purple/white?text=Prize';
                    }}
                  />
                ) : (
                  // Fallback display if no proper image source
                  <div className="text-center text-white/80">
                    <Gift size={48} className="mx-auto mb-2" /> {/* Changed from Confetti to Gift */}
                    <p>Приз</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6"
          >
            <h3 className="text-xl font-bold mb-1">{result.title || "Поздравляем!"}</h3>
            {result.price && (
              <p className="text-yellow-400 font-medium text-lg">{result.price} TON</p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full bg-white/10 border-white/20 hover:bg-white/20"
            >
              Закрыть
            </Button>
            
            {onPlayAgain && (
              <Button
                onClick={onPlayAgain}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Играть снова
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouletteResultModal;
