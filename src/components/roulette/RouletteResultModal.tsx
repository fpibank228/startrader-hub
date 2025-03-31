
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LottieItem from './LottieItem';
import { RotateCw, Gift, Wallet } from 'lucide-react';
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
      <DialogContent className="bg-gradient-to-b from-customPurple/90 to-black/90 border border-white/20 p-6 text-center max-w-sm mx-auto rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* Декоративные элементы для красивого модального окна */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-xl"></div>
          
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
          
          <h3 className="text-lg font-semibold mb-1">{result.title}</h3>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-yellow-400 font-bold">{result.price} TON</span>
            <span className="text-sm text-white/60">≈ ${usdPrice}</span>
          </div>
          
          {/* Display attributes if available */}
          {(result.model || result.symbol || result.backdrop) && (
            <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-white/80">
              {result.model && <div>Модель: {result.model}</div>}
              {result.symbol && <div>Символ: {result.symbol}</div>}
              {result.backdrop && <div>Фон: {result.backdrop}</div>}
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
