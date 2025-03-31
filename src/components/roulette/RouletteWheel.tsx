
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
  number?: number;
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
    
    // Fixed item width plus gap for more precise calculations
    const itemWidth = 88 + 16; // Each item is 96px wide (24*4) plus 16px gap
    
    // Calculate the winning position more precisely
    const totalItems = items.length;
    const fullRotations = 2; // 2 full rotations for consistency
    
    // Start with an initial position of 0
    setSlidePosition(0);
    
    // Short delay before starting the animation
    setTimeout(() => {
      // Calculate the final position to ensure the 7th item (index 6) is centered
      // We're using the third repetition of items (since we have 5 repetitions in RouletteStrip)
      const targetSetIndex = 2; // Use the middle (third) set for stability
      const targetItemPosition = targetSetIndex * totalItems + winningIndex;
      
      // Calculate the exact pixel position
      // We add 0.5 to center the item precisely in the indicator
      const finalPosition = -((targetItemPosition + 0.5) * itemWidth);
      
      // Start the animation to the final position
      setSlidePosition(finalPosition);
      
      // Set a timeout for when the animation completes
      setTimeout(() => {
        setSelectedIndex(winningIndex);
        setIsSpinning(false);
        
        // Prepare result data and show modal immediately
        if (items && items.length > winningIndex) {
          setResult(items[winningIndex]);
          setShowResultModal(true);
          
          if (onSpin && items[winningIndex]) {
            onSpin(items[winningIndex]);
          }
        }
      }, 4000); // Slightly shorter than animation duration for better UX
    }, 10); // Small delay before animation starts for better visual effect
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    
    // Reset wheel position after modal is closed
    setTimeout(() => {
      setSlidePosition(0);
      setSelectedIndex(null);
    }, 100); // Faster reset
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setResult(null);
    
    // Reset wheel position for next spin
    setSlidePosition(0);
    setSelectedIndex(null);
  };

  const handleItemClick = (item: RouletteItem) => {
    // Immediately show loading state in modal
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setSelectedItem(null);
  };

  // Make sure items is never undefined to prevent rendering issues
  const safeItems = items || [];

  return (
    <div className="flex flex-col items-center">
      <StarCard className="relative w-full max-w-md mb-6 p-6">
        <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>
        
        <RouletteDisplay 
          items={safeItems}
          slidePosition={slidePosition}
          isSpinning={isSpinning}
          selectedIndex={selectedIndex}
        />
        
        <div className="mt-6">
          <SpinButton isSpinning={isSpinning} onSpin={spinWheel} />
        </div>
      </StarCard>

      {/* Показываем все возможные выигрыши под рулеткой */}
      <PrizeGrid items={safeItems} onItemClick={handleItemClick} />

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
