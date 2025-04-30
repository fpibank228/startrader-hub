import LottieItem from './LottieItem';
import {motion, AnimatePresence} from 'framer-motion';
import {X} from 'lucide-react';
import React from "react";

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

interface ItemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: RouletteItem;
}

// Check if a URL is a Lottie animation (ends with .json)
const isLottieAnimation = (url: string): boolean => {
    return url.toLowerCase().endsWith('.json');
};

const ItemDetailModal = ({isOpen, onClose, item}: ItemDetailModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={onClose}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.2}}
                            className="relative w-[calc(100%-2rem)] max-w-sm mx-auto"
                        >
                            <div
                                className="bg-gradient-to-b bg-customDark border-white/40 border-2 p-6 sm:p-8 text-center rounded-3xl">
                                <div className="relative">
                                    {/* Custom close button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                                    >
                                        <X size={18} className="text-white/80"/>
                                    </button>

                                    {/* Decorative elements */}
                                    <div
                                        className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-radial from-purple-500/30 to-transparent rounded-full blur-xl"></div>
                                    <div
                                        className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-xl"></div>

                                    <h2 className="text-lg sm:text-xl font-bold mb-4">{item.title}</h2>

                                    <div className="my-4 sm:my-6 mx-auto w-32 h-32 sm:w-40 sm:h-40 relative">
                                        <div
                                            className="w-full h-full rounded-xl overflow-hidden border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                            {isLottieAnimation(item.link) ? (
                                                <LottieItem
                                                    animationData={item.link}
                                                    className="w-full h-full"
                                                    loop={true}
                                                    autoplay={true}
                                                />
                                            ) : (
                                                <img
                                                    src={item.link}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-2 mb-4">
                                        <span className=" font-bold">{item.price}
                                            <svg width="18" height="18"
                                                 fill="#ffffff" className="inline ml-0.5"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                          d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                                          fill="ddd"></path>
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 mt-4 text-left">
                                        {item.model && (
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                                <span className="text-sm font-medium">Модель:</span>
                                                <div className="text-sm text-white/80 mt-1">{item.model}</div>
                                            </div>
                                        )}

                                        {item.symbol && (
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                                <span className="text-sm font-medium">Символ:</span>
                                                <div className="text-sm text-white/80 mt-1">{item.symbol}</div>
                                            </div>
                                        )}

                                        {item.backdrop && (
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                                <span className="text-sm font-medium">Фон:</span>
                                                <div className="text-sm text-white/80 mt-1">{item.backdrop}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ItemDetailModal;
