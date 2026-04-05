import { useEffect, useCallback } from 'react';
import { BattleLogEntry } from '../types/game';
import { calculateTurnRegeneration, levelUp, canLevelUp } from '../utils/character';
import { useGameState } from './useGameState';
import { useBattle } from './useBattle';
import { useShopInventory } from './useShopInventory';

export const useGame = () => {
  const { gameState, setGameState, resetGame, saveGame } = useGameState();

  // Battle log management
  const addBattleLogEntry = useCallback((entry: BattleLogEntry) => {
    setGameState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog.slice(-49), entry] // Keep last 50 entries
    }));
  }, [setGameState]);

  // Battle system
  const { startBattle, performAction, selectEnemy } = useBattle(
    gameState,
    setGameState,
    addBattleLogEntry
  );

  // Shop and inventory system
  const { buyItem, sellItem, equipItem, unequipItem, refreshShop, getAllEquipment, getInventoryEquipment, getAvailableShopItems } = useShopInventory(
    gameState,
    setGameState,
    addBattleLogEntry
  );

  // Manual level up
  const manualLevelUp = useCallback(() => {
    if (!canLevelUp(gameState.player)) {
      addBattleLogEntry({
        message: 'Not enough EXP to level up!',
        type: 'system',
        timestamp: Date.now()
      });
      return;
    }

    let newPlayer = gameState.player;
    
    // Level up as many times as possible
    while (canLevelUp(newPlayer)) {
      newPlayer = levelUp(newPlayer);
      addBattleLogEntry({
        message: `Level Up! Now level ${newPlayer.level}!`,
        type: 'system',
        timestamp: Date.now()
      });
    }

    setGameState(prev => ({
      ...prev,
      player: newPlayer
    }));
  }, [gameState.player, addBattleLogEntry, setGameState]);

  // Immediate save when player stats change
  useEffect(() => {
    saveGame(gameState);
  }, [gameState, saveGame]);

  // HP/MP regeneration when idle (not in battle)
  useEffect(() => {
    if (gameState.inBattle) return;

    const regenerationInterval = setInterval(() => {
      setGameState(prev => {
        const regenRates = calculateTurnRegeneration(prev.player.level);
        const timeDiff = (Date.now() - prev.lastRegenerationTime) / 1000; // Convert to seconds
        const hpRegen = Math.floor(regenRates.hpRegen * timeDiff);
        const mpRegen = Math.floor(regenRates.mpRegen * timeDiff);
        
        const newHp = Math.min(prev.player.maxHp, prev.player.hp + hpRegen);
        const newMp = Math.min(prev.player.maxMp, prev.player.mp + mpRegen);
        
        // Stop EXP regeneration when at max level
        const expRegen = prev.player.level >= 99 ? 0 : Math.floor(1 * timeDiff); // 1 EXP per second
        let newPlayer = { ...prev.player, hp: newHp, mp: newMp, exp: prev.player.exp + expRegen };
        
        // Check for level up from idle EXP gain
        if (expRegen > 0 && canLevelUp(newPlayer)) {
          while (canLevelUp(newPlayer)) {
            newPlayer = levelUp(newPlayer);
            addBattleLogEntry({
              message: `Auto Level Up! Now level ${newPlayer.level}!`,
              type: 'system',
              timestamp: Date.now()
            });
          }
        }
        
        if (newHp > prev.player.hp || newMp > prev.player.mp || newPlayer.exp > prev.player.exp) {
          return {
            ...prev,
            player: newPlayer,
            lastRegenerationTime: Date.now()
          };
        }
        
        return prev;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(regenerationInterval);
  }, [gameState.inBattle, setGameState, addBattleLogEntry]);

  return {
    gameState,
    setGameState,
    startBattle,
    performAction,
    manualLevelUp,
    resetGame,
    buyItem,
    sellItem,
    equipItem,
    unequipItem,
    refreshShop,
    selectEnemy,
    getAllEquipment,
    getInventoryEquipment,
    getAvailableShopItems
  };
};
