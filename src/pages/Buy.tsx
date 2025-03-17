
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, DollarSign, Wallet } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import StarAmountSelector from '../components/StarAmountSelector';

const TON_PRICE = 3.5; // TON price in USD
const STAR_PRICE = 0.015; // Price per star in USD

const Buy = () => {
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const { toast } = useToast();

  const handleStarSelect = (amount: number) => {
    setSelectedStars(amount);
  };

  const calculatePrice = () => {
    if (!selectedStars) return { usd: 0, ton: 0 };
    
    const usdPrice = selectedStars * STAR_PRICE;
    const tonPrice = usdPrice / TON_PRICE;
    
    return {
      usd: usdPrice.toFixed(2),
      ton: tonPrice.toFixed(4)
    };
  };

  const handlePayment = () => {
    if (!selectedStars) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите количество звезд",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Заказ создан",
      description: `Вы покупаете ${selectedStars} звезд за ${calculatePrice().ton} TON`,
    });
  };

  return (
    <div className="relative min-h-screen pt-4 pb-24">
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Купить звезды</h1>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Выберите количество звезд, которое хотите приобрести. Оплата в криптовалюте TON.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StarCard className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-300" fill="rgba(253, 224, 71, 0.5)" />
                  <span className="font-medium">Цена за звезду</span>
                </div>
                <span className="text-white font-bold">${STAR_PRICE}</span>
              </div>
              <div className="h-0.5 bg-white/10 mb-4"></div>
              <StarAmountSelector onSelect={handleStarSelect} />
            </StarCard>
          </motion.div>

          {selectedStars && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StarCard className="mb-6 border border-customPurple/50">
                <h3 className="text-lg font-medium mb-4">Ваш заказ</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Количество звезд:</span>
                    <span className="font-medium flex items-center gap-1">
                      {selectedStars}
                      <Star size={14} className="text-yellow-300" fill="rgba(253, 224, 71, 0.5)" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Стоимость в USD:</span>
                    <span className="font-medium flex items-center gap-1">
                      ${calculatePrice().usd}
                      <DollarSign size={14} />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">К оплате в TON:</span>
                    <span className="font-medium text-customPurple flex items-center gap-1">
                      {calculatePrice().ton} TON
                      <Wallet size={14} />
                    </span>
                  </div>
                </div>
              </StarCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={handlePayment}
              disabled={!selectedStars}
              className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                selectedStars
                  ? 'bg-customPurple text-white btn-glow hover:bg-opacity-90'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <Wallet size={18} />
              Оплатить в TON
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
