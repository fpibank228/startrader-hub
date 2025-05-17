import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Import images
import basicImage from '../../assets/images/roulette/case1.png';
import middleImage from '../../assets/images/roulette/case2.png';
import bigImage from '../../assets/images/roulette/case3.png';
import nftImage from '../../assets/images/roulette/caseNft.png';
import upgradeImage from '../../assets/images/roulette/upgrade.png';
import mineImage from '../../assets/images/roulette/mine.png';
import bombImage from '../../assets/images/roulette/bomb.png';
import cristalImage from '../../assets/images/roulette/cristal.png';

// Image mapping
const imageMap: { [key: string]: string } = {
    basic: basicImage,
    middle: middleImage,
    big: bigImage,
    nft: nftImage,
    upgrade: upgradeImage,
    mine: mineImage,
    bomb: bombImage,
    cristal: cristalImage
};

interface RouletteOption {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageBg?: string;
  disabled?: boolean;
  path?: string;
}

interface RouletteSelectorProps {
  options: RouletteOption[];
  onSelect?: (id: string) => void;
}

const RouletteSelector = ({ options, onSelect }: RouletteSelectorProps) => {
  const navigate = useNavigate();

  const handleSelect = (option: RouletteOption) => {
    if (option.disabled) return;

    if (option.path) {
      navigate(option.path);
    } else if (option.id === 'basic') {
      navigate('/roulette/basic');
    } else if (option.id === 'nft') {
      navigate('/roulette/nft');
    }
    
    if (onSelect) {
      onSelect(option.id);
    }
  };

  const renderIcon = (iconName: string | undefined) => {
    if (!iconName) return <Star className="w-12 h-12 text-white opacity-70" />;

    // @ts-ignore - dynamic icon usage
    const IconComponent = LucideIcons[iconName];

    if (IconComponent) {
      return <IconComponent className="w-12 h-12 text-white/90" />;
    }

    return <Star className="w-12 h-12 text-white opacity-70" />;
  };

  return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
            <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: option.disabled ? 1 : 1.02 }}
                whileTap={{ scale: option.disabled ? 1 : 0.98 }}
            >
              <StarCard
                  className={`p-0 overflow-hidden h-full ${option.disabled ? 'opacity-70' : 'cursor-pointer hover:shadow-lg transition-shadow'}`}
                  onClick={() => !option.disabled && handleSelect(option)}
              >
                {option.imageBg && (
                    <div
                        className="w-full aspect-[16/9] relative overflow-hidden"
                    >
                        <img 
                            src={imageMap[option.id]} 
                            alt={option.title}
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b to-transparent"></div>
                    </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-center">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {option.title}
                        {option.disabled && <Lock size={14} className="text-white/60" />}
                      </h3>
                    </div>
                  </div>
                </div>
              </StarCard>
            </motion.div>
        ))}
      </div>
  );
};

export default RouletteSelector;
