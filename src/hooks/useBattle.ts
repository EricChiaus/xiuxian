import { useCallback } from 'react';
import { GameState, BattleLogEntry, Enemy, BattleAction } from '../types/game';
import { gainExp } from '../utils/character';
import { 
  performPlayerAction, 
  performEnemyAction
} from '../utils/battle';
import { generateMultipleEnemies } from '../utils/enemies';

export const useBattle = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void,
  saveGame: (state: GameState) => void
) => {
  const startBattle = useCallback(() => {
    if (gameState.inBattle) return;

    const enemies = generateMultipleEnemies(gameState.player.level);
    const firstEnemy = enemies[0];
    
    setGameState(prev => ({
      ...prev,
      currentEnemy: firstEnemy,
      enemies: enemies,
      selectedEnemyId: firstEnemy.id,
      inBattle: true,
      isPlayerTurn: true,
      battleLog: [...prev.battleLog, {
        message: `战斗开始！${enemies.map((e: Enemy) => e.name).join('、')} 出现了！`,
        type: 'enemy',
        timestamp: Date.now()
      }]
    }));
  }, [gameState.inBattle, gameState.player.level, setGameState]);

  const selectEnemy = useCallback((enemyId: string) => {
    if (!gameState.isPlayerTurn || !gameState.inBattle) return;
    
    const selectedEnemy = gameState.enemies.find(e => e.id === enemyId);
    if (!selectedEnemy || selectedEnemy.hp <= 0) return;
    
    setGameState(prev => ({
      ...prev,
      selectedEnemyId: enemyId,
      currentEnemy: selectedEnemy
    }));
  }, [gameState.isPlayerTurn, gameState.inBattle, gameState.enemies, setGameState]);

  const performAction = useCallback((action: BattleAction) => {
    if (!gameState.inBattle || !gameState.currentEnemy || !gameState.isPlayerTurn) return;

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

    // No auto level up - players must level up manually

    // Update game state with damaged enemy and player changes
    setGameState(prev => ({
      ...prev,
      player: playerResult.character,
      currentEnemy: playerResult.enemy,
      enemies: prev.enemies.map(e => e.id === playerResult.enemy.id ? playerResult.enemy : e)
    }));

    // Check if battle ended after player action
    const updatedEnemies = gameState.enemies.map(e => e.id === playerResult.enemy.id ? playerResult.enemy : e);
    const allEnemiesDefeated = updatedEnemies.every(enemy => enemy.hp <= 0);
    
    if (allEnemiesDefeated) {
      // Calculate total rewards from all enemies
      const totalExp = updatedEnemies.reduce((sum, enemy) => sum + enemy.expReward, 0);
      const totalCoins = updatedEnemies.reduce((sum, enemy) => sum + enemy.coinReward, 0);
      let newPlayer = gainExp(playerResult.character, totalExp);
      newPlayer.coin += totalCoins;

      // Enforce EXP cap - don't exceed current level's expToNext
      newPlayer.exp = Math.min(newPlayer.exp, newPlayer.expToNext);
      // No auto level up - players must level up manually

      setGameState(prev => {
        // Restore full HP/MP after battle victory
        newPlayer.hp = newPlayer.maxHp;
        newPlayer.mp = newPlayer.maxMp;
        
        const battleEndState = {
          ...prev,
          player: newPlayer,
          currentEnemy: null,
          enemies: [],
          selectedEnemyId: null,
          inBattle: false,
          isPlayerTurn: true,
          battleLog: [...prev.battleLog, {
            message: `Victory! You gained ${totalExp} EXP and ${totalCoins} coins! HP/MP fully restored!`,
            type: 'system' as const,
            timestamp: Date.now()
          }]
        };
        
        // Save game after battle victory
        saveGame(battleEndState);
        
        return battleEndState;
      });
      
      return;
    }

    if (playerResult.character.hp <= 0) {
      const expLoss = Math.floor(gameState.player.exp * 0.1);
      let newPlayer = gainExp(playerResult.character, -expLoss);
      
      // Restore full HP/MP after battle defeat (same as victory)
      newPlayer.hp = newPlayer.maxHp;
      newPlayer.mp = newPlayer.maxMp;

      setGameState(prev => {
        const battleEndState = {
          ...prev,
          player: newPlayer,
          currentEnemy: null,
          enemies: [],
          selectedEnemyId: null,
          inBattle: false,
          isPlayerTurn: true,
          battleLog: [...prev.battleLog, {
            message: `Defeat! You lost ${expLoss} EXP! HP/MP fully restored!`,
            type: 'system' as const,
            timestamp: Date.now()
          }]
        };
        
        // Save game after battle defeat
        saveGame(battleEndState);
        
        return battleEndState;
      });
      return;
    }

    // Switch to enemy turn
    setGameState(prev => ({ ...prev, isPlayerTurn: false }));

    // Enemy actions - ALL enemies attack
    setTimeout(() => {
      setGameState(prev => {
        if (!prev.enemies || prev.enemies.length === 0) return prev;

        let newPlayer = { ...prev.player };
        let newEnemies = [...prev.enemies];
        const logEntries: BattleLogEntry[] = [];

        // All alive enemies attack
        newEnemies = newEnemies.map(enemy => {
          if (enemy.hp <= 0) return enemy; // Skip dead enemies

          const enemyAction = performEnemyAction(newPlayer, enemy);
          logEntries.push({
            message: enemyAction.logEntry.message,
            type: enemyAction.logEntry.type,
            timestamp: Date.now()
          });

          newPlayer = enemyAction.character;
          return enemyAction.enemy;
        });

        // Add all enemy action logs
        logEntries.forEach(entry => addBattleLogEntry(entry));

        // Check if all enemies are defeated
        const allEnemiesDefeated = newEnemies.every(enemy => enemy.hp <= 0);
        const playerDefeated = newPlayer.hp <= 0;

        if (allEnemiesDefeated) {
          // Calculate total rewards from all enemies
          const totalExp = newEnemies.reduce((sum, enemy) => sum + enemy.expReward, 0);
          const totalCoins = newEnemies.reduce((sum, enemy) => sum + enemy.coinReward, 0);
          
          let finalPlayer = gainExp(newPlayer, totalExp);
          finalPlayer.coin += totalCoins;

          // Enforce EXP cap - don't exceed current level's expToNext
          finalPlayer.exp = Math.min(finalPlayer.exp, finalPlayer.expToNext);
          // No auto level up - players must level up manually

          // Restore full HP/MP after battle victory
          finalPlayer.hp = finalPlayer.maxHp;
          finalPlayer.mp = finalPlayer.maxMp;

          const battleEndState = {
            ...prev,
            player: finalPlayer,
            currentEnemy: null,
            enemies: [],
            selectedEnemyId: null,
            inBattle: false,
            isPlayerTurn: true,
            battleLog: [...prev.battleLog, {
              message: `Victory! You gained ${totalExp} EXP and ${totalCoins} coins! HP/MP fully restored!`,
              type: 'system' as const,
              timestamp: Date.now()
            }]
          };
          
          // Save game after battle victory
          saveGame(battleEndState);
          
          return battleEndState;
        }

        if (playerDefeated) {
          const expLoss = Math.floor(newPlayer.exp * 0.1);
          let finalPlayer = gainExp(newPlayer, -expLoss);
          
          // Restore full HP/MP after battle defeat (same as victory)
          finalPlayer.hp = finalPlayer.maxHp;
          finalPlayer.mp = finalPlayer.maxMp;

          const battleEndState = {
            ...prev,
            player: finalPlayer,
            currentEnemy: null,
            enemies: [],
            selectedEnemyId: null,
            inBattle: false,
            isPlayerTurn: true,
            battleLog: [...prev.battleLog, {
              message: `Defeat! You lost ${expLoss} EXP! HP/MP fully restored!`,
              type: 'system' as const,
              timestamp: Date.now()
            }]
          };
          
          // Save game after battle defeat
          saveGame(battleEndState);
          
          return battleEndState;
        }

        // Preserve player's selected enemy if it's still alive, otherwise select first alive enemy
        let currentEnemy = null;
        let selectedEnemyId = prev.selectedEnemyId;
        
        if (selectedEnemyId) {
          const previouslySelectedEnemy = newEnemies.find(e => e.id === selectedEnemyId && e.hp > 0);
          if (previouslySelectedEnemy) {
            currentEnemy = previouslySelectedEnemy;
          } else {
            // Previously selected enemy is dead, select first alive enemy
            currentEnemy = newEnemies.find(e => e.hp > 0) || null;
            selectedEnemyId = currentEnemy?.id || null;
          }
        } else {
          // No previous selection, select first alive enemy
          currentEnemy = newEnemies.find(e => e.hp > 0) || null;
          selectedEnemyId = currentEnemy?.id || null;
        }

        return {
          ...prev,
          player: newPlayer,
          enemies: newEnemies,
          currentEnemy,
          selectedEnemyId,
          isPlayerTurn: true
        };
      });
    }, 1000); // Enemy action delay
  }, [gameState.inBattle, gameState.currentEnemy, gameState.isPlayerTurn, gameState.player.exp, addBattleLogEntry, setGameState]);

  return {
    startBattle,
    performAction,
    selectEnemy
  };
};
