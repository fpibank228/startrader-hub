import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, DollarSign, Wallet, Loader, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import StarAmountSelector from '../components/StarAmountSelector';
import { SendTransactionRequest, TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Address, Cell, toNano } from '@ton/core';
import { beginCell } from '@ton/ton';
import axios from 'axios';
import WebApp from '@twa-dev/sdk';

const STAR_PRICE = 0.020;

const Buy = () => {
    const [selectedStars, setSelectedStars] = useState<number>(50); // Начальное значение 50
    const [tonPrice, setTonPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const isFullscreen = WebApp.isFullscreen;

    useEffect(() => {
        console.log(tonConnectUI.connected);
        const fetchTonPrice = async () => {
            try {
                const response = await axios.get('https://tonapi.io/v2/rates?tokens=ton&currencies=usd');
                const price = response.data.rates.TON.prices.USD;
                setTonPrice(price);
            } catch (error) {
                console.error('Ошибка при получении цены TON:', error);
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось получить текущую цену TON.',
                    variant: 'destructive',
                });
            }
        };
        if (!tonConnectUI.connected) {
            toast({
                title: 'Подключите кошелек!',
                description: 'Для покупки звезд вам нужно подключить кошелек',
            });
        }
        fetchTonPrice();
    }, [toast, tonConnectUI.connected]);

    const handleStarSelect = (amount: number) => {
        setSelectedStars(amount);
    };

    const calculatePrice = () => {
        if (!selectedStars || !tonPrice) return { usd: 0, ton: 0 };

        const usdPrice = selectedStars * STAR_PRICE;
        const tonPriceCalculated = usdPrice / tonPrice;

        return {
            usd: usdPrice.toFixed(2),
            ton: tonPriceCalculated.toFixed(4),
        };
    };

    const successTransaction = async (hash: string) => {
        setIsLoading(true);

        try {
            const userFriendlyAddress = wallet?.account.address
                ? Address.parse(wallet.account.address).toString({ bounceable: false })
                : 'Нет адреса';

            const amountInNanoTON = toNano(calculatePrice().ton);
            const response = await axios.post(
                'https://starsbuy.space/api/api/send_transaction',
                {
                    walletAddress: userFriendlyAddress,
                    amount: amountInNanoTON.toString(),
                    comment: `${selectedStars} stars`,
                    currency: 'TON',
                    timestamp: Date.now(),
                    hash: hash,
                    init: WebApp.initData,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setIsLoading(false);
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast({
                title: 'Ошибка',
                description: 'Не удалось завершить транзакцию.',
                variant: 'destructive',
            });
        }
    };

    const handlePayment = () => {
        if (!selectedStars || selectedStars < 50) { // Проверка на минимальное значение
            toast({
                title: 'Ошибка',
                description: 'Минимальное количество звезд — 50.',
                variant: 'destructive',
            });
            return;
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            const body = beginCell().storeUint(0, 32).storeStringTail(`${selectedStars} stars`).endCell();
            const amountInNanoTON = toNano(calculatePrice().ton);

            const transaction: SendTransactionRequest = {
                validUntil: Date.now() + 5 * 60 * 1000,
                messages: [
                    {
                        address: 'UQCvVrEGflaTqphVAk06ZPPvbAfXhs4iB81wdvDbVxDh9jcj',
                        amount: amountInNanoTON.toString(),
                        payload: body.toBoc().toString('base64'),
                    },
                ],
            };

            tonConnectUI
                .sendTransaction(transaction)
                .then((suc) => {
                    const cell = Cell.fromBase64(suc.boc);
                    const buffer = cell.hash();
                    const hashHex = Buffer.from(buffer).toString('hex');
                    successTransaction(hashHex);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <div
            className="relative min-h-screen pt-4 pb-24"
            style={{
                marginTop: isFullscreen ? '80px' : '0px',
            }}
        >
            <StarBackground />

            {isLoading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <Loader className="animate-spin text-customPurple w-8 h-8 mb-4" />
                        <p className="text-gray-700">Обработка транзакции...</p>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <Check className="text-green-500 w-8 h-8 mb-4" />
                        <p className="text-gray-700">Транзакция прошла успешно!</p>
                        <p className="text-gray-500 text-sm">Ваши звезды придут к вам на аккаунт.</p>
                    </div>
                </div>
            )}

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Купить звезды</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Выберите количество звезд, которое хотите приобрести. Минимальное количество — 50. Оплата в криптовалюте TON.
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <StarCard className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-300" fill="rgba(253, 224, 71, 0.5)" />
                                    <span className="font-medium">Цена за звезду</span>
                                </div>
                                <span className="text-white font-bold">${STAR_PRICE}</span>
                            </div>
                            <div className="h-0.5 bg-white/10 mb-4"></div>
                            <StarAmountSelector onSelect={handleStarSelect} />
                        </StarCard>
                    </motion.div>

                    {selectedStars && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StarCard className="mb-6 border border-customPurple/50">
                                <h3 className="text-lg font-medium mb-4">Ваш заказ</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Количество звезд:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            {selectedStars}
                                            <Star size={14} className="text-yellow-300" fill="rgba(253, 224, 71, 0.5)" />
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Стоимость в USD:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            ${calculatePrice().usd}
                                            <DollarSign size={14} />
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">К оплате в TON:</span>
                                        <span className="font-medium text-customBlue flex items-center gap-1">
                                            {calculatePrice().ton} TON
                                            <Wallet size={14} />
                                        </span>
                                    </div>
                                </div>
                            </StarCard>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <button
                            onClick={handlePayment}
                            disabled={!tonConnectUI.connected || !selectedStars || !tonPrice || selectedStars < 50}
                            className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                                tonConnectUI.connected && selectedStars && tonPrice && selectedStars >= 50
                                    ? 'bg-customPurple text-white btn-glow hover:bg-opacity-90'
                                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                            }`}
                        >
                            <Wallet size={18} />
                            Оплатить в TON
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Buy;