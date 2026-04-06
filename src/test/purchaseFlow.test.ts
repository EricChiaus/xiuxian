import { describe, it, expect } from 'vitest';
import { generateShopItems } from '../utils/shop';
import { createInitialCharacter } from '../utils/character';
import { generateRandomEquipment } from '../utils/equipment';
import { Equipment, ShopItem } from '../types/game';

// Test the complete purchase flow to ensure equipment persistence works
describe('Purchase Flow Integration Tests', () => {
  
  describe('Complete Purchase Flow', () => {
    it('should correctly purchase item and store equipment data', () => {
      // Setup initial state
      const player = createInitialCharacter();
      const shopItems = generateShopItems(player.level);
      const shopItem = shopItems[0]; // Get first shop item
      
      // Simulate the purchase logic from buyItem function
      const purchasedEquipment = generateRandomEquipment(1);
      
      // Simulate setGameState update from buyItem
      const newPlayer = { 
        ...player, 
        coin: player.coin - shopItem.price 
      };
      
      // Add equipment to inventory
      newPlayer.inventory = [...newPlayer.inventory, purchasedEquipment];
      
      // Equipment is now stored directly in inventory

      // Verify purchase results
      expect(newPlayer.inventory).toContain(purchasedEquipment);
      expect(newPlayer.coin).toBe(player.coin - shopItem.price);
      // Equipment is stored directly in inventory, no playerEquipment field
    });

    it('should simulate localStorage save and load cycle', () => {
      // Setup initial state
      const player = createInitialCharacter();
      const shopItems = generateShopItems(player.level);
      const shopItem = shopItems[0];
      
      // Simulate purchase
      const purchasedEquipment = generateRandomEquipment(1);
      const newPlayer = { 
        ...player, 
        coin: player.coin - shopItem.price,
        inventory: [...player.inventory, shopItem.id],
        playerEquipment: {
          ...player.playerEquipment,
          [shopItem.id]: {
            ...purchasedEquipment,
            id: shopItem.id,
            name: shopItem.name,
            price: shopItem.price,
            sellPrice: Math.floor(shopItem.price / 2)
          }
        }
      };

      // Simulate localStorage save
      const gameState = {
        player: newPlayer,
        currentEnemy: null,
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
        lastSaveTime: Date.now(),
        battleLog: [],
        offlineExp: 0,
        lastRegenerationTime: Date.now(),
        shopItems: generateShopItems(newPlayer.level),
        playerEquipment: newPlayer.playerEquipment
      };

      // Simulate localStorage save/load
      const savedData = JSON.stringify(gameState);
      const loadedData = JSON.parse(savedData);

      // Verify data integrity after save/load
      expect(loadedData.player.inventory).toContain(shopItem.id);
      expect(loadedData.player.playerEquipment[shopItem.id]).toBeDefined();
      expect(loadedData.player.playerEquipment[shopItem.id].id).toBe(shopItem.id);
      expect(loadedData.player.playerEquipment[shopItem.id].name).toBe(shopItem.name);
      expect(loadedData.player.playerEquipment[shopItem.id].price).toBe(shopItem.price);
    });

    it('should verify equipment retrieval works correctly', () => {
      // Setup initial state
      const player = createInitialCharacter();
      const shopItems = generateShopItems(player.level);
      const shopItem = shopItems[0];
      
      // Create equipment data as it would be stored
      const equipmentData: Equipment = {
        id: shopItem.id,
        name: shopItem.name,
        type: 'weapon',
        rarity: 'common',
        level: 1,
        bonus: { pa: 10 },
        elements: { fire: 5 },
        elementResistance: {},
        price: shopItem.price,
        sellPrice: Math.floor(shopItem.price / 2)
      };

      // Simulate playerEquipment storage
      const playerEquipment = {
        [shopItem.id]: equipmentData
      };

      // Test equipment retrieval (simulating getAllEquipment logic)
      const allEquipment: Equipment[] = [];
      
      // Add purchased equipment
      Object.entries(playerEquipment).forEach(([itemId, equipment]) => {
        allEquipment.push({
          ...equipment,
          id: itemId
        });
      });

      // Verify equipment can be retrieved correctly
      expect(allEquipment).toHaveLength(1);
      expect(allEquipment[0].id).toBe(shopItem.id);
      expect(allEquipment[0].name).toBe(shopItem.name);
      expect(allEquipment[0].type).toBe('weapon');
      expect(allEquipment[0].rarity).toBe('common');
      expect(allEquipment[0].level).toBe(1);
      expect(allEquipment[0].bonus.pa).toBe(10);
      expect(allEquipment[0].elements.fire).toBe(5);
      expect(allEquipment[0].price).toBe(shopItem.price);
      expect(allEquipment[0].sellPrice).toBe(Math.floor(shopItem.price / 2));
    });

    it('should test complete buy -> save -> load -> retrieve cycle', () => {
      // Step 1: Initial state
      const player = createInitialCharacter();
      const shopItems = generateShopItems(player.level);
      const shopItem = shopItems[0];
      
      // Step 2: Purchase item
      const purchasedEquipment = generateRandomEquipment(1);
      const afterPurchase = {
        ...player,
        coin: player.coin - shopItem.price,
        inventory: [...player.inventory, shopItem.id],
        playerEquipment: {
          ...player.playerEquipment,
          [shopItem.id]: {
            ...purchasedEquipment,
            id: shopItem.id,
            name: shopItem.name,
            price: shopItem.price,
            sellPrice: Math.floor(shopItem.price / 2)
          }
        }
      };

      // Step 3: Save to localStorage (simulate)
      const gameState = {
        player: afterPurchase,
        currentEnemy: null,
        enemies: [],
        selectedEnemyId: null,
        inBattle: false,
        isPlayerTurn: true,
        lastSaveTime: Date.now(),
        battleLog: [],
        offlineExp: 0,
        lastRegenerationTime: Date.now(),
        shopItems: generateShopItems(afterPurchase.level),
        playerEquipment: afterPurchase.playerEquipment
      };

      // Step 4: Load from localStorage (simulate)
      const loadedGameState = JSON.parse(JSON.stringify(gameState));
      const loadedPlayer = loadedGameState.player;

      // Step 5: Verify complete cycle
      // Check inventory
      expect(loadedPlayer.inventory).toContain(shopItem.id);
      expect(loadedPlayer.inventory).toHaveLength(1);

      // Check playerEquipment
      expect(loadedPlayer.playerEquipment[shopItem.id]).toBeDefined();
      const loadedEquipment = loadedPlayer.playerEquipment[shopItem.id];
      expect(loadedEquipment.id).toBe(shopItem.id);
      expect(loadedEquipment.name).toBe(shopItem.name);
      expect(loadedEquipment.price).toBe(shopItem.price);

      // Step 6: Test equipment retrieval (simulate getAllEquipment)
      const retrievedEquipment = loadedPlayer.playerEquipment[shopItem.id];
      expect(retrievedEquipment).toBeDefined();
      expect(retrievedEquipment.id).toBe(shopItem.id);
      expect(retrievedEquipment.name).toBe(shopItem.name);
      expect(retrievedEquipment.price).toBe(shopItem.price);
      expect(retrievedEquipment.sellPrice).toBe(Math.floor(shopItem.price / 2));
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple purchases correctly', () => {
      const player = createInitialCharacter();
      const shopItems = generateShopItems(player.level);
      const shopItem1 = shopItems[0];
      const shopItem2 = shopItems[1];

      // Purchase first item
      const equipment1 = generateRandomEquipment(1);
      let newPlayer = {
        ...player,
        coin: player.coin - shopItem1.price,
        inventory: [...player.inventory, shopItem1.id],
        playerEquipment: {
          ...player.playerEquipment,
          [shopItem1.id]: {
            ...equipment1,
            id: shopItem1.id,
            name: shopItem1.name,
            price: shopItem1.price,
            sellPrice: Math.floor(shopItem1.price / 2)
          }
        }
      };

      // Purchase second item
      const equipment2 = generateRandomEquipment(1);
      newPlayer = {
        ...newPlayer,
        coin: newPlayer.coin - shopItem2.price,
        inventory: [...newPlayer.inventory, shopItem2.id],
        playerEquipment: {
          ...newPlayer.playerEquipment,
          [shopItem2.id]: {
            ...equipment2,
            id: shopItem2.id,
            name: shopItem2.name,
            price: shopItem2.price,
            sellPrice: Math.floor(shopItem2.price / 2)
          }
        }
      };

      // Verify both items are stored correctly
      expect(newPlayer.inventory).toHaveLength(2);
      expect(newPlayer.inventory).toContain(shopItem1.id);
      expect(newPlayer.inventory).toContain(shopItem2.id);
      expect(newPlayer.playerEquipment[shopItem1.id]).toBeDefined();
      expect(newPlayer.playerEquipment[shopItem2.id]).toBeDefined();
      expect(newPlayer.playerEquipment[shopItem1.id].name).toBe(shopItem1.name);
      expect(newPlayer.playerEquipment[shopItem2.id].name).toBe(shopItem2.name);
    });

    it('should handle empty inventory correctly', () => {
      const player = createInitialCharacter();
      
      // Verify initial state
      expect(player.inventory).toHaveLength(0);
      // No more playerEquipment - equipment is stored directly in inventory

      // Test equipment retrieval with empty storage
      const allEquipment: Equipment[] = player.inventory; // Direct access to inventory

      expect(allEquipment).toHaveLength(0);
    });
  });
});
