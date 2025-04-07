
interface RouletteItem {
    chance: string;
    link: string;
    title: string;
    price: number;
    model?: string;
    symbol?: string;
    backdrop?: string;
    number?: number;
    isWin?: boolean;
}

export const basicRouletteItems: RouletteItem[] = [
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168103777563050263/1x/000.png',
        'title': 'Rose',
        'price': 0.25,
    },
    {
        'chance': 'yes',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5168043875654172773/1x/000.png',
        'title': 'Champ',
        'price': 0.25,
        'isWin': true
    },
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170144170496491616/1x/000.png',
        'title': 'Cake',
        'price': 0.25,
    },
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170145012310081615/1x/000.png',
        'title': 'Heart',
        'price': 0.25,
    },
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170233102089322756/1x/000.png',
        'title': 'Bear',
        'price': 0.25,
    },
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170250947678437525/1x/000.png',
        'title': 'Gift',
        'price': 0.25,
    },
    {
        'chance': 'no',
        'link': 'https://idwyjbqan6cqi.mediwall.org/static_gifts/5170314324215857265/1x/000.png',
        'title': 'Flowers',
        'price': 0.25,
    }
];

export const rouletteOptions = [
    {
        id: 'basic',
        title: 'Обычная рулетка',
        description: 'Испытайте свою удачу с шансом выигрыша',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        path: '/roulette/basic'
    },
    {
        id: 'nft',
        title: 'NFT рулетка',
        description: 'Выиграйте уникальные NFT предметы',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
    },
    {
        id: 'upgrade',
        title: 'Апгрейд',
        description: 'Улучшите свои существующие предметы',
        image: 'https://cdn.pixabay.com/photo/2017/02/13/01/26/the-question-mark-2061539_1280.png',
        disabled: true
    }
];
