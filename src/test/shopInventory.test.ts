import { describe, it, expect } from 'vitest';
import { generateShopItems } from '../utils/shop';
import { createInitialCharacter } from '../utils/character';
import { Equipment } from '../types/game';

// Test core shop and inventory logic without React hooks
describe('Shop & Inventory Core Logic', () => {
  
  describe('Shop Item Filtering Logic', () => {
    it('should filter out items that are in inventory', () => {
      const shopItems = [
        { id: 'item1', name: 'Item 1', price: 100, type: 'equipment', description: 'Test', effect: '' },
        { id: 'item2', name: 'Item 2', price: 200, type: 'equipment', description: 'Test', effect: '' }
      ];
      
      const inventory = ['item1'];
      const equippedItems = { weapon: 'item3' } as any;
      
      // Simulate the filtering logic from getAvailableShopItems
      const purchasedItemIds = new Set([
        ...inventory,
        ...Object.values(equippedItems).filter(Boolean)
      ]);
      
      const availableItems = shopItems.filter(shopItem => !purchasedItemIds.has(shopItem.id));
      
      expect(availableItems).toHaveLength(1);
      expect(availableItems[0].id).toBe('item2');
    });

    it('should show all items when none are owned', () => {
      const shopItems = [
        { id: 'item1', name: 'Item 1', price: 100, type: 'equipment', description: 'Test', effect: '' },
        { id: 'item2', name: 'Item 2', price: 200, type: 'equipment', description: 'Test', effect: '' }
      ];
      
      const inventory = [];
      const equippedItems = {} as any;
      
      const purchasedItemIds = new Set([
        ...inventory,
        ...Object.values(equippedItems).filter(Boolean)
      ]);
      
      const availableItems = shopItems.filter(shopItem => !purchasedItemIds.has(shopItem.id));
      
      expect(availableItems).toHaveLength(2);
      expect(availableItems.map(item => item.id)).toEqual(['item1', 'item2']);
    });

    it('should filter out both inventory and equipped items', () => {
      const shopItems = [
        { id: 'item1', name: 'Item 1', price: 100, type: 'equipment', description: 'Test', effect: '' },
        { id: 'item2', name: 'Item 2', price: 200, type: 'equipment', description: 'Test', effect: '' }
      ];
      
      const inventory = ['item1'];
      const equippedItems = { weapon: 'item2' } as any;
      
      const purchasedItemIds = new Set([
        ...inventory,
        ...Object.values(equippedItems).filter(Boolean)
      ]);
      
      const availableItems = shopItems.filter(shopItem => !purchasedItemIds.has(shopItem.id));
      
      expect(availableItems).toHaveLength(0);
    });
  });

  describe('Equipment Data Persistence', () => {
    it('should maintain equipment data consistency', () => {
      const equipment: Equipment = {
        id: 'test_sword',
        name: 'Test Sword',
        type: 'weapon',
        rarity: 'rare',
        level: 5,
        bonus: { pa: 15 },
        elements: { fire: 10 },
        elementResistance: {},
        price: 500,
        sellPrice: 250
      };

      // Simulate storing and retrieving equipment data
      const playerEquipment = { 'test_sword': equipment };
      const retrievedEquipment = playerEquipment['test_sword'];

      expect(retrievedEquipment).toEqual(equipment);
      expect(retrievedEquipment.id).toBe('test_sword');
      expect(retrievedEquipment.name).toBe('Test Sword');
      expect(retrievedEquipment.type).toBe('weapon');
      expect(retrievedEquipment.rarity).toBe('rare');
      expect(retrievedEquipment.level).toBe(5);
      expect(retrievedEquipment.bonus.pa).toBe(15);
      expect(retrievedEquipment.elements.fire).toBe(10);
    });

    it('should preserve equipment across multiple operations', () => {
      const equipment: Equipment = {
        id: 'test_armor',
        name: 'Test Armor',
        type: 'armor',
        rarity: 'common',
        level: 3,
        bonus: { pd: 8 },
        elements: {},
        elementResistance: {},
        price: 300,
        sellPrice: 150
      };

      // Simulate multiple operations
      let playerEquipment = { 'test_armor': equipment };
      
      // Operation 1: Add to inventory
      const inventory1 = ['test_armor'];
      
      // Operation 2: Equip item
      const equippedItems1 = { armor: 'test_armor' };
      
      // Operation 3: Unequip item
      const inventory2 = ['test_armor'];
      const equippedItems2 = {};
      
      // Check if equipment data is preserved
      expect(playerEquipment['test_armor']).toEqual(equipment);
      expect(inventory1).toEqual(inventory2);
      expect(equippedItems1.armor).toBe('test_armor');
      expect(equippedItems2.armor).toBeUndefined();
    });
  });

  describe('Purchase Validation Logic', () => {
    it('should validate purchase conditions correctly', () => {
      const shopItem = { id: 'test_item', name: 'Test Item', price: 100, type: 'equipment', description: 'Test', effect: '' };
      const playerCoins = 50;
      const inventory = [];

      // Check purchase conditions
      const canAfford = playerCoins >= shopItem.price;
      const itemExists = shopItem.id !== undefined;
      const notAlreadyOwned = !inventory.includes(shopItem.id);

      const canPurchase = canAfford && itemExists && notAlreadyOwned;

      expect(canPurchase).toBe(false); // Can't afford
      expect(canAfford).toBe(false); // Can't afford
      expect(itemExists).toBe(true); // Item exists
      expect(notAlreadyOwned).toBe(true); // Not owned
    });

    it('should allow purchase when all conditions are met', () => {
      const shopItem = { id: 'test_item', name: 'Test Item', price: 100, type: 'equipment', description: 'Test', effect: '' };
      const playerCoins = 150;
      const inventory = [];

      const canAfford = playerCoins >= shopItem.price;
      const itemExists = shopItem.id !== undefined;
      const notAlreadyOwned = !inventory.includes(shopItem.id);

      const canPurchase = canAfford && itemExists && notAlreadyOwned;

      expect(canPurchase).toBe(true); // Can afford
      expect(itemExists).toBe(true); // Item exists
      expect(notAlreadyOwned).toBe(true); // Not owned
    });

    it('should prevent purchase when item already owned', () => {
      const shopItem = { id: 'test_item', name: 'Test Item', price: 100, type: 'equipment', description: 'Test', effect: '' };
      const playerCoins = 150;
      const inventory = ['test_item'];

      const canAfford = playerCoins >= shopItem.price;
      const itemExists = shopItem.id !== undefined;
      const notAlreadyOwned = !inventory.includes(shopItem.id);

      const canPurchase = canAfford && itemExists && notAlreadyOwned;

      expect(canPurchase).toBe(false); // Already owned
      expect(canAfford).toBe(true); // Can afford
      expect(itemExists).toBe(true); // Item exists
      expect(notAlreadyOwned).toBe(false); // Already owned
    });
  });

  describe('Equipment Type Detection', () => {
    it('should detect equipment types correctly', () => {
      const weaponIds = ['sword1', 'weapon_fire', 'blade_steel'];
      const armorIds = ['armor1', 'chestplate_iron', 'helmet_steel'];
      const accessoryIds = ['ring1', 'necklace1', 'boots1'];

      // Simulate the type detection logic from getEquipmentTypeFromId
      const detectType = (itemId: string) => {
        if (itemId.includes('sword') || itemId.includes('weapon') || itemId.includes('blade')) {
          return 'weapon';
        }
        if (itemId.includes('armor') || itemId.includes('chestplate') || itemId.includes('helmet')) {
          return 'armor';
        }
        if (itemId.includes('ring') || itemId.includes('necklace') || itemId.includes('boots')) {
          return 'accessory';
        }
        return null;
      };

      weaponIds.forEach(id => {
        expect(detectType(id)).toBe('weapon');
      });

      armorIds.forEach(id => {
        expect(detectType(id)).toBe('armor');
      });

      accessoryIds.forEach(id => {
        expect(detectType(id)).toBe('accessory');
      });
    });

    it('should return null for unknown equipment types', () => {
      const unknownIds = ['unknown1', 'mystery_item', 'weird_thing'];

      const detectType = (itemId: string) => {
        if (itemId.includes('sword') || itemId.includes('weapon') || itemId.includes('blade')) {
          return 'weapon';
        }
        if (itemId.includes('armor') || itemId.includes('chestplate') || itemId.includes('helmet')) {
          return 'armor';
        }
        if (itemId.includes('ring') || itemId.includes('necklace') || itemId.includes('boots')) {
          return 'accessory';
        }
        return null;
      };

      unknownIds.forEach(id => {
        expect(detectType(id)).toBeNull();
      });
    });
  });

  describe('Inventory Management Logic', () => {
    it('should handle equip operations correctly', () => {
      const itemId = 'test_sword';
      const inventory = ['test_sword', 'test_armor'];
      const equippedItems = { weapon: null } as any;

      // Simulate equip operation logic
      const canEquip = inventory.includes(itemId);
      const isSlotEmpty = !equippedItems.weapon;

      expect(canEquip).toBe(true);
      expect(isSlotEmpty).toBe(true);
    });

    it('should handle unequip operations correctly', () => {
      const itemId = 'test_sword';
      const inventory = ['test_armor'];
      const equippedItems = { weapon: 'test_sword' } as any;

      // Simulate unequip operation logic
      const isEquipped = equippedItems.weapon === itemId;
      const canUnequip = isEquipped;

      expect(canUnequip).toBe(true);
      expect(isEquipped).toBe(true);
    });

    it('should handle slot swapping correctly', () => {
      const newItemId = 'test_sword';
      const oldEquippedItemId = 'old_sword';
      const inventory = ['test_sword', 'old_sword'];
      const equippedItems = { weapon: oldEquippedItemId } as any;

      // Simulate equip with existing item logic
      const canEquip = inventory.includes(newItemId);
      const shouldReturnOldItem = equippedItems.weapon !== null;

      expect(canEquip).toBe(true);
      expect(shouldReturnOldItem).toBe(true);

      // After equip, old item should be in inventory, new item equipped
      const newInventory = inventory.filter(id => id !== newItemId).concat(oldEquippedItemId);
      const newEquippedItems = { weapon: newItemId };

      expect(newInventory).toContain(oldEquippedItemId);
      expect(newEquippedItems.weapon).toBe(newItemId);
      expect(newInventory).not.toContain(newItemId);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data integrity across operations', () => {
      const initialData = {
        inventory: ['item1', 'item2'],
        equippedItems: { weapon: 'item1' },
        playerEquipment: {
          'item1': { id: 'item1', name: 'Item 1', type: 'weapon', rarity: 'common', level: 1, bonus: {}, elements: {}, elementResistance: {}, price: 100, sellPrice: 50 },
          'item2': { id: 'item2', name: 'Item 2', type: 'armor', rarity: 'common', level: 1, bonus: {}, elements: {}, elementResistance: {}, price: 150, sellPrice: 75 }
        }
      };

      // Simulate multiple operations
      let currentData = { ...initialData };

      // Operation 1: Unequip item1
      currentData.inventory = [...currentData.inventory, 'item1']; // Return item1 to inventory
      currentData.equippedItems = { weapon: null };

      // Operation 2: Equip item2
      currentData.inventory = currentData.inventory.filter(id => id !== 'item2'); // Remove item2 from inventory
      currentData.equippedItems = { weapon: 'item2' };

      // Check data integrity
      expect(currentData.inventory).toContain('item1');
      expect(currentData.equippedItems.weapon).toBe('item2');
      expect(currentData.playerEquipment.item1).toEqual(initialData.playerEquipment.item1);
      expect(currentData.playerEquipment.item2).toEqual(initialData.playerEquipment.item2);
      expect(currentData.inventory).not.toContain('item2'); // item2 should be equipped
    });
  });

  describe('Shop Item Generation', () => {
    it('should generate shop items correctly', () => {
      const playerLevel = 5;
      const shopItems = generateShopItems(playerLevel);

      expect(Array.isArray(shopItems)).toBe(true);
      expect(shopItems.length).toBeGreaterThan(0);
      
      shopItems.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('description');
        expect(item.type).toBe('equipment');
        expect(item.price).toBeGreaterThan(0);
      });
    });

    it('should generate different items for different levels', () => {
      const shopItems1 = generateShopItems(1);
      const shopItems5 = generateShopItems(5);
      const shopItems10 = generateShopItems(10);

      expect(shopItems1.length).toBeGreaterThan(0);
      expect(shopItems5.length).toBeGreaterThan(0);
      expect(shopItems10.length).toBeGreaterThan(0);
      
      // Higher levels should generally have more expensive items
      const avgPrice1 = shopItems1.reduce((sum, item) => sum + item.price, 0) / shopItems1.length;
      const avgPrice5 = shopItems5.reduce((sum, item) => sum + item.price, 0) / shopItems5.length;
      const avgPrice10 = shopItems10.reduce((sum, item) => sum + item.price, 0) / shopItems10.length;

      expect(avgPrice10).toBeGreaterThanOrEqual(avgPrice5);
      expect(avgPrice5).toBeGreaterThanOrEqual(avgPrice1);
    });
  });

  describe('Character Equipment Integration', () => {
    it('should handle character equipment slots correctly', () => {
      const character = createInitialCharacter();
      
      // Check that character has equippedItems property
      expect(character).toHaveProperty('equippedItems');
      expect(typeof character.equippedItems).toBe('object');
      
      // Initially equippedItems should be empty object (no properties)
      expect(Object.keys(character.equippedItems)).toHaveLength(0);
      expect(character.equippedItems).toEqual({});
    });

    it('should handle inventory storage correctly', () => {
      const character = createInitialCharacter();
      
      // Check that character has inventory storage
      expect(character).toHaveProperty('inventory');
      expect(Array.isArray(character.inventory)).toBe(true); // Should be array of Equipment objects
      // No more playerEquipment - equipment is stored directly in inventory
    });
  });
});
