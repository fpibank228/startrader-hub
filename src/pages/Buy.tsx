
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Cell} from '@ton/core';
import {toNano} from '@ton/core';
import {useTonConnectUI, useTonWallet} from '@tonconnect/ui-react';
import {useToast} from '../hooks/use-toast';
import {useNavigate} from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import StarAmountSelector from '../components/StarAmountSelector';
import {useTonPrice} from '../hooks/useTonPrice';
import PaymentDetailsCard from '../components/buy/PaymentDetailsCard';
import PaymentButton from '../components/buy/PaymentButton';
import TransactionStatusDialog from '../components/buy/TransactionStatusDialog';
import {createTransactionRequest, processSuccessfulTransaction} from '../utils/transactionUtils';
import WebApp from '@twa-dev/sdk';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"

const STAR_PRICE = 0.020;

const Buy = () => {
    const [selectedStars, setSelectedStars] = useState<number>(50);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'rubles'>('crypto');
    const {toast} = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const tonPrice = useTonPrice();
    const isFullscreen = WebApp.isFullscreen;
    const navigate = useNavigate();

    useEffect(() => {
        WebApp.isVerticalSwipesEnabled = false
        if (!tonConnectUI.connected && paymentMethod === 'crypto') {
            toast({
                title: 'Подключите кошелек!',
                description: 'Для покупки звезд вам нужно подключить кошелек',
            });
        }
    }, [toast, tonConnectUI.connected, paymentMethod]);

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
        if (!selectedStars || !tonPrice) return {usd: '0', ton: '0', rub: '0'};

        const usdPrice = selectedStars * STAR_PRICE;
        const tonPriceCalculated = usdPrice / tonPrice;
        const rubPrice = usdPrice * 90; // Примерный курс USD к RUB

        return {
            usd: usdPrice.toFixed(2),
            ton: tonPriceCalculated.toFixed(4),
            rub: rubPrice.toFixed(0)
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

        if (paymentMethod === 'rubles') {
            // Переход на страницу оплаты рублями
            navigate('/buy/rubles', { 
                state: { 
                    username, 
                    stars: selectedStars, 
                    price: calculatePrice().rub 
                } 
            });
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

    const isPaymentDisabled = (paymentMethod === 'crypto' && !tonConnectUI.connected) || 
                             !selectedStars || 
                             (paymentMethod === 'crypto' && !tonPrice) || 
                             selectedStars < 50 || 
                             !isUsernameChecked || 
                             !username;

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
                        Выберите количество звезд, которое хотите приобрести. Минимальное количество — 50.
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

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                        className="mb-6"
                    >
                        <StarCard>
                            <h3 className="text-lg font-medium mb-4">Способ оплаты</h3>
                            <RadioGroup 
                                defaultValue="crypto" 
                                value={paymentMethod}
                                onValueChange={(value) => setPaymentMethod(value as 'crypto' | 'rubles')}
                                className="grid grid-cols-1 gap-4"
                            >
                                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 hover:bg-white/5">
                                    <RadioGroupItem value="crypto" id="crypto" />
                                    <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Криптовалюта (TON)</div>
                                        <div className="text-sm text-white/70">Оплата через TON кошелек</div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 hover:bg-white/5">
                                    <RadioGroupItem value="rubles" id="rubles" />
                                    <Label htmlFor="rubles" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Российский рубль (₽)</div>
                                        <div className="text-sm text-white/70">Оплата через банковскую карту</div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </StarCard>
                    </motion.div>

                    <PaymentButton
                        handlePayment={handlePayment}
                        isDisabled={isPaymentDisabled}
                        buttonText={paymentMethod === 'crypto' ? 'Оплатить в TON' : 'Продолжить'}
                        paymentMethod={paymentMethod}
                    />
                </div>
            </div>
        </div>
    );
};

export default Buy;
