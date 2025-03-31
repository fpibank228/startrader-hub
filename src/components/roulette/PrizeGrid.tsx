
import StarCard from '../StarCard';
import LottieItem from './LottieItem';

interface RouletteItem {
  chance: string;
  link: string;
  title: string;
}

interface PrizeGridProps {
  items: RouletteItem[];
}

const PrizeGrid = ({ items }: PrizeGridProps) => {
  return (
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
              {item.title}
            </div>
          </StarCard>
        ))}
      </div>
    </div>
  );
};

export default PrizeGrid;
