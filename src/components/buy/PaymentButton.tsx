
import { Wallet, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentButtonProps {
  handlePayment: () => void;
  isDisabled: boolean;
  buttonText?: string;
  paymentMethod?: 'crypto' | 'rubles';
}

const PaymentButton = ({ 
  handlePayment, 
  isDisabled, 
  buttonText = 'Оплатить в TON', 
  paymentMethod = 'crypto' 
}: PaymentButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <button
        onClick={handlePayment}
        disabled={isDisabled}
        className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
          !isDisabled
            ? paymentMethod === 'crypto' 
              ? 'bg-customPurple text-white btn-glow hover:bg-opacity-90 animate-pulse-purple'
              : 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
      >
        {paymentMethod === 'crypto' ? (
          <Wallet size={18} />
        ) : (
          <CreditCard size={18} />
        )}
        {buttonText}
      </button>
    </motion.div>
  );
};

export default PaymentButton;
