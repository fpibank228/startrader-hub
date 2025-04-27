import React, {memo} from 'react';
import StarCard from '../StarCard';
import LottieItem from './LottieItem';
import {useIsMobile} from '../../hooks/use-mobile';

interface RouletteItem {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
}

interface PrizeGridProps {
    items: RouletteItem[];
    onItemClick?: (item: RouletteItem) => void;
}

// Мемоизируем компонент чтобы предотвратить лишние ререндеры
const PrizeGrid = memo(({items, onItemClick}: PrizeGridProps) => {
    // Make sure items is never undefined
    const safeItems = items || [];
    const isMobile = useIsMobile();

    // Helper function to shuffle array using Fisher-Yates algorithm
    const shuffleArray = (array: RouletteItem[]): RouletteItem[] => {
        const shuffled = [...array]; // Create a copy of the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
    };

    // Shuffle items before rendering
    const shuffledItems = shuffleArray(safeItems);

    // Helper function to determine if URL is a Lottie animation
    const isLottieAnimation = (url: string): boolean => {
        return url?.toLowerCase?.().endsWith('.json') || false;
    };

    return (
        <div className="w-full max-w-md mt-4">
            <h3 className="text-center text-lg font-medium mb-4">Возможные выигрыши</h3>
            <div className="grid grid-cols-3 gap-4">
                {shuffledItems.map((item, index) => (
                    <StarCard
                        key={index}
                        className="p-3 flex flex-col items-center cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => onItemClick && onItemClick(item)}
                    >
                        <div
                            className="w-20 h-20 rounded-lg overflow-hidden border border-white/30 shadow-[0_0_5px_rgba(255,255,255,0.2)] flex items-center justify-center">
                            {isLottieAnimation(item.link) ? (
                                <LottieItem
                                    animationData={item.link}
                                    className="w-full h-full"
                                    loop={false}
                                    autoplay={false}
                                />
                            ) : (
                                <img
                                    src={item.link}
                                    alt={item.title}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = 'https://placehold.co/100x100/purple/white?text=Prize';
                                    }}
                                />
                            )}
                        </div>
                        <div className="text-sm mt-2 text-center font-medium">
                            {item.title}
                        </div>
                        <div className="text-xs mt-1  font-medium flex items-center justify-center">
                            {item.price}
                            <svg width="14" height="14"
                                 fill="#546CF3" className="inline ml-0.5"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                      fill="ddd"></path>
                            </svg>
                        </div>
                        {item.number && (
                            <div className="text-xs mt-1 text-white/60">
                                #{item.number}
                            </div>
                        )}
                    </StarCard>
                ))}
            </div>
        </div>
    );
});

PrizeGrid.displayName = 'PrizeGrid';

export default PrizeGrid;