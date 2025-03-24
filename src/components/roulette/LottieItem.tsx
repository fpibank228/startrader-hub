
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Loader2 } from 'lucide-react';

interface LottieItemProps {
  url: string;
  width?: number | string;
  height?: number | string;
}

const LottieItem = ({ url, width = 50, height = 50 }: LottieItemProps) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnimation = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch animation');
        
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchAnimation();
    }
  }, [url]);

  if (isLoading) {
    return <div className="flex items-center justify-center" style={{ width, height }}><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center bg-gray-200 rounded" style={{ width, height }}>Error</div>;
  }

  return (
    <div style={{ width, height }}>
      {animationData && (
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default LottieItem;
