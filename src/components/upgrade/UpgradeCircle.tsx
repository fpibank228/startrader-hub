
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { ArrowUp } from 'lucide-react';

interface UpgradeCircleProps {
  multiplier: number;
  onSpinComplete?: () => void;
  isSpinning?: boolean;
  initialRotation?: number;
}

const UpgradeCircle: React.FC<UpgradeCircleProps> = ({
  multiplier,
  onSpinComplete,
  isSpinning = false,
  initialRotation = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(isSpinning);
  const [rotation, setRotation] = useState(initialRotation);
  
  // Calculate progress based on multiplier (2 -> 20%, 5 -> 50%, 10 -> 100%)
  const progressPercentage = (multiplier / 10) * 100;
  
  const handleSpin = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setRotation(rotation + 1080 + Math.random() * 360); // 3+ full rotations + random
    
    // Notify parent when spin completes
    setTimeout(() => {
      setIsAnimating(false);
      if (onSpinComplete) onSpinComplete();
    }, 3000);
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto">
      {/* Circular progress component */}
      <div className="absolute inset-0">
        <CircularProgress progress={progressPercentage} />
      </div>
      
      {/* Center point */}
      <div className="absolute w-4 h-4 bg-white rounded-full z-10"></div>
      
      {/* Rotating arrow */}
      <motion.div
        className="absolute z-20 origin-center"
        style={{ transformOrigin: 'center' }}
        animate={{ rotate: rotation }}
        initial={{ rotate: initialRotation }}
        transition={{ 
          duration: 3, 
          ease: [0.32, 0.72, 0.35, 1.12],
        }}
      >
        <div className="h-32 flex items-center justify-center">
          <ArrowUp size={32} className="text-white" />
        </div>
      </motion.div>
      
      {/* Spin button */}
      <div className="absolute -bottom-16">
        <Button 
          onClick={handleSpin} 
          disabled={isAnimating}
          variant="default" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Вращать
        </Button>
      </div>
    </div>
  );
};

// Custom circular progress component
const CircularProgress = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 120; // 120 is the radius
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Beginning from the bottom (270 degrees)
  const rotation = -90;
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 264 264" className="transform rotate-90">
        {/* Background circle */}
        <circle
          cx="132"
          cy="132"
          r="120"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <circle
          cx="132"
          cy="132"
          r="120"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(${rotation} 132 132)`}
          className="transition-all duration-1000 ease-in-out"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default UpgradeCircle;
