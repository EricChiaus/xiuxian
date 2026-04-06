import { useState, useCallback } from 'react';
import { Character, GameState } from '../types/game';
import { createInitialCharacter, gainExp } from '../utils/character';
import { generateShopItems } from '../utils/shop';

// Save/Load functions
const loadGame = () => {
  try {
    const saved = localStorage.getItem('xiuxian-save');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveGame = (state: GameState) => {
  try {
    // Create a save state without shopItems (should be randomly generated)
    const saveState = {
      ...state,
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

const calculateStats = (character: Character) => {
  const levelMultiplier = 1 + (character.level - 1) * 0.15;
  
  return {
    ...character,
    maxHp: Math.floor(100 * levelMultiplier),
    maxMp: Math.floor(50 * levelMultiplier),
    pa: Math.floor(10 * levelMultiplier),
    ma: Math.floor(8 * levelMultiplier),
    pd: Math.floor(5 * levelMultiplier),
    md: Math.floor(5 * levelMultiplier)
  };
};

const calculateOfflineExp = (lastSaveTime: number) => {
  const now = Date.now();
  const hoursPassed = (now - lastSaveTime) / (1000 * 60 * 60);
  return Math.floor(hoursPassed * 10); // 10 EXP per hour
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = loadGame();
    if (savedData) {
      const character = calculateStats(savedData.player);
      const offlineExp = calculateOfflineExp(savedData.lastSaveTime);
      const characterWithExp = gainExp(character, offlineExp);
      
      // Cap EXP at max level to prevent overflow on refresh
      const cappedCharacter = characterWithExp.level >= 99 ? 
        { ...characterWithExp, exp: characterWithExp.expToNext - 1 } : 
        characterWithExp;
      
      return {
        player: cappedCharacter,
        currentEnemy: null,
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
        lastSaveTime: Date.now(),
        battleLog: offlineExp > 0 ? [{
          message: `Welcome back! You earned ${offlineExp} EXP while away!`,
          type: 'system',
          timestamp: Date.now()
        }] : [],
        offlineExp,
        lastRegenerationTime: Date.now(),
        shopItems: generateShopItems(cappedCharacter.level),
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
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
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
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
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
