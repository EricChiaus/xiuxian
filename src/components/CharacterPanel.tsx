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
    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>修仙者</h3>
      
      {/* Character Avatar - Cultivator */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 100 100">
            {/* Robe */}
            <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#8B4513"/>
            <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#D2691E" opacity="0.7"/>
            {/* Head */}
            <circle cx="50" cy="40" r="18" fill="#fdbcb4"/>
            {/* Hair - Top knot */}
            <circle cx="50" cy="25" r="8" fill="#2c1810"/>
            <circle cx="50" cy="20" r="5" fill="#2c1810"/>
            {/* Eyes */}
            <circle cx="42" cy="38" r="2" fill="#333"/>
            <circle cx="58" cy="38" r="2" fill="#333"/>
            {/* Serene expression */}
            <path d="M 42 48 Q 50 52 58 48" stroke="#333" strokeWidth="1.5" fill="none"/>
            {/* Aura effect */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.3"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2"/>
          </svg>
          {/* Cultivation level indicator */}
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {player.level}
          </div>
        </div>
      </div>

      {/* HP Bar - Vitality */}
      <div className="mb-3">
        <div className="text-sm text-amber-800 font-semibold mb-1">🩸 生命元气</div>
        <div className="w-full bg-amber-200 rounded-full h-5 relative border border-amber-600">
          <div 
            className="bg-gradient-to-r from-red-600 to-red-700 h-5 rounded-full transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {player.hp}/{player.maxHp}
            </span>
          </div>
        </div>
      </div>

      {/* MP Bar - Spiritual Energy */}
      <div className="mb-3">
        <div className="text-sm text-amber-800 font-semibold mb-1">✨ 灵力</div>
        <div className="w-full bg-amber-200 rounded-full h-5 relative border border-amber-600">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-5 rounded-full transition-all duration-300"
            style={{ width: `${mpPercent}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {player.mp}/{player.maxMp}
            </span>
          </div>
        </div>
      </div>

      {/* EXP Bar - Cultivation Progress */}
      <div className="mb-4">
        <div className="text-sm text-amber-800 font-semibold mb-1">🌟 修为</div>
        <div className="w-full bg-amber-200 rounded-full h-5 relative border border-amber-600">
          <div 
            className="bg-gradient-to-r from-yellow-600 to-orange-600 h-5 rounded-full transition-all duration-300"
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
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 text-center border border-amber-600">
          <div className="text-lg font-bold text-red-900">{player.pa}</div>
          <div className="text-xs text-amber-800">⚔️ 攻击</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 text-center border border-amber-600">
          <div className="text-lg font-bold text-red-900">{player.ma}</div>
          <div className="text-xs text-amber-800">🔮 法术</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 text-center border border-amber-600">
          <div className="text-lg font-bold text-red-900">{player.pd}</div>
          <div className="text-xs text-amber-800">🛡️ 防御</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 text-center border border-amber-600">
          <div className="text-lg font-bold text-red-900">{player.md}</div>
          <div className="text-xs text-amber-800">🧘 抗法</div>
        </div>
      </div>

      {/* Level Up Button */}
      <button
        onClick={onLevelUp}
        disabled={!canLevelUp}
        className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 border-2 ${
          canLevelUp 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 animate-pulse shadow-lg border-yellow-700 transform hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
        }`}
      >
        {canLevelUp ? '🌟 突破境界' : '🔒 修为不足'}
      </button>
    </div>
  );
};

export default CharacterPanel;
