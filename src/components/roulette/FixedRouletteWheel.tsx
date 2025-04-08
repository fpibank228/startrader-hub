
import { useState, useEffect } from 'react';
import StarCard from '../StarCard';
import FixedRouletteDisplay from './FixedRouletteDisplay';
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
  gift_id?: string;
}

interface FixedRouletteWheelProps {
  onSpin?: (result: RouletteItem) => void;
}
import {apiService} from "@/utils/api.ts";
import NftResultModal from "@/components/roulette/NftResultModal.tsx";
import {useToast} from '../../hooks/use-toast';

const FixedRouletteWheel = ({ onSpin }: FixedRouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [items, setItems] = useState<RouletteItem[]>([]);
  const isMobile = useIsMobile();
  const {toast} = useToast();

  // Always use index 4 (5th item) as the winning item
  const winningIndex = 4;

  // Initialize with fresh data on mount - shuffle only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itms = await apiService.createNftSpinInvoice();
        setItems([...itms.data]); // Объединяем базовые и полученные элементы
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems([]); // Используем только базовые в случае ошибки
      }
    };

    fetchData();
  }, []);

  const spinWheel = async () => {
    try {
      const itms = await apiService.createNftSpin();
    } catch (e){

      toast({
        title: 'Ошибка',
        description: 'Недостаточно средств, пополните ваш баланс',
        variant: 'destructive',
      });
      return;
    }

    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);

    // Dynamic item dimensions based on mobile or desktop view
    const itemWidth = isMobile ? 80 : 120; // Smaller on mobile
    const itemGap = isMobile ? 12 : 16;    // Smaller gap on mobile
    const totalItemSpace = itemWidth + itemGap;
    
    // Calculate random offset from center (between -itemWidth/2 and +itemWidth/2 pixels)
    // This makes the wheel stop slightly before or after the exact center for variability
    const randomOffset = Math.floor(Math.random() * itemWidth - (itemWidth / 2)) - (itemWidth / 2);
    
    // Reset to initial position
    setSlidePosition(0);
    
    // Calculate the number of complete rotations (4 as requested) plus the target position
    const totalItems = items.length;
    const completeRotations = 4; // 4 complete rotations before stopping
    
    // Calculate final position to center on the winning item
    // We use the middle set of items plus the random offset
    const middleSetIndex = 2; // Use the middle (3rd) set of items
    const targetPosition = -((middleSetIndex * totalItems + winningIndex) * totalItemSpace + (itemWidth / 2) + randomOffset);
    
    // Start the animation after a short delay
    setTimeout(() => {
      setSlidePosition(targetPosition);
      
      // Set a timeout for when the animation completes
      setTimeout(() => {
        setSelectedIndex(5);
        setIsSpinning(false);
        
        // Prepare result data and show modal
        if (items && items.length > winningIndex) {
          setResult(items[5]);
          setShowResultModal(true);
          
          if (onSpin && items[winningIndex]) {
            onSpin(items[winningIndex]);
          }
        }
      }, 4500); // Match duration to the animation in FixedRouletteStrip
    }, 10);
  };

  const handleCloseModal = () => {
    setShowResultModal(false);

    // Reset wheel position after modal is closed
    setTimeout(() => {
      setSlidePosition(0);
      setSelectedIndex(null);
    }, 100);
  };

  const handlePlayAgain = () => {
    apiService.sellGift(result.gift_id)
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
      <NftResultModal
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
