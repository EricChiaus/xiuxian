import React from 'react';
import { BattleAction, Enemy } from '../../types/game';

interface BattleActionsProps {
  isPlayerTurn: boolean;
  currentEnemy: Enemy | null;
  onAction: (action: BattleAction) => void;
}

const BattleActions: React.FC<BattleActionsProps> = ({ isPlayerTurn, currentEnemy, onAction }) => {
  if (!currentEnemy || currentEnemy.hp <= 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-600 mb-6">
      <h4 className="text-lg font-bold text-blue-900 mb-3" style={{ fontFamily: 'serif' }}>你的回合</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => onAction('attack')}
          className={`px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg border-2 border-red-800 transition-all transform hover:scale-105 hover:from-red-700 hover:to-orange-700 ${!isPlayerTurn ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          disabled={!isPlayerTurn}
        >
          ⚔️ 攻击
        </button>
        <button
          onClick={() => onAction('magic')}
          className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg border-2 border-purple-800 transition-all transform hover:scale-105 hover:from-purple-700 hover:to-blue-700 ${!isPlayerTurn ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          disabled={!isPlayerTurn}
        >
          🔮 法术 (-10 MP)
        </button>
        <button
          onClick={() => onAction('heal')}
          className={`px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg border-2 border-green-800 transition-all transform hover:scale-105 hover:from-green-700 hover:to-emerald-700 ${!isPlayerTurn ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          disabled={!isPlayerTurn}
        >
          💚 治疗 (-15 MP)
        </button>
      </div>
    </div>
  );
};

export default BattleActions;
