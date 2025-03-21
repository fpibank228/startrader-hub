
import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentButtonProps {
  handlePayment: () => void;
  isDisabled: boolean;
}

const PaymentButton = ({ handlePayment, isDisabled }: PaymentButtonProps) => {
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
            ? 'bg-customPurple text-white btn-glow hover:bg-opacity-90'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
      >
        <Wallet size={18} />
        Оплатить в TON
      </button>
    </motion.div>
  );
};

export default PaymentButton;
