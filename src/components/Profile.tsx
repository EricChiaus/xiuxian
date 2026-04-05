import React from 'react';
import { Character } from '../types/game';

interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  imageUrl: string;
}

interface ProfileProps {
  character: Character;
  currentAvatar: string;
  onAvatarChange: (avatarId: string) => void;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ character, currentAvatar, onAvatarChange, onClose }) => {
  const avatars: Avatar[] = [
    {
      id: 'male_cultivator_1',
      name: '年轻修士',
      gender: 'male',
      description: '朝气蓬勃的年轻修士',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=young-cultivator&backgroundColor=b6e3f4'
    },
    {
      id: 'male_cultivator_2', 
      name: '中年道长',
      gender: 'male',
      description: '稳重的中年道长',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taoist-master&backgroundColor=c0aede'
    },
    {
      id: 'male_cultivator_3',
      name: '老神仙',
      gender: 'male', 
      description: '仙风道骨的老神仙',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=immortal-master&backgroundColor=d1d4f9'
    },
    {
      id: 'female_cultivator_1',
      name: '年轻女修',
      gender: 'female',
      description: '清秀可人的年轻女修',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female-cultivator&backgroundColor=ffdfbf'
    },
    {
      id: 'female_cultivator_2',
      name: '仙女',
      gender: 'female',
      description: '飘逸出尘的仙女',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fairy-immortal&backgroundColor=ffd5dc'
    },
    {
      id: 'female_cultivator_3',
      name: '女道尊',
      gender: 'female',
      description: '威严的女道尊',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female-master&backgroundColor=ffdfd2'
    }
  ];

  const renderAvatar = (avatar: Avatar, isSelected: boolean) => {
    const scale = isSelected ? 1.1 : 1;
    
    return (
      <div 
        className="relative w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300"
        style={{ 
          transform: `scale(${scale})`,
          borderColor: isSelected ? '#FFD700' : '#8B4513',
          boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
          background: `linear-gradient(135deg, ${avatar.gender === 'male' ? '#2E7D32' : '#FF69B4'}, ${avatar.gender === 'male' ? '#1B5E20' : '#C71585'})`
        }}
      >
        {/* Avatar Image with cultivation theme */}
        <div className="relative w-full h-full">
          <img 
            src={avatar.imageUrl} 
            alt={avatar.name}
            className="w-full h-full object-cover"
            style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
            onError={(e) => {
              // Fallback to a themed div if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-white font-bold text-2xl" 
                       style="background: ${avatar.gender === 'male' ? 'linear-gradient(135deg, #2E7D32, #1B5E20)' : 'linear-gradient(135deg, #FF69B4, #C71585)'}">
                    ${avatar.name.charAt(0)}
                  </div>
                `;
              }
            }}
          />
          
          {/* Cultivation-themed overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-opacity-20 text-4xl font-bold" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
              {avatar.gender === 'male' ? '☯' : '✦'}
            </div>
          </div>
          
          {/* Energy aura effect */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-30 animate-pulse pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs border-2 border-yellow-600">
            ✓
          </div>
        )}
        
        {/* Gender indicator */}
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded-tl">
          {avatar.gender === 'male' ? '男' : '女'}
        </div>
        
        {/* Cultivation level indicator */}
        <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs px-1 py-0.5 rounded-br font-bold">
          {avatar.id.includes('1') ? '初' : avatar.id.includes('2') ? '中' : '高'}
        </div>
        
        {/* Cultivation type indicator */}
        <div className="absolute top-2 left-2 text-white text-xs opacity-60 font-bold">
          {avatar.id.includes('cultivator') ? '修' : avatar.id.includes('taoist') ? '道' : '仙'}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto border-4 border-amber-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-900" style={{ fontFamily: 'serif' }}>👤 修仙档案</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 text-3xl font-bold bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-amber-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Character Info */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6 border-2 border-amber-600">
          <h3 className="text-xl font-bold text-red-900 mb-3" style={{ fontFamily: 'serif' }}>当前修仙者</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              {renderAvatar(avatars.find(a => a.id === currentAvatar) || avatars[0], false)}
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-800">境界: {character.level}</div>
              <div className="text-sm text-amber-700">生命元气: {character.hp}/{character.maxHp}</div>
              <div className="text-sm text-amber-700">灵力: {character.mp}/{character.maxMp}</div>
              <div className="text-sm text-amber-700">修为: {character.exp}/{character.expToNext}</div>
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <h3 className="text-xl font-bold text-red-900 mb-4" style={{ fontFamily: 'serif' }}>选择化身</h3>
          <div className="grid grid-cols-3 gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => onAvatarChange(avatar.id)}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:scale-105 ${
                  currentAvatar === avatar.id
                    ? 'border-red-600 bg-gradient-to-br from-red-50 to-orange-50'
                    : 'border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-red-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  {renderAvatar(avatar, currentAvatar === avatar.id)}
                  <h4 className="text-sm font-bold text-red-900 mt-2" style={{ fontFamily: 'serif' }}>
                    {avatar.name}
                  </h4>
                  <p className="text-xs text-amber-700 text-center">{avatar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
