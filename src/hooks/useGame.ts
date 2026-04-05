import { useEffect, useCallback } from 'react';
import { BattleLogEntry } from '../types/game';
import { calculateTurnRegeneration } from '../utils/character';
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
  const { buyItem, sellItem, useItem } = useShopInventory(
    gameState,
    setGameState,
    addBattleLogEntry
  );

  // Manual level up
  const manualLevelUp = useCallback(() => {
    // This would be implemented with the character utilities
    // For now, it's a placeholder
    addBattleLogEntry({
      message: 'Manual level up not yet implemented',
      type: 'system',
      timestamp: Date.now()
    });
  }, [addBattleLogEntry]);

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
        const newExp = prev.player.exp + expRegen;
        
        if (newHp > prev.player.hp || newMp > prev.player.mp || newExp > prev.player.exp) {
          return {
            ...prev,
            player: { ...prev.player, hp: newHp, mp: newMp, exp: newExp },
            lastRegenerationTime: Date.now()
          };
        }
        
        return prev;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(regenerationInterval);
  }, [gameState.inBattle, setGameState]);

  return {
    gameState,
    setGameState,
    startBattle,
    performAction,
    manualLevelUp,
    resetGame,
    buyItem,
    sellItem,
    useItem,
    selectEnemy
  };
};
