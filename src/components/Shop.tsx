import React from 'react';
import { ShopItem } from '../types/game';

// Utility to get background color class based on rarity
function getRarityBg(rarity?: string) {
  switch (rarity) {
    case 'common': return 'bg-gray-100';
    case 'uncommon': return 'bg-green-100';
    case 'rare': return 'bg-blue-100';
    case 'epic': return 'bg-purple-200';
    case 'legendary': return 'bg-yellow-200';
    default: return 'bg-amber-50';
  }
}

import { getCultivatorLevelName } from '../types/game';

interface ShopProps {
  shopItems: ShopItem[];
  playerCoins: number;
  playerLevel: number;
  onBuyItem: (itemId: string) => void;
  onRefreshShop: () => void;
}

const Shop: React.FC<ShopProps> = ({ shopItems, playerCoins, playerLevel, onBuyItem, onRefreshShop }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-red-900" style={{ fontFamily: 'serif' }}>🏪 法宝阁</h3>
        <button
          onClick={onRefreshShop}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors border-2 border-purple-800"
        >
          🔄 刷新商品
        </button>
      </div>
      
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-4 mb-4 border border-amber-600">
        <div className="text-center mb-3">
          <span className="text-sm text-amber-700">
            修仙者等级: {playerLevel} | 
            <span className="font-bold text-red-900">
              {getCultivatorLevelName(playerLevel)}
            </span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item) => (
            <div key={item.id} className={`border-2 border-amber-600 rounded-lg p-3 hover:shadow-md transition-shadow ${getRarityBg(item.equipmentData?.rarity)}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-red-900" style={{ fontFamily: 'serif' }}>{item.name}</h4>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded border border-red-300">
                  法宝
                </span>
              </div>
              
              <p className="text-sm text-amber-800 mb-2">{item.description}</p>
              <p className="text-xs text-green-700 font-semibold mb-3">{item.effect}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-amber-700">{item.price} 🪙</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onBuyItem(item.id)}
                  disabled={playerCoins < item.price}
                  className={`flex-1 px-3 py-2 text-white font-bold rounded transition-colors border-2 ${
                    playerCoins >= item.price
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-amber-800'
                      : 'bg-gray-400 cursor-not-allowed border-gray-500'
                  }`}
                >
                  🏪 购买
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
