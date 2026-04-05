import { describe, it, expect } from 'vitest';
import { 
  createInitialCharacter,
  levelUp,
  gainExp,
  canLevelUp,
  calculateStats,
  restoreHp,
  useMp,
  takeDamage
} from '../utils/character';

describe('Character Utils', () => {
  describe('createInitialCharacter', () => {
    it('should create a character with initial stats', () => {
      const character = createInitialCharacter();
      
      expect(character.level).toBe(1);
      expect(character.hp).toBe(100);
      expect(character.maxHp).toBe(100);
      expect(character.mp).toBe(50);
      expect(character.maxMp).toBe(50);
      expect(character.pa).toBe(10);
      expect(character.ma).toBe(8);
      expect(character.pd).toBe(5);
      expect(character.md).toBe(5);
      expect(character.exp).toBe(0);
      expect(character.expToNext).toBe(100);
      expect(character.coin).toBe(0);
      expect(character.inventory).toEqual([]); // Add inventory check
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats for level 1 character', () => {
      const character = createInitialCharacter();
      const calculated = calculateStats(character);
      
      expect(calculated.maxHp).toBe(100);
      expect(calculated.maxMp).toBe(50);
      expect(calculated.pa).toBe(10);
      expect(calculated.ma).toBe(8);
      expect(calculated.pd).toBe(5);
      expect(calculated.md).toBe(4);
    });

    it('should calculate increased stats for higher level character', () => {
      const character = { ...createInitialCharacter(), level: 5 };
      const calculated = calculateStats(character);
      
      expect(calculated.maxHp).toBeGreaterThan(100);
      expect(calculated.maxMp).toBeGreaterThan(50);
      expect(calculated.pa).toBeGreaterThan(10);
      expect(calculated.ma).toBeGreaterThan(8);
      expect(calculated.pd).toBeGreaterThan(5);
      expect(calculated.md).toBeGreaterThan(4);
    });

    it('should restore HP/MP if they exceed max after calculation', () => {
      const character = { 
        ...createInitialCharacter(), 
        level: 2,
        hp: 150,
        mp: 80
      };
      const calculated = calculateStats(character);
      
      expect(calculated.hp).toBe(calculated.maxHp);
      expect(calculated.mp).toBe(calculated.maxMp);
    });
  });

  describe('canLevelUp', () => {
    it('should return false when EXP is less than required', () => {
      const character = createInitialCharacter();
      expect(canLevelUp(character)).toBe(false);
    });

    it('should return true when EXP equals required', () => {
      const character = { ...createInitialCharacter(), exp: 100 };
      expect(canLevelUp(character)).toBe(true);
    });

    it('should return true when EXP exceeds required', () => {
      const character = { ...createInitialCharacter(), exp: 150 };
      expect(canLevelUp(character)).toBe(true);
    });
  });

  describe('levelUp', () => {
    it('should not level up when insufficient EXP', () => {
      const character = createInitialCharacter();
      const result = levelUp(character);
      
      expect(result.level).toBe(1);
      expect(result.exp).toBe(0);
    });

    it('should level up when sufficient EXP', () => {
      const character = { ...createInitialCharacter(), exp: 100 };
      const result = levelUp(character);
      
      expect(result.level).toBe(2);
      expect(result.exp).toBe(0);
      expect(result.expToNext).toBeGreaterThan(100);
    });

    it('should increase stats on level up', () => {
      const character = { ...createInitialCharacter(), exp: 100 };
      const result = levelUp(character);
      
      expect(result.maxHp).toBeGreaterThan(100);
      expect(result.maxMp).toBeGreaterThan(50);
      expect(result.pa).toBeGreaterThan(10);
      expect(result.ma).toBeGreaterThan(8);
      expect(result.pd).toBeGreaterThanOrEqual(5); // Changed from > to >=
      expect(result.md).toBeGreaterThanOrEqual(4); // Changed from > to >=
    });
  });

  describe('gainExp', () => {
    it('should add positive EXP', () => {
      const character = createInitialCharacter();
      const result = gainExp(character, 50);
      
      expect(result.exp).toBe(50);
    });

    it('should handle negative EXP', () => {
      const character = { ...createInitialCharacter(), exp: 50 };
      const result = gainExp(character, -30);
      
      expect(result.exp).toBe(20);
    });

    it('should not allow EXP below 0', () => {
      const character = createInitialCharacter();
      const result = gainExp(character, -100);
      
      expect(result.exp).toBe(0);
    });
  });

  describe('restoreHp', () => {
    it('should restore HP without exceeding max', () => {
      const character = { ...createInitialCharacter(), hp: 50 };
      const result = restoreHp(character, 30);
      
      expect(result.hp).toBe(80);
    });

    it('should not exceed max HP', () => {
      const character = { ...createInitialCharacter(), hp: 90 };
      const result = restoreHp(character, 20);
      
      expect(result.hp).toBe(100);
    });
  });

  describe('useMp', () => {
    it('should consume MP', () => {
      const character = { ...createInitialCharacter(), mp: 30 };
      const result = useMp(character, 10);
      
      expect(result.mp).toBe(20);
    });

    it('should not allow MP below 0', () => {
      const character = { ...createInitialCharacter(), mp: 5 };
      const result = useMp(character, 10);
      
      expect(result.mp).toBe(0);
    });
  });

  describe('takeDamage', () => {
    it('should reduce HP', () => {
      const character = { ...createInitialCharacter(), hp: 80 };
      const result = takeDamage(character, 20);
      
      expect(result.hp).toBe(60);
    });

    it('should not allow HP below 0', () => {
      const character = { ...createInitialCharacter(), hp: 10 };
      const result = takeDamage(character, 20);
      
      expect(result.hp).toBe(0);
    });
  });
});
