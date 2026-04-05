import { useCallback } from 'react';
import { Character } from '../types/game';
import { addBattleLogEntry } from './useGame';

export const useInventoryLogic = (player: Character, onAddBattleLogEntry: (entry: any) => void) => {
  const useItem = useCallback((itemId: string) => {
    if (!player.inventory.includes(itemId)) return;

    let newPlayer = { ...player };
    let logMessage = '';

    switch (itemId) {
      case 'potion1':
        newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + 50);
        logMessage = 'Used Health Potion! Restored 50 HP!';
        break;
      case 'potion2':
        newPlayer.mp = Math.min(newPlayer.maxMp, newPlayer.mp + 30);
        logMessage = 'Used Mana Potion! Restored 30 MP!';
        break;
      case 'potion3':
        newPlayer.hp = newPlayer.maxHp;
        newPlayer.mp = newPlayer.maxMp;
        logMessage = 'Used Full Heal Potion! Fully restored HP and MP!';
        break;
      default:
        // Equipment items - would implement equip logic here
        return player;
    }

    if (logMessage) {
      newPlayer.inventory = newPlayer.inventory.filter(id => id !== itemId);
      
      onAddBattleLogEntry({
        message: logMessage,
        type: 'system',
        timestamp: Date.now()
      });
    }

    return newPlayer;
  }, [player.inventory]);

  return { useItem };
};
