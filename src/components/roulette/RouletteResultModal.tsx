
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
  console.log(result);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b bg-customDark border-white/40 border-2 p-6 sm:p-8 text-center rounded-3xl">
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
                <p className=" font-medium text-lg">{result.price}
                  <svg width="18" height="18"
                       fill="#546CF3" className="inline ml-0.5"
                       xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                          fill="ddd"></path>
                  </svg>
                </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 gap-3 w-full">
            <Button
                variant="outline"
                onClick={onClose}
                className=" bg-gradient-to-r customBlue mx-5 py-5 h-auto"
            >
              Забрать
            </Button>

            {onPlayAgain && (
                <Button
                    onClick={onPlayAgain}
                    className=" bg-gradient-to-r customBlue mx-5 py-5 h-auto"
                >
                  Продать за {result.price}
                  <svg width="18" height="18"
                       fill="#ffffff" className="inline ml-0.5"
                       xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                          fill="ddd"></path>
                  </svg>
                </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouletteResultModal;
