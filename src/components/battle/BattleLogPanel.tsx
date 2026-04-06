import React from 'react';
import { BattleLogEntry } from '../../types/game';

interface BattleLogPanelProps {
  battleLog: BattleLogEntry[];
}

const getLogEntryClass = (type: string) => {
  switch (type) {
    case 'player':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'enemy':
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'system':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const BattleLogPanel: React.FC<BattleLogPanelProps> = ({ battleLog }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-600">
      <h4 className="text-lg font-bold text-amber-900 mb-3" style={{ fontFamily: 'serif' }}>战斗记录</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {battleLog.slice(-10).map((entry, index) => (
          <div key={index} className={`p-2 rounded text-sm ${getLogEntryClass(entry.type)}`}>
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLogPanel;
