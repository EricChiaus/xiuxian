import { GameSaveData, GameState } from '../types/game';

const SAVE_KEY = 'xiuxian-save';
const SAVE_VERSION = 1;

interface VersionedSave {
  version: number;
  data: GameSaveData;
}

export const loadGameSave = (): GameSaveData | null => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as VersionedSave | GameSaveData;

    if ('version' in parsed && 'data' in parsed) {
      return parsed.version === SAVE_VERSION ? parsed.data : null;
    }

    // Backward compatibility for old save format
    if ('player' in parsed && 'lastSaveTime' in parsed) {
      return parsed as GameSaveData;
    }

    return null;
  } catch {
    return null;
  }
};

export const saveGameState = (state: GameState): void => {
  try {
    if (state.inBattle) {
      return;
    }

    const payload: VersionedSave = {
      version: SAVE_VERSION,
      data: {
        player: state.player,
        lastSaveTime: Date.now()
      }
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch {
    // Silent fail on storage quota/private mode
  }
};

export const clearGameSave = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Silent fail
  }
};
