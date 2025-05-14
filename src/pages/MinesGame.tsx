import React from 'react';
import { motion } from 'framer-motion';
import StarBackground from '../components/StarBackground';
import MinesGame from '../components/roulette/MinesGame';
import WebApp from "@twa-dev/sdk";

const MinesGamePage = () => {
    const isFullscreen = WebApp.isFullscreen;

    return (
        <div className="relative min-h-screen pt-4 pb-24" style={{
            marginTop: isFullscreen ? "80px" : "0px",
        }}>
            <StarBackground />
            
            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Мины</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Откройте все ячейки, избегая мин. Чем больше ячеек вы откроете, тем выше будет ваш выигрыш!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <MinesGame />
                </motion.div>
            </div>
        </div>
    );
};

export default MinesGamePage; 