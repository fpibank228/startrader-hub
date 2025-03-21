import React, {useState} from 'react';
import {Check, User} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import axios from 'axios';
import WebApp from '@twa-dev/sdk';

interface StarAmountSelectorProps {
    onSelect: (amount: number) => void;
    onUsernameCheck: (username: string, isValid: boolean) => void;
}

const StarAmountSelector = ({onSelect, onUsernameCheck}: StarAmountSelectorProps) => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isChecking, setIsChecking] = useState(false);
    const starAmounts = [50, 100, 500, 1000];

    const handleSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
        onSelect(amount);
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomAmount(value);
        setSelectedAmount(null);

        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 50) {
            onSelect(numValue);
        } else if (numValue < 50) {
            onSelect(50);
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        onUsernameCheck('', false);
    };

    const handleCheckUsername = async () => {
        if (!username) return;

        setIsChecking(true);

        try {
            const stars = customAmount ? parseInt(customAmount, 10) : selectedAmount;
            const response = await axios.post(
                'https://starsbuy.space/api/api/stars/search',
                {
                    init: WebApp.initData,
                    username: username,
                    stars: stars,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data['transactions']['ok'] == false) {
                onUsernameCheck(username, false);
                return;
            }
            const isValid = username.length >= 3;
            onUsernameCheck(username, isValid);
        } catch (error) {
            console.error('Ошибка при проверке имени пользователя:', error);
            onUsernameCheck(username, false);
        } finally {
            setIsChecking(false);
        }
    };

    const handleSetMyUsername = () => {
        const myUsername = WebApp.initDataUnsafe.user.username;
        setUsername(myUsername);
        onUsernameCheck(myUsername, true);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-medium text-white/90">Выберите количество звезд:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {starAmounts.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleSelect(amount)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                            selectedAmount === amount
                                ? 'bg-customPurple text-white shadow-lg shadow-customPurple/30'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        <svg className={`${selectedAmount === amount ? 'text-yellow-300' : 'text-white/50'}`} width="16"
                             height="16" viewBox="0 0 14 15" fill="#fde047"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                                  fill="ddd"></path>
                        </svg>
                        <span className="font-medium">{amount}</span>
                    </button>
                ))}
            </div>

            <div className="mt-4">
                <label className="block text-white/90 text-sm mb-2">Или введите своё количество:</label>
                <Input
                    type="number"
                    min="50"
                    placeholder="Например: 75"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="bg-white/5 border-white/10 focus:border-customPurple"
                    style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield',
                    }}
                />
            </div>

            <div className="mt-4">
                <label className="block text-white/90 text-sm mb-2">Введите имя пользователя:</label>
                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={handleUsernameChange}
                        className="bg-white/5 border-white/10 focus:border-customPurple flex-grow"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCheckUsername}
                            variant="outline"
                            className={`bg-white/5 border-white/10 hover:bg-white/10 text-white ${isChecking ? 'opacity-50' : ''}`}
                            disabled={isChecking || !username}
                        >
                            <Check size={16} className="mr-1"/>
                            {isChecking ? 'Проверка...' : 'Проверить'}
                        </Button>
                        <Button
                            onClick={handleSetMyUsername}
                            variant="outline"
                            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        >
                            <User size={16} className="mr-1"/>
                            Себе
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarAmountSelector;
