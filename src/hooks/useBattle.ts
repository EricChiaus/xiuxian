import { useCallback } from 'react';
import { Character, Enemy, BattleAction } from '../types/game';
import { performPlayerAction, performEnemyAction, checkBattleEnd } from '../utils/battle';
import { addBattleLogEntry } from './useGame';

export const useBattleLogic = (player: Character, currentEnemy: Enemy | null, inBattle: boolean, onAddBattleLogEntry: (entry: any) => void) => {
  const performAction = useCallback((action: BattleAction) => {
    if (!currentEnemy || !inBattle) return;

    const result = performPlayerAction(player, currentEnemy, action);
    const newEnemy = performEnemyAction(currentEnemy, result.enemyDamage);
    
    onAddBattleLogEntry({
      message: result.logMessage,
      type: 'player',
      timestamp: Date.now()
    });

    const battleEndResult = checkBattleEnd(player, newEnemy);
    
    if (battleEndResult.ended) {
      onAddBattleLogEntry({
        message: battleEndResult.message,
        type: 'system',
        timestamp: Date.now()
      });

      return {
        player: battleEndResult.player,
        currentEnemy: null,
        inBattle: false,
        battleEnded: true,
        victory: battleEndResult.victory
      };
    }

    return {
      player: result.player,
      currentEnemy: newEnemy,
      inBattle: true,
      battleEnded: false,
      victory: false
    };
  }, [player, currentEnemy, inBattle]);

  return { performAction };
};
