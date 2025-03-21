
import { Star, DollarSign, Wallet } from 'lucide-react';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';

interface PaymentDetailsCardProps {
  selectedStars: number;
  calculatePrice: () => { usd: string; ton: string };
}

const PaymentDetailsCard = ({ selectedStars, calculatePrice }: PaymentDetailsCardProps) => {
  return (
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
            <span className="font-medium text-customBlue flex items-center gap-1">
              {calculatePrice().ton} TON
              <Wallet size={14} />
            </span>
          </div>
        </div>
      </StarCard>
    </motion.div>
  );
};

export default PaymentDetailsCard;
