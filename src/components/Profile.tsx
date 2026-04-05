import React from 'react';
import { Character } from '../types/game';

interface Avatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
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
      description: '朝气蓬勃的年轻修士'
    },
    {
      id: 'male_cultivator_2', 
      name: '中年道长',
      gender: 'male',
      description: '稳重的中年道长'
    },
    {
      id: 'male_cultivator_3',
      name: '老神仙',
      gender: 'male', 
      description: '仙风道骨的老神仙'
    },
    {
      id: 'female_cultivator_1',
      name: '年轻女修',
      gender: 'female',
      description: '清秀可人的年轻女修'
    },
    {
      id: 'female_cultivator_2',
      name: '仙女',
      gender: 'female',
      description: '飘逸出尘的仙女'
    },
    {
      id: 'female_cultivator_3',
      name: '女道尊',
      gender: 'female',
      description: '威严的女道尊'
    }
  ];

  const renderAvatar = (avatar: Avatar, isSelected: boolean) => {
    const scale = isSelected ? 1.1 : 1;
    
    if (avatar.gender === 'male') {
      return (
        <svg className="w-24 h-24" viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }}>
          {/* Robe */}
          <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#8B4513"/>
          <path d="M 30 70 Q 50 65 70 70 L 65 95 L 35 95 Z" fill="#D2691E" opacity="0.7"/>
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="#fdbcb4"/>
          {/* Hair - varies by avatar */}
          {avatar.id === 'male_cultivator_1' && (
            <>
              <circle cx="50" cy="25" r="8" fill="#2c1810"/>
              <circle cx="50" cy="20" r="5" fill="#2c1810"/>
            </>
          )}
          {avatar.id === 'male_cultivator_2' && (
            <>
              <ellipse cx="50" cy="25" rx="10" ry="8" fill="#4a4a4a"/>
              <path d="M 40 20 Q 50 15 60 20" stroke="#2c1810" strokeWidth="2" fill="none"/>
            </>
          )}
          {avatar.id === 'male_cultivator_3' && (
            <>
              <ellipse cx="50" cy="22" rx="12" ry="10" fill="#e8e8e8"/>
              <path d="M 38 18 Q 50 12 62 18" stroke="#d0d0d0" strokeWidth="2" fill="none"/>
            </>
          )}
          {/* Eyes */}
          <circle cx="42" cy="38" r="2" fill="#333"/>
          <circle cx="58" cy="38" r="2" fill="#333"/>
          {/* Expression */}
          <path d="M 42 48 Q 50 52 58 48" stroke="#333" strokeWidth="1.5" fill="none"/>
          {/* Aura */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.3"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-24 h-24" viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }}>
          {/* Robe */}
          <path d="M 25 70 Q 50 62 75 70 L 70 95 L 30 95 Z" fill="#ff69b4"/>
          <path d="M 25 70 Q 50 62 75 70 L 70 95 L 30 95 Z" fill="#ffb6c1" opacity="0.7"/>
          {/* Head */}
          <circle cx="50" cy="38" r="17" fill="#fdbcb4"/>
          {/* Hair - varies by avatar */}
          {avatar.id === 'female_cultivator_1' && (
            <>
              <ellipse cx="50" cy="25" rx="15" ry="12" fill="#8B4513"/>
              <path d="M 35 20 Q 50 15 65 20" stroke="#654321" strokeWidth="2" fill="none"/>
              <circle cx="45" cy="28" r="3" fill="#FFB6C1"/>
              <circle cx="55" cy="28" r="3" fill="#FFB6C1"/>
            </>
          )}
          {avatar.id === 'female_cultivator_2' && (
            <>
              <path d="M 35 20 Q 50 10 65 20 L 65 35 Q 50 40 35 35 Z" fill="#4B0082"/>
              <circle cx="50" cy="25" r="2" fill="#FFD700"/>
              <circle cx="45" cy="30" r="1.5" fill="#FFB6C1"/>
              <circle cx="55" cy="30" r="1.5" fill="#FFB6C1"/>
            </>
          )}
          {avatar.id === 'female_cultivator_3' && (
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
    }
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
