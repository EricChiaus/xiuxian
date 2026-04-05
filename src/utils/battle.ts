import { Character, Enemy, BattleLogEntry, BattleAction } from '../types/game';
import { calculateDamage, calculateHeal, chooseEnemyAction } from './enemies';
import { restoreHp, useMp } from './character';

export const performPlayerAction = (
  character: Character,
  enemy: Enemy,
  action: BattleAction
): { character: Character; enemy: Enemy; logEntry: BattleLogEntry } => {
  let newCharacter = { ...character };
  let newEnemy = { ...enemy };
  let message = '';
  let logType: 'player' | 'enemy' | 'system' = 'player';

  switch (action) {
    case 'attack':
      const damage = calculateDamage(character.pa, enemy.pd, 5);
      newEnemy.hp = Math.max(0, newEnemy.hp - damage);
      message = `You attack for ${damage} damage!`;
      break;

    case 'magic':
      if (character.mp < 10) {
        message = "Not enough MP!";
        logType = 'system';
        return { character: newCharacter, enemy: newEnemy, logEntry: { message, type: logType, timestamp: Date.now() } };
      }
      const magicDamage = calculateDamage(character.ma, enemy.md, 8);
      newEnemy.hp = Math.max(0, newEnemy.hp - magicDamage);
      newCharacter = useMp(newCharacter, 10);
      message = `You cast magic for ${magicDamage} damage! (-10 MP)`;
      break;

    case 'heal':
      if (character.mp < 15) {
        message = "Not enough MP!";
        logType = 'system';
        return { character: newCharacter, enemy: newEnemy, logEntry: { message, type: logType, timestamp: Date.now() } };
      }
      const healAmount = calculateHeal(character.ma, 10);
      const actualHeal = Math.min(healAmount, character.maxHp - character.hp);
      newCharacter = restoreHp(newCharacter, actualHeal);
      newCharacter = useMp(newCharacter, 15);
      message = `You heal for ${actualHeal} HP! (-15 MP)`;
      break;
  }

  return {
    character: newCharacter,
    enemy: newEnemy,
    logEntry: { message, type: logType, timestamp: Date.now() }
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
      const damage = calculateDamage(enemy.pa, character.pd, 4);
      newCharacter.hp = Math.max(0, newCharacter.hp - damage);
      message = `${enemy.name} attacks for ${damage} damage!`;
      break;

    case 'magic':
      if (enemy.hasMagic) {
        const magicDamage = calculateDamage(enemy.ma, character.md, 6);
        newCharacter.hp = Math.max(0, newCharacter.hp - magicDamage);
        message = `${enemy.name} casts magic for ${magicDamage} damage!`;
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
