import { useCallback } from 'react';
import { BattleLogEntry } from '../types/game';

export const useGameCore = () => {
  const addBattleLogEntry = useCallback((entry: Omit<BattleLogEntry, 'timestamp'>) => {
    const logEntry: BattleLogEntry = {
      ...entry,
      timestamp: Date.now()
    };
    
    // This would be used in components to add battle log entries
    return logEntry;
  }, []);

  return { addBattleLogEntry };
};
