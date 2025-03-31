
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LottieItem from './LottieItem';
import { RotateCw, Gift, Wallet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTonPrice } from '@/hooks/useTonPrice';
import { useState } from 'react';

interface RouletteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
  } | null;
  onPlayAgain: () => void;
}

const RouletteResultModal = ({ isOpen, onClose, result, onPlayAgain }: RouletteResultModalProps) => {
  const [showButtons, setShowButtons] = useState(true);
  const [action, setAction] = useState<'collect' | 'sell' | null>(null);
  const tonPrice = useTonPrice();
  
  if (!result) return null;
  
  const isWin = result.chance === 'yes';
  const usdPrice = tonPrice ? (result.price * tonPrice).toFixed(2) : 'загрузка...';

  const handlePlayAgain = () => {
    setShowButtons(true);
    setAction(null);
    onPlayAgain();
    onClose();
  };

  const handleCollect = () => {
    setShowButtons(false);
    setAction('collect');
  };

  const handleSell = () => {
    setShowButtons(false);
    setAction('sell');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-customPurple/90 to-customMidBlue/90 border-none p-8 text-center max-w-sm mx-auto rounded-3xl shadow-[0_0_30px_rgba(53,0,211,0.4)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* Custom close button */}
          <button 
            onClick={onClose}
            className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={16} className="text-white/70" />
          </button>
          
          {/* Decorative elements for modal */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-xl"></div>
          
          <h2 className="text-xl font-bold mb-4">
            {isWin ? '🎉 Поздравляем! Вы выиграли!' : 'К сожалению, не повезло'}
          </h2>
          
          <div className="my-6 mx-auto w-40 h-40">
            <div className={`w-full h-full rounded-xl overflow-hidden border-2 ${
              isWin ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)]' : 'border-white/50'
            }`}>
              <LottieItem 
                animationData={result.link} 
                className="w-full h-full"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">{result.title}</h3>
          
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-yellow-400 font-bold">{result.price} TON</span>
            <span className="text-sm text-white/60">≈ ${usdPrice}</span>
          </div>
          
          {result.number && (
            <div className="text-white/70 text-sm mb-3">
              #{result.number}
            </div>
          )}
          
          {/* Display attributes if available */}
          {(result.model || result.symbol || result.backdrop) && (
            <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
              {result.model && (
                <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                  Модель: <span className="text-white/80">{result.model}</span>
                </div>
              )}
              {result.symbol && (
                <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                  Символ: <span className="text-white/80">{result.symbol}</span>
                </div>
              )}
              {result.backdrop && (
                <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                  Фон: <span className="text-white/80">{result.backdrop}</span>
                </div>
              )}
            </div>
          )}
          
          {isWin && showButtons ? (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={handleCollect}
                variant="secondary"
                className="py-3 rounded-xl bg-gradient-to-r from-customPurple/70 to-purple-900/70 hover:from-customPurple hover:to-purple-900 border border-white/10"
              >
                <Gift size={18} className="mr-1" />
                Забрать
              </Button>
              
              <Button
                onClick={handleSell}
                variant="secondary"
                className="py-3 rounded-xl bg-gradient-to-r from-customPurple/70 to-purple-900/70 hover:from-customPurple hover:to-purple-900 border border-white/10"
              >
                <Wallet size={18} className="mr-1" />
                Продать
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              {action === 'collect' ? (
                <p className="text-white/80 mb-6">
                  Ваш подарок успешно добавлен в коллекцию!
                </p>
              ) : action === 'sell' ? (
                <p className="text-white/80 mb-6">
                  {result.price} TON будет отправлено на ваш кошелек!
                </p>
              ) : (
                <p className="text-white/80 mb-6">
                  {isWin 
                    ? 'Ваш приз зачислен на счет!'
                    : 'Попробуйте еще раз, удача обязательно улыбнется!'}
                </p>
              )}
              
              <button
                onClick={handlePlayAgain}
                className="w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90"
              >
                <RotateCw size={18} />
                Играть снова
              </button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default RouletteResultModal;
