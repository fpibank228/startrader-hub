
import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LottieItem from '../roulette/LottieItem';
import {Button} from "@/components/ui/button";
import {ArrowUp, Gift, Check, X} from 'lucide-react';
import {WheelRoulette} from './WheelAnimation';

interface GiftItem {
    gift_id: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
    name?: string;
    collectible_id?: number;
    url?: string;
    chance?: string;
    isWin?: boolean;
}

interface UpgradePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    selectedGifts: GiftItem[];
    multiplier: number;
    potentialReward: GiftItem;
    onComplete: (success: boolean, resultGift?: GiftItem) => void;
}

const UpgradePreview = ({
                            isOpen,
                            onClose,
                            selectedGifts,
                            multiplier,
                            potentialReward,
                            onComplete
                        }: UpgradePreviewProps) => {
    const [stage, setStage] = useState<'initial' | 'spinning' | 'result'>('initial');
    const [isSuccess, setIsSuccess] = useState(false);

    // Calculate total value
    const totalValue = selectedGifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
    const upgradedValue = totalValue * multiplier;

    // Set up success probability based on multiplier
    const successProbability = multiplier === 2 ? 0.7 : (multiplier === 5 ? 0.4 : 0.2);

    // When the animation starts, determine success
    const startAnimation = () => {
        setStage('spinning');

        // Randomly determine if the upgrade is successful based on the probability
        const randomSuccess = Math.random() < successProbability;
        setIsSuccess(randomSuccess);

        // After the animation completes, show the result
        setTimeout(() => {
            setStage('result');
        }, 5000); // Match to wheel animation duration
    };

    const handleCompleteUpgrade = () => {
        onComplete(isSuccess, isSuccess ? potentialReward : undefined);
    };

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setStage('initial');
            setIsSuccess(false);
        }
    }, [isOpen]);

    // Set up the wheel items with the potential reward and selected gifts
    const wheelItems = [
        {...potentialReward, isWin: true},
        ...selectedGifts.slice(0, multiplier - 1).map(gift => ({...gift, isWin: false}))
    ];
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="bg-gradient-to-b from-customMidBlue to-customPurple/90 border-none max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-xl text-center">
                        {stage === 'initial' && 'Апгрейд подарков'}
                        {stage === 'spinning' && 'Процесс апгрейда...'}
                        {stage === 'result' && (isSuccess ? 'Успешный апгрейд!' : 'Апгрейд не удался')}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    {stage === 'initial' && (
                        <>
                            <div className="bg-white/10 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span>Выбрано подарков:</span>
                                    <span className="font-bold">{selectedGifts.length}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span>Общая стоимость:</span>
                                    <span className="font-bold text-yellow-400">{totalValue.toFixed(2)} TON</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Множитель:</span>
                                    <span className="font-bold">x{multiplier}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mb-4">
                                <div className="w-20 h-20 mb-4">
                                    <motion.div
                                        animate={{y: [0, -10, 0]}}
                                        transition={{repeat: Infinity, duration: 1.5}}
                                    >
                                        <ArrowUp size={80} className="text-green-400"/>
                                    </motion.div>
                                </div>

                                <div className="text-center">
                                    <p className="text-lg font-bold mb-1">Возможный выигрыш</p>
                                    <p className="text-sm text-white/70 mb-4">
                                        Шанс на успех: {(successProbability * 100).toFixed(0)}%
                                    </p>

                                    <div
                                        className="w-32 h-32 mx-auto bg-white/10 rounded-lg p-2 border border-white/20">
                                        <LottieItem
                                            animationData={`https://nft.fragment.com/gift/${potentialReward.name.toLowerCase()}.lottie.json`}
                                            className="w-full h-full"
                                        />
                                    </div>

                                    <p className="mt-2 font-bold">{potentialReward.title}</p>
                                    <p className="text-green-400 font-bold">{potentialReward.price.toFixed(2)} TON</p>
                                </div>
                            </div>

                            <Button
                                onClick={startAnimation}
                                className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                <Gift className="mr-2"/>
                                Начать апгрейд
                            </Button>
                        </>
                    )}

                    {stage === 'spinning' && (
                        <div className="py-4">
                            <WheelRoulette 
                                items={wheelItems} 
                                multiplier={multiplier}
                                forceWin={isSuccess} // Pass the predetermined success value
                            />
                        </div>
                    )}

                    {stage === 'result' && (
                        <div className="flex flex-col items-center pt-2 pb-4">
                            <motion.div
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                transition={{type: "spring", stiffness: 260, damping: 20}}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                                    isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}
                            >
                                {isSuccess ? (
                                    <Check size={60} className="text-green-400"/>
                                ) : (
                                    <X size={60} className="text-red-400"/>
                                )}
                            </motion.div>

                            {isSuccess ? (
                                <div className="text-center mb-6">
                                    <p className="text-lg font-bold mb-4">Поздравляем!</p>

                                    <div
                                        className="w-40 h-40 mx-auto bg-white/10 rounded-lg p-2 border border-white/20 mb-4">
                                        <LottieItem
                                            animationData={`https://nft.fragment.com/gift/${potentialReward.name.toLowerCase()}.lottie.json`}
                                            className="w-full h-full"
                                        />
                                    </div>

                                    <p className="font-bold">{potentialReward.title}</p>
                                    <p className="text-green-400 font-bold">{potentialReward.price.toFixed(2)} TON</p>
                                </div>
                            ) : (
                                <div className="text-center mb-6">
                                    <p className="text-lg font-bold mb-2">Не удалось выполнить апгрейд</p>
                                    <p className="text-white/70 mb-4">
                                        К сожалению, апгрейд не удался. Попробуйте еще раз с другими подарками или
                                        множителем.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleCompleteUpgrade}
                                className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                Завершить
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpgradePreview;
