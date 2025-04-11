import {useState, useEffect} from 'react';
import StarCard from '../StarCard';
import RouletteDisplay from './RouletteDisplay';
import SpinButton from './SpinButton';
import PrizeGrid from './PrizeGrid';
import {useIsMobile} from '../../hooks/use-mobile';
import RouletteResultModal from './RouletteResultModal';
import ItemDetailModal from './ItemDetailModal';
import TONBalanceDisplay from "@/components/roulette/TONBalanceDisplay.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {apiService} from "@/utils/api.ts";

interface RouletteItem {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
    isWin?: boolean;
}

interface UserData {
    user_id: string;
    username: string;
    full_name: string;
    ref_id: string;
    balance: number;
}

interface RouletteWheelProps {
    items: RouletteItem[];
    onSpin?: (result: RouletteItem) => void;
    onPlayAgain?: () => void; // New prop for reshuffling items
    userData: UserData;
}

const RouletteWheel = ({items: initialItems, onSpin, onPlayAgain, userData}: RouletteWheelProps) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [slidePosition, setSlidePosition] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [result, setResult] = useState<RouletteItem | null>(null);
    const [showItemDetail, setShowItemDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
    const [items, setItems] = useState<RouletteItem[]>(initialItems || []);
    const isMobile = useIsMobile();
    const {toast} = useToast();
    const [winItem, setWinItem] = useState({});

    // Always use the 5th item (index 4) as the winning item for consistency
    const winningIndex = 5;

    // Update items when initialItems change
    useEffect(() => {
        setItems(initialItems || []);
    }, [initialItems]);

    const spinWheel = async () => {
        if (userData && userData.balance < 2) {
            toast({
                title: 'Недостаточно средств',
                description: 'На вашем балансе недостаточно средств для вращения',
                variant: 'destructive',
            });
            return;
        }
        console.log("jugsadvfcytsdvchgsdvchgsvchgsvchgsdvhgcv")
        try {
            const response = await apiService.createDefaultGiftSpin();
            console.log(response);
            await setWinItem(response.data);
            console.log(winItem);
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Spin error:', error);
            toast({
                title: 'Ошибка',
                description: 'Недостаточно средств, пополните ваш баланс',
                variant: 'destructive',
            });
        }
        if (isSpinning) return;

        setIsSpinning(true);
        setSelectedIndex(null);

        // Fixed item width plus gap for more precise calculations
        const itemWidth = 88 + 16; // Each item is 96px wide plus 16px gap

        // Start with an initial position of 0
        setSlidePosition(0);

        // Calculate the final position to ensure the winning item (index 4) is centered
        // We're using the third repetition of items (since we have 5 repetitions in RouletteStrip)
        const totalItems = items.length;
        const targetSetIndex = 2; // Use the middle (third) set for stability
        const targetItemPosition = targetSetIndex * totalItems + winningIndex;

        // Calculate the exact pixel position
        // We add 0.5 to center the item precisely in the indicator
        const finalPosition = -((targetItemPosition + 0.5) * itemWidth);

        // Start the animation to the final position
        setTimeout(() => {
            setSlidePosition(finalPosition);

            // Set a timeout for when the animation completes
            setTimeout(() => {
                setSelectedIndex(winningIndex);
                setIsSpinning(false);

                // Prepare result data and show modal
                if (items && items.length > winningIndex) {
                    setResult(items[winningIndex]);
                    setShowResultModal(true);

                    if (onSpin && items[winningIndex]) {
                        onSpin(items[winningIndex]);
                    }
                }
            }, 3700); // Match the animation duration in RouletteStrip
        }, 10);
    };

    const handleCloseModal = () => {
        setShowResultModal(false);

        // Reset wheel position after modal is closed
        setTimeout(() => {
            setSlidePosition(0);
            setSelectedIndex(null);
        }, 100);
    };

    const handlePlayAgain = async () => {
        // Call the onPlayAgain callback if provided
        if (onPlayAgain) {
            onPlayAgain();
        }
        await apiService.sellDefaultGift(winItem['gift_id'])
        setShowResultModal(false);
        setResult(null);

        // Reset wheel position for next spin
        setSlidePosition(0);
        setSelectedIndex(null);
    };

    const handleItemClick = (item: RouletteItem) => {
        setSelectedItem(item);
        setShowItemDetail(true);
    };

    const handleCloseItemDetail = () => {
        setShowItemDetail(false);
        setTimeout(() => {
            setSelectedItem(null);
        }, 200);
    };

    return (
        <div className="flex flex-col items-center">
            <StarCard className="relative w-full max-w-md mb-6 p-6">
                <h3 className="text-center text-lg font-medium mb-4">Вращайте рулетку и выигрывайте приз!</h3>
                <RouletteDisplay
                    items={items}
                    slidePosition={slidePosition}
                    isSpinning={isSpinning}
                    selectedIndex={selectedIndex}
                />

                <div className="mt-6">
                    <SpinButton isSpinning={isSpinning} onSpin={spinWheel}/>
                </div>
            </StarCard>

            {/* Показываем все возможные выигрыши под рулеткой */}
            <PrizeGrid items={items} onItemClick={handleItemClick}/>

            {/* Модальное окно с результатом */}
            <RouletteResultModal
                isOpen={showResultModal}
                onClose={handleCloseModal}
                result={result}
                onPlayAgain={handlePlayAgain}
            />

            {/* Модальное окно с деталями предмета */}
            {selectedItem && (
                <ItemDetailModal
                    isOpen={showItemDetail}
                    onClose={handleCloseItemDetail}
                    item={selectedItem}
                />
            )}
        </div>
    );
};

export default RouletteWheel;
