import { useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';
import { clearGameSave, loadGameSave, saveGameState } from '../utils/persistence';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = loadGameSave();
    if (savedData) {
      return {
        player: savedData.player,
        currentEnemy: null,
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
        lastSaveTime: Date.now(),
        battleLog: [], // No more offline EXP with regeneration removed
        shopItems: generateShopItems(savedData.player.level),
        battleResult: null,
        battleRewards: null
      };
    }
    
    return {
      player: createInitialCharacter(),
      currentEnemy: null,
      enemies: [],
      selectedEnemyId: null,
      inBattle: false,
      isPlayerTurn: true,
      lastSaveTime: Date.now(),
      battleLog: [],
      shopItems: generateShopItems(createInitialCharacter().level),
      battleResult: null,
      battleRewards: null
    };
  });

  const resetGame = useCallback(() => {
    clearGameSave();
    setGameState({
      player: createInitialCharacter(),
      currentEnemy: null,
      enemies: [],
      selectedEnemyId: null,
      inBattle: false,
      isPlayerTurn: true,
      lastSaveTime: Date.now(),
      battleLog: [{
        message: 'Game reset! Starting fresh...',
        type: 'system',
        timestamp: Date.now()
      }],
      shopItems: generateShopItems(createInitialCharacter().level),
      battleResult: null,
      battleRewards: null
    });
  }, []);

  const saveGame = useCallback((state: GameState) => {
    saveGameState(state);
  }, []);

  return {
    gameState,
    setGameState,
    resetGame,
    saveGame
  };
};
