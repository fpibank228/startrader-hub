
import { useEffect, useState, memo } from 'react';
import Lottie from "lottie-react";

interface LottieItemProps {
  animationData: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const LottieItem = memo(({ animationData, className = '', loop = true, autoplay = true }: LottieItemProps) => {
  const [animation, setAnimation] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimation = async () => {
      try {
        const response = await fetch(animationData);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        if (isMounted) {
          setAnimation(data);
        }
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    if (animationData) {
      fetchAnimation();
    }

    return () => {
      isMounted = false;
    };
  }, [animationData]);

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
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      )}
    </div>
  );
});

LottieItem.displayName = 'LottieItem';

export default LottieItem;
