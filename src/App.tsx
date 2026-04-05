import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import CharacterPanel from './components/CharacterPanel';
import BattleArea from './components/BattleArea';
import Shop from './components/Shop';
import Inventory from './components/Inventory';

function App() {
  const { gameState, startBattle, performAction, manualLevelUp, resetGame, buyItem, sellItem, useItem } = useGame();
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-7xl w-full p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">⚔️ Simple RPG Game ⚔️</h1>
          <p className="text-gray-600">Battle enemies, level up, and manage your equipment!</p>
        </header>

        {/* Game Info Bar */}
        <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4 mb-6">
          <div className="text-lg font-bold text-gray-800">
            Level: <span className="text-purple-600">{gameState.player.level}</span>
          </div>
          <div className="text-xl font-bold text-yellow-600">
            💰 Coins: {gameState.player.coin}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowShop(true)}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
            >
              🛒 Shop
            </button>
            <button
              onClick={() => setShowInventory(true)}
              className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
            >
              📦 Inventory
            </button>
          </div>
        </div>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Character Panel */}
          <div className="lg:col-span-1">
            <CharacterPanel 
              player={gameState.player}
              onLevelUp={manualLevelUp}
              canLevelUp={gameState.player.exp >= gameState.player.expToNext}
            />
          </div>

          {/* Battle Area */}
          <div className="lg:col-span-1">
            <BattleArea
              inBattle={gameState.inBattle}
              currentEnemy={gameState.currentEnemy}
              battleLog={gameState.battleLog}
              onStartBattle={startBattle}
              onAction={performAction}
            />
          </div>
        </div>

        {/* Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-900">Shop</h2>
                <button
                  onClick={() => setShowShop(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              <Shop
                shopItems={gameState.shopItems}
                playerCoins={gameState.player.coin}
                onBuyItem={buyItem}
              />
            </div>
          </div>
        )}

        {/* Inventory Modal */}
        {showInventory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-900">Inventory</h2>
                <button
                  onClick={() => setShowInventory(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              <Inventory
                character={gameState.player}
                onUseItem={useItem}
                onSellItem={sellItem}
              />
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            🔄 Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
