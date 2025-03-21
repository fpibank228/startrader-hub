import { useState } from 'react';
import { Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StarAmountSelectorProps {
  onSelect: (amount: number) => void;
}

const StarAmountSelector = ({ onSelect }: StarAmountSelectorProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50); // Начальное значение 50
  const [customAmount, setCustomAmount] = useState<string>('');
  const starAmounts = [50, 100, 150, 200, 250, 500, 1000];

  const handleSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    onSelect(amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 50) { // Проверка на минимальное значение 50
      onSelect(numValue);
    } else if (numValue < 50) {
      onSelect(50); // Устанавливаем минимальное значение 50
    }
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

        <div className="mt-4">
          <label className="block text-white/90 text-sm mb-2">
            Или введите своё количество:
          </label>
          <Input
              type="number"
              min="50"
              placeholder="Например: 75"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="bg-white/5 border-white/10 focus:border-customPurple"
              style={{
                WebkitAppearance: 'none', // Скрыть стрелочки в Safari
                MozAppearance: 'textfield', // Скрыть стрелочки в Firefox
              }}
          />
        </div>
      </div>
  );
};

export default StarAmountSelector;