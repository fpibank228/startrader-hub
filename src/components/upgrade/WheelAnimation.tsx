import React, {useState, useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import LottieItem from '../roulette/LottieItem';

interface RouletteItem {
    link: string;
    title: string;
    price: number;
    isWin?: boolean;
    name?: string;
}

interface WheelRouletteProps {
    items: RouletteItem[];
    multiplier: number;
    forceWin?: boolean; // Optional prop to force a win (for demo purposes)
    onSpinComplete?: (result: boolean) => void; // Callback when spin completes
}

// Check if a URL is a Lottie animation (ends with .json)
const isLottieAnimation = (url: string): boolean => {
    return url?.toLowerCase().endsWith('.json');
};

export const WheelRoulette = ({items, multiplier, forceWin, onSpinComplete}: WheelRouletteProps) => {
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const [wheelItems, setWheelItems] = useState<RouletteItem[]>([]);
    const [isWin, setIsWin] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    // Set up items based on multiplier and determine win/loss
    useEffect(() => {
        // Determine if this spin is a win or loss
        // If forceWin is provided, use that value, otherwise use random
        const win = forceWin !== undefined ? forceWin : Math.random() < 0.5;
        setIsWin(win);

        // Always include the potential reward as the first item
        const targetItem = items.find(item => item.isWin) || items[0];

        // For multiplier x2, show 2 segments (win item + empty/loss item)
        // For multiplier x5, show 5 segments
        // For multiplier x10, show 10 segments
        let totalSegments = multiplier;
        if (totalSegments < 2) totalSegments = 2; // Minimum 2 segments
        if (totalSegments > 10) totalSegments = 10; // Maximum 10 segments

        // Create the wheel items array
        const wheelItemsArr: RouletteItem[] = [];

        // Always put the winning item first
        wheelItemsArr.push({...targetItem, isWin: true});

        // Fill the remaining segments with empty placeholders
        for (let i = 1; i < totalSegments; i++) {
            wheelItemsArr.push({
                link: "https://nft.fragment.com/gift/lolpop.lottie.json", // fallback item
                title: "Empty",
                price: 0.1,
                isWin: false
            });
        }

        setWheelItems(wheelItemsArr);
    }, [items, multiplier, forceWin]);

    // Start spinning the wheel automatically
    useEffect(() => {
        if (wheelItems.length === 0) return;

        // Set spinning state to true when wheel starts spinning
        setIsSpinning(true);

        const fullRotations = 3; // Spin 4 full rotations before stopping
        const finalRotation = fullRotations * 360;

        let randomOffset: number;
        if (forceWin) {
            randomOffset = Math.floor(Math.random() * 37) + 162;
        } else {
            randomOffset = Math.floor(Math.random() * (450 - 270 + 1)) + 270;
        }

        // Set the final rotation value after a short delay
        setTimeout(() => {
            setRotation(finalRotation + randomOffset);

            // Trigger the callback when animation completes - waiting for wheel to stop completely
            setTimeout(() => {
                setIsSpinning(false);
                if (onSpinComplete) {
                    onSpinComplete(forceWin);
                }
            }, 5500);
        }, 300);
    }, [wheelItems, onSpinComplete]);

    // Calculate wheel dimensions
    const wheelSize = 280;
    const centerSize = 220;

    return (
        <div className="flex justify-center items-center">
            {/* Wheel container */}
            <div className="relative" style={{width: wheelSize, height: wheelSize}}>
                {/* Wheel pointer (triangle at the top) */}
                <motion.div
                    ref={wheelRef}
                    className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-b from-purple-900 to-blue-900 border-4 border-white/20"
                    animate={{
                        rotate: rotation,
                    }}
                    initial={{rotate: 0}}
                    transition={{
                        duration: 5,
                        ease: [0.22, 0.62, 0.5, 1],
                        type: "tween",
                    }}
                >
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div
                            className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-0 border-b-[20px] border-l-transparent border-r-transparent border-b-white rotate-180"/>
                    </div>
                </motion.div>
                {/* The wheel */}
                <div

                >
                    {/* Wheel segments */}
                    {wheelItems.map((item, index) => {
                        const segmentAngle = 360 / wheelItems.length;
                        const angle = index * segmentAngle;

                        // Alternate background colors
                        const segmentColor = item.isWin
                            ? 'rgba(99,211,27,0.6)' // Gold for winning
                            : 'rgba(128, 90, 213, 0.6)'; // Blue

                        // Calculate segment clip path using SVG path
                        const startX = Math.sin(angle * Math.PI / 180) * 50 + 50;
                        const startY = -Math.cos(angle * Math.PI / 180) * 50 + 50;
                        const endAngle = (angle + segmentAngle) * Math.PI / 180;
                        const endX = Math.sin(endAngle) * 50 + 50;
                        const endY = -Math.cos(endAngle) * 50 + 50;
                        const largeArcFlag = segmentAngle <= 180 ? "0" : "1";

                        // SVG path for the segment
                        const path = `M50,50 L${startX},${startY} A50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`;

                        // Position for the item image
                        const itemAngle = (angle + segmentAngle / 2) * Math.PI / 180;
                        const itemX = Math.sin(itemAngle) * 30;
                        const itemY = -Math.cos(itemAngle) * 30;

                        // Determine if this segment should show the reward item or be empty
                        const showRewardItem = item.isWin || item.title === items[0].title;

                        // Determine the proper animation source based on item properties
                        let animationSource = '';

                        if (item.name && item.name.length > 0) {
                            // If we have a name, construct the Fragment URL
                            animationSource = `https://nft.fragment.com/gift/${item.name.toLowerCase()}.lottie.json`;
                        } else if (item.link && isLottieAnimation(item.link)) {
                            // Otherwise use the provided link if it's a Lottie animation
                            animationSource = item.link;
                        }
                        const rotationMap = {
                            2: 'rotate-90',
                            5: '[transform:rotate(144deg)]',
                            10: '[transform:rotate(162deg)]'
                        };
                        return (
                            <div
                                key={index}
                                className={`absolute inset-0 ${rotationMap[multiplier]}`}
                            >
                                {/* Segment with border */}
                                <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                                    <path
                                        d={path}
                                        fill={segmentColor}
                                    />
                                </svg>

                                {/* Item image - centered in each segment */}
                                {showRewardItem ? (
                                    <div
                                        className="absolute rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            left: `calc(50% + ${itemX * (wheelSize / 100)}px - 25px)`,
                                            top: `calc(50% + ${itemY * (wheelSize / 100)}px - 25px)`,
                                        }}
                                    >
                                        {/* Using LottieItem for both cases */}
                                        {animationSource ? (
                                            <LottieItem
                                                animationData={animationSource}
                                                className="w-full h-full"
                                                loop={item.isWin}
                                                autoplay={true}
                                            />
                                        ) : (
                                            // Fallback to image if no animation source is available
                                            <img
                                                src={item.link}
                                                alt={item.title}
                                                className="w-full h-full object-contain p-1"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = 'https://placehold.co/100x100/purple/white?text=Item';
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    // Empty segment
                                    <div
                                        className="absolute rounded-full bg-white/5 flex items-center justify-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            left: `calc(50% + ${itemX * (wheelSize / 100)}px - 20px)`,
                                            top: `calc(50% + ${itemY * (wheelSize / 100)}px - 20px)`,
                                        }}
                                    >
                                        {/* Empty slot indicator */}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Center circle */}
                    <div
                        className="absolute rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border-2 border-white/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] z-10"
                        style={{
                            width: centerSize,
                            height: centerSize,
                            top: `calc(50% - ${centerSize / 2}px)`,
                            left: `calc(50% - ${centerSize / 2}px)`,
                        }}
                    >
                        <div className="text-white font-bold text-center">
                            <span className="text-xs block opacity-80">АПГРЕЙД</span>
                            {multiplier && <span className="text-xs block opacity-80">x{multiplier}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
