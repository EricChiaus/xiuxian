import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBattle } from '../hooks/useBattle';
import { createInitialCharacter } from '../utils/character';
import { GameState } from '../types/game';

const buildState = (): GameState => ({
  player: createInitialCharacter(),
  currentEnemy: null,
  enemies: [],
  selectedEnemyId: null,
  inBattle: false,
  isPlayerTurn: true,
  battleLog: [],
  lastSaveTime: Date.now(),
  shopItems: [],
  battleResult: null,
  battleRewards: null
});

describe('useBattle', () => {
  it('startBattle writes battle state via updater', () => {
    const gameState = buildState();
    const setGameState = vi.fn();
    const addBattleLogEntry = vi.fn();
    const saveGame = vi.fn();

    const { result } = renderHook(() => useBattle(gameState, setGameState, addBattleLogEntry, saveGame));

    act(() => {
      result.current.startBattle();
    });

    expect(setGameState).toHaveBeenCalledTimes(1);
    const updater = setGameState.mock.calls[0][0];
    const next = updater(gameState);

    expect(next.inBattle).toBe(true);
    expect(next.enemies.length).toBeGreaterThan(0);
    expect(next.currentEnemy).not.toBeNull();
  });
});
