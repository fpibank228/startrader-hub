
import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import { Loader2 } from 'lucide-react';

interface LottieItemProps {
  animationData: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieItem = ({ animationData, className = '', loop = true, autoplay = true }: LottieItemProps) => {
  const [animation, setAnimation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnimation = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch(animationData);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        setAnimation(data);
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (animationData) {
      fetchAnimation();
    }
  }, [animationData]);

  if (isLoading) {
    return <div className={`flex items-center justify-center ${className}`}><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (error) {
    return <div className={`flex items-center justify-center bg-white/10 rounded-lg ${className}`}>❓</div>;
  }

  return (
    <div className={className}>
      {animation && (
        <Lottie
          animationData={animation}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default LottieItem;
