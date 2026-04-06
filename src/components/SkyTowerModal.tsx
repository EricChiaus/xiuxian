import React from 'react';
import BattleModal from './BattleModal';
import { Enemy, Character, BattleAction, BattleLogEntry } from '../types/game';

interface SkyTowerModalProps {
  inBattle: boolean;
  enemies: Enemy[];
  player: Character;
  selectedEnemyId: string | null;
  isPlayerTurn: boolean;
  battleLog: BattleLogEntry[];
  battleResult: 'victory' | 'defeat' | null;
  rewards: any;
  onAction: (action: BattleAction) => void;
  onSelectEnemy: (enemyId: string) => void;
  onCloseModal: () => void;
}

const SkyTowerModal: React.FC<SkyTowerModalProps> = ({
  inBattle,
  enemies,
  player,
  selectedEnemyId,
  isPlayerTurn,
  battleLog,
  battleResult,
  rewards,
  onAction,
  onSelectEnemy,
  onCloseModal
}) => {
  return (
    <BattleModal
      inBattle={inBattle}
      currentEnemy={enemies[0]}
      enemies={enemies}
      selectedEnemyId={selectedEnemyId}
      isPlayerTurn={isPlayerTurn}
      battleLog={battleLog}
      battleResult={battleResult}
      rewards={rewards}
      player={player}
      onAction={onAction}
      onSelectEnemy={onSelectEnemy}
      onCloseModal={onCloseModal}
    />
  );
};

export default SkyTowerModal;
