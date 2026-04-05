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
          {/* Background aura effect */}
          <defs>
            <radialGradient id="femaleAura1">
              <stop offset="0%" stopColor="#FF69B4" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0.1"/>
            </radialGradient>
            <radialGradient id="femaleAura2">
              <stop offset="0%" stopColor="#E6E6FA" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#DDA0DD" stopOpacity="0.05"/>
            </radialGradient>
          </defs>
          
          {/* Young Female Cultivator - female_cultivator_1 */}
          {player.avatar === 'female_cultivator_1' && (
            <>
              {/* Elegant dress with details */}
              <path d="M 28 72 Q 50 65 72 72 L 68 98 L 32 98 Z" fill="#FF69B4"/>
              <path d="M 28 72 Q 50 65 72 72 L 68 98 L 32 98 Z" fill="#FFB6C1" opacity="0.7"/>
              {/* Dress trim and patterns */}
              <path d="M 32 75 L 68 75" stroke="#FFD700" strokeWidth="2"/>
              <path d="M 35 80 L 65 80" stroke="#FFF" strokeWidth="1"/>
              <path d="M 37 85 L 63 85" stroke="#FFD700" strokeWidth="1"/>
              {/* Decorative belt */}
              <rect x="45" y="73" width="10" height="3" fill="#8B4513"/>
              <circle cx="50" cy="74.5" r="1.5" fill="#FFD700"/>
              {/* Head */}
              <circle cx="50" cy="35" r="16" fill="#FDBCB4"/>
              {/* Beautiful long hair */}
              <path d="M 34 28 Q 50 18 66 28 Q 64 22 50 19 Q 36 22 34 28" fill="#4A4A4A"/>
              <path d="M 32 35 Q 30 40 32 45" stroke="#4A4A4A" strokeWidth="3" fill="none"/>
              <path d="M 68 35 Q 70 40 68 45" stroke="#4A4A4A" strokeWidth="3" fill="none"/>
              {/* Hair details and accessories */}
              <circle cx="40" cy="25" r="2" fill="#FFD700"/>
              <circle cx="60" cy="25" r="2" fill="#FFD700"/>
              <path d="M 40 25 L 60 25" stroke="#8B4513" strokeWidth="1"/>
              {/* Beautiful eyes */}
              <ellipse cx="44" cy="35" rx="2.5" ry="3.5" fill="#333"/>
              <ellipse cx="56" cy="35" rx="2.5" ry="3.5" fill="#333"/>
              <circle cx="45" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="34" r="0.5" fill="#FFF"/>
              {/* Gentle smile */}
              <path d="M 43 43 Q 50 47 57 43" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Cultivation symbols */}
              <text x="50" y="92" fontSize="8" fill="#FFD700" textAnchor="middle">☯</text>
              {/* Feminine aura */}
              <circle cx="50" cy="50" r="38" fill="url(#femaleAura1)"/>
              <circle cx="50" cy="50" r="42" fill="url(#femaleAura2)"/>
              {/* Floating flower petals */}
              <ellipse cx="30" cy="25" rx="2" ry="1" fill="#FFB6C1" opacity="0.7" transform="rotate(45 30 25)"/>
              <ellipse cx="70" cy="30" rx="2" ry="1" fill="#FFB6C1" opacity="0.7" transform="rotate(-45 70 30)"/>
              <ellipse cx="25" cy="60" rx="2" ry="1" fill="#FF69B4" opacity="0.6" transform="rotate(30 25 60)"/>
            </>
          )}
          
          {/* Fairy - female_cultivator_2 */}
          {player.avatar === 'female_cultivator_2' && (
            <>
              {/* Ethereal fairy dress */}
              <path d="M 25 70 Q 50 62 75 70 L 70 98 L 30 98 Z" fill="#E6E6FA"/>
              <path d="M 25 70 Q 50 62 75 70 L 70 98 L 30 98 Z" fill="#DDA0DD" opacity="0.6"/>
              {/* Flowing patterns */}
              <path d="M 30 73 Q 50 70 70 73" stroke="#FFB6C1" strokeWidth="1.5" fill="none"/>
              <path d="M 32 78 Q 50 75 68 78" stroke="#FFB6C1" strokeWidth="1" fill="none"/>
              <path d="M 34 83 Q 50 80 66 83" stroke="#FFB6C1" strokeWidth="1" fill="none"/>
              {/* Fairy wings */}
              <ellipse cx="35" cy="60" rx="8" ry="15" fill="#87CEEB" opacity="0.4"/>
              <ellipse cx="65" cy="60" rx="8" ry="15" fill="#87CEEB" opacity="0.4"/>
              <path d="M 35 60 Q 30 55 35 50" stroke="#ADD8E6" strokeWidth="1" fill="none"/>
              <path d="M 65 60 Q 70 55 65 50" stroke="#ADD8E6" strokeWidth="1" fill="none"/>
              {/* Head */}
              <circle cx="50" cy="30" r="17" fill="#FDBCB4"/>
              {/* Flowing fairy hair */}
              <ellipse cx="50" cy="20" rx="15" ry="13" fill="#8B4513"/>
              <path d="M 35 15 Q 50 8 65 15" stroke="#D2691E" strokeWidth="2" fill="none"/>
              <path d="M 33 25 Q 30 35 33 45" stroke="#8B4513" strokeWidth="2" fill="none"/>
              <path d="M 67 25 Q 70 35 67 45" stroke="#8B4513" strokeWidth="2" fill="none"/>
              {/* Hair ornaments */}
              <circle cx="45" cy="18" r="1.5" fill="#FFD700"/>
              <circle cx="55" cy="18" r="1.5" fill="#FFD700"/>
              <path d="M 45 18 L 55 18" stroke="#8B4513" strokeWidth="0.5"/>
              {/* Magical eyes */}
              <ellipse cx="44" cy="30" rx="3" ry="4" fill="#4B0082"/>
              <ellipse cx="56" cy="30" rx="3" ry="4" fill="#4B0082"/>
              <circle cx="45" cy="29" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="29" r="0.5" fill="#FFF"/>
              {/* Ethereal smile */}
              <path d="M 43 38 Q 50 42 57 38" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Fairy symbols */}
              <text x="50" y="92" fontSize="10" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="40" y="92" fontSize="6" fill="#87CEEB" textAnchor="middle">✦</text>
              <text x="60" y="92" fontSize="6" fill="#87CEEB" textAnchor="middle">✦</text>
              {/* Magical aura */}
              <circle cx="50" cy="50" r="40" fill="url(#femaleAura1)"/>
              <circle cx="50" cy="50" r="45" fill="url(#femaleAura2)"/>
              {/* Sparkles */}
              <circle cx="30" cy="20" r="1" fill="#FFD700" opacity="0.9"/>
              <circle cx="70" cy="25" r="1" fill="#87CEEB" opacity="0.8"/>
              <circle cx="25" cy="55" r="1" fill="#FFB6C1" opacity="0.7"/>
              <circle cx="75" cy="60" r="1" fill="#DDA0DD" opacity="0.8"/>
            </>
          )}
          
          {/* Female Daoist Master - female_cultivator_3 */}
          {player.avatar === 'female_cultivator_3' && (
            <>
              {/* Master's robe with authority */}
              <path d="M 26 68 Q 50 60 74 68 L 70 98 L 30 98 Z" fill="#4B0082"/>
              <path d="M 26 68 Q 50 60 74 68 L 70 98 L 30 98 Z" fill="#663399" opacity="0.7"/>
              {/* Authority patterns */}
              <path d="M 32 70 Q 50 68 68 70" stroke="#FFD700" strokeWidth="2"/>
              <path d="M 35 75 Q 50 73 65 75" stroke="#FFD700" strokeWidth="1.5"/>
              <path d="M 38 80 Q 50 78 62 80" stroke="#FFD700" strokeWidth="1"/>
              {/* Master's insignia */}
              <circle cx="50" cy="85" r="4" fill="#FFD700"/>
              <text x="50" y="88" fontSize="6" fill="#4B0082" textAnchor="middle">道</text>
              {/* Head */}
              <circle cx="50" cy="28" r="18" fill="#F5DEB3"/>
              {/* Dignified hairstyle */}
              <ellipse cx="50" cy="18" rx="16" ry="14" fill="#2C1810"/>
              <path d="M 34 15 Q 50 8 66 15" stroke="#4A4A4A" strokeWidth="2" fill="none"/>
              {/* Crown/headdress */}
              <path d="M 40 12 L 60 12 L 58 8 L 42 8 Z" fill="#FFD700"/>
              <circle cx="50" cy="10" r="2" fill="#8B4513"/>
              {/* Wise authoritative eyes */}
              <ellipse cx="44" cy="28" rx="3" ry="4" fill="#333"/>
              <ellipse cx="56" cy="28" rx="3" ry="4" fill="#333"/>
              <circle cx="45" cy="27" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="27" r="0.5" fill="#FFF"/>
              {/* Authoritative expression */}
              <path d="M 44 36 Q 50 39 56 36" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Master symbols */}
              <text x="50" y="92" fontSize="12" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="35" y="92" fontSize="8" fill="#87CEEB" textAnchor="middle">☰</text>
              <text x="65" y="92" fontSize="8" fill="#87CEEB" textAnchor="middle">☱</text>
              {/* Powerful aura */}
              <circle cx="50" cy="50" r="42" fill="url(#femaleAura1)"/>
              <circle cx="50" cy="50" r="48" fill="url(#femaleAura2)"/>
              {/* Energy particles */}
              <circle cx="28" cy="22" r="1.5" fill="#FFD700" opacity="0.8"/>
              <circle cx="72" cy="28" r="1.5" fill="#87CEEB" opacity="0.7"/>
              <circle cx="22" cy="58" r="1.5" fill="#4B0082" opacity="0.6"/>
              <circle cx="78" cy="63" r="1.5" fill="#DDA0DD" opacity="0.7"/>
            </>
          )}
        </svg>
      );
    } else {
      return (
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          {/* Background aura effect */}
          <defs>
            <radialGradient id="maleAura1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0.1"/>
            </radialGradient>
            <radialGradient id="maleAura2">
              <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#4169E1" stopOpacity="0.05"/>
            </radialGradient>
          </defs>
          
          {/* Young Cultivator - male_cultivator_1 */}
          {player.avatar === 'male_cultivator_1' && (
            <>
              {/* Elaborate robe with details */}
              <path d="M 25 75 Q 50 68 75 75 L 70 98 L 30 98 Z" fill="#2E7D32"/>
              <path d="M 25 75 Q 50 68 75 75 L 70 98 L 30 98 Z" fill="#4CAF50" opacity="0.6"/>
              {/* Robe trim */}
              <path d="M 30 80 L 70 80" stroke="#FFD700" strokeWidth="2"/>
              <path d="M 35 85 L 65 85" stroke="#FFD700" strokeWidth="1"/>
              {/* Belt */}
              <rect x="45" y="78" width="10" height="4" fill="#8B4513"/>
              <circle cx="50" cy="80" r="2" fill="#FFD700"/>
              {/* Head */}
              <circle cx="50" cy="35" r="15" fill="#FDBCB4"/>
              {/* Detailed hair */}
              <path d="M 35 30 Q 50 20 65 30 Q 62 25 50 22 Q 38 25 35 30" fill="#2C1810"/>
              <path d="M 40 25 Q 50 18 60 25" stroke="#4A4A4A" strokeWidth="1" fill="none"/>
              {/* Hair details */}
              <circle cx="45" cy="25" r="1" fill="#6B4423"/>
              <circle cx="55" cy="25" r="1" fill="#6B4423"/>
              {/* Eyes with detail */}
              <ellipse cx="43" cy="35" rx="2" ry="3" fill="#333"/>
              <ellipse cx="57" cy="35" rx="2" ry="3" fill="#333"/>
              <circle cx="44" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="58" cy="34" r="0.5" fill="#FFF"/>
              {/* Confident expression */}
              <path d="M 43 42 Q 50 45 57 42" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Cultivation symbols */}
              <text x="50" y="92" fontSize="8" fill="#FFD700" textAnchor="middle">☯</text>
              {/* Energy aura */}
              <circle cx="50" cy="50" r="38" fill="url(#maleAura1)"/>
              <circle cx="50" cy="50" r="42" fill="url(#maleAura2)"/>
            </>
          )}
          
          {/* Middle-aged Daoist - male_cultivator_2 */}
          {player.avatar === 'male_cultivator_2' && (
            <>
              {/* Traditional daoist robe */}
              <path d="M 28 72 Q 50 67 72 72 L 68 98 L 32 98 Z" fill="#1A237E"/>
              <path d="M 28 72 Q 50 67 72 72 L 68 98 L 32 98 Z" fill="#3949AB" opacity="0.7"/>
              {/* Robe patterns */}
              <path d="M 35 75 Q 50 73 65 75" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
              <path d="M 38 80 Q 50 78 62 80" stroke="#FFD700" strokeWidth="1" fill="none"/>
              <path d="M 40 85 Q 50 83 60 85" stroke="#FFD700" strokeWidth="1" fill="none"/>
              {/* Beard and mustache */}
              <path d="M 40 45 Q 50 48 60 45" stroke="#6B4423" strokeWidth="2" fill="none"/>
              <path d="M 35 40 Q 38 42 41 40" stroke="#6B4423" strokeWidth="1.5" fill="none"/>
              <path d="M 59 40 Q 62 42 65 40" stroke="#6B4423" strokeWidth="1.5" fill="none"/>
              {/* Head */}
              <circle cx="50" cy="30" r="16" fill="#FDBCB4"/>
              {/* Long hair with topknot */}
              <ellipse cx="50" cy="20" rx="14" ry="12" fill="#4A4A4A"/>
              <circle cx="50" cy="15" r="4" fill="#2C1810"/>
              <path d="M 46 15 L 54 15" stroke="#8B4513" strokeWidth="1"/>
              {/* Wise eyes */}
              <ellipse cx="44" cy="30" rx="2.5" ry="3" fill="#333"/>
              <ellipse cx="56" cy="30" rx="2.5" ry="3" fill="#333"/>
              <circle cx="45" cy="29" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="29" r="0.5" fill="#FFF"/>
              {/* Serene expression */}
              <path d="M 44 38 Q 50 41 56 38" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Daoist symbols */}
              <text x="50" y="92" fontSize="10" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="40" y="92" fontSize="6" fill="#87CEEB" textAnchor="middle">☰</text>
              <text x="60" y="92" fontSize="6" fill="#87CEEB" textAnchor="middle">☱</text>
              {/* Wisdom aura */}
              <circle cx="50" cy="50" r="40" fill="url(#maleAura1)"/>
              <circle cx="50" cy="50" r="45" fill="url(#maleAura2)"/>
            </>
          )}
          
          {/* Elder Immortal - male_cultivator_3 */}
          {player.avatar === 'male_cultivator_3' && (
            <>
              {/* Immortal robe with cloud patterns */}
              <path d="M 26 70 Q 50 65 74 70 L 70 98 L 30 98 Z" fill="#E8E8E8"/>
              <path d="M 26 70 Q 50 65 74 70 L 70 98 L 30 98 Z" fill="#F5F5F5" opacity="0.8"/>
              {/* Cloud patterns on robe */}
              <ellipse cx="40" cy="80" rx="8" ry="4" fill="#87CEEB" opacity="0.6"/>
              <ellipse cx="60" cy="85" rx="8" ry="4" fill="#87CEEB" opacity="0.6"/>
              <ellipse cx="50" cy="90" rx="6" ry="3" fill="#87CEEB" opacity="0.6"/>
              {/* Long white beard */}
              <path d="M 38 45 Q 50 52 62 45 Q 58 55 50 58 Q 42 55 38 45" fill="#F5F5F5"/>
              <path d="M 38 45 Q 50 52 62 45" stroke="#E0E0E0" strokeWidth="1" fill="none"/>
              {/* Head */}
              <circle cx="50" cy="28" r="17" fill="#F5DEB3"/>
              {/* Long flowing hair */}
              <ellipse cx="50" cy="18" rx="16" ry="14" fill="#F5F5F5"/>
              <path d="M 34 15 Q 50 8 66 15" stroke="#E0E0E0" strokeWidth="2" fill="none"/>
              <path d="M 36 20 Q 50 14 64 20" stroke="#E0E0E0" strokeWidth="1" fill="none"/>
              {/* Ancient eyes */}
              <ellipse cx="44" cy="28" rx="3" ry="4" fill="#4A4A4A"/>
              <ellipse cx="56" cy="28" rx="3" ry="4" fill="#4A4A4A"/>
              <circle cx="45" cy="27" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="27" r="0.5" fill="#FFF"/>
              {/* Wise expression */}
              <path d="M 44 36 Q 50 39 56 36" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Immortal symbols */}
              <text x="50" y="92" fontSize="12" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="35" y="92" fontSize="8" fill="#87CEEB" textAnchor="middle">☰</text>
              <text x="65" y="92" fontSize="8" fill="#87CEEB" textAnchor="middle">☱</text>
              {/* Divine aura */}
              <circle cx="50" cy="50" r="42" fill="url(#maleAura1)"/>
              <circle cx="50" cy="50" r="48" fill="url(#maleAura2)"/>
              {/* Floating particles */}
              <circle cx="30" cy="25" r="1" fill="#FFD700" opacity="0.8"/>
              <circle cx="70" cy="30" r="1" fill="#87CEEB" opacity="0.8"/>
              <circle cx="25" cy="60" r="1" fill="#FFD700" opacity="0.6"/>
              <circle cx="75" cy="65" r="1" fill="#87CEEB" opacity="0.6"/>
            </>
          )}
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
