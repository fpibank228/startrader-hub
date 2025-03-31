
import { useState, useEffect } from 'react';
import StarCard from '../StarCard';
import RouletteDisplay from './RouletteDisplay';
import SpinButton from './SpinButton';
import PrizeGrid from './PrizeGrid';
import { useIsMobile } from '../../hooks/use-mobile';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
}

interface RouletteWheelProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ items, onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Find the winning item index (chance === "yes")
  const winningIndex = items.findIndex(item => item.chance === "yes");
  const safeWinningIndex = winningIndex >= 0 ? winningIndex : 0;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);
    
    // Размеры элементов
    const itemWidth = 120; // ширина элемента + отступ
    const stripWidth = items.length * itemWidth;
    
    // Начальная позиция (без анимации)
    const startPosition = 0;
    
    // Промежуточная позиция для анимации - сдвигаем ленту далеко влево
    const midwayPosition = -(stripWidth * 3);
    
    // Финальная позиция, где выигрышный элемент будет точно по центру контейнера
    const containerWidth = window.innerWidth;
    const centerPosition = containerWidth / 2;
    const targetItemLeftPosition = midwayPosition + (stripWidth - (4 * itemWidth));
    const finalPosition = targetItemLeftPosition - centerPosition + (itemWidth / 2);
    
    // Устанавливаем начальную позицию (без анимации)
    setSlidePosition(startPosition);
    
    // Запускаем анимацию через небольшую задержку
    setTimeout(() => {
      // Единая анимация с использованием одного вызова
      setSlidePosition(finalPosition);
      
      // После завершения анимации
      setTimeout(() => {
        setSelectedIndex(safeWinningIndex);
        setIsSpinning(false);
        
        if (onSpin) {
          onSpin(items[safeWinningIndex]);
        }
      }, 5000); // Время до полной остановки (5 секунд)
    }, 10);
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
      <PrizeGrid items={items} />
    </div>
  );
};

export default RouletteWheel;
