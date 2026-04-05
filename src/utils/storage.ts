import { GameSaveData } from '../types/game';

const STORAGE_KEY = 'rpgGameSave';

export const saveGame = (data: GameSaveData): void => {
  try {
    const saveData = {
      ...data,
      lastSaveTime: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): GameSaveData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Failed to load game:', error);
  }
  return null;
};

export const calculateOfflineExp = (lastSaveTime: number): number => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastSaveTime;
  const hoursAway = timeDiff / (1000 * 60 * 60);
  
  if (hoursAway >= 1) {
    const offlineExpRate = 5; // EXP per hour
    return Math.floor(hoursAway * offlineExpRate);
  }
  
  return 0;
};

export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
};
