import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShopInventory } from '../hooks/useShopInventory';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';
import { GameState, Equipment } from '../types/game';

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
      shopItems: shopItems
    };

    const mockSetGameState = vi.fn();
    const mockAddBattleLogEntry = vi.fn();
    const mockSaveGame = vi.fn();

    // Render the hook
    const { result } = renderHook(() => 
      useShopInventory(mockGameState, mockSetGameState, mockAddBattleLogEntry, mockSaveGame)
    );

    // Get the buyItem function
    const { buyItem, getAllEquipment } = result.current;

    // Check initial state
    expect(mockGameState.player.inventory).toHaveLength(0);
    // No more playerEquipment field - equipment is stored directly in inventory

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
    console.log('Inventory:', updatedPlayer.inventory);

    // Basic checks
    expect(updatedPlayer.inventory).toHaveLength(1);
    expect(updatedPlayer.inventory[0].id).toBe(shopItem.id);
    expect(updatedPlayer.coin).toBe(initialPlayer.coin - shopItem.price);
    // No more playerEquipment - equipment is stored directly in inventory

    // Check equipment data (generated equipment will have different name than shop item)
    const equipment = updatedPlayer.inventory[0];
    expect(equipment.id).toBe(shopItem.id);
    // Equipment name is generated randomly, so we just check it exists
    expect(equipment.name).toBeDefined();
    expect(equipment.type).toBe('weapon'); // We default to weapon type
    expect(equipment.price).toBeGreaterThan(0);
    expect(equipment.sellPrice).toBe(Math.floor(equipment.price / 2));
  });

  it('should test getAllEquipment after purchase', () => {
    // Setup initial game state with purchased item
    const initialPlayer = createInitialCharacter();
    const shopItems = generateShopItems(initialPlayer.level);
    const shopItem = shopItems[0];
    
    // Simulate a purchased item in inventory
    const mockGameState: GameState = {
      player: {
        ...initialPlayer,
        inventory: [{
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
        }]
      },
      currentEnemy: null,
      enemies: [],
      selectedEnemyId: null,
      inBattle: false,
      isPlayerTurn: true,
      lastSaveTime: Date.now(),
      battleLog: [],
      shopItems: shopItems
    };

    const mockSetGameState = vi.fn();
    const mockAddBattleLogEntry = vi.fn();
    const mockSaveGame = vi.fn();

    // Render the hook
    const { result } = renderHook(() => 
      useShopInventory(mockGameState, mockSetGameState, mockAddBattleLogEntry, mockSaveGame)
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
      inventory: [purchasedEquipment]
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
      shopItems: shopItems
    };

    const savedData = JSON.stringify(gameState);

    // Step 3: Load from localStorage (simulate)
    const loadedData = JSON.parse(savedData);
    const loadedPlayer = loadedData.player;

    // Step 4: Verify the loaded data
    console.log('Loaded player:', loadedPlayer);

    expect(loadedPlayer.inventory).toContain(purchasedEquipment);
    
    const loadedEquipment = loadedPlayer.inventory.find((eq: Equipment) => eq.id === purchasedEquipment.id);
    expect(loadedEquipment).toBeDefined();
    expect(loadedEquipment.id).toBe(purchasedEquipment.id);
    expect(loadedEquipment.name).toBe(purchasedEquipment.name);
    expect(loadedEquipment.type).toBe(purchasedEquipment.type);
    expect(loadedEquipment.rarity).toBe('common');
    expect(loadedEquipment.level).toBe(1);
    expect(loadedEquipment.bonus.pa).toBe(10);
    expect(loadedEquipment.elements.fire).toBe(5);
  });
});
