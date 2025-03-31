
import { useState, useEffect } from 'react';
import StarCard from '../StarCard';
import RouletteDisplay from './RouletteDisplay';
import SpinButton from './SpinButton';
import PrizeGrid from './PrizeGrid';
import { useIsMobile } from '../../hooks/use-mobile';
import RouletteResultModal from './RouletteResultModal';
import ItemDetailModal from './ItemDetailModal';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
  price: number;
  model?: string;
  symbol?: string;
  backdrop?: string;
}

interface RouletteWheelProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ items, onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const isMobile = useIsMobile();

  // Always use index 6 (7th item) as the winning item for consistency
  const winningIndex = 6;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);
    
    // Fixed item width for consistency
    const itemWidth = 120;
    
    // Always target the 7th item (index 6) to appear in the center
    // Regardless of screen size, we'll position this item in the center
    
    // Start with an initial position of 0
    setSlidePosition(0);
    
    // Short delay before starting the animation
    setTimeout(() => {
      // Calculate a position that will place the target item in the center
      // We use a fixed calculation that works on all screen sizes
      // Negative value moves the strip to the left
      const finalPosition = -((winningIndex + 0.5) * itemWidth);
      
      // Start the animation to the final position
      setSlidePosition(finalPosition);
      
      // Set a timeout for when the animation completes
      setTimeout(() => {
        setSelectedIndex(winningIndex);
        setIsSpinning(false);
        
        // Show the result modal
        setResult(items[winningIndex]);
        setShowResultModal(true);
        
        if (onSpin) {
          onSpin(items[winningIndex]);
        }
      }, 5000); // Animation duration (5 seconds)
    }, 10);
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setResult(null);
  };

  const handleItemClick = (item: RouletteItem) => {
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>
        
        <RouletteDisplay 
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

export default RouletteWheel;
