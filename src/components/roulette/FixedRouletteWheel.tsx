
import { useState, useEffect } from 'react';
import StarCard from '../StarCard';
import FixedRouletteDisplay from './FixedRouletteDisplay';
import SpinButton from './SpinButton';
import PrizeGrid from './PrizeGrid';
import { useIsMobile } from '../../hooks/use-mobile';
import RouletteResultModal from './RouletteResultModal';
import ItemDetailModal from './ItemDetailModal';
import { basicRouletteItems } from '../../data/rouletteData';

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

interface FixedRouletteWheelProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
}

const FixedRouletteWheel = ({ items: initialItems, onSpin }: FixedRouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [items, setItems] = useState<RouletteItem[]>(initialItems || []);
  const isMobile = useIsMobile();

  // Always use index 4 (5th item) as the winning item
  const winningIndex = 4;

  // Refresh items data for each spin
  const refreshItems = () => {
    // This will get fresh data from basicRouletteItems
    setItems([...basicRouletteItems]);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    // Refresh items before spinning
    refreshItems();
    
    setIsSpinning(true);
    setSelectedIndex(null);

    // Fixed item width - exactly 140px as requested
    const itemWidth = 140;
    
    // Calculate random offset from center (between -70 and +70 pixels)
    // This makes the wheel stop slightly before or after the exact center for variability
    const randomOffset = Math.floor(Math.random() * itemWidth) - (itemWidth / 2);
    
    // Reset to initial position
    setSlidePosition(0);
    
    // Calculate the number of complete rotations (4 as requested) plus the target position
    const totalItems = items.length;
    const completeRotations = 4; // 4 complete rotations before stopping
    
    // Calculate final position to center on the winning item
    // We use the middle set of items plus the random offset
    const middleSetIndex = 2; // Use the middle (3rd) set of items
    const targetPosition = -((middleSetIndex * totalItems + winningIndex) * itemWidth + (itemWidth / 2) + randomOffset);
    
    // Start the animation after a short delay
    setTimeout(() => {
      setSlidePosition(targetPosition);
      
      // Set a timeout for when the animation completes
      setTimeout(() => {
        setSelectedIndex(winningIndex);
        setIsSpinning(false);
        
        // Prepare result data and show modal
        if (items && items.length > winningIndex) {
          setResult(items[winningIndex]);
          setShowResultModal(true);
          
          if (onSpin && items[winningIndex]) {
            onSpin(items[winningIndex]);
          }
        }
      }, 4500); // Match duration to the animation in FixedRouletteStrip
    }, 10);
  };

  // Initialize with fresh data on mount
  useEffect(() => {
    refreshItems();
  }, []);

  const handleCloseModal = () => {
    setShowResultModal(false);

    // Reset wheel position after modal is closed
    setTimeout(() => {
      setSlidePosition(0);
      setSelectedIndex(null);
    }, 100);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setResult(null);

    // Reset wheel position for next spin
    setSlidePosition(0);
    setSelectedIndex(null);
  };

  const handleItemClick = (item: RouletteItem) => {
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setTimeout(() => {
      setSelectedItem(null);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>

        <FixedRouletteDisplay
          items={items}
          slidePosition={slidePosition}
          isSpinning={isSpinning}
          selectedIndex={selectedIndex}
        />

        <div className="mt-6">
          <SpinButton isSpinning={isSpinning} onSpin={spinWheel} />
        </div>
      </StarCard>

      {/* Показываем все возможные выигрыши под рулеткой */}
      <PrizeGrid items={items} onItemClick={handleItemClick} />

      {/* Модальное окно с результатом */}
      <RouletteResultModal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        result={result}
        onPlayAgain={handlePlayAgain}
      />

      {/* Модальное окно с деталями предмета */}
      {selectedItem && (
        <ItemDetailModal
          isOpen={showItemDetail}
          onClose={handleCloseItemDetail}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default FixedRouletteWheel;
