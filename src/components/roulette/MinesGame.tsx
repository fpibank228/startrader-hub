import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Diamond, Bomb, Star, Plus, Minus, Divide } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/utils/api";
import { hapticFeedback } from "@telegram-apps/sdk";
import MinesResultModal from './MinesResultModal';
import { Input } from "@/components/ui/input";
import TONBalanceDisplay from './TONBalanceDisplay';

interface Cell {
    id: number;
    isRevealed: boolean;
    isMine?: boolean;
}

interface UserData {
    user_info: {
        user_details: {
            balance: number;
        }
    }
}

const GRID_SIZE = 5;
const INITIAL_BET = 10;
const MINES_OPTIONS = [2, 5, 10, 12, 24];
const MIN_BET = 10;
const MAX_BET = 300;

const MinesGame: React.FC = () => {
    const [grid, setGrid] = useState<Cell[]>([]);
    const [bet, setBet] = useState(INITIAL_BET);
    const [selectedMines, setSelectedMines] = useState(5);
    const [gameStarted, setGameStarted] = useState(false);
    const [multiplier, setMultiplier] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [gameId, setGameId] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { toast } = useToast();

    const fetchUserData = async () => {
        try {
            const response = await apiService.getUserInfo();
            setUserData(response.data);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить данные пользователя",
                variant: "destructive",
            });
        }
    };

    const handleBetChange = (value: string) => {
        const numValue = parseInt(value) || 0;
        if (numValue >= MIN_BET && numValue <= MAX_BET) {
            setBet(numValue);
        }
    };

    const handleBetMultiply = (multiply: boolean) => {
        const newBet = multiply ? bet * 2 : Math.floor(bet / 2);
        if (newBet >= MIN_BET && newBet <= MAX_BET) {
            setBet(newBet);
        }
    };

    const initializeGrid = () => {
        const newGrid: Cell[] = Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, index) => ({
            id: index,
            isRevealed: false
        }));
        setGrid(newGrid);
        setMultiplier(1);
        setGameOver(false);
        setWinAmount(0);
        setShowResultModal(false);
    };

    useEffect(() => {
        initializeGrid();
        fetchUserData();
    }, []);

    useEffect(() => {
        if (gameOver) {
            fetchUserData();
        }
    }, [gameOver]);

    const handleCellClick = async (cell: Cell) => {
        if (cell.isRevealed || gameOver || !gameStarted) return;

        if (hapticFeedback.isSupported()) {
            hapticFeedback.impactOccurred("medium");
        }

        try {
            const response = await apiService.checkMinesCell(gameId!, cell.id);
            const { isMine, multiplier: newMultiplier, message } = response.data;

            const newGrid = [...grid];
            newGrid[cell.id] = { ...cell, isRevealed: true, isMine };
            setGrid(newGrid);

            if (isMine) {
                // Game over - hit a mine
                setGameOver(true);
                setIsWin(false);
                setShowResultModal(true);
                setGameStarted(false);
                setGameId(null);
                setMultiplier(1);
                setWinAmount(0);
                
                toast({
                    title: "Игра окончена",
                    description: message || "Вы попали на мину!",
                    variant: "destructive",
                });
            } else {
                // Safe cell - continue game
                setMultiplier(newMultiplier);
                // Используем точное значение множителя для расчета выигрыша
                const calculatedWinAmount = bet * newMultiplier;
                setWinAmount(calculatedWinAmount);

                toast({
                    title: "Успешно",
                    description: message || "Безопасная ячейка!",
                    variant: "default",
                });
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось проверить ячейку",
                variant: "destructive",
            });
        }
    };

    const startGame = async () => {
        try {
            const response = await apiService.placeMinesBet(bet, selectedMines);
            if (response.data.success) {
                setGameId(response.data.gameId);
                setGameStarted(true);
                initializeGrid();
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось начать игру",
                variant: "destructive",
            });
        }
    };

    const cashOut = async () => {
        if (!gameStarted || gameOver || !gameId) return;

        try {
            const response = await apiService.cashOutMines(gameId);
            if (response.data.success) {
                setGameOver(true);
                setIsWin(true);
                setShowResultModal(true);
                setWinAmount(response.data.amount);
                setGameStarted(false);
                setGameId(null);
            }
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось вывести выигрыш",
                variant: "destructive",
            });
        }
    };

    const handleResultModalClose = () => {
        setShowResultModal(false);
        // Reset game state
        setGameStarted(false);
        setGameId(null);
        setMultiplier(1);
        setWinAmount(0);
        setGameOver(false);
        setIsWin(false);
        initializeGrid();
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="flex justify-end mb-4">
                <TONBalanceDisplay balance={userData ? userData.user_info.user_details.balance : 0}/>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
                {grid.map((cell) => (
                    <motion.button
                        key={cell.id}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => handleCellClick(cell)}
                        disabled={!gameStarted || gameOver}
                        className={`
                            aspect-square rounded-lg flex items-center justify-center
                            ${cell.isRevealed
                                ? cell.isMine
                                    ? 'bg-red-500/20'
                                    : 'bg-green-500/20'
                                : 'bg-white/10 hover:bg-white/20'
                            }
                            transition-all duration-200
                        `}
                    >
                        {cell.isRevealed && (
                            cell.isMine ? (
                                <Bomb className="w-6 h-6 text-red-500"/>
                            ) : (
                                <Diamond className="w-6 h-6 text-green-500"/>
                            )
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-white/70 text-sm">Множитель</p>
                        <p className="text-xl font-bold text-green-400">x{multiplier.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-white/70 text-sm">Выигрыш</p>
                        <p className="text-xl font-bold text-yellow-400">{winAmount.toFixed(0)} ⭐</p>
                    </div>
                </div>

                {!gameStarted ? (

                    <div className="space-y-4">
                        <div>
                            <p className="text-white/70 text-sm mb-2">Ставка</p>
                            <div className="flex items-center gap-1 w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setBet(MIN_BET)}
                                    disabled={bet <= MIN_BET || gameStarted}
                                    className="h-7 px-2 text-xs"
                                >
                                    MIN
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleBetMultiply(false)}
                                    disabled={bet <= MIN_BET || gameStarted}
                                    className="h-7 px-2"
                                >
                                    <Divide className="h-3 w-3"/>
                                </Button>
                                <Input
                                    type="number"
                                    value={bet}
                                    onChange={(e) => handleBetChange(e.target.value)}
                                    disabled={gameStarted}
                                    className="flex-1 text-center h-7"
                                    min={MIN_BET}
                                    max={MAX_BET}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleBetMultiply(true)}
                                    disabled={bet >= MAX_BET || gameStarted}
                                    className="h-7 px-2"
                                >
                                    <Plus className="h-3 w-3"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setBet(MAX_BET)}
                                    disabled={bet >= MAX_BET || gameStarted}
                                    className="h-7 px-2 text-xs"
                                >
                                    MAX
                                </Button>
                            </div>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm mb-2">Количество мин</p>
                            <div className="grid grid-cols-5 gap-2">
                                {MINES_OPTIONS.map((mines) => (
                                    <Button
                                        key={mines}
                                        variant={selectedMines === mines ? "default" : "outline"}
                                        onClick={() => setSelectedMines(mines)}
                                        className="w-full"
                                    >
                                        {mines}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Button
                            onClick={startGame}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                            Начать игру
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={cashOut}
                        disabled={gameOver}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                    >
                        Забрать {winAmount.toFixed(0)} ⭐
                    </Button>
                )}
            </div>

            <MinesResultModal
                isOpen={showResultModal}
                onClose={handleResultModalClose}
                winAmount={winAmount}
                isWin={isWin}
                multiplier={multiplier}
            />
        </div>
    );
};

export default MinesGame; 