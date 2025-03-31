
import { memo } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface SpinButtonProps {
  isSpinning: boolean;
  onSpin: () => void;
}

// Мемоизируем кнопку, чтобы предотвратить лишние ререндеры
const SpinButton = memo(({ isSpinning, onSpin }: SpinButtonProps) => {
  return (
    <button
      onClick={onSpin}
      disabled={isSpinning}
      className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90 disabled:opacity-50"
    >
      {isSpinning ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Крутится...
        </>
      ) : (
        <>
          <Play size={20} />
          Крутить
        </>
      )}
    </button>
  );
});

SpinButton.displayName = 'SpinButton';

export default SpinButton;
