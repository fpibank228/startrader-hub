
import { Coins, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface TONBalanceDisplayProps {
  balance: number;
}

const TONBalanceDisplay = ({ balance }: TONBalanceDisplayProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mb-6"
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900/70 via-purple-900/70 to-blue-900/70 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-inner">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs">Ваш баланс</p>
            <p className="text-lg font-semibold">
              {balance.toFixed(1)} <span className="text-yellow-400">TON</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 rounded-lg border border-white/10">
          <Coins size={16} className="text-yellow-400" />
          <span className="text-yellow-300 text-sm font-medium">1 спин = 2 TON</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TONBalanceDisplay;
