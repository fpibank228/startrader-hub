
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarBackground from '../components/StarBackground';
import GiftUpgradeSelector from '../components/upgrade/GiftUpgradeSelector';
import UpgradePreview from '../components/upgrade/UpgradePreview';
import WebApp from "@twa-dev/sdk";
import { apiService } from '@/utils/api';
import { useToast } from '../hooks/use-toast';

const GiftUpgrade = () => {
  const isFullscreen = WebApp.isFullscreen;
  const { toast } = useToast();
  const [userGifts, setUserGifts] = useState([]);
  const [upgradableGifts, setUpgradableGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's gifts and upgradable gifts
    const fetchGifts = async () => {
      setIsLoading(true);
      try {
        // This would normally come from your API
        // For now we'll use mock data
        setUserGifts(mockUserGifts);
        setUpgradableGifts(mockUpgradableGifts);
      } catch (error) {
        console.error('Error fetching gifts:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить подарки',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGifts();
  }, [toast]);

  return (
    <div className="relative min-h-screen pt-4 pb-24" style={{
      marginTop: isFullscreen ? "80px" : "0px",
    }}>
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Апгрейд Подарков
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/70 text-sm mb-6">
            Выберите подарки для апгрейда и множитель, чтобы попытать удачу и получить подарок более высокой стоимости!
          </p>
          
          <GiftUpgradeSelector 
            userGifts={userGifts}
            upgradableGifts={upgradableGifts}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Mock data for user's existing gifts (inventory)
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const mockUserGifts = [
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/homemadecake.lottie.json',
    'title': 'Homemade Cake',
    'price': 0.25,
    'model': 'Basic 15%',
    'symbol': 'Gold 5%',
    'backdrop': 'Blue 10%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999))
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/diamondring.lottie.json',
    'title': 'Diamond Ring',
    'price': 1.5,
    'model': 'Premium 5%',
    'symbol': 'Silver 10%', 
    'backdrop': 'Purple 5%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999))
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/eternalrose.lottie.json',
    'title': 'Eternal Rose',
    'price': 0.7,
    'model': 'Standard 10%',
    'symbol': 'Bronze 15%',
    'backdrop': 'Red 8%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999))
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/cookieheart.lottie.json',
    'title': 'Cookie Heart',
    'price': 0.3,
    'model': 'Basic 20%',
    'symbol': 'Copper 20%',
    'backdrop': 'Green 12%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999))
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/partysparkler.lottie.json',
    'title': 'Party Sparkler',
    'price': 0.2,
    'model': 'Basic 25%',
    'symbol': 'Bronze 25%',
    'backdrop': 'Yellow 15%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999))
  },
  {
    'chance': 'yes',
    'link': 'https://nft.fragment.com/gift/signetring.lottie.json',
    'title': 'Signet Ring',
    'price': 1.0,
    'model': 'Premium 5%',
    'symbol': 'Gold 3%',
    'backdrop': 'Purple 5%',
    'number': getRandomNumber(1, 200000),
    'gift_id': String(getRandomNumber(1000000000, 9999999999)),
    'isWin': true
  },
];

// Mock data for upgradable gifts
const mockUpgradableGifts = [
  {
    "title": "Desk Calendar",
    "gift_id": "5976582472832385923",
    "user_id": 7853490326,
    "model": "Purple Front (1.5%)",
    "symbol": "Shark Knife (0.5%)",
    "backdrop": "Pure Gold (2.0%)",
    "name": "DeskCalendar-299547",
    "collectible_id": 299547,
    "url": "https://t.me/nft/DeskCalendar-299547",
    "price": 30,
    "link": "https://nft.fragment.com/gift/deskcalendar.lottie.json"
  },
  {
    "title": "Lol Pop",
    "gift_id": "5965518100206979498",
    "user_id": 7853490326,
    "model": "Magic Wand (1.0%)",
    "symbol": "Gem (0.4%)",
    "backdrop": "Moonstone (2.0%)",
    "name": "LolPop-206473",
    "collectible_id": 206473,
    "url": "https://t.me/nft/LolPop-206473",
    "price": 15.0,
    "link": "https://nft.fragment.com/gift/lolpop.lottie.json"
  },
  {
    "title": "Lunar Snake",
    "gift_id": "5821442464484950994",
    "user_id": 1044392516,
    "model": "Stone Python (1.3%)",
    "symbol": "Bunny (0.5%)",
    "backdrop": "Electric Purple (1.5%)",
    "name": "LunarSnake-13435",
    "collectible_id": 13435,
    "url": "https://t.me/nft/LunarSnake-13435",
    "price": 100,
    "link": "https://nft.fragment.com/gift/lunarsnake.lottie.json"
  },
  {
    "title": "Signet Ring",
    "gift_id": "5821442464484950991",
    "user_id": 1044392516,
    "model": "Premium (5%)",
    "symbol": "Gold (3%)",
    "backdrop": "Purple (5%)",
    "name": "SignetRing-7628",
    "collectible_id": 7628,
    "url": "https://t.me/nft/SignetRing-7628",
    "price": 65,
    "link": "https://nft.fragment.com/gift/signetring.lottie.json"
  },
  {
    "title": "Tama Gadget",
    "gift_id": "5821442464484150911",
    "user_id": 1044392516,
    "model": "Underdog (0.3%)",
    "symbol": "Underdog (0.3%)",
    "backdrop": "Midnight Blue (1%)",
    "name": "TamaGadget-19732",
    "collectible_id": 19732,
    "url": "https://t.me/nft/TamaGadget-19732",
    "price": 32,
    "link": "https://nft.fragment.com/gift/tamagadget.lottie.json"
  },
  {
    "title": "Plush Pepe",
    "gift_id": "5721442464484150991",
    "user_id": 1044392516,
    "model": "Frozen (2%)",
    "symbol": "Rook (0.5%)",
    "backdrop": "Black (2%)",
    "name": "plushpepe-2010",
    "collectible_id": 2010,
    "url": "https://t.me/nft/PlushPepe-2010",
    "price": 1600,
    "link": "https://nft.fragment.com/gift/plushpepe.lottie.json"
  }
];

export default GiftUpgrade;
