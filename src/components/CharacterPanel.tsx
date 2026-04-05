import React from 'react';
import { Character } from '../types/game';

interface CharacterPanelProps {
  player: Character;
  onLevelUp: () => void;
  canLevelUp: boolean;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ player, onLevelUp, canLevelUp }) => {
  const hpPercent = (player.hp / player.maxHp) * 100;
  const mpPercent = (player.mp / player.maxMp) * 100;
  const expPercent = (player.exp / player.expToNext) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Hero</h3>
      
      {/* Character Face SVG */}
      <div className="flex justify-center mb-4">
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#fdbcb4"/>
          <circle cx="35" cy="40" r="3" fill="#333"/>
          <circle cx="65" cy="40" r="3" fill="#333"/>
          <path d="M 35 60 Q 50 70 65 60" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">HP</div>
        <div className="w-full bg-gray-300 rounded-full h-5 relative">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-5 rounded-full transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {player.hp}/{player.maxHp}
            </span>
          </div>
        </div>
      </div>

      {/* MP Bar */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">MP</div>
        <div className="w-full bg-gray-300 rounded-full h-5 relative">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-5 rounded-full transition-all duration-300"
            style={{ width: `${mpPercent}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {player.mp}/{player.maxMp}
            </span>
          </div>
        </div>
      </div>

      {/* EXP Bar */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">EXP</div>
        <div className="w-full bg-gray-300 rounded-full h-5 relative">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-5 rounded-full transition-all duration-300"
            style={{ width: `${expPercent}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {player.exp}/{player.expToNext}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-800">{player.pa}</div>
          <div className="text-xs text-gray-600">PA</div>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-800">{player.ma}</div>
          <div className="text-xs text-gray-600">MA</div>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-800">{player.pd}</div>
          <div className="text-xs text-gray-600">PD</div>
        </div>
        <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-gray-800">{player.md}</div>
          <div className="text-xs text-gray-600">MD</div>
        </div>
      </div>

      {/* Level Up Button */}
      <button
        onClick={onLevelUp}
        disabled={!canLevelUp}
        className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
          canLevelUp 
            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 animate-pulse shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Level Up
      </button>
    </div>
  );
};

export default CharacterPanel;
