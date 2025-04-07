
import React from 'react';
import { motion } from 'framer-motion';

interface GiftUpgradeMultiplierProps {
  selectedMultiplier: number;
  onChange: (multiplier: number) => void;
}

const GiftUpgradeMultiplier = ({ selectedMultiplier, onChange }: GiftUpgradeMultiplierProps) => {
  const multipliers = [2, 5, 10];
  
  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <div className="mb-2">Выберите множитель апгрейда:</div>
      <div className="flex space-x-2">
        {multipliers.map((multiplier) => (
          <button
            key={multiplier}
            onClick={() => onChange(multiplier)}
            className={`flex-1 py-3 px-2 rounded-lg flex items-center justify-center transition-all ${
              selectedMultiplier === multiplier
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <div className="text-center">
              <span className="text-lg font-bold">x{multiplier}</span>
              <div className="text-xs mt-1 opacity-80">
                {multiplier === 2 ? 'Низкий риск' : multiplier === 5 ? 'Средний риск' : 'Высокий риск'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GiftUpgradeMultiplier;
