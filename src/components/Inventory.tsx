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
        {character.inventory && character.inventory.length > 0 ? (
          <div className="space-y-2">
            {character.inventory.map((itemId, index) => (
              <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                <span className="text-sm font-medium text-gray-800">
                  {itemId === 'sword1' && '⚔️ Iron Sword'}
                  {itemId === 'sword2' && '⚔️ Steel Sword'}
                  {itemId === 'staff1' && '🔮 Wooden Staff'}
                  {itemId === 'staff2' && '🔮 Crystal Staff'}
                  {itemId === 'armor1' && '🛡️ Leather Armor'}
                  {itemId === 'armor2' && '🛡️ Iron Armor'}
                  {itemId === 'armor3' && '�️ Robe'}
                  {itemId === 'armor4' && '🛡️ Enchanted Robe'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUseItem(itemId)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded hover:bg-blue-600 transition-colors"
                  >
                    🎯 Equip
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
        ) : (
          <p className="text-center text-gray-500">Your inventory is empty</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
