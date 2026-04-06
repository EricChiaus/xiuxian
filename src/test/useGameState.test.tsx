import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameState } from '../hooks/useGameState';
import { clearGameSave } from '../utils/persistence';

describe('useGameState', () => {
  beforeEach(() => {
    clearGameSave();
  });

  it('initializes with a default game state', () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.gameState.player.level).toBe(1);
    expect(result.current.gameState.inBattle).toBe(false);
    expect(result.current.gameState.battleResult).toBeNull();
  });
});
