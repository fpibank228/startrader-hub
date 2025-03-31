
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';
import { useIsMobile } from '../../hooks/use-mobile';

interface RouletteItem {
  chance: string;
  link: string;
  image?: string; // Optional image property
}

interface RouletteWheelProps {
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const items = [
    {
      'chance': 'yes',
      'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2017/10/29/12/06/cake-2899717_1280.jpg'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2018/04/16/09/07/ring-3324230_1280.jpg'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2018/01/29/07/11/flower-3115353_1280.jpg'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2016/11/22/18/52/cake-1850011_1280.jpg'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2018/01/04/19/43/sparkler-3061402_1280.jpg'
    },
    {
      'chance': 'no',
      'link': 'https://nft.fragment.com/gift/partysparkler-42952.lottie.json',
      'image': 'https://cdn.pixabay.com/photo/2018/01/04/19/43/sparkler-3061402_1280.jpg'
    },
  ];

  // Find the winning item index (chance === "yes")
  const winningIndex = items.findIndex(item => item.chance === "yes");
  const safeWinningIndex = 0;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedIndex(null);
    
    // Размеры элементов
    const itemWidth = 120; // ширина элемента + отступ
    const stripWidth = items.length * itemWidth;
    
    // Получаем фактическую ширину контейнера
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const centerPosition = containerWidth / 2;
    
    // Начальная позиция (без анимации)
    const startPosition = 0;
    
    // Промежуточная позиция для анимации - сдвигаем ленту далеко влево
    const midwayPosition = -(stripWidth * 3);
    
    // Финальная позиция, где выигрышный элемент будет точно по центру контейнера
    // Учитываем положение центра контейнера и позицию выигрышного элемента
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
        
        <div 
          ref={containerRef}
          className="relative h-40 mx-auto bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden"
        >
          {/* Center indicator */}
          <div className="absolute left-1/2 top-0 bottom-0 -ml-[2px] w-1 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] z-20"></div>
          
          {/* Highlight glow around the center */}
          <div className="absolute left-1/2 top-0 bottom-0 -ml-6 w-12 bg-white/5 blur-md z-10"></div>
          
          <motion.div 
            ref={stripRef}
            className="absolute top-0 bottom-0 flex items-center gap-4 px-6 py-2"
            animate={{ 
              x: slidePosition 
            }}
            transition={{ 
              duration: isSpinning ? 5 : 0,
              ease: [0.1, 0.8, 0.5, 1],
              type: "tween"
            }}
          >
            {/* Repeat items multiple times to create illusion of infinite strip */}
            {[...Array(7)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex items-center gap-6">
                {items.map((item, index) => {
                  const isSelected = selectedIndex === index && repeatIndex === 3;
                  return (
                    <div 
                      key={`${repeatIndex}-${index}`}
                      className={`w-24 h-24 flex-shrink-0 ${
                        isSelected ? 'scale-110 z-10' : ''
                      }`}
                    >
                      <div className={`w-full h-full rounded-lg overflow-hidden border-2 ${
                        isSelected ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]' : 'border-white/30'
                      } bg-white/10 flex items-center justify-center`}>
                        {/* Use LottieItem with autoplay=false to show only the first frame */}
                        <LottieItem 
                          animationData={item.link} 
                          className="w-full h-full"
                          loop={false}
                          autoplay={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={spinWheel}
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
        </div>
      </StarCard>

      {/* Показываем все возможные выигрыши под рулеткой */}
      <div className="w-full max-w-md mt-4">
        <h3 className="text-center text-lg font-medium mb-4">Возможные выигрыши</h3>
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, index) => (
            <StarCard 
              key={index} 
              className="p-2 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/30">
                <LottieItem 
                  animationData={item.link} 
                  className="w-full h-full"
                  loop={false}
                />
              </div>
              <div className="text-sm mt-2 text-center">
                {item.chance === "yes" ? "Главный приз" : `Приз ${index}`}
              </div>
            </StarCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;
