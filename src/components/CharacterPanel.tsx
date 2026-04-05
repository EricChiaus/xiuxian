import React from 'react';
import { Character } from '../types/game';
import PowerDisplay from './PowerDisplay';

interface CharacterPanelProps {
  player: Character;
  onLevelUp: () => void;
  canLevelUp: boolean;
}

const CharacterPanel: React.FC<CharacterPanelProps> = ({ player, onLevelUp, canLevelUp }) => {
  const hpPercent = (player.hp / player.maxHp) * 100;
  const mpPercent = (player.mp / player.maxMp) * 100;
  const expPercent = (player.exp / player.expToNext) * 100;

  const avatarImages: Record<string, string> = {
    'male_cultivator_1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=young-cultivator&backgroundColor=b6e3f4',
    'male_cultivator_2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=taoist-master&backgroundColor=c0aede',
    'male_cultivator_3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=immortal-master&backgroundColor=d1d4f9',
    'female_cultivator_1': 'https://api.dicebear.com/7.x/avataaars/svg?seed=female-cultivator&backgroundColor=ffdfbf',
    'female_cultivator_2': 'https://api.dicebear.com/7.x/avataaars/svg?seed=fairy-immortal&backgroundColor=ffd5dc',
    'female_cultivator_3': 'https://api.dicebear.com/7.x/avataaars/svg?seed=female-master&backgroundColor=ffdfd2'
  };

  const renderAvatar = () => {
    const imageUrl = avatarImages[player.avatar] || avatarImages['male_cultivator_1'];
    const isFemale = player.avatar.includes('female');
    const level = player.avatar.includes('1') ? '初' : player.avatar.includes('2') ? '中' : '高';
    
    return (
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg">
        <img 
          src={imageUrl} 
          alt="Player Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a colored div if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-white font-bold text-xl" 
                     style="background: ${isFemale ? 'linear-gradient(135deg, #FF69B4, #C71585)' : 'linear-gradient(135deg, #2E7D32, #1B5E20)'}">
                  ${player.avatar.charAt(0).toUpperCase()}
                </div>
              `;
            }
          }}
        />
        
        {/* Level indicator */}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs px-1 py-0.5 rounded-bl font-bold">
          {level}
        </div>
        
        {/* Gender indicator */}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded-tr">
          {isFemale ? '女' : '男'}
        </div>
        
        {/* Aura effect */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-30 animate-pulse"></div>
      </div>
    );
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

      {/* Powers Display */}
      <PowerDisplay
        powers={player.powers}
        powerResistance={player.powerResistance}
        title="修仙者之力"
        showResistance={true}
      />

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
