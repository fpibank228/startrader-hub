
import { DollarSign, Wallet } from 'lucide-react';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';

interface TopupDetailsCardProps {
    amount: number;
    calculatePrices: () => { usd: string; ton: string };
}

const PaymentDetailsCard = ({ amount, calculatePrices }: TopupDetailsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <StarCard className="mb-6 border border-customPurple/50">
                <h3 className="text-lg font-medium mb-4">Ваш платеж</h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Сумма пополнения:</span>
                        <span className="font-medium flex items-center gap-1">
                            {amount} TON
                            <Wallet size={14} />
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Стоимость в USD:</span>
                        <span className="font-medium flex items-center gap-1">
                            ${calculatePrices().usd}
                            <DollarSign size={14} />
                        </span>
                    </div>
                </div>
            </StarCard>
        </motion.div>
    );
};

export default PaymentDetailsCard;
