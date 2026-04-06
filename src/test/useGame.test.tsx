import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from '../hooks/useGame';
import { clearGameSave } from '../utils/persistence';

describe('useGame', () => {
  beforeEach(() => {
    clearGameSave();
  });

  it('starts battle and closes result modal', () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startBattle();
    });

    expect(result.current.gameState.inBattle).toBe(true);
    expect(result.current.gameState.enemies.length).toBeGreaterThan(0);

    act(() => {
      result.current.setGameState((prev) => ({
        ...prev,
        inBattle: false,
        battleResult: 'victory',
        battleRewards: { expGained: 1, coinsGained: 1, expLost: 0 }
      }));
      result.current.closeBattleModal();
    });

    expect(result.current.gameState.battleResult).toBeNull();
    expect(result.current.gameState.battleRewards).toBeNull();
  });
});
