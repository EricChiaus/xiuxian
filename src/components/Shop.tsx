import React from 'react';
import { ShopItem } from '../types/game';

interface ShopProps {
  shopItems: ShopItem[];
  playerCoins: number;
  onBuyItem: (itemId: string) => void;
}

const Shop: React.FC<ShopProps> = ({ shopItems, playerCoins, onBuyItem }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4 text-blue-900">Shop</h3>
      
      <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item) => (
            <div key={item.id} className="border border-gray-300 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {item.type === 'equipment' ? 'EQUIP' : 'USE'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-xs text-green-600 font-semibold mb-3">{item.effect}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-blue-600">{item.price} 🪙</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onBuyItem(item.id)}
                  disabled={playerCoins < item.price}
                  className={`flex-1 px-3 py-2 text-white font-bold rounded transition-colors ${
                    playerCoins >= item.price
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  🛒 Buy
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
