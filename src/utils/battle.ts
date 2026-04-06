import { Character, Enemy, BattleAction, getElementMultiplier, BattleLogEntry } from '../types/game';
import { getHighestElement, getAllElementDamage } from './equipment';
import { calculateDamage, calculateHeal, chooseEnemyAction } from './enemies';
import { restoreHp, useMp, regenerateHpMpExp, calculateTurnRegeneration } from './character';

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
      // Calculate base physical damage
      let baseDamage = calculateDamage(character.pa, enemy.pd, 5);
      
      // Calculate damage from ALL elements
      const elementDamageResult = getAllElementDamage(character.elements, enemy.elementResistance, enemy.elements);
      const totalElementDamage = elementDamageResult.totalDamage;
      
      const totalDamage = Math.max(1, baseDamage + totalElementDamage);
      newEnemy.hp = Math.max(0, newEnemy.hp - totalDamage);
      
      // Build detailed damage message
      if (totalElementDamage > 0) {
        const elementDetails = elementDamageResult.elementDamages
          .map(ed => `${ed.damage} ${ed.element}${ed.resisted ? ' (resisted)' : ''}`)
          .join(' + ');
        message = `You attack for ${baseDamage} physical damage + ${elementDetails} element damage! Total: ${totalDamage}`;
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
      const magicPower = getHighestElement(character.elements);
      const enemyMagicPower = getHighestElement(enemy.elements);
      
      let baseMagicDamage = calculateDamage(character.ma, enemy.md, 8);
      let powerMagicBonus = 0;
      
      // Apply power bonus to magic if player has wood or water Elements
      if (magicPower.element && (magicPower.element === 'wood' || magicPower.element === 'water') && enemy.elementResistance) {
        powerMagicBonus = Math.floor(magicPower.value * 0.5); // 50% of power value as bonus
        
        // Calculate power multiplier based on element interaction
        let powerMultiplier = 1.0;
        if (enemyMagicPower.element) {
          powerMultiplier = getElementMultiplier(magicPower.element, enemyMagicPower.element);
        }
        
        // Apply enemy resistance to the power type
        const resistance = enemy.elementResistance[magicPower.element] || 0;
        const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
        
        powerMagicBonus = Math.floor(powerMagicBonus * powerMultiplier * (1 - resistanceReduction));
      }
      
      const totalMagicDamage = Math.max(1, baseMagicDamage + powerMagicBonus);
      newEnemy.hp = Math.max(0, newEnemy.hp - totalMagicDamage);
      newCharacter = useMp(newCharacter, 10);
      
      if (powerMagicBonus > 0) {
        message = `You cast magic for ${baseMagicDamage} damage + ${powerMagicBonus} ${magicPower.element} power bonus! (-10 MP)`;
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
      const healPower = getHighestElement(character.elements);
      
      let baseHealAmount = calculateHeal(character.ma, 15);
      let powerHealBonus = 0;
      
      // Apply power bonus to healing if player has wood or water Elements
      if (healPower.element && (healPower.element === 'wood' || healPower.element === 'water')) {
        powerHealBonus = Math.floor(healPower.value * 0.7); // 70% of power value as healing bonus
      }
      
      const totalHealAmount = baseHealAmount + powerHealBonus;
      const actualHeal = Math.min(totalHealAmount, character.maxHp - character.hp);
      newCharacter = restoreHp(newCharacter, actualHeal);
      newCharacter = useMp(newCharacter, 15);
      
      if (powerHealBonus > 0) {
        message = `You heal for ${actualHeal} HP (+${powerHealBonus} ${healPower.element} power bonus)! (-15 MP)`;
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
      // Calculate base physical damage
      let baseDamage = calculateDamage(enemy.pa, character.pd, 4);
      
      // Calculate damage from ALL elements
      const elementDamageResult = getAllElementDamage(enemy.elements, character.elementResistance, character.elements);
      const totalElementDamage = elementDamageResult.totalDamage;
      
      const totalDamage = Math.max(1, baseDamage + totalElementDamage);
      newCharacter.hp = Math.max(0, newCharacter.hp - totalDamage);
      
      // Build detailed damage message
      if (totalElementDamage > 0) {
        const elementDetails = elementDamageResult.elementDamages
          .map(ed => `${ed.damage} ${ed.element}${ed.resisted ? ' (resisted)' : ''}`)
          .join(' + ');
        message = `${enemy.name} attacks for ${baseDamage} physical damage + ${elementDetails} element damage! Total: ${totalDamage}`;
      } else {
        message = `${enemy.name} attacks for ${totalDamage} damage!`;
      }
      break;

    case 'magic':
      if (enemy.hasMagic) {
        // Get enemy's highest power for magic enhancement
        const magicPower = getHighestElement(enemy.elements);
        const playerMagicPower = getHighestElement(character.elements);
        
        let baseMagicDamage = calculateDamage(enemy.ma, character.md, 6);
        let powerMagicBonus = 0;
        
        // Apply power bonus to magic if enemy has wood or water Elements
        if (magicPower.element && (magicPower.element === 'wood' || magicPower.element === 'water') && character.elementResistance) {
          powerMagicBonus = Math.floor(magicPower.value * 0.5); // 50% of power value as bonus
          
          // Calculate power multiplier based on element interaction
          let powerMultiplier = 1.0;
          if (playerMagicPower.element) {
            powerMultiplier = getElementMultiplier(magicPower.element, playerMagicPower.element);
          }
          
          // Apply player resistance to the power type
          const resistance = character.elementResistance[magicPower.element] || 0;
          const resistanceReduction = Math.min(0.5, resistance * 0.05); // Max 50% reduction
          
          powerMagicBonus = Math.floor(powerMagicBonus * powerMultiplier * (1 - resistanceReduction));
        }
        
        const totalMagicDamage = Math.max(1, baseMagicDamage + powerMagicBonus);
        newCharacter.hp = Math.max(0, newCharacter.hp - totalMagicDamage);
        
        if (powerMagicBonus > 0) {
          message = `${enemy.name} casts magic for ${baseMagicDamage} damage + ${powerMagicBonus} ${magicPower.element} power bonus!`;
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
