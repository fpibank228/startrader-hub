import { useState } from 'react';
import { Star, Check, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import WebApp from '@twa-dev/sdk';

interface StarAmountSelectorProps {
    onSelect: (amount: number) => void;
    onUsernameCheck: (username: string, isValid: boolean) => void;
}

const StarAmountSelector = ({ onSelect, onUsernameCheck }: StarAmountSelectorProps) => {
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

            if (response.data['transactions']['ok'] == false){
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
        const myUsername = 'hostnes';
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
                        <Star
                            size={16}
                            className={`${selectedAmount === amount ? 'text-yellow-300' : 'text-white/50'}`}
                            fill={selectedAmount === amount ? 'rgba(253, 224, 71, 0.5)' : 'transparent'}
                        />
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
