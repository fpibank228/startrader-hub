
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarCard from '../StarCard';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
    } else if (onSelect) {
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
    <div className="grid gap-4">
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
            className={`p-0 overflow-hidden ${option.disabled ? 'opacity-70' : 'cursor-pointer hover:shadow-lg transition-shadow'}`}
            onClick={() => !option.disabled && handleSelect(option)}
          >
            {option.imageBg && (
              <div 
                className="w-full h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${option.imageBg})` }}
              >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {option.icon ? renderIcon(option.icon) : <Star className="w-12 h-12 text-white opacity-70" />}
                </div>
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {option.title}
                    {option.disabled && <Lock size={14} className="text-white/60" />}
                  </h3>
                  <p className="text-sm text-white/70">{option.description}</p>
                </div>
                {!option.disabled && <ChevronRight className="w-5 h-5 text-white/60" />}
              </div>
            </div>
          </StarCard>
        </motion.div>
      ))}
    </div>
  );
};

export default RouletteSelector;
