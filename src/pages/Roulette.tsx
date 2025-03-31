
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import RouletteSelector from '../components/roulette/RouletteSelector';
import WebApp from "@twa-dev/sdk";

// Sample data for the roulette
const rouletteOptions = [
  {
    id: 'basic',
    title: 'Обычная рулетка',
    description: 'Испытайте свою удачу с шансом выигрыша',
    icon: <Star className="w-12 h-12 text-white/90" />,
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    path: '/roulette/basic'
  },
  {
    id: 'nft',
    title: 'NFT рулетка',
    description: 'Выиграйте уникальные NFT предметы',
    icon: <Star className="w-12 h-12 text-white/90 opacity-50" />,
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    disabled: true
  },
  {
    id: 'upgrade',
    title: 'Апгрейд',
    description: 'Улучшите свои существующие предметы',
    icon: <Star className="w-12 h-12 text-white/90 opacity-50" />,
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    disabled: true
  }
];

const Roulette = () => {
  const isFullscreen = WebApp.isFullscreen;

  return (
    <div className="relative min-h-screen pt-4 pb-24" style={{
      marginTop: isFullscreen ? "80px" : "0px",
    }}>
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Звёздная Рулетка
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/70 text-sm mb-6">
            Испытайте удачу и выиграйте призы! Выберите тип рулетки, чтобы начать игру.
          </p>
          
          <RouletteSelector 
            options={rouletteOptions} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Roulette;
