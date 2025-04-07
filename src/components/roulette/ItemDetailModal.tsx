
import LottieItem from './LottieItem';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  price: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
  number?: number;
}

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RouletteItem;
}

// Check if a URL is a Lottie animation (ends with .json)
const isLottieAnimation = (url: string): boolean => {
  return url.toLowerCase().endsWith('.json');
};

const ItemDetailModal = ({ isOpen, onClose, item }: ItemDetailModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-[calc(100%-2rem)] max-w-sm mx-auto"
            >
              <div className="bg-gradient-to-b from-customPurple/90 to-customMidBlue/90 border-none p-6 sm:p-8 text-center rounded-3xl shadow-[0_0_30px_rgba(53,0,211,0.4)]">
                <div className="relative">
                  {/* Custom close button */}
                  <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                  >
                    <X size={18} className="text-white/80" />
                  </button>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-xl"></div>
                  
                  <h2 className="text-lg sm:text-xl font-bold mb-4">{item.title}</h2>
                  
                  <div className="my-4 sm:my-6 mx-auto w-32 h-32 sm:w-40 sm:h-40 relative">
                    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {isLottieAnimation(item.link) ? (
                        <LottieItem
                          animationData={item.link}
                          className="w-full h-full"
                          loop={true}
                          autoplay={true}
                        />
                      ) : (
                        <img 
                          src={item.link} 
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <span className="text-yellow-400 font-bold">{item.price} TON</span>
                    {item.number && (
                      <span className="text-white/70 text-sm">#{item.number}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mt-4 text-left">
                    {item.model && (
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                        <span className="text-sm font-medium">Модель:</span>
                        <div className="text-sm text-white/80 mt-1">{item.model}</div>
                      </div>
                    )}
                    
                    {item.symbol && (
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                        <span className="text-sm font-medium">Символ:</span>
                        <div className="text-sm text-white/80 mt-1">{item.symbol}</div>
                      </div>
                    )}
                    
                    {item.backdrop && (
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                        <span className="text-sm font-medium">Фон:</span>
                        <div className="text-sm text-white/80 mt-1">{item.backdrop}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailModal;
