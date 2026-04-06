import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialCharacter } from '../utils/character';
import { clearGameSave, loadGameSave, saveGameState } from '../utils/persistence';
import { GameState } from '../types/game';
import { generateShopItems } from '../utils/shop';

const buildState = (): GameState => {
  const player = createInitialCharacter();
  return {
    player,
    currentEnemy: null,
    enemies: [],
    selectedEnemyId: null,
    inBattle: false,
    isPlayerTurn: true,
    battleLog: [],
    lastSaveTime: Date.now(),
    shopItems: generateShopItems(player.level),
    battleResult: null,
    battleRewards: null
  };
};

describe('persistence adapter', () => {
  beforeEach(() => {
    clearGameSave();
  });

  it('saves and loads a non-battle game', () => {
    const state = buildState();
    state.player.coin = 4321;

    saveGameState(state);
    const loaded = loadGameSave();

    expect(loaded).not.toBeNull();
    expect(loaded?.player.coin).toBe(4321);
  });

  it('does not save while in battle', () => {
    const state = buildState();
    state.inBattle = true;

    saveGameState(state);
    const loaded = loadGameSave();

    expect(loaded).toBeNull();
  });
});
