"use client";

import { useGetAccountInfo, useGetPendingTransactions } from '@multiversx/sdk-dapp';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Crown } from 'lucide-react';

interface CardData {
  id: number;
  name: string;
  rarity: number;
  power: number;
  image?: string;
}

const rarityColors = {
  1: 'from-gray-400 to-gray-600', // Common
  2: 'from-blue-400 to-blue-600', // Rare
  3: 'from-purple-400 to-purple-600', // Epic
  4: 'from-yellow-400 to-yellow-600', // Legendary
};

const rarityIcons = {
  1: Sparkles,
  2: Zap,
  3: Shield,
  4: Crown,
};

export const CardLegends: React.FC = () => {
  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [playerCards, setPlayerCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleCards: CardData[] = [
    { id: 1, name: "Cosmic Warrior", rarity: 4, power: 850 },
    { id: 2, name: "Space Ranger", rarity: 3, power: 650 },
    { id: 3, name: "Stellar Mage", rarity: 2, power: 450 },
    { id: 4, name: "Galaxy Scout", rarity: 1, power: 250 },
  ];

  const handleMintCard = async () => {
    if (!address) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    // Here we'll integrate with MultiversX SDK to call smart contract
    // For now, simulate minting
    setTimeout(() => {
      const randomCard = sampleCards[Math.floor(Math.random() * sampleCards.length)];
      setPlayerCards(prev => [...prev, { ...randomCard, id: Date.now() }]);
      setLoading(false);
    }, 2000);
  };

  const getRarityName = (rarity: number) => {
    const names = { 1: 'Common', 2: 'Rare', 3: 'Epic', 4: 'Legendary' };
    return names[rarity as keyof typeof names] || 'Common';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🃏 Card Legends
          </h1>
          <p className="text-xl text-gray-300">
            Collect, trade, and battle with NFT cards in the xSphere universe
          </p>
        </motion.div>

        {/* Wallet Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 text-center">
          {address ? (
            <p className="text-green-400">Wallet Connected: {address.slice(0, 8)}...{address.slice(-8)}</p>
          ) : (
            <p className="text-yellow-400">Please connect your MultiversX wallet to start playing</p>
          )}
        </div>

        {/* Mint Card Section */}
        <div className="text-center mb-8">
          <motion.button
            onClick={handleMintCard}
            disabled={loading || !address}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? '⚡ Minting...' : '🎴 Mint New Card'}
          </motion.button>
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {playerCards.map((card, index) => {
            const IconComponent = rarityIcons[card.rarity as keyof typeof rarityIcons];
            return (
              <motion.div
                key={card.id}
                className={`bg-gradient-to-br ${rarityColors[card.rarity as keyof typeof rarityColors]} p-1 rounded-xl`}
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
              >
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 h-full">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <IconComponent className="text-yellow-400" size={24} />
                    <span className="text-sm font-semibold text-white">
                      {getRarityName(card.rarity)}
                    </span>
                  </div>

                  {/* Card Image Placeholder */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-40 mb-4 flex items-center justify-center">
                    <span className="text-4xl">🌟</span>
                  </div>

                  {/* Card Info */}
                  <h3 className="text-white font-bold text-lg mb-2">{card.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-semibold">⚡ {card.power}</span>
                    <span className="text-blue-400 text-sm">#{card.id}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {playerCards.length === 0 && (
          <motion.div 
            className="text-center text-gray-400 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-6xl mb-4">🎴</div>
            <p className="text-xl">Your card collection is empty</p>
            <p className="text-sm mt-2">Mint your first NFT card to start your legend!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};