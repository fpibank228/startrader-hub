
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import RouletteSelector from '../components/roulette/RouletteSelector';
import WebApp from "@twa-dev/sdk";
import { rouletteOptions } from '../data/rouletteData';

const Roulette = () => {
  const isFullscreen = WebApp.isFullscreen;

  // Use all options, now the upgrade option is properly linked in the router
  const displayOptions = rouletteOptions;

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
            options={displayOptions} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Roulette;
