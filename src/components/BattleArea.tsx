import React from 'react';
import { Enemy, BattleLogEntry, BattleAction } from '../types/game';
import EnemyTooltip from './EnemyTooltip';
import { getElementColor } from '../types/game';
import { getCultivatorLevelName } from '../types/game';

interface BattleAreaProps {
  inBattle: boolean;
  currentEnemy: Enemy | null;
  enemies: Enemy[];
  selectedEnemyId: string | null;
  isPlayerTurn: boolean;
  battleLog: BattleLogEntry[];
  onStartBattle: () => void;
  onAction: (action: BattleAction) => void;
  onSelectEnemy: (enemyId: string) => void;
}

const BattleArea: React.FC<BattleAreaProps> = ({ 
  inBattle, 
  currentEnemy, 
  enemies,
  selectedEnemyId,
  isPlayerTurn,
  battleLog, 
  onStartBattle, 
  onAction,
  onSelectEnemy
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

  if (inBattle && currentEnemy) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-red-700">
        <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>⚔️ 战斗 ⚔️</h3>
        
        {/* Enemy Display - Multiple Enemies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-red-900 mb-4" style={{ fontFamily: 'serif' }}>👹 妖魔群</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enemies.map((enemy) => {
              const hpPercent = (enemy.hp / enemy.maxHp) * 100;
              const isSelected = enemy.id === selectedEnemyId;
              const isDefeated = enemy.hp <= 0;
              
              // Get enemy's highest power for coloring
              const highestPower = Object.entries(enemy.Elements)
                .filter(([_, value]) => value > 0)
                .sort(([_, a], [__, b]) => b - a)[0];
              const powerColor = highestPower ? getElementColor(highestPower[0] as any) : '#8B0000';
              
              return (
                <div
                  key={enemy.id}
                  onClick={() => isPlayerTurn && !isDefeated && onSelectEnemy(enemy.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-red-600 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg' 
                      : isDefeated
                      ? 'border-gray-400 bg-gray-100 opacity-60 cursor-not-allowed'
                      : `border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-red-400 hover:shadow-md`
                  } ${!isPlayerTurn && !isDefeated ? 'cursor-not-allowed opacity-75' : ''}`}
                  style={{
                    borderLeftColor: powerColor,
                    boxShadow: powerColor ? `0 0 15px ${powerColor}40` : undefined
                  }}
                >
                  {/* Enemy Avatar */}
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <svg className="w-16 h-16" viewBox="0 0 100 100">
                        {/* Demon body */}
                        <ellipse cx="50" cy="60" rx="25" ry="20" fill="#8B0000"/>
                        <ellipse cx="50" cy="60" rx="20" ry="15" fill="#DC143C" opacity="0.7"/>
                        {/* Demon head */}
                        <circle cx="50" cy="35" r="18" fill="#8B0000"/>
                        {/* Horns */}
                        <path d="M 35 25 L 30 15 L 35 20" stroke="#654321" strokeWidth="3" fill="none"/>
                        <path d="M 65 25 L 70 15 L 65 20" stroke="#654321" strokeWidth="3" fill="none"/>
                        {/* Evil eyes */}
                        <circle cx="42" cy="32" r="3" fill="#FF0000"/>
                        <circle cx="58" cy="32" r="3" fill="#FF0000"/>
                        {/* Evil grin */}
                        <path d="M 40 40 Q 50 45 60 40" stroke="#FF0000" strokeWidth="2" fill="none"/>
                        {/* Dark aura */}
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#8B0000" strokeWidth="1" opacity="0.3"/>
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#8B0000" strokeWidth="0.5" opacity="0.2"/>
                      </svg>
                      <div className="absolute -top-2 -right-2 bg-red-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {getCultivatorLevelName(enemy.level).charAt(0)}
          </div>
                      {isSelected && (
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <EnemyTooltip enemy={enemy}>
                      <div className={`text-lg font-bold mb-2 ${isDefeated ? 'text-gray-500 line-through' : 'text-red-900'}`} style={{ fontFamily: 'serif' }}>
                        👹 {enemy.name} {isDefeated && '(已击败)'}
                      </div>
                    </EnemyTooltip>
                    
                    {/* Enemy HP Bar */}
                    <div className="mb-2">
                      <div className="text-sm text-amber-800 font-semibold mb-1">妖魔生命</div>
                      <div className="w-full bg-amber-200 rounded-full h-4 relative border border-amber-600">
                        <div 
                          className={`h-4 rounded-full transition-all duration-300 ${
                            isDefeated ? 'bg-gray-400' : 'bg-gradient-to-r from-red-600 to-red-700'
                          }`}
                          style={{ width: `${isDefeated ? 0 : hpPercent}%` }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {isDefeated ? '0' : enemy.hp}/{enemy.maxHp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Battle Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={() => onAction('attack')}
            disabled={!isPlayerTurn}
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 shadow-md transform hover:-translate-y-1 border-2 ${
              isPlayerTurn 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg border-red-800' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 opacity-50'
            }`}
          >
            ⚔️ 攻击
          </button>
          <button
            onClick={() => onAction('magic')}
            disabled={!isPlayerTurn}
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 shadow-md transform hover:-translate-y-1 border-2 ${
              isPlayerTurn 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg border-blue-800' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 opacity-50'
            }`}
          >
            ✨ 法术
          </button>
          <button
            onClick={() => onAction('heal')}
            disabled={!isPlayerTurn}
            className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 shadow-md transform hover:-translate-y-1 border-2 ${
              isPlayerTurn 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg border-green-800' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-500 opacity-50'
            }`}
          >
            💚 治疗
          </button>
        </div>

        {/* Battle Log */}
        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-600 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-bold text-amber-900 mb-2">战斗记录</h4>
          <div className="space-y-1">
            {battleLog.slice(-5).reverse().map((entry, index) => (
              <div key={index} className={`text-xs p-2 rounded ${getLogEntryClass(entry.type)}`}>
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>⚔️ 修行历练 ⚔️</h3>
      
      <div className="text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto mb-3" viewBox="0 0 100 100">
            {/* Cultivator in meditation */}
            <ellipse cx="50" cy="70" rx="20" ry="15" fill="#8B4513"/>
            <circle cx="50" cy="35" r="15" fill="#fdbcb4"/>
            {/* Meditation pose */}
            <circle cx="50" cy="25" r="8" fill="#2c1810"/>
            <circle cx="50" cy="20" r="4" fill="#2c1810"/>
            <circle cx="40" cy="33" r="1.5" fill="#333"/>
            <circle cx="60" cy="33" r="1.5" fill="#333"/>
            <path d="M 40 40 Q 50 44 60 40" stroke="#333" strokeWidth="1" fill="none"/>
            {/* Spiritual energy */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2"/>
          </svg>
        </div>
        
        <p className="text-amber-800 mb-6">准备开始历练，斩妖除魔！</p>
        
        <button
          onClick={onStartBattle}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-red-800 text-lg"
        >
          🗡️ 开始历练
        </button>
      </div>
    </div>
  );
};

export default BattleArea;
