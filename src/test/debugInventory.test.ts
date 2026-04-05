import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShopInventory } from '../hooks/useShopInventory';
import { createInitialCharacter } from '../utils/character';
import { generateShopItems } from '../utils/shop';
import { GameState } from '../types/game';

describe('Debug Inventory Issue', () => {
  it('should debug getInventoryEquipment function', () => {
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

    // Get the functions
    const { getAllEquipment, getInventoryEquipment } = result.current;

    // Check initial state
    console.log('=== INITIAL STATE ===');
    console.log('Player inventory:', mockGameState.player.inventory);
    console.log('Player equipment:', mockGameState.playerEquipment);
    
    const initialAllEquipment = getAllEquipment();
    const initialInventoryEquipment = getInventoryEquipment();
    
    console.log('Initial all equipment count:', initialAllEquipment.length);
    console.log('Initial inventory equipment count:', initialInventoryEquipment.length);

    expect(initialInventoryEquipment).toHaveLength(0);

    // Simulate purchase
    act(() => {
      const { buyItem } = result.current;
      buyItem(shopItem.id);
    });

    // Get the updated state by calling the setState function
    const updatedState = mockSetGameState.mock.calls[0][0](mockGameState);
    
    // Re-render the hook with updated state
    act(() => {
      const { result: newResult } = renderHook(() => 
        useShopInventory(updatedState, mockSetGameState, mockAddBattleLogEntry)
      );
      
      // Get functions from the new result
      const { getAllEquipment, getInventoryEquipment } = newResult.current;
      const afterPurchaseAllEquipment = getAllEquipment();
      const afterPurchaseInventoryEquipment = getInventoryEquipment();
      
      console.log('After purchase all equipment count:', afterPurchaseAllEquipment.length);
      console.log('After purchase inventory equipment count:', afterPurchaseInventoryEquipment.length);

      expect(afterPurchaseInventoryEquipment).toHaveLength(1);
      expect(afterPurchaseInventoryEquipment[0].id).toBe(shopItem.id);
    });
  });
});
