import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import StarCard from '../StarCard';
import {Button} from '../../components/ui/button';
import LottieItem from '../roulette/LottieItem';
import {Check, Gift, ArrowUpCircle} from 'lucide-react';
import GiftUpgradeMultiplier from './GiftUpgradeMultiplier';
import UpgradePreview from './UpgradePreview';
import {useToast} from '../../hooks/use-toast';

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

interface GiftUpgradeSelectorProps {
    userGifts: GiftItem[];
    upgradableGifts: GiftItem[];
    isLoading: boolean;
}

const GiftUpgradeSelector = ({userGifts, upgradableGifts, isLoading}: GiftUpgradeSelectorProps) => {
    const [selectedGifts, setSelectedGifts] = useState<GiftItem[]>([]);
    const [selectedMultiplier, setSelectedMultiplier] = useState<number>(2);
    const [showPreview, setShowPreview] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [potentialReward, setPotentialReward] = useState<GiftItem | null>(null);
    const {toast} = useToast();

    // Calculate total value whenever selected gifts change
    useEffect(() => {
        const newTotal = selectedGifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
        setTotalValue(newTotal);

        // Find a potential reward based on the multiplied value
        const targetValue = newTotal * selectedMultiplier;
        findPotentialReward(targetValue);
    }, [selectedGifts, selectedMultiplier]);

    const findPotentialReward = (targetValue: number) => {
        if (targetValue <= 0 || upgradableGifts.length === 0) {
            setPotentialReward(null);
            return;
        }

        // Apply ±20% range to the target value
        const minValue = targetValue * 0.8;
        const maxValue = targetValue * 1.2;

        // Find gifts that fall within the target range
        const eligibleGifts = upgradableGifts.filter(
            gift => gift.price >= minValue && gift.price <= maxValue
        );

        if (eligibleGifts.length > 0) {
            // Randomly select one of the eligible gifts
            const randomIndex = Math.floor(Math.random() * eligibleGifts.length);
            setPotentialReward(eligibleGifts[randomIndex]);
        } else {
            // If no gift in the exact range, find the closest gift
            const closestGift = upgradableGifts.reduce((closest, current) => {
                const currentDiff = Math.abs(current.price - targetValue);
                const closestDiff = Math.abs(closest.price - targetValue);
                return currentDiff < closestDiff ? current : closest;
            });
            setPotentialReward(closestGift);
        }
    };

    const toggleGiftSelection = (gift: GiftItem) => {
        if (selectedGifts.some(g => g.gift_id === gift.gift_id)) {
            // Remove from selection
            setSelectedGifts(selectedGifts.filter(g => g.gift_id !== gift.gift_id));
        } else {
            // Add to selection
            setSelectedGifts([...selectedGifts, gift]);
        }
    };

    const handleMultiplierChange = (multiplier: number) => {
        setSelectedMultiplier(multiplier);
    };

    const handleStartUpgrade = () => {
        if (selectedGifts.length === 0) {
            toast({
                title: "Выберите подарки",
                description: "Пожалуйста, выберите подарки для апгрейда",
                variant: "destructive",
            });
            return;
        }

        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    };

    const handleUpgradeComplete = (success: boolean, resultGift?: GiftItem) => {
        setShowPreview(false);
        if (success && resultGift) {
            toast({
                title: "Апгрейд успешен!",
                description: `Вы получили ${resultGift.title}!`,
            });

            // Would normally update user's gifts here via API
            // For now we'll just clear the selection
            setSelectedGifts([]);
        } else {
            toast({
                title: "Апгрейд не удался",
                description: "К сожалению, апгрейд не был успешен.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <StarCard className="p-6 flex justify-center items-center min-h-[300px]">
                <div className="animate-spin w-12 h-12 border-t-2 border-purple-500 border-solid rounded-full"></div>
            </StarCard>
        );
    }

    return (
        <>
            <StarCard className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Выберите подарки для апгрейда</h2>

                {userGifts.length === 0 ? (
                    <div className="text-center py-10 text-white/60">
                        <Gift size={48} className="mx-auto mb-3 opacity-40"/>
                        <p>У вас пока нет подарков для апгрейда</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                            {userGifts.map((gift) => (
                                <div
                                    key={gift.gift_id}
                                    className={`relative bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-colors border ${
                                        selectedGifts.some(g => g.gift_id === gift.gift_id)
                                            ? 'border-purple-500'
                                            : 'border-white/10'
                                    }`}
                                    onClick={() => toggleGiftSelection(gift)}
                                >
                                    {selectedGifts.some(g => g.gift_id === gift.gift_id) && (
                                        <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1 z-10">
                                            <Check size={14}/>
                                        </div>
                                    )}
                                    <div className="w-full aspect-square relative">
                                        <LottieItem
                                            animationData={gift.link}
                                            className="w-full h-full"
                                            loop={false}
                                            autoplay={false}
                                        />
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="text-xs font-medium truncate">{gift.title}</p>
                                        <p className="text-yellow-400 text-xs">{gift.price} TON</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <span>Выбрано подарков:</span>
                                <span className="font-bold">{selectedGifts.length}</span>
                            </div>

                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <span>Общая стоимость:</span>
                                <span className="font-bold text-yellow-400">{totalValue.toFixed(2)} TON</span>
                            </div>

                            <GiftUpgradeMultiplier
                                selectedMultiplier={selectedMultiplier}
                                onChange={handleMultiplierChange}
                            />

                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <span>Потенциальная стоимость:</span>
                                <span
                                    className="font-bold text-green-400">{(totalValue * selectedMultiplier).toFixed(2)} TON</span>
                            </div>

                            <Button
                                onClick={handleStartUpgrade}
                                disabled={selectedGifts.length === 0}
                                className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                <ArrowUpCircle className="mr-2"/>
                                Начать апгрейд
                            </Button>
                        </div>
                    </>
                )}
            </StarCard>

            {potentialReward && showPreview && (
                <UpgradePreview
                    isOpen={showPreview}
                    onClose={handleClosePreview}
                    selectedGifts={selectedGifts}
                    multiplier={selectedMultiplier}
                    potentialReward={potentialReward}
                    onComplete={handleUpgradeComplete}
                />
            )}
        </>
    );
};

export default GiftUpgradeSelector;
