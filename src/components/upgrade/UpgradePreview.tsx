import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LottieItem from '../roulette/LottieItem';
import {Button} from "@/components/ui/button";
import {ArrowUp, Gift, Check, X} from 'lucide-react';
import {WheelRoulette} from './WheelAnimation';
import {apiService} from "@/utils/api.ts";
import {useNavigate} from "react-router-dom";

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
    onComplete: (success: boolean, resultGift?: GiftItem) => void;
}

// Helper function to check if a URL is for a Lottie animation
const isLottieAnimation = (url: string): boolean => {
    return url?.toLowerCase().endsWith('.json');
};

const UpgradePreview = ({
                            isOpen,
                            onClose,
                            selectedGifts,
                            multiplier,
                            onComplete
                        }: UpgradePreviewProps) => {
    const [stage, setStage] = useState<'initial' | 'spinning' | 'result'>('initial');
    const [isSuccess, setIsSuccess] = useState(false);
    const [wheelItems, setWheelItems] = useState([]);
    const [potentialReward, setPotentialReward] = useState<GiftItem | null>(null);
    // Calculate total value
    const totalValue = selectedGifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
    const upgradedValue = totalValue * multiplier;
    const navigate = useNavigate();

    // Set up success probability based on multiplier
    const successProbability = multiplier === 2 ? 0.5 : (multiplier === 5 ? 0.25 : 0.1);

    // When the animation starts, determine success
    const startAnimation = async () => {
        const res = await apiService.createUpgrade(selectedGifts.map(gift => gift.gift_id), multiplier);
        setPotentialReward(res.data['closest_gift'])
        console.log(selectedGifts);
        const wheelItems1 = [
            {...res.data['closest_gift'], isWin: true},
            ...selectedGifts.slice(0, multiplier - 1).map(gift => ({...gift, isWin: false}))
        ];
        setIsSuccess(res.data['is_win']);
        setWheelItems(wheelItems1);
        setStage('spinning');
    };

    // Handle spin completion from WheelRoulette component
    const handleSpinComplete = (success: boolean) => {
        setStage('result');
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="bg-gradient-to-b border-white/40 border-2 rounded-2xl p-5 max-w-sm w-full">
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
                                    <span className="font-bold text-yellow-400  flex items-center gap-1">{totalValue.toFixed(2)}
                                        <svg width="14" height="14" viewBox="0 0 14 15"
                                             className="inline" fill="#facc15"
                                             xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                      fill="ddd"></path>
                            </svg></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Множитель:</span>
                                    <span className="font-bold">x{multiplier}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mb-4">

                                <div className="text-center">
                                    <p className="text-lg font-bold mb-1">Возможный выигрыш</p>
                                    <p className="text-sm text-white/70 mb-4">
                                        Шанс на успех: {(successProbability * 100).toFixed(0)}%
                                    </p>

                                    <div
                                        className="w-32 h-32 mx-auto bg-white/10 rounded-lg p-2 border border-white/20 flex items-center justify-center text-white text-4xl font-bold">
                                        ?
                                    </div>

                                    <p className="text-green-400 font-bold flex items-center gap-1">Потенциальная
                                        стоимость: {(multiplier * totalValue).toFixed(2)}
                                        <svg width="14" height="14" viewBox="0 0 14 15"
                                             fill="#4ade80" className="inline"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                  fill="ddd"></path>
                                        </svg>
                                    </p>
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
                                forceWin={isSuccess}
                                onSpinComplete={handleSpinComplete} // Add the callback
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
                                        {potentialReward.link ? (
                                            <LottieItem
                                                animationData={potentialReward.link}
                                                className="w-full h-full"
                                                loop={true}
                                                autoplay={true}
                                            />
                                        ) : (
                                            <img
                                                src={potentialReward.link}
                                                alt={potentialReward.title}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = 'https://placehold.co/100x100/purple/white?text=Item';
                                                }}
                                            />
                                        )}
                                    </div>

                                    <p className="font-bold">{potentialReward.title}</p>
                                    <p className="text-green-400 font-bold">{potentialReward.price.toFixed(2)}
                                        <svg width="18" height="18"
                                             fill="#ffffff" className="inline"
                                             viewBox="0 0 14 15"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                  fill="ddd"></path>
                                        </svg>
                                    </p>
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