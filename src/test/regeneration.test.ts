import { describe, it, expect } from 'vitest';
import { 
  calculateRegenerationRates, 
  calculateTurnRegeneration, 
  regenerateHpMp 
} from '../utils/character';
import { createInitialCharacter } from '../utils/character';

describe('Regeneration Utils', () => {
  describe('calculateRegenerationRates', () => {
    it('should calculate base regeneration rates for level 1', () => {
      const rates = calculateRegenerationRates(1);
      
      expect(rates.hpPerSecond).toBe(1.5);
      expect(rates.mpPerSecond).toBe(0.6);
    });

    it('should increase regeneration rates with level', () => {
      const level1Rates = calculateRegenerationRates(1);
      const level5Rates = calculateRegenerationRates(5);
      const level10Rates = calculateRegenerationRates(10);
      
      expect(level5Rates.hpPerSecond).toBeGreaterThan(level1Rates.hpPerSecond);
      expect(level5Rates.mpPerSecond).toBeGreaterThan(level1Rates.mpPerSecond);
      expect(level10Rates.hpPerSecond).toBeGreaterThan(level5Rates.hpPerSecond);
      expect(level10Rates.mpPerSecond).toBeGreaterThan(level5Rates.mpPerSecond);
    });
  });

  describe('calculateTurnRegeneration', () => {
    it('should calculate turn regeneration for level 1', () => {
      const regen = calculateTurnRegeneration(1);
      
      expect(regen.hpRegen).toBe(2);
      expect(regen.mpRegen).toBe(1);
    });

    it('should increase turn regeneration with level', () => {
      const level1Regen = calculateTurnRegeneration(1);
      const level5Regen = calculateTurnRegeneration(5);
      const level10Regen = calculateTurnRegeneration(10);
      
      expect(level5Regen.hpRegen).toBeGreaterThan(level1Regen.hpRegen);
      expect(level5Regen.mpRegen).toBeGreaterThan(level1Regen.mpRegen);
      expect(level10Regen.hpRegen).toBeGreaterThan(level5Regen.hpRegen);
      expect(level10Regen.mpRegen).toBeGreaterThan(level5Regen.mpRegen);
    });
  });

  describe('regenerateHpMp', () => {
    it('should regenerate HP and MP without exceeding max', () => {
      const character = { 
        ...createInitialCharacter(), 
        hp: 50, 
        mp: 20,
        maxHp: 100,
        maxMp: 50
      };
      
      const result = regenerateHpMp(character, 10, 5);
      
      expect(result.hp).toBe(60);
      expect(result.mp).toBe(25);
    });

    it('should not exceed max HP and MP', () => {
      const character = { 
        ...createInitialCharacter(), 
        hp: 95, 
        mp: 48,
        maxHp: 100,
        maxMp: 50
      };
      
      const result = regenerateHpMp(character, 10, 5);
      
      expect(result.hp).toBe(100);
      expect(result.mp).toBe(50);
    });

    it('should handle full HP/MP case', () => {
      const character = createInitialCharacter();
      
      const result = regenerateHpMp(character, 10, 5);
      
      expect(result.hp).toBe(character.maxHp);
      expect(result.mp).toBe(character.maxMp);
    });
  });
});
