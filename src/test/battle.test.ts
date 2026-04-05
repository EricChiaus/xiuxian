import { describe, it, expect } from 'vitest';
import { 
  performPlayerAction, 
  performEnemyAction, 
  checkBattleEnd 
} from '../utils/battle';
import { createInitialCharacter } from '../utils/character';
import { generateEnemy } from '../utils/enemies';

describe('Battle Utils', () => {
  describe('performPlayerAction', () => {
    it('should perform attack action', () => {
      const player = createInitialCharacter();
      const enemy = generateEnemy(1);
      
      const result = performPlayerAction(player, enemy, 'attack');
      
      expect(result.enemy.hp).toBeLessThan(enemy.maxHp);
      expect(result.logEntry.type).toBe('player');
      expect(result.logEntry.message).toContain('attack for');
      expect(result.logEntry.message).toContain('damage!');
    });

    it('should perform magic action with sufficient MP', () => {
      const player = createInitialCharacter();
      const enemy = generateEnemy(1);
      
      const result = performPlayerAction(player, enemy, 'magic');
      
      expect(result.enemy.hp).toBeLessThan(enemy.maxHp);
      expect(result.character.mp).toBeLessThan(player.mp);
      expect(result.logEntry.type).toBe('player');
      expect(result.logEntry.message).toContain('cast magic');
      expect(result.logEntry.message).toContain('-10 MP');
    });

    it('should fail magic action with insufficient MP', () => {
      const player = { ...createInitialCharacter(), mp: 5 };
      const enemy = generateEnemy(1);
      
      const result = performPlayerAction(player, enemy, 'magic');
      
      expect(result.enemy.hp).toBe(enemy.maxHp);
      expect(result.character.mp).toBe(5);
      expect(result.logEntry.type).toBe('system');
      expect(result.logEntry.message).toBe('Not enough MP!');
    });

    it('should perform heal action with sufficient MP', () => {
      const player = { ...createInitialCharacter(), hp: 50 };
      const enemy = generateEnemy(1);
      
      const result = performPlayerAction(player, enemy, 'heal');
      
      expect(result.character.hp).toBeGreaterThan(50);
      expect(result.character.mp).toBeLessThan(player.mp);
      expect(result.logEntry.type).toBe('player');
      expect(result.logEntry.message).toContain('heal for');
      expect(result.logEntry.message).toContain('HP!');
      expect(result.logEntry.message).toContain('-15 MP');
    });

    it('should fail heal action with insufficient MP', () => {
      const player = { ...createInitialCharacter(), mp: 10 };
      const enemy = generateEnemy(1);
      
      const result = performPlayerAction(player, enemy, 'heal');
      
      expect(result.character.hp).toBe(player.hp);
      expect(result.character.mp).toBe(10);
      expect(result.logEntry.type).toBe('system');
      expect(result.logEntry.message).toBe('Not enough MP!');
    });
  });

  describe('performEnemyAction', () => {
    it('should damage player', () => {
      const player = createInitialCharacter();
      const enemy = generateEnemy(1);
      
      const result = performEnemyAction(player, enemy);
      
      expect(result.character.hp).toBeLessThan(player.hp);
      expect(result.logEntry.type).toBe('enemy');
      expect(result.logEntry.message).toContain(enemy.name);
    });

    it('should handle enemy healing when conditions are met', () => {
      const player = createInitialCharacter();
      const enemy = { ...generateEnemy(1), hp: 10, maxHp: 100, hasHeal: true };
      
      const result = performEnemyAction(player, enemy);
      
      if (result.logEntry.message.includes('heals for')) {
        expect(result.enemy.hp).toBeGreaterThan(10);
      }
    });
  });

  describe('checkBattleEnd', () => {
    it('should detect victory when enemy HP is 0', () => {
      const player = createInitialCharacter();
      const enemy = { ...generateEnemy(1), hp: 0 };
      
      const result = checkBattleEnd(player, enemy);
      
      expect(result.isVictory).toBe(true);
      expect(result.isDefeat).toBe(false);
    });

    it('should detect defeat when player HP is 0', () => {
      const player = { ...createInitialCharacter(), hp: 0 };
      const enemy = generateEnemy(1);
      
      const result = checkBattleEnd(player, enemy);
      
      expect(result.isVictory).toBe(false);
      expect(result.isDefeat).toBe(true);
    });

    it('should detect ongoing battle when both have HP', () => {
      const player = createInitialCharacter();
      const enemy = generateEnemy(1);
      
      const result = checkBattleEnd(player, enemy);
      
      expect(result.isVictory).toBe(false);
      expect(result.isDefeat).toBe(false);
    });
  });
});
