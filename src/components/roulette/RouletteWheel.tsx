
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCw, Loader2 } from 'lucide-react';
import StarCard from '../StarCard';

interface RouletteItem {
  chance: string;
  link: string;
}

interface RouletteWheelProps {
  items: RouletteItem[];
  onSpin?: (result: RouletteItem) => void;
}

const RouletteWheel = ({ items, onSpin }: RouletteWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Calculate a random result
    const randomIndex = Math.floor(Math.random() * items.length);
    const spinDegree = 1800 + (randomIndex * (360 / items.length)); // Multiple spins + position
    
    // Set the rotation
    setRotationDegree(spinDegree);
    
    // After spinning is complete
    setTimeout(() => {
      setSelectedIndex(randomIndex);
      setIsSpinning(false);
      
      if (onSpin) {
        onSpin(items[randomIndex]);
      }
    }, 3000); // Match this with the animation duration
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md mb-6">
        <div 
          ref={wheelRef}
          className="w-full aspect-square rounded-full bg-gradient-to-r from-customPurple to-customBrightBlue mx-auto relative overflow-hidden"
        >
          <motion.div 
            className="w-full h-full absolute"
            animate={{ rotate: rotationDegree }}
            transition={{ 
              duration: 3,
              ease: [0.2, 0.65, 0.3, 0.9], // Custom easing function
            }}
          >
            {items.map((item, index) => {
              const angle = (360 / items.length) * index;
              return (
                <div 
                  key={index}
                  className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div className="absolute w-full h-1/2 origin-bottom transform-gpu" style={{ transformOrigin: 'center bottom' }}>
                    <div 
                      className={`absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-lg flex items-center justify-center
                        ${selectedIndex === index ? 'scale-110 ring-2 ring-white ring-opacity-70' : ''}`}
                    >
                      {item.link ? (
                        <img 
                          src={item.link} 
                          alt={`Prize ${index}`} 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/50?text=Error";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/20 rounded-lg">
                          <span>?</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
          
          {/* Center point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 z-10 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-white/40"></div>
          </div>
          
          {/* Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-10 z-10">
            <div className="w-0 h-0 border-left-8 border-right-8 border-top-12 border-transparent border-top-white"></div>
          </div>
        </div>
      </div>
      
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="w-full max-w-xs py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-customPurple to-purple-700 text-white hover:opacity-90 disabled:opacity-50"
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
  );
};

export default RouletteWheel;
