
import { useNavigate } from 'react-router-dom';
import StarCard from '../StarCard';

interface RouletteOption {
  id: string;
  title: string;
  description: string;
  minLevel?: number;
  image: string;
}

interface RouletteSelectorProps {
  options: RouletteOption[];
}

const RouletteSelector = ({ options }: RouletteSelectorProps) => {
  const navigate = useNavigate();

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'basic') {
      navigate('/roulette/basic');
    } else if (optionId === 'nft') {
      // Redirect directly to fixed roulette for NFT option
      navigate('/roulette/fixed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <div key={option.id} onClick={() => handleOptionClick(option.id)}>
          <StarCard className="p-4 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-blue-600 flex items-center justify-center">
                <img src={option.image} alt={option.title} className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{option.title}</h3>
                <p className="text-white/70 text-sm">{option.description}</p>
              </div>
            </div>
          </StarCard>
        </div>
      ))}
    </div>
  );
};

export default RouletteSelector;
