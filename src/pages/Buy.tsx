import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Cell} from '@ton/core';
import {toNano} from '@ton/core';
import {useTonConnectUI, useTonWallet} from '@tonconnect/ui-react';
import {useToast} from '../hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import StarAmountSelector from '../components/StarAmountSelector';
import {useTonPrice} from '../hooks/useTonPrice';
import PaymentDetailsCard from '../components/buy/PaymentDetailsCard';
import PaymentButton from '../components/buy/PaymentButton';
import TransactionStatusDialog from '../components/buy/TransactionStatusDialog';
import {createTransactionRequest, processSuccessfulTransaction} from '../utils/transactionUtils';
import WebApp from '@twa-dev/sdk';
import {SafeAreaInset} from "@twa-dev/types";

const STAR_PRICE = 0.020;

const Buy = () => {
    const [selectedStars, setSelectedStars] = useState<number>(50);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [username, setUsername] = useState<string>('');
    const {toast} = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const tonPrice = useTonPrice();
    const isFullscreen = WebApp.isFullscreen;

    useEffect(() => {
        WebApp.isVerticalSwipesEnabled = false
        if (!tonConnectUI.connected) {
            toast({
                title: 'Подключите кошелек!',
                description: 'Для покупки звезд вам нужно подключить кошелек',
            });
        }
    }, [toast, tonConnectUI.connected]);

    const handleStarSelect = (amount: number) => {
        setSelectedStars(amount);
    };

    const handleUsernameCheck = (checkedUsername: string, isValid: boolean) => {
        setUsername(checkedUsername);
        setIsUsernameChecked(isValid);

        if (isValid) {
            toast({
                title: 'Успешно',
                description: `Имя пользователя ${checkedUsername} проверено!`,
                variant: 'green',

            });
        } else if (checkedUsername && !isValid) {
            toast({
                title: 'Ошибка',
                description: 'Имя пользователя не прошло проверку.',
                variant: 'destructive',
            });
        }
    };

    const calculatePrice = () => {
        if (!selectedStars || !tonPrice) return {usd: '0', ton: '0'};

        const usdPrice = selectedStars * STAR_PRICE;
        const tonPriceCalculated = usdPrice / tonPrice;

        return {
            usd: usdPrice.toFixed(2),
            ton: tonPriceCalculated.toFixed(4),
        };
    };

    const showErrorToast = (message: string) => {
        toast({
            title: 'Ошибка',
            description: message,
            variant: 'destructive',
        });
    };

    const handlePayment = () => {
        if (!selectedStars || selectedStars < 50) {
            showErrorToast('Минимальное количество звезд — 50.');
            return;
        }

        if (!isUsernameChecked || !username) {
            showErrorToast('Необходимо проверить имя пользователя перед оплатой.');
            return;
        }

        const handleSubmit = async () => {
            const transaction = createTransactionRequest(selectedStars, calculatePrice().ton);
            console.log(username)

            tonConnectUI
                .sendTransaction(transaction)
                .then((response) => {
                    const cell = Cell.fromBase64(response.boc);
                    const buffer = cell.hash();
                    const hashHex = Buffer.from(buffer).toString('hex');

                    processSuccessfulTransaction(
                        username,
                        hashHex,
                        wallet?.account.address,
                        selectedStars,
                        toNano(calculatePrice().ton).toString(),
                        setIsLoading,
                        setIsSuccess,
                        showErrorToast
                    );
                })
                .catch((error) => {
                    console.error(error);
                    showErrorToast('Произошла ошибка при отправке транзакции.');
                });
        };

        handleSubmit();
    };

    const isPaymentDisabled = !tonConnectUI.connected || !selectedStars || !tonPrice || selectedStars < 50 || !isUsernameChecked || !username;

    return (
        <div
            className="relative min-h-screen pt-4 pb-24"
            style={{
                marginTop: isFullscreen ? '80px' : '0px',
            }}
        >
            <StarBackground/>
            <TransactionStatusDialog isLoading={isLoading} isSuccess={isSuccess}/>

            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold mb-2">Купить звезды</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Выберите количество звезд, которое хотите приобрести. Минимальное количество — 50. Оплата в
                        криптовалюте TON.
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                    >
                        <StarCard className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Цена за звезду</span>
                                </div>
                                <span className="text-white font-bold">${STAR_PRICE}</span>
                            </div>
                            <div className="h-0.5 bg-white/10 mb-4"></div>
                            <StarAmountSelector
                                onSelect={handleStarSelect}
                                onUsernameCheck={handleUsernameCheck}
                            />
                        </StarCard>
                    </motion.div>

                    {selectedStars && (
                        <PaymentDetailsCard
                            selectedStars={selectedStars}
                            calculatePrice={calculatePrice}
                        />
                    )}

                    <PaymentButton
                        handlePayment={handlePayment}
                        isDisabled={isPaymentDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default Buy;
