import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import bombImage from '../../assets/images/roulette/bomb.png';
import cristalImage from '../../assets/images/roulette/cristal.png';

interface MinesResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    winAmount: number;
    isWin: boolean;
    multiplier: number;
}

const MinesResultModal: React.FC<MinesResultModalProps> = ({
    isOpen,
    onClose,
    winAmount,
    isWin,
    multiplier
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-customDark border-white/40 border-2 p-6 sm:p-8 text-center rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-center">
                        {isWin ? "Победа!" : "Игра окончена"}
                    </DialogTitle>
                </DialogHeader>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mt-4 flex justify-center"
                >
                    {isWin ? (
                        <img src={cristalImage} alt="Crystal" className="w-24 h-24" />
                    ) : (
                        <img src={bombImage} alt="Bomb" className="w-24 h-24" />
                    )}
                </motion.div>

                <div className="mt-4 space-y-2">
                    {isWin ? (
                        <>
                            <p className="text-2xl font-bold text-green-400">
                                +{winAmount} ⭐
                            </p>
                            <p className="text-white/70">
                                Множитель: x{multiplier.toFixed(1)}
                            </p>
                        </>
                    ) : (
                        <p className="text-white/70">
                            К сожалению, вы попали на мину
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <Button
                        onClick={onClose}
                        className="w-full bg-white/20 hover:bg-white/30 text-white"
                    >
                        {isWin ? "Забрать выигрыш" : "Играть снова"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MinesResultModal; 