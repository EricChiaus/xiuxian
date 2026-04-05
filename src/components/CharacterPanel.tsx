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

  const renderAvatar = () => {
    if (player.avatar.includes('female')) {
      return (
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          {/* Robe */}
          <path d="M 25 70 Q 50 62 75 70 L 70 95 L 30 95 Z" fill="#ff69b4"/>
          <path d="M 25 70 Q 50 62 75 70 L 70 95 L 30 95 Z" fill="#ffb6c1" opacity="0.7"/>
          {/* Head */}
          <circle cx="50" cy="38" r="17" fill="#fdbcb4"/>
          {/* Hair - varies by avatar */}
          {player.avatar === 'female_cultivator_1' && (
            <>
              <ellipse cx="50" cy="25" rx="15" ry="12" fill="#8B4513"/>
              <path d="M 35 20 Q 50 15 65 20" stroke="#654321" strokeWidth="2" fill="none"/>
              <circle cx="45" cy="28" r="3" fill="#FFB6C1"/>
              <circle cx="55" cy="28" r="3" fill="#FFB6C1"/>
            </>
          )}
          {player.avatar === 'female_cultivator_2' && (
            <>
              <path d="M 35 20 Q 50 10 65 20 L 65 35 Q 50 40 35 35 Z" fill="#4B0082"/>
              <circle cx="50" cy="25" r="2" fill="#FFD700"/>
              <circle cx="45" cy="30" r="1.5" fill="#FFB6C1"/>
              <circle cx="55" cy="30" r="1.5" fill="#FFB6C1"/>
            </>
          )}
          {player.avatar === 'female_cultivator_3' && (
            <>
              <path d="M 30 25 Q 50 8 70 25 L 70 38 Q 50 45 30 38 Z" fill="#2F4F4F"/>
              <path d="M 40 15 Q 50 10 60 15" stroke="#FFD700" strokeWidth="2" fill="none"/>
              <circle cx="48" cy="28" r="2" fill="#FF69B4"/>
              <circle cx="52" cy="28" r="2" fill="#FF69B4"/>
            </>
          )}
          {/* Eyes */}
          <circle cx="43" cy="36" r="1.5" fill="#333"/>
          <circle cx="57" cy="36" r="1.5" fill="#333"/>
          {/* Expression */}
          <path d="M 43 44 Q 50 48 57 44" stroke="#333" strokeWidth="1" fill="none"/>
          {/* Aura */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FFB6C1" strokeWidth="1" opacity="0.3"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB6C1" strokeWidth="0.5" opacity="0.2"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          {/* Robe */}
          <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#8B4513"/>
          <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#D2691E" opacity="0.7"/>
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="#fdbcb4"/>
          {/* Hair - varies by avatar */}
          {player.avatar === 'male_cultivator_1' && (
            <>
              <circle cx="50" cy="25" r="8" fill="#2c1810"/>
              <circle cx="50" cy="20" r="5" fill="#2c1810"/>
            </>
          )}
          {player.avatar === 'male_cultivator_2' && (
            <>
              <ellipse cx="50" cy="25" rx="10" ry="8" fill="#4a4a4a"/>
              <path d="M 40 20 Q 50 15 60 20" stroke="#2c1810" strokeWidth="2" fill="none"/>
            </>
          )}
          {player.avatar === 'male_cultivator_3' && (
            <>
              <ellipse cx="50" cy="22" rx="12" ry="10" fill="#e8e8e8"/>
              <path d="M 38 18 Q 50 12 62 18" stroke="#d0d0d0" strokeWidth="2" fill="none"/>
            </>
          )}
          {/* Eyes */}
          <circle cx="42" cy="38" r="2" fill="#333"/>
          <circle cx="58" cy="38" r="2" fill="#333"/>
          {/* Serene expression */}
          <path d="M 42 48 Q 50 52 58 48" stroke="#333" strokeWidth="1.5" fill="none"/>
          {/* Aura effect */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.3"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2"/>
        </svg>
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>修仙者</h3>
      
      {/* Character Avatar - Cultivator */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {renderAvatar()}
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
