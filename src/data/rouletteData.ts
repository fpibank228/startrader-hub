
interface RouletteItem {
  chance: string;
  link: string;
  image?: string;
}

// Data for the basic roulette
export const basicRouletteItems: RouletteItem[] = [
  {
    'chance': 'yes',
    'link': 'https://nft.fragment.com/gift/homemadecake-10230.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2017/10/29/12/06/cake-2899717_1280.jpg'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/diamondring-18822.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2018/04/16/09/07/ring-3324230_1280.jpg'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/eternalrose-1385.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2018/01/29/07/11/flower-3115353_1280.jpg'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/cookieheart-87873.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2016/11/22/18/52/cake-1850011_1280.jpg'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/partysparkler-42951.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2018/01/04/19/43/sparkler-3061402_1280.jpg'
  },
  {
    'chance': 'no',
    'link': 'https://nft.fragment.com/gift/partysparkler-42952.lottie.json',
    'image': 'https://cdn.pixabay.com/photo/2018/01/04/19/43/sparkler-3061402_1280.jpg'
  },
];

// Data for the roulette types/options
export const rouletteOptions = [
  {
    id: 'basic',
    title: 'Обычная рулетка',
    description: 'Испытайте свою удачу с шансом выигрыша',
    icon: 'Star',
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    path: '/roulette/basic'
  },
  {
    id: 'nft',
    title: 'NFT рулетка',
    description: 'Выиграйте уникальные NFT предметы',
    icon: 'Star',
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    disabled: true
  },
  {
    id: 'upgrade',
    title: 'Апгрейд',
    description: 'Улучшите свои существующие предметы',
    icon: 'Star',
    imageBg: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    disabled: true
  }
];
