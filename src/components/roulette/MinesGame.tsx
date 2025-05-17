import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Diamond, Bomb, Star, Plus, Minus, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/utils/api";
import { hapticFeedback } from "@telegram-apps/sdk";
import MinesResultModal from "./MinesResultModal";
import { Input } from "@/components/ui/input";
import TONBalanceDisplay from "./TONBalanceDisplay";
import bombImage from "../../assets/images/roulette/bomb.png";
import cristalImage from "../../assets/images/roulette/cristal.png";

interface Cell {
  id: number;
  isRevealed: boolean;
  isMine?: boolean;
}

interface UserData {
  user_info: {
    user_details: {
      balance: number;
    };
  };
}

const GRID_SIZE = 5;
const INITIAL_BET = 5;
const MINES_OPTIONS = [2, 5, 10, 12, 24];
const MIN_BET = 5;
const MAX_BET = 300;
const BET_STEP = 10;

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

  const revealAllCells = (lostCellIndex?: number) => {
    // Get all unrevealed cell indexes
    const unrevealedCells = grid
      .map((cell, index) => ({ index, isRevealed: cell.isRevealed, isMine: cell.isMine }))
      .filter(cell => !cell.isRevealed && cell.index !== lostCellIndex);

    // Count how many mines we still need to place
    const revealedMines = grid.filter(cell => cell.isRevealed && cell.isMine).length;
    const remainingMines = selectedMines - revealedMines - (lostCellIndex !== undefined ? 1 : 0);

    // Randomly select positions for remaining mines
    const minePositions = new Set<number>();
    while (minePositions.size < remainingMines) {
      const randomIndex = Math.floor(Math.random() * unrevealedCells.length);
      if (!minePositions.has(randomIndex)) {
        minePositions.add(randomIndex);
      }
    }

    // Create new grid with revealed cells
    const newGrid = grid.map((cell, index) => {
      if (cell.isRevealed || index === lostCellIndex) {
        return cell; // Keep already revealed cells and the lost cell as they are
      }
      // For unrevealed cells, reveal them and set mine status
      const unrevealedIndex = unrevealedCells.findIndex(uc => uc.index === index);
      return {
        ...cell,
        isRevealed: true,
        isMine: minePositions.has(unrevealedIndex)
      };
    });

    setGrid(newGrid);
  };

  const fetchUserData = async () => {
    try {
      const response = await apiService.getUserInfo();
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные пользователя",
        variant: "destructive",
      });
    }
  };

  const handleBetChange = (increase: boolean) => {
    const newBet = increase ? bet + BET_STEP : bet - BET_STEP;
    if (newBet >= MIN_BET && newBet <= MAX_BET) {
      setBet(newBet);
    }
  };

  const initializeGrid = () => {
    const newGrid: Cell[] = Array(GRID_SIZE * GRID_SIZE)
      .fill(null)
      .map((_, index) => ({
        id: index,
        isRevealed: false,
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

      if (isMine) {
        // Game over - hit a mine
        setGameOver(true);
        setIsWin(false);
        setShowResultModal(true);
        setGameStarted(false);
        setGameId(null);
        setMultiplier(1);
        setWinAmount(0);
        
        // First update the grid with the clicked mine
        const newGrid = [...grid];
        newGrid[cell.id] = { ...cell, isRevealed: true, isMine: true };
        setGrid(newGrid);
        
        // Then reveal all other cells with random mines after a short delay
        setTimeout(() => {
          revealAllCells(cell.id);
        }, 300);

        toast({
          title: "Игра окончена",
          description: message || "Вы попали на мину!",
          variant: "destructive",
        });
      } else {
        // Safe cell - continue game
        const newGrid = [...grid];
        newGrid[cell.id] = { ...cell, isRevealed: true, isMine: false };
        setGrid(newGrid);
        
        setMultiplier(newMultiplier);
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
      initializeGrid();

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
        
        // Reveal all cells with random mines (no lost cell in this case)
        revealAllCells();
        
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
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex justify-end mb-4">
        <TONBalanceDisplay
          balance={userData ? userData.user_info.user_details.balance : 0}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {grid.map((cell) => (
          <motion.button
            key={cell.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCellClick(cell)}
            disabled={!gameStarted || gameOver}
            className={`
              aspect-square rounded-lg flex items-center justify-center
              ${
                cell.isRevealed
                  ? cell.isMine
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                  : "bg-white/10 hover:bg-white/20"
              }
              transition-all duration-200
            `}
          >
            {cell.isRevealed && (
              <img 
                src={cell.isMine ? bombImage : cristalImage} 
                alt={cell.isMine ? "Bomb" : "Crystal"} 
                className="w-12 h-12" 
              />
            )}
          </motion.button>
        ))}
      </div>
      <Button
        onClick={startGame}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mt-4"
      >
        Начать игру
      </Button>
      <div className="bg-white/5 rounded-xl p-4 mb-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-white/70 text-sm">Множитель</p>
            <p className="text-xl font-bold text-green-400">
              x{multiplier.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Выигрыш</p>
            <p className="text-xl font-bold flex items-center gap-1">
              {winAmount.toFixed(0)}
              <svg
                width="17"
                height="17"
                viewBox="0 0 14 15"
                fill="#ffffff"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                  fill="ddd"
                ></path>
              </svg>
            </p>
          </div>
        </div>

        {!gameStarted ? (
          <div className="space-y-4">
            <div>
              <p className="text-white/70 text-sm mb-2">Ставка</p>
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBet(MIN_BET)}
                  disabled={bet <= MIN_BET || gameStarted}
                  className="h-9 px-3"
                >
                  MIN
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(false)}
                  disabled={bet <= MIN_BET || gameStarted}
                  className="h-9 px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center h-9 bg-white/10 rounded-md flex items-center justify-center font-medium">
                  {bet}
                  <svg
                    className="ml-1"
                    width="17"
                    height="17"
                    viewBox="0 0 14 15"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.63869 12.1902L3.50621 14.1092C3.18049 14.3087 2.75468 14.2064 2.55515 13.8807C2.45769 13.7216 2.42864 13.5299 2.47457 13.3491L2.95948 11.4405C3.13452 10.7515 3.60599 10.1756 4.24682 9.86791L7.6642 8.22716C7.82352 8.15067 7.89067 7.95951 7.81418 7.80019C7.75223 7.67116 7.61214 7.59896 7.47111 7.62338L3.66713 8.28194C2.89387 8.41581 2.1009 8.20228 1.49941 7.69823L0.297703 6.69116C0.00493565 6.44581 -0.0335059 6.00958 0.211842 5.71682C0.33117 5.57442 0.502766 5.48602 0.687982 5.47153L4.35956 5.18419C4.61895 5.16389 4.845 4.99974 4.94458 4.75937L6.36101 1.3402C6.5072 0.987302 6.91179 0.819734 7.26469 0.965925C7.43413 1.03612 7.56876 1.17075 7.63896 1.3402L9.05539 4.75937C9.15496 4.99974 9.38101 5.16389 9.6404 5.18419L13.3322 5.47311C13.713 5.50291 13.9975 5.83578 13.9677 6.2166C13.9534 6.39979 13.8667 6.56975 13.7269 6.68896L10.9114 9.08928C10.7131 9.25826 10.6267 9.52425 10.6876 9.77748L11.5532 13.3733C11.6426 13.7447 11.414 14.1182 11.0427 14.2076C10.8642 14.2506 10.676 14.2208 10.5195 14.1249L7.36128 12.1902C7.13956 12.0544 6.8604 12.0544 6.63869 12.1902Z"
                      fill="ddd"
                    ></path>
                  </svg>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBetChange(true)}
                  disabled={bet >= MAX_BET || gameStarted}
                  className="h-9 px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBet(MAX_BET)}
                  disabled={bet >= MAX_BET || gameStarted}
                  className="h-9 px-3"
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
