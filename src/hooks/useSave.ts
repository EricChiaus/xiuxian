import { useEffect } from 'react';
import { Character } from '../types/game';
import { saveGame } from '../utils/storage';

export const useAutoSave = (player: Character) => {
  // Immediate save when player stats change
  useEffect(() => {
    saveGame({
      player: player,
      lastSaveTime: Date.now()
    });
  }, [player, player.inventory, player.level, player.coin, player.exp, player.hp, player.mp, player.maxHp, player.maxMp, player.pa, player.ma, player.pd, player.md, player.expToNext]);
};
