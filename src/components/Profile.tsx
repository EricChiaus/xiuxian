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
          {avatar.id === 'male_cultivator_1' && (
            <>
              {/* Enhanced background with multiple layers */}
              <defs>
                <radialGradient id="youngCultivatorBg">
                  <stop offset="0%" stopColor="#E8F5E8"/>
                  <stop offset="100%" stopColor="#C8E6C9"/>
                </radialGradient>
                <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E7D32"/>
                  <stop offset="50%" stopColor="#388E3C"/>
                  <stop offset="100%" stopColor="#1B5E20"/>
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle cx="50" cy="50" r="48" fill="url(#youngCultivatorBg)" opacity="0.3"/>
              
              {/* Enhanced robe with 3D effect */}
              <path d="M 25 75 Q 50 68 75 75 L 70 98 L 30 98 Z" fill="url(#robeGradient)"/>
              <path d="M 25 75 Q 50 68 75 75 L 70 98 L 30 98 Z" fill="#4CAF50" opacity="0.4"/>
              {/* Robe shadow */}
              <path d="M 28 78 Q 50 71 72 78 L 68 95 L 32 95 Z" fill="#1B5E20" opacity="0.3"/>
              
              {/* Detailed robe patterns */}
              <path d="M 30 80 L 70 80" stroke="#FFD700" strokeWidth="2"/>
              <path d="M 35 85 L 65 85" stroke="#FFF" strokeWidth="1"/>
              <path d="M 37 90 L 63 90" stroke="#FFD700" strokeWidth="1"/>
              {/* Decorative embroidery */}
              <circle cx="40" cy="82" r="1" fill="#FFD700"/>
              <circle cx="60" cy="82" r="1" fill="#FFD700"/>
              <circle cx="45" cy="87" r="0.5" fill="#FFF"/>
              <circle cx="55" cy="87" r="0.5" fill="#FFF"/>
              
              {/* Enhanced belt */}
              <rect x="45" y="78" width="10" height="4" fill="#8B4513"/>
              <rect x="45" y="78" width="10" height="1" fill="#D2691E"/>
              <circle cx="50" cy="80" r="2" fill="#FFD700"/>
              <circle cx="50" cy="80" r="1" fill="#FFF"/>
              
              {/* Improved head with skin tones */}
              <circle cx="50" cy="35" r="15" fill="#FDBCB4"/>
              <ellipse cx="50" cy="35" rx="14" ry="15" fill="#F5DEB3" opacity="0.5"/>
              
              {/* Enhanced hair with layers */}
              <path d="M 35 30 Q 50 20 65 30 Q 62 25 50 22 Q 38 25 35 30" fill="#2C1810"/>
              <path d="M 36 28 Q 50 19 64 28" stroke="#4A4A4A" strokeWidth="1" fill="none"/>
              {/* Hair highlights */}
              <path d="M 40 25 Q 50 18 60 25" stroke="#6B4423" strokeWidth="0.5" fill="none"/>
              {/* Hair texture */}
              <circle cx="45" cy="25" r="1" fill="#6B4423"/>
              <circle cx="55" cy="25" r="1" fill="#6B4423"/>
              <circle cx="42" cy="27" r="0.5" fill="#8B4513"/>
              <circle cx="58" cy="27" r="0.5" fill="#8B4513"/>
              
              {/* Enhanced eyes with depth */}
              <ellipse cx="43" cy="35" rx="2" ry="3" fill="#333"/>
              <ellipse cx="57" cy="35" rx="2" ry="3" fill="#333"/>
              {/* Eye highlights */}
              <circle cx="44" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="58" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="43" cy="36" r="0.3" fill="#87CEEB" opacity="0.6"/>
              <circle cx="57" cy="36" r="0.3" fill="#87CEEB" opacity="0.6"/>
              
              {/* Improved facial features */}
              <path d="M 43 42 Q 50 45 57 42" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Nose shadow */}
              <path d="M 50 38 L 50 40" stroke="#D2B48C" strokeWidth="1" opacity="0.5"/>
              
              {/* Enhanced cultivation symbols */}
              <text x="50" y="92" fontSize="8" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="50" y="92" fontSize="6" fill="#FFF" textAnchor="middle">☯</text>
              
              {/* Multi-layered energy aura */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#87CEEB" strokeWidth="0.5" opacity="0.2"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#4CAF50" strokeWidth="0.3" opacity="0.3"/>
              
              {/* Floating energy particles */}
              <circle cx="30" cy="25" r="1" fill="#FFD700" opacity="0.8"/>
              <circle cx="70" cy="30" r="1" fill="#87CEEB" opacity="0.6"/>
              <circle cx="25" cy="60" r="1" fill="#4CAF50" opacity="0.7"/>
              <circle cx="75" cy="65" r="1" fill="#FFD700" opacity="0.5"/>
              <circle cx="35" cy="70" r="0.5" fill="#87CEEB" opacity="0.8"/>
              <circle cx="65" cy="20" r="0.5" fill="#4CAF50" opacity="0.6"/>
            </>
          )}
          
          {/* Middle-aged Daoist - male_cultivator_2 */}
          {avatar.id === 'male_cultivator_2' && (
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
          {avatar.id === 'male_cultivator_3' && (
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
    } else {
      return (
        <svg className="w-24 h-24" viewBox="0 0 100 100" style={{ transform: `scale(${scale})` }}>
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
          {avatar.id === 'female_cultivator_1' && (
            <>
              {/* Enhanced background with feminine gradients */}
              <defs>
                <radialGradient id="youngFemaleBg">
                  <stop offset="0%" stopColor="#FFF0F5"/>
                  <stop offset="100%" stopColor="#FFE4E1"/>
                </radialGradient>
                <linearGradient id="dressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF69B4"/>
                  <stop offset="50%" stopColor="#FF1493"/>
                  <stop offset="100%" stopColor="#C71585"/>
                </linearGradient>
                <radialGradient id="flowerPetal">
                  <stop offset="0%" stopColor="#FFB6C1"/>
                  <stop offset="100%" stopColor="#FF69B4"/>
                </radialGradient>
              </defs>
              
              {/* Background circle */}
              <circle cx="50" cy="50" r="48" fill="url(#youngFemaleBg)" opacity="0.3"/>
              
              {/* Enhanced dress with 3D effect */}
              <path d="M 28 72 Q 50 65 72 72 L 68 98 L 32 98 Z" fill="url(#dressGradient)"/>
              <path d="M 28 72 Q 50 65 72 72 L 68 98 L 32 98 Z" fill="#FFB6C1" opacity="0.4"/>
              {/* Dress shadow */}
              <path d="M 31 75 Q 50 68 69 75 L 65 95 L 35 95 Z" fill="#C71585" opacity="0.3"/>
              
              {/* Detailed dress patterns */}
              <path d="M 32 75 L 68 75" stroke="#FFD700" strokeWidth="2"/>
              <path d="M 35 80 L 65 80" stroke="#FFF" strokeWidth="1"/>
              <path d="M 37 85 L 63 85" stroke="#FFD700" strokeWidth="1"/>
              <path d="M 39 90 L 61 90" stroke="#FFF" strokeWidth="0.5"/>
              {/* Decorative embroidery */}
              <circle cx="40" cy="77" r="1" fill="#FFD700"/>
              <circle cx="60" cy="77" r="1" fill="#FFD700"/>
              <circle cx="45" cy="82" r="0.5" fill="#FFF"/>
              <circle cx="55" cy="82" r="0.5" fill="#FFF"/>
              <circle cx="42" cy="87" r="0.5" fill="#FFD700"/>
              <circle cx="58" cy="87" r="0.5" fill="#FFD700"/>
              
              {/* Enhanced belt */}
              <rect x="45" y="73" width="10" height="3" fill="#8B4513"/>
              <rect x="45" y="73" width="10" height="1" fill="#D2691E"/>
              <circle cx="50" cy="74.5" r="1.5" fill="#FFD700"/>
              <circle cx="50" cy="74.5" r="0.8" fill="#FFF"/>
              
              {/* Improved head with skin tones */}
              <circle cx="50" cy="35" r="16" fill="#FDBCB4"/>
              <ellipse cx="50" cy="35" rx="15" ry="16" fill="#F5DEB3" opacity="0.5"/>
              
              {/* Enhanced long hair with layers */}
              <path d="M 34 28 Q 50 18 66 28 Q 64 22 50 19 Q 36 22 34 28" fill="#4A4A4A"/>
              <path d="M 32 35 Q 30 40 32 45" stroke="#4A4A4A" strokeWidth="3" fill="none"/>
              <path d="M 68 35 Q 70 40 68 45" stroke="#4A4A4A" strokeWidth="3" fill="none"/>
              {/* Hair highlights */}
              <path d="M 36 30 Q 50 20 64 30" stroke="#6B4423" strokeWidth="1" fill="none"/>
              <path d="M 33 38 Q 31 42 33 46" stroke="#8B4513" strokeWidth="1" fill="none"/>
              <path d="M 67 38 Q 69 42 67 46" stroke="#8B4513" strokeWidth="1" fill="none"/>
              {/* Hair texture */}
              <circle cx="40" cy="25" r="1.5" fill="#6B4423"/>
              <circle cx="60" cy="25" r="1.5" fill="#6B4423"/>
              <circle cx="45" cy="30" r="0.5" fill="#8B4513"/>
              <circle cx="55" cy="30" r="0.5" fill="#8B4513"/>
              
              {/* Enhanced hair accessories */}
              <circle cx="40" cy="25" r="2" fill="#FFD700"/>
              <circle cx="60" cy="25" r="2" fill="#FFD700"/>
              <circle cx="40" cy="25" r="1" fill="#FFA500"/>
              <circle cx="60" cy="25" r="1" fill="#FFA500"/>
              <path d="M 40 25 L 60 25" stroke="#8B4513" strokeWidth="1"/>
              {/* Hair pins */}
              <circle cx="45" cy="23" r="0.5" fill="#FF69B4"/>
              <circle cx="55" cy="23" r="0.5" fill="#FF69B4"/>
              
              {/* Enhanced beautiful eyes */}
              <ellipse cx="44" cy="35" rx="2.5" ry="3.5" fill="#333"/>
              <ellipse cx="56" cy="35" rx="2.5" ry="3.5" fill="#333"/>
              {/* Eye highlights */}
              <circle cx="45" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="57" cy="34" r="0.5" fill="#FFF"/>
              <circle cx="44" cy="36" r="0.3" fill="#87CEEB" opacity="0.6"/>
              <circle cx="56" cy="36" r="0.3" fill="#87CEEB" opacity="0.6"/>
              {/* Eyelashes */}
              <path d="M 42 33 L 41 31" stroke="#333" strokeWidth="0.5"/>
              <path d="M 46 33 L 47 31" stroke="#333" strokeWidth="0.5"/>
              <path d="M 54 33 L 53 31" stroke="#333" strokeWidth="0.5"/>
              <path d="M 58 33 L 59 31" stroke="#333" strokeWidth="0.5"/>
              
              {/* Improved facial features */}
              <path d="M 43 43 Q 50 47 57 43" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
              {/* Nose shadow */}
              <path d="M 50 38 L 50 40" stroke="#D2B48C" strokeWidth="1" opacity="0.5"/>
              {/* Blush */}
              <circle cx="38" cy="40" r="2" fill="#FFB6C1" opacity="0.3"/>
              <circle cx="62" cy="40" r="2" fill="#FFB6C1" opacity="0.3"/>
              
              {/* Enhanced cultivation symbols */}
              <text x="50" y="92" fontSize="8" fill="#FFD700" textAnchor="middle">☯</text>
              <text x="50" y="92" fontSize="6" fill="#FFF" textAnchor="middle">☯</text>
              
              {/* Multi-layered feminine aura */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB6C1" strokeWidth="0.5" opacity="0.2"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#FF69B4" strokeWidth="0.3" opacity="0.3"/>
              
              {/* Enhanced floating flower petals */}
              <ellipse cx="30" cy="25" rx="3" ry="1.5" fill="url(#flowerPetal)" opacity="0.8" transform="rotate(45 30 25)"/>
              <ellipse cx="70" cy="30" rx="3" ry="1.5" fill="url(#flowerPetal)" opacity="0.7" transform="rotate(-45 70 30)"/>
              <ellipse cx="25" cy="60" rx="3" ry="1.5" fill="url(#flowerPetal)" opacity="0.6" transform="rotate(30 25 60)"/>
              <ellipse cx="75" cy="65" rx="3" ry="1.5" fill="url(#flowerPetal)" opacity="0.7" transform="rotate(-30 75 65)"/>
              <ellipse cx="35" cy="20" rx="2" ry="1" fill="#FFB6C1" opacity="0.6" transform="rotate(60 35 20)"/>
              <ellipse cx="65" cy="70" rx="2" ry="1" fill="#FF69B4" opacity="0.6" transform="rotate(-60 65 70)"/>
              
              {/* Sparkle effects */}
              <circle cx="28" cy="35" r="0.5" fill="#FFD700" opacity="0.9"/>
              <circle cx="72" cy="40" r="0.5" fill="#FFD700" opacity="0.8"/>
              <circle cx="45" cy="15" r="0.5" fill="#87CEEB" opacity="0.7"/>
              <circle cx="55" cy="75" r="0.5" fill="#87CEEB" opacity="0.8"/>
            </>
          )}
          
          {/* Fairy - female_cultivator_2 */}
          {avatar.id === 'female_cultivator_2' && (
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
          {avatar.id === 'female_cultivator_3' && (
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
