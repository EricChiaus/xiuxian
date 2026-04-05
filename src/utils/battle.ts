import { Character, Enemy, BattleAction, getElementMultiplier, BattleLogEntry } from '../types/game';
import { getHighestElement } from './equipment';
import { calculateDamage, calculateHeal, chooseEnemyAction } from './enemies';
import { restoreHp, useMp, regenerateHpMpExp, calculateTurnRegeneration } from './character';
import { getHighestPower } from './equipment';

export const performPlayerAction = (
  character: Character,
  enemy: Enemy,
  action: BattleAction
): { character: Character; enemy: Enemy; logEntry: BattleLogEntry; turnRegeneration?: { hpRegen: number; mpRegen: number } } => {
  let newCharacter = { ...character };
  let newEnemy = { ...enemy };
  let message = '';
  let logType: 'player' | 'enemy' | 'system' = 'player';

  switch (action) {
    case 'attack':
      // Get player's highest power
      const playerPower = getHighestPower(character.Elements);
      const enemyPower = getHighestPower(enemy.Elements);
      
      let baseDamage = calculateDamage(character.pa, enemy.pd, 5);
      let powerDamage = 0;
      let damageType = 'physical';
      
      // Apply power damage if player has Elements
      if (playerPower.power && playerPower.value > 0) {
        powerDamage = playerPower.value;
        
        // Calculate power multiplier based on element interaction
        let powerMultiplier = 1.0;
        if (enemyPower.power) {
          powerMultiplier = getElementMultiplier(playerPower.power, enemyPower.power);
        }
        
        // Apply enemy resistance to the power type
        const resistance = enemy.ElementResistance[playerPower.power] || 0;
        const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
        
        powerDamage = Math.floor(powerDamage * powerMultiplier * (1 - resistanceReduction));
        damageType = `${playerPower.power}`;
      }
      
      const totalDamage = baseDamage + powerDamage;
      newEnemy.hp = Math.max(0, newEnemy.hp - totalDamage);
      
      if (powerDamage > 0) {
        message = `You attack for ${baseDamage} damage + ${powerDamage} ${damageType} power damage!`;
      } else {
        message = `You attack for ${totalDamage} damage!`;
      }
      break;

    case 'magic':
      if (character.mp < 10) {
        message = "Not enough MP!";
        logType = 'system';
        return { character: newCharacter, enemy: newEnemy, logEntry: { message, type: logType, timestamp: Date.now() } };
      }
      
      // Get player's highest power for magic enhancement
      const magicPower = getHighestPower(character.Elements);
      const enemyMagicPower = getHighestPower(enemy.Elements);
      
      let baseMagicDamage = calculateDamage(character.ma, enemy.md, 8);
      let powerMagicBonus = 0;
      
      // Apply power bonus to magic if player has wood or water Elements
      if (magicPower.power && (magicPower.power === 'wood' || magicPower.power === 'water')) {
        powerMagicBonus = Math.floor(magicPower.value * 0.5); // 50% of power value as bonus
        
        // Calculate power multiplier based on element interaction
        let powerMultiplier = 1.0;
        if (enemyMagicPower.power) {
          powerMultiplier = getElementMultiplier(magicPower.power, enemyMagicPower.power);
        }
        
        // Apply enemy resistance to the power type
        const resistance = enemy.ElementResistance[magicPower.power] || 0;
        const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
        
        powerMagicBonus = Math.floor(powerMagicBonus * powerMultiplier * (1 - resistanceReduction));
      }
      
      const totalMagicDamage = baseMagicDamage + powerMagicBonus;
      newEnemy.hp = Math.max(0, newEnemy.hp - totalMagicDamage);
      newCharacter = useMp(newCharacter, 10);
      
      if (powerMagicBonus > 0) {
        message = `You cast magic for ${baseMagicDamage} damage + ${powerMagicBonus} ${magicPower.power} power bonus! (-10 MP)`;
      } else {
        message = `You cast magic for ${totalMagicDamage} damage! (-10 MP)`;
      }
      break;

    case 'heal':
      if (character.mp < 15) {
        message = "Not enough MP!";
        logType = 'system';
        return { character: newCharacter, enemy: newEnemy, logEntry: { message, type: logType, timestamp: Date.now() } };
      }
      
      // Get player's highest power for healing enhancement
      const healPower = getHighestPower(character.Elements);
      
      let baseHealAmount = calculateHeal(character.ma, 15);
      let powerHealBonus = 0;
      
      // Apply power bonus to healing if player has wood or water Elements
      if (healPower.power && (healPower.power === 'wood' || healPower.power === 'water')) {
        powerHealBonus = Math.floor(healPower.value * 0.7); // 70% of power value as healing bonus
      }
      
      const totalHealAmount = baseHealAmount + powerHealBonus;
      const actualHeal = Math.min(totalHealAmount, character.maxHp - character.hp);
      newCharacter = restoreHp(newCharacter, actualHeal);
      newCharacter = useMp(newCharacter, 15);
      
      if (powerHealBonus > 0) {
        message = `You heal for ${actualHeal} HP (+${powerHealBonus} ${healPower.power} power bonus)! (-15 MP)`;
      } else {
        message = `You heal for ${actualHeal} HP! (-15 MP)`;
      }
      break;
  }

  // Apply turn-based regeneration after player action
  const turnRegen = calculateTurnRegeneration(character.level);
  newCharacter = regenerateHpMpExp(newCharacter, turnRegen.hpRegen, turnRegen.mpRegen, 0);

  return {
    character: newCharacter,
    enemy: newEnemy,
    logEntry: { message, type: logType, timestamp: Date.now() },
    turnRegeneration: turnRegen
  };
};

