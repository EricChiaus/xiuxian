import { useState, useCallback } from 'react';
import { GameState, Equipment } from '../types/game';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';

// Save/Load functions
const loadGame = () => {
  try {
    const saved = localStorage.getItem('xiuxian-save');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Migrate old save data with playerEquipment to new format
      if (parsed.player && parsed.player.playerEquipment) {
        const oldPlayerEquipment = parsed.player.playerEquipment;
        
        // Convert playerEquipment objects to inventory Equipment objects
        const inventoryEquipment: Equipment[] = [];
        
        Object.entries(oldPlayerEquipment).forEach(([itemId, equipmentData]) => {
          const equipment = equipmentData as Equipment;
          inventoryEquipment.push({
            ...equipment,
            equipped: Object.values(parsed.player.equippedItems || {}).includes(itemId)
          });
        });
        
        // Update player data to new format
        parsed.player.inventory = inventoryEquipment;
        
        // Remove old playerEquipment field
        delete parsed.player.playerEquipment;
      }
      
      return parsed;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const saveGame = (state: GameState) => {
  try {
    // Don't save during battle - only save after battle completion
    if (state.inBattle) {
      console.log('Skipping save during battle');
      return;
    }
    
    // Create a clean save state without battle-related data
    const saveState = {
      player: state.player,
      lastSaveTime: Date.now(),
      shopItems: [] // Don't save shop items - they should be randomly generated
    };
    localStorage.setItem('xiuxian-save', JSON.stringify(saveState));
  } catch {
    // Silent fail
  }
};

const clearSavedGame = () => {
  try {
    localStorage.removeItem('xiuxian-save');
  } catch {
    // Silent fail
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = loadGame();
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
        shopItems: generateShopItems(savedData.player.level)
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
      shopItems: generateShopItems(createInitialCharacter().level)
    };
  });

  const resetGame = useCallback(() => {
    clearSavedGame();
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
      shopItems: generateShopItems(createInitialCharacter().level)
    });
  }, []);

  return {
    gameState,
    setGameState,
    resetGame,
    saveGame
  };
};
