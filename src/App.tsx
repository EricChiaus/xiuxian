import { useState } from 'react';
import { useGame } from './hooks/useGame';
import CharacterPanel from './components/CharacterPanel';
import BattleArea from './components/BattleArea';
import BattleModal from './components/BattleModal';
import Shop from './components/Shop';
import Inventory from './components/Inventory';
import Profile from './components/Profile';
import { getCultivatorLevelName } from './types/game';

function App() {
  const { gameState, setGameState, startBattle, performAction, manualLevelUp, resetGame, buyItem, sellItem, equipItem, unequipItem, refreshShop, selectEnemy, getAvailableShopItems, closeBattleModal } = useGame();
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-amber-800 to-yellow-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ancient Chinese background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDVMMzUgMTBMMzAgMTVMMjUgMTBMMzAgNVoiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iOCIgZmlsbD0iI0ZGRDcwMCIvPgo8L3N2Zz4K')] bg-repeat"></div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 bg-opacity-95 rounded-3xl shadow-2xl max-w-7xl w-full p-8 border-4 border-amber-900 relative z-10">
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-red-800"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-red-800"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-red-800"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-red-800"></div>
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-900 mb-2" style={{ fontFamily: 'serif' }}>🏮 修仙界 🏮</h1>
          <p className="text-amber-800 text-lg">修炼成仙，斩妖除魔，收集法宝！</p>
        </header>

        {/* Game Info Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6 border-2 border-amber-700">
          <div className="text-lg font-bold text-red-900">
            境界: <span className="text-amber-600">{getCultivatorLevelName(gameState.player.level)}</span>
          </div>
          <div className="text-xl font-bold text-amber-700">
            🪙 灵石: {gameState.player.coin}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 border-2 border-purple-800"
            >
              👤 修仙档案
            </button>
            <button
              onClick={() => setShowShop(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 border-2 border-amber-800"
            >
              🏪 法宝阁
            </button>
            <button
              onClick={() => setShowInventory(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 border-2 border-red-800"
            >
              📜 藏宝阁
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
              onStartBattle={startBattle}
            />
          </div>
        </div>

        {/* Battle Modal */}
        <BattleModal
          inBattle={gameState.inBattle}
          currentEnemy={gameState.currentEnemy}
          enemies={gameState.enemies}
          selectedEnemyId={gameState.selectedEnemyId}
          isPlayerTurn={gameState.isPlayerTurn}
          battleLog={gameState.battleLog}
          battleResult={gameState.battleResult}
          rewards={gameState.battleRewards}
          onAction={performAction}
          onSelectEnemy={selectEnemy}
          onCloseModal={closeBattleModal}
        />

        {/* Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto border-4 border-amber-800 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-red-900" style={{ fontFamily: 'serif' }}>🏪 法宝阁</h2>
                <button
                  onClick={() => setShowShop(false)}
                  className="text-red-600 hover:text-red-800 text-3xl font-bold bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-amber-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <Shop
                shopItems={getAvailableShopItems()}
                playerCoins={gameState.player.coin}
                playerLevel={gameState.player.level}
                onBuyItem={buyItem}
                onRefreshShop={refreshShop}
              />
            </div>
          </div>
        )}

        {/* Inventory Modal */}
        {showInventory && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-y-auto border-4 border-red-800 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-red-900" style={{ fontFamily: 'serif' }}>📜 藏宝阁</h2>
                <button
                  onClick={() => setShowInventory(false)}
                  className="text-red-600 hover:text-red-800 text-3xl font-bold bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-amber-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              <Inventory 
                character={gameState.player} 
                onEquipItem={equipItem}
                onUnequipItem={unequipItem}
                onSellItem={sellItem}
              />
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && (
          <Profile
            character={gameState.player}
            currentAvatar={gameState.player.avatar}
            onAvatarChange={(avatarId) => {
              // Update avatar in game state
              setGameState((prev: any) => ({
                ...prev,
                player: {
                  ...prev.player,
                  avatar: avatarId
                }
              }));
            }}
            onClose={() => setShowProfile(false)}
          />
        )}

        {/* Reset Button */}
        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold rounded-lg hover:from-red-800 hover:to-red-950 transition-all transform hover:scale-105 border-2 border-red-950"
          >
            🔄 重修轮回
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
