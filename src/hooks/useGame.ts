import { useCallback, useEffect } from 'react';
import { BattleLogEntry } from '../types/game';
import { levelUp, canLevelUp } from '../utils/character';
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
    addBattleLogEntry,
    saveGame
  );

  // Shop and inventory system
  const { buyItem, sellItem, equipItem, unequipItem, refreshShop, getAllEquipment, getInventoryEquipment, getAvailableShopItems } = useShopInventory(
    gameState,
    setGameState,
    addBattleLogEntry,
    saveGame
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

  // Close battle modal and reset battle result
  const closeBattleModal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      battleResult: null,
      battleRewards: null
    }));
  }, [setGameState]);

  // Auto EXP growth every 60 seconds (not during battle)
  useEffect(() => {
    if (gameState.inBattle) return;

    const expInterval = setInterval(() => {
      setGameState(prev => {
        // Don't give EXP if at max level
        if (prev.player.level >= 99) return prev;
        
        // Check if EXP is at cap
        if (prev.player.exp >= prev.player.expToNext) return prev;
        
        // Add 1 EXP, but don't exceed cap
        const newExp = Math.min(prev.player.exp + 1, prev.player.expToNext);
        const newPlayer = { ...prev.player, exp: newExp };
        
        // No auto level up - just save the EXP gain
        const newState = {
          ...prev,
          player: newPlayer
        };
        
        saveGame(newState);
        return newState;
      });
    }, 60000); // Every 60 seconds

    return () => clearInterval(expInterval);
  }, [gameState.inBattle, setGameState, saveGame]);

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
    getAvailableShopItems,
    closeBattleModal
  };
};
