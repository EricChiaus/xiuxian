import { useState, useEffect, useCallback } from 'react';
import { GameState, BattleLogEntry, BattleAction } from '../types/game';
import { createInitialCharacter, calculateStats, canLevelUp, levelUp, gainExp, calculateRegenerationRates } from '../utils/character';
import { generateEnemy } from '../utils/enemies';
import { saveGame, loadGame, calculateOfflineExp, clearSavedGame } from '../utils/storage';
import { generateShopItems } from '../utils/shop';
import { performPlayerAction, performEnemyAction, checkBattleEnd } from '../utils/battle';

export const useGame = () => {
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
        inBattle: false,
        lastSaveTime: Date.now(),
        battleLog: offlineExp > 0 ? [{
          message: `Welcome back! You earned ${offlineExp} EXP while away!`,
          type: 'system',
          timestamp: Date.now()
        }] : [],
        offlineExp,
        lastRegenerationTime: Date.now(),
        shopItems: generateShopItems(),
        playerEquipment: []
      };
    }
    
    return {
      player: createInitialCharacter(),
      currentEnemy: null,
      inBattle: false,
      lastSaveTime: Date.now(),
      battleLog: [],
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
      shopItems: generateShopItems(),
      playerEquipment: []
    };
  });

  // Immediate save when player stats change
  useEffect(() => {
    saveGame({
      player: gameState.player,
      lastSaveTime: Date.now()
    });
  }, [gameState.player, gameState.player.inventory, gameState.player.level, gameState.player.coin, gameState.player.exp, gameState.player.hp, gameState.player.mp, gameState.player.maxHp, gameState.player.maxMp, gameState.player.pa, gameState.player.ma, gameState.player.pd, gameState.player.md, gameState.player.expToNext]);

  // HP/MP regeneration when idle (not in battle)
  useEffect(() => {
    if (gameState.inBattle) return;

    const regenerationInterval = setInterval(() => {
      setGameState(prev => {
        const regenRates = calculateRegenerationRates(prev.player.level);
        const timeDiff = (Date.now() - prev.lastRegenerationTime) / 1000; // Convert to seconds
        const hpRegen = Math.floor(regenRates.hpPerSecond * timeDiff);
        const mpRegen = Math.floor(regenRates.mpPerSecond * timeDiff);
        
        const newHp = Math.min(prev.player.maxHp, prev.player.hp + hpRegen);
        const newMp = Math.min(prev.player.maxMp, prev.player.mp + mpRegen);
        
        // Stop EXP regeneration when at max level
        const expRegen = prev.player.level >= 99 ? 0 : Math.floor(regenRates.expPerSecond * timeDiff);
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
    }, 1000); // Check every second

    return () => clearInterval(regenerationInterval);
  }, [gameState.inBattle, gameState.player.level]);

  const addBattleLogEntry = useCallback((entry: BattleLogEntry) => {
    setGameState(prev => ({
      ...prev,
      battleLog: [...prev.battleLog.slice(-49), entry] // Keep last 50 entries
    }));
  }, []);

  const startBattle = useCallback(() => {
    if (gameState.inBattle) return;

    const enemy = generateEnemy(gameState.player.level);
    
    setGameState(prev => ({
      ...prev,
      currentEnemy: enemy,
      inBattle: true,
      battleLog: [...prev.battleLog, {
        message: `Battle started! ${enemy.name} appears!`,
        type: 'enemy',
        timestamp: Date.now()
      }]
    }));
  }, [gameState.inBattle, gameState.player.level]);

  const performAction = useCallback((action: BattleAction) => {
    if (!gameState.inBattle || !gameState.currentEnemy) return;

    // Player action
    const playerResult = performPlayerAction(gameState.player, gameState.currentEnemy, action);
    addBattleLogEntry(playerResult.logEntry);

    // Add turn regeneration log if applicable
    if (playerResult.turnRegeneration) {
      addBattleLogEntry({
        message: `Regenerated +${playerResult.turnRegeneration.hpRegen} HP and +${playerResult.turnRegeneration.mpRegen} MP this turn!`,
        type: 'system',
        timestamp: Date.now()
      });
    }

    // Check for level up from idle EXP gain
    if (playerResult.character.exp >= playerResult.character.expToNext) {
      while (canLevelUp(playerResult.character)) {
        const leveledUpCharacter = levelUp(playerResult.character);
        addBattleLogEntry({
          message: `Level Up! Now level ${leveledUpCharacter.level}!`,
          type: 'system',
          timestamp: Date.now()
        });
        playerResult.character = leveledUpCharacter;
      }
    }

    // Check if battle ended after player action
    const battleEndCheck = checkBattleEnd(playerResult.character, playerResult.enemy);
    if (battleEndCheck.isVictory) {
      const expGained = playerResult.enemy.expReward;
      const coinsGained = playerResult.enemy.coinReward;
      let newPlayer = gainExp(playerResult.character, expGained);
      newPlayer.coin += coinsGained;

      // Auto level up if possible
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
        player: newPlayer,
        currentEnemy: null,
        inBattle: false,
        battleLog: [...prev.battleLog, {
          message: `Victory! You gained ${expGained} EXP and ${coinsGained} coins!`,
          type: 'system',
          timestamp: Date.now()
        }]
      }));
      return;
    }

    if (battleEndCheck.isDefeat) {
      const expLoss = Math.floor(gameState.player.exp * 0.1);
      let newPlayer = gainExp(playerResult.character, -expLoss);
      
      // Restore some HP/MP for next battle
      newPlayer.hp = Math.floor(newPlayer.maxHp * 0.5);
      newPlayer.mp = Math.floor(newPlayer.maxMp * 0.5);

      setGameState(prev => ({
        ...prev,
        player: newPlayer,
        currentEnemy: null,
        inBattle: false,
        battleLog: [...prev.battleLog, {
          message: `Defeat! You lost ${expLoss} EXP!`,
          type: 'system',
          timestamp: Date.now()
        }]
      }));
      return;
    }

    // Update game state with damaged enemy and player changes
    setGameState(prev => ({
      ...prev,
      player: playerResult.character,
      currentEnemy: playerResult.enemy
    }));

    // Enemy action
    setTimeout(() => {
      setGameState(prev => {
        if (!prev.currentEnemy) return prev;

        const enemyAction = performEnemyAction(prev.player, prev.currentEnemy);
        addBattleLogEntry({
          message: enemyAction.logEntry.message,
          type: enemyAction.logEntry.type,
          timestamp: Date.now()
        });

        // Check if battle ended after enemy action
        const battleEndCheck = checkBattleEnd(prev.player, enemyAction.enemy);
        if (battleEndCheck.isVictory) {
          const expGained = enemyAction.enemy.expReward;
          const coinsGained = enemyAction.enemy.coinReward;
          let newPlayer = gainExp(prev.player, expGained);
          newPlayer.coin += coinsGained;

          // Auto level up if possible
          while (canLevelUp(newPlayer)) {
            newPlayer = levelUp(newPlayer);
            addBattleLogEntry({
              message: `Level Up! Now level ${newPlayer.level}!`,
              type: 'system',
              timestamp: Date.now()
            });
          }

          return {
            ...prev,
            player: newPlayer,
            currentEnemy: null,
            inBattle: false,
            battleLog: [...prev.battleLog, {
              message: `Victory! You gained ${expGained} EXP and ${coinsGained} coins!`,
              type: 'system',
              timestamp: Date.now()
            }]
          };
        }

        if (battleEndCheck.isDefeat) {
          const expLoss = Math.floor(prev.player.exp * 0.1);
          let newPlayer = gainExp(prev.player, -expLoss);
          
          // Restore some HP/MP for next battle
          newPlayer.hp = Math.floor(newPlayer.maxHp * 0.5);
          newPlayer.mp = Math.floor(newPlayer.maxMp * 0.5);

          return {
            ...prev,
            player: newPlayer,
            currentEnemy: null,
            inBattle: false,
            battleLog: [...prev.battleLog, {
              message: `Defeat! You lost ${expLoss} EXP!`,
              type: 'system',
              timestamp: Date.now()
            }]
          };
        }

        return {
          ...prev,
          player: enemyAction.character,
          currentEnemy: enemyAction.enemy
        };
      });
    }, 1000); // Enemy action delay
  }, [gameState.inBattle, gameState.currentEnemy, gameState.player.exp, addBattleLogEntry]);

  const manualLevelUp = useCallback(() => {
    if (!canLevelUp(gameState.player)) return;

    const newPlayer = levelUp(gameState.player);
    
    const newLogEntry: BattleLogEntry = {
  message: `Level Up! Now level ${newPlayer.level}!`,
  type: 'system' as const,
  timestamp: Date.now()
};
addBattleLogEntry(newLogEntry);

setGameState(prev => ({
  ...prev,
  player: newPlayer,
  battleLog: [...prev.battleLog, newLogEntry]
}));
  }, [gameState.player]);

  const buyItem = useCallback((itemId: string) => {
    const item = gameState.shopItems.find(shopItem => shopItem.id === itemId);
    if (!item || gameState.player.coin < item.price) return;

    setGameState(prev => {
      const newPlayer = { ...prev.player, coin: prev.player.coin - item.price };
      
      // Add equipment to inventory
      newPlayer.inventory = [...newPlayer.inventory, itemId];

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `Purchased ${item.name} for ${item.price} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.shopItems, gameState.player.coin]);

  const sellItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    const item = gameState.shopItems.find(shopItem => shopItem.id === itemId);
    if (!item) return;

    setGameState(prev => {
      const newPlayer = { 
        ...prev.player, 
        coin: prev.player.coin + Math.floor(item.price / 2), // Sell for half price
        inventory: prev.player.inventory.filter(id => id !== itemId)
      };

      return {
        ...prev,
        player: newPlayer
      };
    });

    addBattleLogEntry({
      message: `Sold item for ${Math.floor(item.price / 2)} 🪙!`,
      type: 'system',
      timestamp: Date.now()
    });
  }, [gameState.player.inventory, gameState.shopItems]);

  const useItem = useCallback((itemId: string) => {
    if (!gameState.player.inventory.includes(itemId)) return;

    let newPlayer = { ...gameState.player };
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
        return;
    }

    if (logMessage) {
      newPlayer.inventory = newPlayer.inventory.filter(id => id !== itemId);
      
      setGameState(prev => ({
        ...prev,
        player: newPlayer
      }));

      addBattleLogEntry({
        message: logMessage,
        type: 'system',
        timestamp: Date.now()
      });
    }
  }, [gameState.player.inventory]);

  const resetGame = useCallback(() => {
    clearSavedGame();
    setGameState({
      player: createInitialCharacter(),
      currentEnemy: null,
      inBattle: false,
      lastSaveTime: Date.now(),
      battleLog: [{
        message: 'Game reset! Starting fresh...',
        type: 'system',
        timestamp: Date.now()
      }],
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
      shopItems: generateShopItems(),
      playerEquipment: []
    });
  }, []);

  return {
    gameState,
    startBattle,
    performAction,
    manualLevelUp,
    resetGame,
    buyItem,
    sellItem,
    useItem
  };
};
