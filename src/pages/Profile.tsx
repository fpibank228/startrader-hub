
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, History, User, DollarSign } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import StarCard from '../components/StarCard';

interface Transaction {
  id: number;
  type: 'buy' | 'sell';
  amount: number;
  date: string;
  price: string;
}

const Profile = () => {
  const [tab, setTab] = useState<'profile' | 'history'>('profile');
  
  const mockTransactions: Transaction[] = [
    { id: 1, type: 'buy', amount: 100, date: '10.05.2023', price: '0.43 TON' },
    { id: 2, type: 'buy', amount: 50, date: '15.05.2023', price: '0.21 TON' },
    { id: 3, type: 'sell', amount: 30, date: '20.05.2023', price: '0.06 TON' },
    { id: 4, type: 'buy', amount: 200, date: '25.05.2023', price: '0.86 TON' },
    { id: 5, type: 'sell', amount: 100, date: '01.06.2023', price: '0.21 TON' },
  ];

  const totalBought = mockTransactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSold = mockTransactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="relative min-h-screen pt-4 pb-24">
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Мой профиль</h1>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Управляйте своим аккаунтом и просматривайте историю транзакций
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <div className="flex rounded-lg overflow-hidden mb-6 bg-white/5 backdrop-blur-sm">
            <button
              onClick={() => setTab('profile')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                tab === 'profile' ? 'bg-customPurple text-white' : 'text-white/70'
              }`}
            >
              <User size={18} />
              <span>Профиль</span>
            </button>
            <button
              onClick={() => setTab('history')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                tab === 'history' ? 'bg-customPurple text-white' : 'text-white/70'
              }`}
            >
              <History size={18} />
              <span>История</span>
            </button>
          </div>

          {tab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StarCard className="mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-customMidBlue mb-4 flex items-center justify-center">
                    <User size={40} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Пользователь</h2>
                  <p className="text-white/70 text-sm mb-4">user@example.com</p>
                  
                  <div className="w-full h-0.5 bg-white/10 my-4"></div>
                  
                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-300 mb-1">
                        <Star size={16} fill="rgba(253, 224, 71, 0.5)" />
                        <span className="font-bold">Куплено</span>
                      </div>
                      <p className="text-2xl font-bold">{totalBought}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                        <DollarSign size={16} />
                        <span className="font-bold">Продано</span>
                      </div>
                      <p className="text-2xl font-bold">{totalSold}</p>
                    </div>
                  </div>
                </div>
              </StarCard>
            </motion.div>
          )}

          {tab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StarCard className="mb-6">
                <h3 className="text-lg font-medium mb-4">История операций</h3>
                
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'buy' 
                              ? 'bg-yellow-500/20' 
                              : 'bg-green-500/20'
                          }`}
                        >
                          {transaction.type === 'buy' ? (
                            <Star size={16} className="text-yellow-300" />
                          ) : (
                            <DollarSign size={16} className="text-green-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type === 'buy' ? 'Покупка' : 'Продажа'} {transaction.amount} звезд
                          </div>
                          <div className="text-xs text-white/50">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          transaction.type === 'buy' 
                            ? 'text-red-400' 
                            : 'text-green-400'
                        }`}>
                          {transaction.type === 'buy' ? '-' : '+'}{transaction.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </StarCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
