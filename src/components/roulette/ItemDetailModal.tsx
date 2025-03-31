
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LottieItem from './LottieItem';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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

const ItemDetailModal = ({ isOpen, onClose, item }: ItemDetailModalProps) => {
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Reset loading state when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      setContentLoaded(false);
      // Имитируем время загрузки, чтобы показать состояние загрузки
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, item]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-customPurple/90 to-customMidBlue/90 border-none p-8 text-center max-w-sm mx-auto rounded-3xl shadow-[0_0_30px_rgba(53,0,211,0.4)]">
        <DialogTitle className="sr-only">Информация об элементе</DialogTitle>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
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
          
          <h2 className="text-xl font-bold mb-4">{item.title}</h2>
          
          <div className="my-6 mx-auto w-40 h-40 relative">
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {!contentLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 z-10">
                  <Loader2 className="w-10 h-10 animate-spin text-white/70" />
                </div>
              )}
              <LottieItem 
                animationData={item.link} 
                className="w-full h-full"
                loop={true}
                autoplay={true}
              />
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
