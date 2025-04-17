
import { Check, Loader } from 'lucide-react';

interface TransactionStatusDialogProps {
  isLoading: boolean;
  isSuccess: boolean;
}

const TransactionStatusDialog = ({ isLoading, isSuccess }: TransactionStatusDialogProps) => {
  if (!isLoading && !isSuccess) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        {isLoading && (
          <>
            <Loader className="animate-spin text-customPurple w-8 h-8 mb-4" />
            <p className="text-gray-700">Обработка транзакции...</p>
          </>
        )}
        {isSuccess && (
          <>
            <Check className="text-green-500 w-8 h-8 mb-4" />
            <p className="text-gray-700">Транзакция прошла успешно!</p>
            <p className="text-gray-500 text-sm">Ваши средства будут зачислены вам на баланс.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusDialog;
