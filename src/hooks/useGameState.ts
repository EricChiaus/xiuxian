import { useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';

// Save/Load functions
const loadGame = () => {
  try {
    const saved = localStorage.getItem('xiuxian-save');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Fix: Use nested playerEquipment if root is empty
      if (!parsed.playerEquipment || Object.keys(parsed.playerEquipment).length === 0) {
        if (parsed.player?.playerEquipment && Object.keys(parsed.player.playerEquipment).length > 0) {
          parsed.playerEquipment = parsed.player.playerEquipment;
        }
      }
      
      // Fix: Ensure all equipped items are in inventory and have equipment data
      if (parsed.player?.equippedItems) {
        const equippedItemIds = Object.values(parsed.player.equippedItems).filter((id): id is string => Boolean(id));
        
        equippedItemIds.forEach(itemId => {
          // Add to inventory if not present
          if (!parsed.player.inventory.includes(itemId)) {
            parsed.player.inventory.push(itemId);
          }
          
          // Add equipment data if missing
          if (!parsed.playerEquipment[itemId]) {
            parsed.playerEquipment[itemId] = {
              id: itemId,
              name: 'Equipped Item',
              type: 'weapon',
              rarity: 'common',
              level: 1,
              bonus: {},
              elements: {},
              elementResistance: {},
              price: 100,
              sellPrice: 50
            };
          }
        });
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
      playerEquipment: state.playerEquipment,
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
        shopItems: generateShopItems(savedData.player.level),
        playerEquipment: savedData.playerEquipment || {} // Preserve purchased equipment
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
      playerEquipment: {}
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
      shopItems: generateShopItems(createInitialCharacter().level),
      playerEquipment: {}
    });
  }, []);

  return {
    gameState,
    setGameState,
    resetGame,
    saveGame
  };
};
