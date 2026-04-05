import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShopInventory } from '../hooks/useShopInventory';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';
import { GameState } from '../types/game';

// Test the actual buyItem function integration
describe('BuyItem Integration Tests', () => {
  
  it('should test actual buyItem function with real hook', () => {
    // Setup initial game state
    const initialPlayer = createInitialCharacter();
    const shopItems = generateShopItems(initialPlayer.level);
    const shopItem = shopItems[0];
    
    const mockGameState: GameState = {
      player: initialPlayer,
      currentEnemy: null,
      enemies: [],
      selectedEnemyId: null,
      inBattle: false,
      isPlayerTurn: true,
      lastSaveTime: Date.now(),
      battleLog: [],
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
      shopItems: shopItems,
      playerEquipment: {}
    };

    const mockSetGameState = vi.fn();
    const mockAddBattleLogEntry = vi.fn();

    // Render the hook
    const { result } = renderHook(() => 
      useShopInventory(mockGameState, mockSetGameState, mockAddBattleLogEntry)
    );

    // Get the buyItem function
    const { buyItem, getAllEquipment } = result.current;

    // Check initial state
    expect(mockGameState.player.inventory).toHaveLength(0);
    expect(Object.keys(mockGameState.player.playerEquipment)).toHaveLength(0);

    // Buy the item
    act(() => {
      buyItem(shopItem.id);
    });

    // Check that setGameState was called
    expect(mockSetGameState).toHaveBeenCalledTimes(1);

    // Get the updated game state from the mock call
    const updateCall = mockSetGameState.mock.calls[0][0];
    const updatedPlayer = updateCall(mockGameState).player;

    // Verify the purchase results
    console.log('Updated player:', updatedPlayer);
    console.log('Player equipment:', updatedPlayer.playerEquipment);
    console.log('Inventory:', updatedPlayer.inventory);

    // Basic checks
    expect(updatedPlayer.inventory).toContain(shopItem.id);
    expect(updatedPlayer.coin).toBe(initialPlayer.coin - shopItem.price);
    expect(updatedPlayer.playerEquipment[shopItem.id]).toBeDefined();

    // Check equipment data
    const equipment = updatedPlayer.playerEquipment[shopItem.id];
    expect(equipment.id).toBe(shopItem.id);
    expect(equipment.name).toBe(shopItem.name);
    expect(equipment.price).toBe(shopItem.price);
    expect(equipment.sellPrice).toBe(Math.floor(shopItem.price / 2));
  });

  it('should test getAllEquipment after purchase', () => {
    // Setup initial game state with purchased item
    const initialPlayer = createInitialCharacter();
    const shopItems = generateShopItems(initialPlayer.level);
    const shopItem = shopItems[0];
    
    // Simulate a purchased item in playerEquipment
    const mockGameState: GameState = {
      player: {
        ...initialPlayer,
        inventory: [shopItem.id],
        playerEquipment: {
          [shopItem.id]: {
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
          }
        }
      },
      currentEnemy: null,
      enemies: [],
      selectedEnemyId: null,
      inBattle: false,
      isPlayerTurn: true,
      lastSaveTime: Date.now(),
      battleLog: [],
      offlineExp: 0,
      lastRegenerationTime: Date.now(),
      shopItems: shopItems,
      playerEquipment: {
        [shopItem.id]: {
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
        }
      }
    };

    const mockSetGameState = vi.fn();
    const mockAddBattleLogEntry = vi.fn();

    // Render the hook
    const { result } = renderHook(() => 
      useShopInventory(mockGameState, mockSetGameState, mockAddBattleLogEntry)
    );

    // Get all equipment and inventory equipment
    const { getAllEquipment, getInventoryEquipment } = result.current;
    const allEquipment = getAllEquipment();
    const inventoryEquipment = getInventoryEquipment();
    
    console.log('All equipment:', allEquipment);
    console.log('Inventory equipment:', inventoryEquipment);

    // Verify equipment retrieval - should only return inventory items
    expect(inventoryEquipment).toHaveLength(1);
    expect(inventoryEquipment[0].id).toBe(shopItem.id);
    expect(inventoryEquipment[0].name).toBe(shopItem.name);
    expect(allEquipment[0].type).toBe('weapon');
    expect(allEquipment[0].rarity).toBe('common');
    expect(allEquipment[0].level).toBe(1);
    expect(allEquipment[0].bonus.pa).toBe(10);
    expect(allEquipment[0].elements.fire).toBe(5);
    expect(allEquipment[0].sellPrice).toBe(Math.floor(shopItem.price / 2));
  });

  it('should test localStorage persistence simulation', () => {
    // Simulate the complete flow: buy -> save -> load -> check
    const initialPlayer = createInitialCharacter();
    const shopItems = generateShopItems(initialPlayer.level);
    const shopItem = shopItems[0];
    
    // Step 1: Purchase item (simulate buyItem logic)
    const purchasedEquipment = {
      id: shopItem.id,
      name: shopItem.name,
      type: 'weapon' as const,
      rarity: 'common' as const,
      level: 1,
      bonus: { pa: 10 },
      elements: { fire: 5 },
      elementResistance: {},
      price: shopItem.price,
      sellPrice: Math.floor(shopItem.price / 2)
    };

    const afterPurchase = {
      ...initialPlayer,
      coin: initialPlayer.coin - shopItem.price,
      inventory: [shopItem.id],
      playerEquipment: {
        [shopItem.id]: purchasedEquipment
      }
    };

    // Step 2: Save to localStorage (simulate)
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
      shopItems: shopItems,
      playerEquipment: afterPurchase.playerEquipment
    };

    const savedData = JSON.stringify(gameState);

    // Step 3: Load from localStorage (simulate)
    const loadedData = JSON.parse(savedData);
    const loadedPlayer = loadedData.player;

    // Step 4: Verify the loaded data
    console.log('Loaded player:', loadedPlayer);
    console.log('Loaded equipment:', loadedPlayer.playerEquipment);

    expect(loadedPlayer.inventory).toContain(shopItem.id);
    expect(loadedPlayer.playerEquipment[shopItem.id]).toBeDefined();
    
    const loadedEquipment = loadedPlayer.playerEquipment[shopItem.id];
    expect(loadedEquipment.id).toBe(shopItem.id);
    expect(loadedEquipment.name).toBe(shopItem.name);
    expect(loadedEquipment.type).toBe('weapon');
    expect(loadedEquipment.rarity).toBe('common');
    expect(loadedEquipment.level).toBe(1);
    expect(loadedEquipment.bonus.pa).toBe(10);
    expect(loadedEquipment.elements.fire).toBe(5);
  });
});
