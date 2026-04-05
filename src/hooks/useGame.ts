import { useState, useEffect, useCallback } from 'react';
import { GameState, BattleLogEntry, BattleAction } from '../types/game';
import { createInitialCharacter, calculateStats, canLevelUp, levelUp, gainExp, calculateRegenerationRates } from '../utils/character';
import { generateEnemy } from '../utils/enemies';
import { saveGame, loadGame, calculateOfflineExp, clearSavedGame } from '../utils/storage';
import { performPlayerAction, performEnemyAction, checkBattleEnd } from '../utils/battle';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = loadGame();
    if (savedData) {
      const character = calculateStats(savedData.player);
      const offlineExp = calculateOfflineExp(savedData.lastSaveTime);
      const characterWithExp = gainExp(character, offlineExp);
      
      return {
        player: characterWithExp,
        currentEnemy: null,
        inBattle: false,
        lastSaveTime: Date.now(),
        battleLog: offlineExp > 0 ? [{
          message: `Welcome back! You earned ${offlineExp} EXP while away!`,
          type: 'system',
          timestamp: Date.now()
        }] : [],
        offlineExp,
        lastRegenerationTime: Date.now()
      };
    }
    
    return {
      player: createInitialCharacter(),
      currentEnemy: null,
      inBattle: false,
      lastSaveTime: Date.now(),
      battleLog: [],
      offlineExp: 0,
      lastRegenerationTime: Date.now()
    };
  });

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame({
        player: gameState.player,
        lastSaveTime: gameState.lastSaveTime
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [gameState]);

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
        
        if (newHp > prev.player.hp || newMp > prev.player.mp) {
          return {
            ...prev,
            player: { ...prev.player, hp: newHp, mp: newMp },
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

    // Enemy action
    setTimeout(() => {
      setGameState(prev => {
        if (!prev.currentEnemy) return prev;

        const enemyResult = performEnemyAction(playerResult.character, prev.currentEnemy);
        const newBattleLog = [...prev.battleLog, enemyResult.logEntry];

        // Check if battle ended after enemy action
        const finalBattleCheck = checkBattleEnd(enemyResult.character, enemyResult.enemy);
        
        if (finalBattleCheck.isVictory) {
          const expGained = enemyResult.enemy.expReward;
          const coinsGained = enemyResult.enemy.coinReward;
          let newPlayer = gainExp(enemyResult.character, expGained);
          newPlayer.coin += coinsGained;

          // Auto level up if possible
          while (canLevelUp(newPlayer)) {
            newPlayer = levelUp(newPlayer);
            newBattleLog.push({
              message: `Level Up! Now level ${newPlayer.level}!`,
              type: 'system',
              timestamp: Date.now()
            });
          }

          newBattleLog.push({
            message: `Victory! You gained ${expGained} EXP and ${coinsGained} coins!`,
            type: 'system',
            timestamp: Date.now()
          });

          return {
            ...prev,
            player: newPlayer,
            currentEnemy: null,
            inBattle: false,
            battleLog: newBattleLog
          };
        }

        if (finalBattleCheck.isDefeat) {
          const expLoss = Math.floor(playerResult.character.exp * 0.1);
          let newPlayer = gainExp(enemyResult.character, -expLoss);
          
          // Restore some HP/MP for next battle
          newPlayer.hp = Math.floor(newPlayer.maxHp * 0.5);
          newPlayer.mp = Math.floor(newPlayer.maxMp * 0.5);

          newBattleLog.push({
            message: `Defeat! You lost ${expLoss} EXP!`,
            type: 'system',
            timestamp: Date.now()
          });

          return {
            ...prev,
            player: newPlayer,
            currentEnemy: null,
            inBattle: false,
            battleLog: newBattleLog
          };
        }

        return {
          ...prev,
          player: enemyResult.character,
          currentEnemy: enemyResult.enemy,
          battleLog: newBattleLog
        };
      });
    }, 1000);

    setGameState(prev => ({
      ...prev,
      player: playerResult.character,
      currentEnemy: playerResult.enemy
    }));
  }, [gameState.inBattle, gameState.currentEnemy, gameState.player.exp, addBattleLogEntry]);

  const manualLevelUp = useCallback(() => {
    if (!canLevelUp(gameState.player)) return;

    const newPlayer = levelUp(gameState.player);
    
    setGameState(prev => ({
      ...prev,
      player: newPlayer,
      battleLog: [...prev.battleLog, {
        message: `Level Up! Now level ${newPlayer.level}!`,
        type: 'system',
        timestamp: Date.now()
      }]
    }));
  }, [gameState.player]);

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
      lastRegenerationTime: Date.now()
    });
  }, []);

  return {
    gameState,
    startBattle,
    performAction,
    manualLevelUp,
    resetGame
  };
};
