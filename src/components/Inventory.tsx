import React from 'react';
import { Character } from '../types/game';

interface InventoryProps {
  character: Character;
  onUseItem: (itemId: string) => void;
  onSellItem: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ character, onUseItem, onSellItem }) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4 text-purple-900">Inventory</h3>
      
      <div className="bg-white bg-opacity-90 rounded-lg p-4">
        {character.inventory.length === 0 ? (
          <p className="text-center text-gray-500">Your inventory is empty</p>
        ) : (
          <div className="space-y-2">
            {character.inventory.map((itemId, index) => (
              <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                <span className="text-sm font-medium text-gray-800">
                  {itemId === 'potion1' && '🧪 Health Potion'}
                  {itemId === 'potion2' && '💧 Mana Potion'}
                  {itemId === 'potion3' && '✨ Full Heal Potion'}
                  {itemId.startsWith('sword') && '⚔️ Sword'}
                  {itemId.startsWith('staff') && '🔮 Staff'}
                  {itemId.startsWith('armor') && '🛡️ Armor'}
                  {!['potion1', 'potion2', 'potion3'].includes(itemId) && 
                   itemId.startsWith('sword') && '⚔️ ' + itemId.slice(-1)}
                  {!['potion1', 'potion2', 'potion3'].includes(itemId) && 
                   itemId.startsWith('staff') && '🔮 ' + itemId.slice(-1)}
                  {!['potion1', 'potion2', 'potion3'].includes(itemId) && 
                   itemId.startsWith('armor') && '🛡️ ' + itemId.slice(-1)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUseItem(itemId)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded hover:bg-blue-600 transition-colors"
                  >
                    🎯 Use
                  </button>
                  <button
                    onClick={() => onSellItem(itemId)}
                    className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600 transition-colors"
                  >
                    💰 Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
