"use client";

import { CardLegends } from '../modules/card-legends/CardLegends';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Cards, Dice6, Castle } from 'lucide-react';

type GameModule = 'hub' | 'card-legends' | 'dice-masters' | 'pixel-kingdoms';

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<GameModule>('hub');

  const gameModules = [
    {
      id: 'card-legends' as GameModule,
      name: 'Card Legends',
      description: 'NFT Trading Cards with Crypto Personalities',
      icon: Cards,
      color: 'from-purple-500 to-pink-500',
      available: true
    },
    {
      id: 'dice-masters' as GameModule,
      name: 'Dice Masters',
      description: 'NFT Dice Battles with Probability Mechanics',
      icon: Dice6,
      color: 'from-blue-500 to-cyan-500',
      available: false
    },
    {
      id: 'pixel-kingdoms' as GameModule,
      name: 'Pixel Kingdoms',
      description: 'Retro City Builder with NFT Buildings',
      icon: Castle,
      color: 'from-green-500 to-emerald-500',
      available: false
    }
  ];

  const renderGameModule = () => {
    switch (activeModule) {
      case 'card-legends':
        return <CardLegends />;
      case 'hub':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Main Header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  🌌 xSphere Gaming Suite
                </h1>
                <p className="text-2xl text-gray-300 mb-4">
                  Multi-Game Blockchain Gaming Platform on MultiversX
                </p>
                <p className="text-lg text-gray-400">
                  Interconnected NFT-based games with cross-game asset utility
                </p>
              </motion.div>

              {/* Game Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gameModules.map((game, index) => {
                  const IconComponent = game.icon;
                  return (
                    <motion.div
                      key={game.id}
                      className={`relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br ${game.color}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 h-full">
                        <div className="flex items-center mb-4">
                          <IconComponent className="text-white mr-3" size={32} />
                          <h3 className="text-2xl font-bold text-white">{game.name}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{game.description}</p>
                        
                        {game.available ? (
                          <button
                            onClick={() => setActiveModule(game.id)}
                            className={`w-full bg-gradient-to-r ${game.color} hover:opacity-80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200`}
                          >
                            🎮 Play Now
                          </button>
                        ) : (
                          <div className="w-full bg-gray-600 text-gray-400 font-bold py-3 px-6 rounded-lg text-center">
                            🕒 Coming Soon
                          </div>
                        )}
                        
                        {!game.available && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">🚬 Under Development</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Back to Hub Button */}
              {activeModule !== 'hub' && (
                <motion.div 
                  className="fixed bottom-6 right-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => setActiveModule('hub')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-4 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-110"
                  >
                    <Gamepad2 size={24} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        );
    }
  };

  return renderGameModule();
}