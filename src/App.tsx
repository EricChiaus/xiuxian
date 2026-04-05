import React from 'react';
import { useGame } from './hooks/useGame';
import CharacterPanel from './components/CharacterPanel';
import BattleArea from './components/BattleArea';
import GameInfo from './components/GameInfo';
import OfflineExpNotification from './components/OfflineExpNotification';

function App() {
  const { gameState, startBattle, performAction, manualLevelUp, resetGame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl max-w-7xl w-full p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">⚔️ Simple RPG Game ⚔️</h1>
        </header>

        {/* Offline EXP Notification */}
        {gameState.offlineExp > 0 && (
          <OfflineExpNotification amount={gameState.offlineExp} />
        )}

        {/* Game Info Bar */}
        <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4 mb-6">
          <div className="text-lg font-bold text-gray-800">
            Level: <span className="text-purple-600">{gameState.player.level}</span>
          </div>
          <div className="text-xl font-bold text-yellow-600">
            💰 Coins: {gameState.player.coin}
          </div>
        </div>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Character Panel */}
          <div className="lg:col-span-1">
            <CharacterPanel 
              player={gameState.player}
              onLevelUp={manualLevelUp}
              canLevelUp={gameState.player.exp >= gameState.player.expToNext}
            />
          </div>

          {/* Battle Area */}
          <div className="lg:col-span-2">
            <BattleArea
              inBattle={gameState.inBattle}
              currentEnemy={gameState.currentEnemy}
              battleLog={gameState.battleLog}
              onStartBattle={startBattle}
              onAction={performAction}
            />
          </div>

          {/* Game Info Panel */}
          <div className="lg:col-span-1">
            <GameInfo onResetGame={resetGame} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
