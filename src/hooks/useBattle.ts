import { useCallback } from 'react';
import { Enemy, BattleLogEntry, BattleAction, GameState } from '../types/game';
import { generateMultipleEnemies } from '../utils/enemies';
import { 
  performPlayerAction, 
  performEnemyAction, 
  checkBattleEnd 
} from '../utils/battle';
import { 
  levelUp, 
  gainExp, 
  canLevelUp
} from '../utils/character';

export const useBattle = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  addBattleLogEntry: (entry: BattleLogEntry) => void
) => {
  const startBattle = useCallback(() => {
    if (gameState.inBattle) return;

    const enemies = generateMultipleEnemies(gameState.player.level, 2 + Math.floor(gameState.player.level / 10)); // 2-3 enemies based on level
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

    // Update game state with damaged enemy and player changes
    setGameState(prev => ({
      ...prev,
      player: playerResult.character,
      currentEnemy: playerResult.enemy,
      enemies: prev.enemies.map(e => e.id === playerResult.enemy.id ? playerResult.enemy : e)
    }));

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
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
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
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
        battleLog: [...prev.battleLog, {
          message: `Defeat! You lost ${expLoss} EXP!`,
          type: 'system',
          timestamp: Date.now()
        }]
      }));
      return;
    }

    // Switch to enemy turn
    setGameState(prev => ({ ...prev, isPlayerTurn: false }));

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
            enemies: [],
            selectedEnemyId: null,
            inBattle: false,
            isPlayerTurn: true,
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
            enemies: [],
            selectedEnemyId: null,
            inBattle: false,
            isPlayerTurn: true,
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
          currentEnemy: enemyAction.enemy,
          enemies: prev.enemies.map(e => e.id === enemyAction.enemy.id ? enemyAction.enemy : e),
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
