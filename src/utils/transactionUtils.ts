
import { Address, Cell, toNano } from '@ton/core';
import { beginCell } from '@ton/ton';
import axios from 'axios';
import { SendTransactionRequest } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

export const createTransactionRequest = (stars: number, tonAmount: string) => {
  const body = beginCell().storeUint(0, 32).storeStringTail(`${stars} stars`).endCell();
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

export const processSuccessfulTransaction = async (
  hash: string, 
  walletAddress: string | undefined, 
  stars: number, 
  amountInNanoTON: string, 
  setIsLoading: (value: boolean) => void,
  setIsSuccess: (value: boolean) => void,
  showErrorToast: (message: string) => void
) => {
  setIsLoading(true);

  try {
    const userFriendlyAddress = walletAddress
      ? Address.parse(walletAddress).toString({ bounceable: false })
      : 'Нет адреса';

    await axios.post(
      'https://starsbuy.space/api/api/send_transaction',
      {
        walletAddress: userFriendlyAddress,
        amount: amountInNanoTON,
        comment: `${stars} stars`,
        currency: 'TON',
        timestamp: Date.now(),
        hash: hash,
        init: WebApp.initData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  } catch (error) {
    console.error(error);
    setIsLoading(false);
    showErrorToast('Не удалось завершить транзакцию.');
  }
};
