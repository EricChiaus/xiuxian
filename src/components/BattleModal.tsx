import React from 'react';
import { Enemy, BattleLogEntry, BattleAction } from '../types/game';
import BattleResultView from './battle/BattleResultView';
import EnemyGrid from './battle/EnemyGrid';
import BattleActions from './battle/BattleActions';
import BattleLogPanel from './battle/BattleLogPanel';

import { Character } from '../types/game';

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
  player: Character;
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
  player,
  onAction,
  onSelectEnemy,
  onCloseModal
}) => {
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

        {/* Player Status Bar */}
        <div className="flex justify-center items-center gap-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-3 mx-6 mt-4 mb-2 border-2 border-blue-400">
          <div className="text-lg font-bold text-blue-900">HP: <span className="text-red-600">{player.hp}</span> / {player.maxHp}</div>
          <div className="text-lg font-bold text-blue-900">MP: <span className="text-blue-600">{player.mp}</span> / {player.maxMp}</div>
        </div>

        {/* Battle Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!inBattle && battleResult ? (
            <BattleResultView battleResult={battleResult} rewards={rewards} onCloseModal={onCloseModal} />
          ) : (
            <>
              <EnemyGrid enemies={enemies} selectedEnemyId={selectedEnemyId} onSelectEnemy={onSelectEnemy} />
              <BattleActions isPlayerTurn={isPlayerTurn} currentEnemy={currentEnemy} onAction={onAction} />
              <BattleLogPanel battleLog={battleLog} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleModal;
