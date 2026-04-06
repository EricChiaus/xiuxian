import React from 'react';
import { Enemy, BattleLogEntry, BattleAction } from '../types/game';
import { getElementColor } from '../types/game';

interface BattleModalProps {
  inBattle: boolean;
  currentEnemy: Enemy | null;
  enemies: Enemy[];
  selectedEnemyId: string | null;
  isPlayerTurn: boolean;
  battleLog: BattleLogEntry[];
  battleResult: 'victory' | 'defeat' | null;
  rewards: {
    expGained: number;
    coinsGained: number;
    expLost: number;
  } | null;
  onAction: (action: BattleAction) => void;
  onSelectEnemy: (enemyId: string) => void;
  onCloseModal: () => void;
}

const BattleModal: React.FC<BattleModalProps> = ({ 
  inBattle, 
  currentEnemy, 
  enemies,
  selectedEnemyId,
  isPlayerTurn,
  battleLog, 
  battleResult,
  rewards,
  onAction,
  onSelectEnemy,
  onCloseModal
}) => {
  const getLogEntryClass = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'enemy':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'system':
        return 'bg-amber-100 text-amber-800 border border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  if (!inBattle && !battleResult) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border-4 border-red-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-orange-800 text-white p-4">
          <h2 className="text-2xl font-bold text-center" style={{ fontFamily: 'serif' }}>
            ⚔️ 修仙战斗 ⚔️
          </h2>
        </div>

        {/* Battle Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!inBattle && battleResult ? (
            // Battle Result Screen
            <div className="text-center space-y-6">
              <div className="text-4xl">
                {battleResult === 'victory' ? '🎉' : '💀'}
              </div>
              
              <h3 className={`text-3xl font-bold ${battleResult === 'victory' ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'serif' }}>
                {battleResult === 'victory' ? '胜利！' : '失败！'}
              </h3>

              {rewards && (
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border-2 border-amber-700">
                  <h4 className="text-xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'serif' }}>
                    {battleResult === 'victory' ? '🏆 战利品' : '💔 损失'}
                  </h4>
                  
                  <div className="space-y-3">
                    {battleResult === 'victory' ? (
                      <>
                        <div className="flex justify-between items-center bg-white rounded-lg p-3">
                          <span className="font-bold text-green-700">🌟 修为</span>
                          <span className="text-green-600 font-bold">+{rewards.expGained}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-lg p-3">
                          <span className="font-bold text-yellow-700">🪙 灵石</span>
                          <span className="text-yellow-600 font-bold">+{rewards.coinsGained}</span>
                        </div>
                        <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                          ✨ HP/MP 已完全恢复
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center bg-white rounded-lg p-3">
                          <span className="font-bold text-red-700">🌟 修为</span>
                          <span className="text-red-600 font-bold">-{rewards.expLost}</span>
                        </div>
                        <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                          💔 HP/MP 已完全恢复
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={onCloseModal}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 border-2 border-purple-800"
              >
                继续修仙
              </button>
            </div>
          ) : (
            // Active Battle Screen
            <>
              {/* Enemy Display */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-center text-red-900" style={{ fontFamily: 'serif' }}>👹 妖魔群</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enemies.map(enemy => (
                    <div
                      key={enemy.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedEnemyId === enemy.id 
                          ? 'border-red-500 bg-red-50' 
                          : enemy.hp <= 0 
                            ? 'border-gray-300 bg-gray-50 opacity-50' 
                            : 'border-red-300 bg-red-100 hover:border-red-400'
                      }`}
                      onClick={() => enemy.hp > 0 && onSelectEnemy(enemy.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-red-900">{enemy.name}</h4>
                        <div className="relative">
                          <span className="text-2xl">👹</span>
                        </div>
                      </div>
                      
                      {/* HP Bar */}
                      <div className="mb-2">
                        <div className="text-sm text-red-800 font-semibold mb-1">生命值</div>
                        <div className="w-full bg-red-200 rounded-full h-3 relative border border-red-400">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-red-800 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                              {enemy.hp}/{enemy.maxHp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Elements */}
                      {Object.entries(enemy.elements).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(enemy.elements).map(([element, value]) => (
                            <div
                              key={element}
                              className="px-2 py-1 rounded text-xs font-bold text-white border border-gray-800"
                              style={{ backgroundColor: getElementColor(element as any) }}
                            >
                              {element} {Math.floor(value)}
                            </div>
                          ))}
                        </div>
                      )}

                      {enemy.hp <= 0 && (
                        <div className="text-center text-red-600 font-bold mt-2">已击败</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Battle Actions */}
              {isPlayerTurn && currentEnemy && currentEnemy.hp > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-600 mb-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-3" style={{ fontFamily: 'serif' }}>你的回合</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => onAction('attack')}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 border-2 border-red-800"
                    >
                      ⚔️ 攻击
                    </button>
                    <button
                      onClick={() => onAction('magic')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 border-2 border-purple-800"
                    >
                      🔮 法术 (-10 MP)
                    </button>
                    <button
                      onClick={() => onAction('heal')}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 border-2 border-green-800"
                    >
                      💚 治疗 (-15 MP)
                    </button>
                  </div>
                </div>
              )}

              {/* Battle Log */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-600">
                <h4 className="text-lg font-bold text-amber-900 mb-3" style={{ fontFamily: 'serif' }}>战斗记录</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {battleLog.slice(-10).map((entry, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${getLogEntryClass(entry.type)}`}
                    >
                      {entry.message}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleModal;