export const performEnemyAction = (
  character: Character,
  enemy: Enemy
): { character: Character; enemy: Enemy; logEntry: BattleLogEntry } => {
  let newCharacter = { ...character };
  let newEnemy = { ...enemy };
  let message = '';

  const action = chooseEnemyAction(enemy);

  switch (action) {
    case 'attack':
      // Get enemy's highest power
      const enemyPower = getHighestPower(enemy.Elements);
      const playerPower = getHighestPower(character.Elements);
      
      let baseDamage = calculateDamage(enemy.pa, character.pd, 4);
      let powerDamage = 0;
      
      // Apply power damage if enemy has Elements
      if (enemyPower.power && enemyPower.value > 0) {
        powerDamage = enemyPower.value;
        
        // Calculate power multiplier based on element interaction
        let powerMultiplier = 1.0;
        if (playerPower.power) {
          powerMultiplier = getElementMultiplier(enemyPower.power, playerPower.power);
        }
        
        // Apply player resistance to the power type
        const resistance = character.ElementResistance[enemyPower.power] || 0;
        const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
        
        powerDamage = Math.floor(powerDamage * powerMultiplier * (1 - resistanceReduction));
      }
      
      const totalDamage = baseDamage + powerDamage;
      newCharacter.hp = Math.max(0, newCharacter.hp - totalDamage);
      
      if (powerDamage > 0) {
        message = `${enemy.name} attacks for ${baseDamage} damage + ${powerDamage} ${enemyPower.power} power damage!`;
      } else {
        message = `${enemy.name} attacks for ${totalDamage} damage!`;
      }
      break;

    case 'magic':
      if (enemy.hasMagic) {
        // Get enemy's highest power for magic enhancement
        const magicPower = getHighestPower(enemy.Elements);
        const playerMagicPower = getHighestPower(character.Elements);
        
        let baseMagicDamage = calculateDamage(enemy.ma, character.md, 6);
        let powerMagicBonus = 0;
        
        // Apply power bonus to magic if enemy has wood or water Elements
        if (magicPower.power && (magicPower.power === 'wood' || magicPower.power === 'water')) {
          powerMagicBonus = Math.floor(magicPower.value * 0.5); // 50% of power value as bonus
          
          // Calculate power multiplier based on element interaction
          let powerMultiplier = 1.0;
          if (playerMagicPower.power) {
            powerMultiplier = getElementMultiplier(magicPower.power, playerMagicPower.power);
          }
          
          // Apply player resistance to the power type
          const resistance = character.ElementResistance[magicPower.power] || 0;
          const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
          
          powerMagicBonus = Math.floor(powerMagicBonus * powerMultiplier * (1 - resistanceReduction));
        }
        
        const totalMagicDamage = baseMagicDamage + powerMagicBonus;
        newCharacter.hp = Math.max(0, newCharacter.hp - totalMagicDamage);
        
        if (powerMagicBonus > 0) {
          message = `${enemy.name} casts magic for ${baseMagicDamage} damage + ${powerMagicBonus} ${magicPower.power} power bonus!`;
        } else {
          message = `${enemy.name} casts magic for ${totalMagicDamage} damage!`;
        }
      } else {
        // Fall back to attack
        const fallbackDamage = calculateDamage(enemy.pa, character.pd, 4);
        newCharacter.hp = Math.max(0, newCharacter.hp - fallbackDamage);
        message = `${enemy.name} attacks for ${fallbackDamage} damage!`;
      }
      break;

    case 'heal':
      if (enemy.hasHeal && enemy.hp < enemy.maxHp * 0.5) {
        const healAmount = calculateHeal(enemy.ma, 8);
        const actualHeal = Math.min(healAmount, enemy.maxHp - enemy.hp);
        newEnemy.hp += actualHeal;
        message = `${enemy.name} heals for ${actualHeal} HP!`;
      } else {
        // Fall back to attack
        const fallbackDamage = calculateDamage(enemy.pa, character.pd, 4);
        newCharacter.hp = Math.max(0, newCharacter.hp - fallbackDamage);
        message = `${enemy.name} attacks for ${fallbackDamage} damage!`;
      }
      break;
  }

  return {
    character: newCharacter,
    enemy: newEnemy,
    logEntry: { message, type: 'enemy', timestamp: Date.now() }
  };
};

export const checkBattleEnd = (character: Character, enemy: Enemy): {
  isVictory: boolean;
  isDefeat: boolean;
} => {
  return {
    isVictory: enemy.hp <= 0,
    isDefeat: character.hp <= 0
  };
};
