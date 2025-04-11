import { memo } from 'react';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';
import { useIsMobile } from '../../hooks/use-mobile';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  price: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
  number?: number;
}

interface PrizeGridProps {
  items: RouletteItem[];
  onItemClick?: (item: RouletteItem) => void;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const PrizeGrid = memo(({ items, onItemClick }: PrizeGridProps) => {
  // Make sure items is never undefined
  const safeItems = items || [];
  const isMobile = useIsMobile();

  // Helper function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array: RouletteItem[]): RouletteItem[] => {
    const shuffled = [...array]; // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  // Shuffle items before rendering
  const shuffledItems = shuffleArray(safeItems);

  // Helper function to determine if URL is a Lottie animation
  const isLottieAnimation = (url: string): boolean => {
    return url?.toLowerCase?.().endsWith('.json') || false;
  };

  return (
      <div className="w-full max-w-md mt-4">
        <h3 className="text-center text-lg font-medium mb-4">Возможные выигрыши</h3>
        <div className="grid grid-cols-3 gap-4">
          {shuffledItems.map((item, index) => (
              <StarCard
                  key={index}
                  className="p-3 flex flex-col items-center cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => onItemClick && onItemClick(item)}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/30 shadow-[0_0_5px_rgba(255,255,255,0.2)] flex items-center justify-center">
                  {isLottieAnimation(item.link) ? (
                      <LottieItem
                          animationData={item.link}
                          className="w-full h-full"
                          loop={false}
                          autoplay={false}
                      />
                  ) : (
                      <img
                          src={item.link}
                          alt={item.title}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://placehold.co/100x100/purple/white?text=Prize';
                          }}
                      />
                  )}
                </div>
                <div className="text-sm mt-2 text-center font-medium">
                  {item.title}
                </div>
                <div className="text-xs mt-1 text-yellow-400 font-medium">
                  {item.price} TON
                </div>
                {item.number && (
                    <div className="text-xs mt-1 text-white/60">
                      #{item.number}
                    </div>
                )}
              </StarCard>
          ))}
        </div>
      </div>
  );
});

PrizeGrid.displayName = 'PrizeGrid';

export default PrizeGrid;