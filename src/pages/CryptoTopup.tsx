import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Cell} from '@ton/core';
import {toNano} from '@ton/core';
import {SendTransactionRequest, TonConnectButton, useTonConnectUI, useTonWallet} from '@tonconnect/ui-react';
import {useToast} from '../hooks/use-toast';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';
import {useTonPrice} from '../hooks/useTonPrice';
import PaymentDetailsCard from '../components/topup/TopupDetailsCard';
import PaymentButton from '../components/buy/PaymentButton';
import TransactionStatusDialog from '../components/buy/TransactionStatusDialog';
import {
    createTransactionRequest,
    processSuccessfulTopUpTransaction,
    processSuccessfulTransaction
} from '../utils/transactionUtils';
import WebApp from '@twa-dev/sdk';
import {beginCell} from "@ton/ton";

const CryptoTopup = () => {
    const [amount, setAmount] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const {toast} = useToast();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const tonPrice = useTonPrice();
    const isFullscreen = WebApp.isFullscreen;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);

        if (!isNaN(numValue) && numValue > 0) {
            setAmount(numValue);
        } else {
            setAmount(0.5);
        }
    };

    const calculatePrices = () => {
        if (!amount || !tonPrice) return {usd: '0', ton: '0'};

        const tonAmount = amount;
        const usdPrice = tonAmount * tonPrice;

        return {
            usd: usdPrice.toFixed(2),
            ton: tonAmount.toFixed(4)
        };
    };

    const showErrorToast = (message: string) => {
        toast({
            title: 'Ошибка',
            description: message,
            variant: 'destructive',
        });
    };

    const topUpTransactionRequest = (tonAmount: string) => {
        const body = beginCell().storeUint(0, 32).storeStringTail(`TopUp by ${tonAmount} TON`).endCell();
        const amountInNanoTON = toNano(tonAmount);

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

        return transaction;
    };

    const handlePayment = async () => {
        if (!amount || amount <= 0) {
            showErrorToast('Пожалуйста, введите сумму пополнения.');
            return;
        }

        if (!tonConnectUI.connected) {
            showErrorToast('Подключите кошелек для пополнения баланса.');
            return;
        }

        const transaction = topUpTransactionRequest(amount.toString());

        tonConnectUI
            .sendTransaction(transaction)
            .then((response) => {
                const cell = Cell.fromBase64(response.boc);
                const buffer = cell.hash();
                const hashHex = Buffer.from(buffer).toString('hex');

                processSuccessfulTopUpTransaction(
                    hashHex,
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
                    <h1 className="text-2xl font-bold mb-2">Пополнить баланс</h1>
                    <p className="text-white/70 text-sm max-w-md mx-auto">
                        Введите количество TON, которое хотите внести на баланс.
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
                                    <span className="font-medium">Курс TON к USD</span>
                                </div>
                                <span className="text-white font-bold">${tonPrice ? tonPrice.toFixed(2) : '...'}</span>
                            </div>
                            <div className="h-0.5 bg-white/10 mb-4"></div>
                            <div className="flex justify-center"> {/* Новый контейнер для центрирования */}
                                <TonConnectButton/>
                            </div>
                            <div className="mt-4">
                                <label className="block text-white/90 text-sm mb-2">Сумма в TON:</label>
                                <input
                                    type="number"
                                    min="0.5"
                                    step="0.1"
                                    placeholder="Введите сумму в TON"
                                    value={amount || ''}
                                    onChange={handleAmountChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-customPurple"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'textfield',
                                    }}
                                />
                            </div>
                        </StarCard>
                    </motion.div>

                    {amount > 0 && (
                        <PaymentDetailsCard
                            amount={amount}
                            calculatePrices={calculatePrices}
                        />
                    )}

                    <PaymentButton
                        handlePayment={handlePayment}
                        isDisabled={!tonConnectUI.connected || !amount || amount <= 0 || !tonPrice}
                        buttonText="Пополнить баланс"
                        paymentMethod="crypto"
                    />
                </div>
            </div>
        </div>
    );
};

export default CryptoTopup;
