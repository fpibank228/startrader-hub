
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarAmountSelectorProps {
  onSelect: (amount: number) => void;
}

const StarAmountSelector = ({ onSelect }: StarAmountSelectorProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const starAmounts = [50, 100, 150, 200, 250, 500, 1000];

  const handleSelect = (amount: number) => {
    setSelectedAmount(amount);
    onSelect(amount);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white/90">Выберите количество звезд:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {starAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleSelect(amount)}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 ${
              selectedAmount === amount
                ? 'bg-customPurple text-white shadow-lg shadow-customPurple/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Star 
              size={16} 
              className={`${selectedAmount === amount ? 'text-yellow-300' : 'text-white/50'}`}
              fill={selectedAmount === amount ? 'rgba(253, 224, 71, 0.5)' : 'transparent'} 
            />
            <span className="font-medium">{amount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarAmountSelector;
