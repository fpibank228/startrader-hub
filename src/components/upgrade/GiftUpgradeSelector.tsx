import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import StarCard from '../StarCard';
import {Button} from '../../components/ui/button';
import LottieItem from '../roulette/LottieItem';
import {Check, Gift, ArrowUpCircle} from 'lucide-react';
import GiftUpgradeMultiplier from './GiftUpgradeMultiplier';
import UpgradePreview from './UpgradePreview';
import {useToast} from '../../hooks/use-toast';
import {apiService} from "@/utils/api.ts";

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
    isLoading: boolean;
}

const GiftUpgradeSelector = ({isLoading}: GiftUpgradeSelectorProps) => {
    const [selectedGifts, setSelectedGifts] = useState<GiftItem[]>([]);
    const [selectedMultiplier, setSelectedMultiplier] = useState<number>(2);
    const [showPreview, setShowPreview] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [potentialReward, setPotentialReward] = useState<GiftItem | null>(null);
    const {toast} = useToast();
    const [userGifts, setUserGifts] = useState([]);

    const resetUserInfo = async () => {

        console.log("reset user info");
        try {
            const response = await apiService.getUserInfo();
            const data = await response.data;
            setUserGifts(data["gifts"]);
        } catch (error) {
            console.error('Error fetching gifts:', error);
            toast({
                title: 'Ошибка',
                description: 'апгрейнд на слишком большую сумму.',
                variant: 'destructive',
            });
        }
        setSelectedGifts([])
    }
    // Calculate total value whenever selected gifts change
    useEffect(() => {
        const newTotal = selectedGifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
        setTotalValue(newTotal);

        // Find a potential reward based on the multiplied value
        const targetValue = newTotal * selectedMultiplier;
        findPotentialReward(targetValue);
    }, [selectedGifts, selectedMultiplier]);

    useEffect(() => {
        resetUserInfo()

    }, []);

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
        resetUserInfo()

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
                                    <div className="p-2 text-center ">
                                        <p className="text-xs font-medium truncate">{gift.title}</p>
                                        <p className="text-yellow-400 text-sm flex items-center gap-1 justify-center">{gift.price}
                                            <svg width="12" height="12" viewBox="0 0 14 15"
                                                 fill="#facc15" className="inline"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                      fill="ddd"></path>
                                            </svg>
                                        </p>
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
                                <span
                                    className="font-bold text-yellow-400 flex items-center gap-1">{totalValue.toFixed(2)}
                                    <svg width="14" height="14" viewBox="0 0 14 15"
                                         fill="#facc15" className="inline"
                                         xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                      fill="ddd"></path>
                            </svg></span>
                            </div>

                            <GiftUpgradeMultiplier
                                selectedMultiplier={selectedMultiplier}
                                onChange={handleMultiplierChange}
                            />

                            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <span>Потенциальная стоимость:</span>
                                <span
                                    className="font-bold text-green-400 flex items-center gap-1">{(totalValue * selectedMultiplier).toFixed(2)}
                                    <svg width="14" height="14" viewBox="0 0 14 15"
                                         fill="#4ade80" className="inline"
                                         xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                      fill="ddd"></path>
                            </svg></span>
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
                    onComplete={handleUpgradeComplete}
                />
            )}
        </>
    );
};

export default GiftUpgradeSelector;


// Mock data for upgradable gifts
const upgradableGifts = [
    {
        "title": "Desk Calendar",
        "gift_id": "5976582472832385923",
        "user_id": 7853490326,
        "model": "Purple Front (1.5%)",
        "symbol": "Shark Knife (0.5%)",
        "backdrop": "Pure Gold (2.0%)",
        "name": "DeskCalendar-299547",
        "collectible_id": 299547,
        "url": "https://t.me/nft/DeskCalendar-299547",
        "price": 30,
        "link": "https://nft.fragment.com/gift/deskcalendar.lottie.json"
    },
    {
        "title": "Lol Pop",
        "gift_id": "5965518100206979498",
        "user_id": 7853490326,
        "model": "Magic Wand (1.0%)",
        "symbol": "Gem (0.4%)",
        "backdrop": "Moonstone (2.0%)",
        "name": "LolPop-206473",
        "collectible_id": 206473,
        "url": "https://t.me/nft/LolPop-206473",
        "price": 5.0,
        "link": "https://nft.fragment.com/gift/lolpop.lottie.json"
    },
    {
        "title": "Lunar Snake",
        "gift_id": "5821442464484950994",
        "user_id": 1044392516,
        "model": "Stone Python (1.3%)",
        "symbol": "Bunny (0.5%)",
        "backdrop": "Electric Purple (1.5%)",
        "name": "LunarSnake-13435",
        "collectible_id": 13435,
        "url": "https://t.me/nft/LunarSnake-13435",
        "price": 100,
        "link": "https://nft.fragment.com/gift/lunarsnake.lottie.json"
    },
    {
        "title": "Signet Ring",
        "gift_id": "5821442464484950991",
        "user_id": 1044392516,
        "model": "Premium (5%)",
        "symbol": "Gold (3%)",
        "backdrop": "Purple (5%)",
        "name": "SignetRing-7628",
        "collectible_id": 7628,
        "url": "https://t.me/nft/SignetRing-7628",
        "price": 65,
        "link": "https://nft.fragment.com/gift/signetring.lottie.json"
    },
    {
        "title": "Tama Gadget",
        "gift_id": "5821442464484150911",
        "user_id": 1044392516,
        "model": "Underdog (0.3%)",
        "symbol": "Underdog (0.3%)",
        "backdrop": "Midnight Blue (1%)",
        "name": "TamaGadget-19732",
        "collectible_id": 19732,
        "url": "https://t.me/nft/TamaGadget-19732",
        "price": 32,
        "link": "https://nft.fragment.com/gift/tamagadget.lottie.json"
    },
    {
        "title": "Plush Pepe",
        "gift_id": "5721442464484150991",
        "user_id": 1044392516,
        "model": "Frozen (2%)",
        "symbol": "Rook (0.5%)",
        "backdrop": "Black (2%)",
        "name": "plushpepe-2010",
        "collectible_id": 2010,
        "url": "https://t.me/nft/PlushPepe-2010",
        "price": 1600,
        "link": "https://nft.fragment.com/gift/plushpepe.lottie.json"
    }
];