import React from 'react';
import { Enemy, BattleLogEntry, BattleAction } from '../types/game';

interface BattleAreaProps {
  inBattle: boolean;
  currentEnemy: Enemy | null;
  battleLog: BattleLogEntry[];
  onStartBattle: () => void;
  onAction: (action: BattleAction) => void;
}

const BattleArea: React.FC<BattleAreaProps> = ({ 
  inBattle, 
  currentEnemy, 
  battleLog, 
  onStartBattle, 
  onAction 
}) => {
  const getLogEntryClass = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-100 text-blue-800';
      case 'enemy':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (inBattle && currentEnemy) {
    const hpPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Battle</h3>
        
        {/* Enemy Display */}
        <div className="text-center mb-6">
          <svg className="w-20 h-20 mx-auto mb-3" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#ff6b6b"/>
            <circle cx="35" cy="40" r="3" fill="#333"/>
            <circle cx="65" cy="40" r="3" fill="#333"/>
            <path d="M 30 55 L 70 55" stroke="#333" strokeWidth="2"/>
          </svg>
          <div className="text-lg font-bold text-gray-800 mb-2">
            {currentEnemy.name} (Lv.{currentEnemy.level})
          </div>
          
          {/* Enemy HP Bar */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Enemy HP</div>
            <div className="w-full bg-gray-300 rounded-full h-5 relative">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-5 rounded-full transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {currentEnemy.hp}/{currentEnemy.maxHp}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={() => onAction('attack')}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            ⚔️ Attack
          </button>
          <button
            onClick={() => onAction('magic')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            ✨ Magic
          </button>
          <button
            onClick={() => onAction('heal')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            💚 Heal
          </button>
        </div>

        {/* Battle Log */}
        <div className="bg-gray-50 rounded-lg p-4 h-40 overflow-y-auto">
          <div className="space-y-2">
            {battleLog.slice(-10).map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className={`text-sm p-2 rounded ${getLogEntryClass(entry.type)}`}
              >
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Main Area</h3>
      
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the RPG Game!</h2>
        <p className="text-gray-600 mb-8">Fight enemies to gain EXP and coins!</p>
        <button
          onClick={onStartBattle}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
        >
          ⚔️ Fight Enemy
        </button>
      </div>
    </div>
  );
};

export default BattleArea;
