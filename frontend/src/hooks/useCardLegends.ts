import { useState, useCallback } from 'react';
import {
  useGetAccountInfo,
  refreshAccount,
  sendTransactions,
} from '@multiversx/sdk-dapp';
import { 
  ContractFunction, 
  Address, 
  ProxyNetworkProvider,
  SmartContract,
  DefaultSmartContractController,
  TypedValue,
  BytesValue,
  U8Value,
  U32Value,
} from '@multiversx/sdk-core';
import { ProxyNetworkProvider as NetworkProvider } from '@multiversx/sdk-network-providers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'erd1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6gq4c5';
const GATEWAY_URL = process.env.NEXT_PUBLIC_MULTIVERSX_CHAIN === 'mainnet' 
  ? 'https://gateway.multiversx.com' 
  : 'https://devnet-gateway.multiversx.com';

interface CardData {
  id: number;
  name: string;
  rarity: number;
  power: number;
  owner: string;
}

export const useCardLegends = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardData[]>([]);

  const networkProvider = new NetworkProvider(GATEWAY_URL);
  const contract = new SmartContract({ address: new Address(CONTRACT_ADDRESS) });
  const controller = new DefaultSmartContractController();

  const mintCard = useCallback(async (cardName: string, rarity: number, power: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const transaction = contract.methods
        .mintCard([
          new Address(address),
          BytesValue.fromUTF8(cardName),
          new U8Value(rarity),
          new U32Value(power)
        ])
        .withSender(new Address(address))
        .withGasLimit(10000000)
        .withChainID('D') // Devnet
        .buildTransaction();

      await sendTransactions({
        transactions: [transaction],
        transactionsDisplayInfo: {
          processingMessage: 'Minting NFT card...',
          errorMessage: 'Failed to mint card',
          successMessage: 'Card minted successfully!'
        }
      });
    } catch (error) {
      console.error('Mint card error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, contract]);

  const getPlayerCards = useCallback(async () => {
    if (!address) return [];
    
    try {
      const query = contract.methods.getPlayerCards([new Address(address)]);
      const queryResponse = await networkProvider.queryContract(query);
      
      // Parse response and convert to CardData[]
      // For now, return sample data
      return [
        { id: 1, name: "Sample Card", rarity: 2, power: 400, owner: address }
      ];
    } catch (error) {
      console.error('Get cards error:', error);
      return [];
    }
  }, [address, contract, networkProvider]);

  const getCard = useCallback(async (cardId: number) => {
    try {
      const query = contract.methods.getCard([new U32Value(cardId)]);
      const queryResponse = await networkProvider.queryContract(query);
      
      // Parse and return card data
      return null; // Placeholder
    } catch (error) {
      console.error('Get card error:', error);
      return null;
    }
  }, [contract, networkProvider]);

  const refreshCards = useCallback(async () => {
    const playerCards = await getPlayerCards();
    setCards(playerCards);
  }, [getPlayerCards]);

  return {
    // State
    loading,
    cards,
    address,
    
    // Actions
    mintCard,
    getPlayerCards,
    getCard,
    refreshCards,
    
    // Utils
    isConnected: !!address,
  };
};