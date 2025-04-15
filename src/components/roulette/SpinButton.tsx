
import { memo } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpinButtonProps {
  isSpinning: boolean;
  onSpin: () => void;
  price: string;
}

// Мемоизируем кнопку, чтобы предотвратить лишние ререндеры
const SpinButton = memo(({ isSpinning, onSpin, price }: SpinButtonProps) => {
  return (
    <Button
      onClick={onSpin}
      disabled={isSpinning}
      className="w-full py-6 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90 disabled:opacity-50 h-auto"
    >
      {isSpinning ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Крутится...
        </>
      ) : (
        <>
          <Play size={20} />
          Крутить рулетку {price}
        </>
      )}
    </Button>
  );
});

SpinButton.displayName = 'SpinButton';

export default SpinButton;
