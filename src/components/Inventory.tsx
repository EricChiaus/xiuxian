import React from 'react';
import { Character } from '../types/game';

interface InventoryProps {
  character: Character;
  onUseItem: (itemId: string) => void;
  onSellItem: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ character, onUseItem, onSellItem }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>📜 藏宝阁</h3>
      
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-4 border border-amber-600">
        {character.inventory && character.inventory.length > 0 ? (
          <div className="space-y-2">
            {character.inventory.map((itemId, index) => (
              <div key={index} className="flex justify-between items-center p-3 border-2 border-amber-600 rounded bg-gradient-to-r from-amber-50 to-orange-50">
                <span className="text-sm font-medium text-red-900" style={{ fontFamily: 'serif' }}>
                  {itemId === 'sword1' && '⚔️ 铁剑'}
                  {itemId === 'sword2' && '⚔️ 钢剑'}
                  {itemId === 'staff1' && '🔮 木杖'}
                  {itemId === 'staff2' && '🔮 水晶杖'}
                  {itemId === 'armor1' && '🛡️ 皮甲'}
                  {itemId === 'armor2' && '🛡️ 铁甲'}
                  {itemId === 'armor3' && '👘 道袍'}
                  {itemId === 'armor4' && '� 法袍'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUseItem(itemId)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded hover:from-blue-700 hover:to-purple-700 transition-colors border-2 border-blue-800"
                  >
                    🎯 装备
                  </button>
                  <button
                    onClick={() => onSellItem(itemId)}
                    className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded hover:from-red-700 hover:to-red-800 transition-colors border-2 border-red-800"
                  >
                    💰 出售
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-amber-700 font-semibold">藏宝阁空空如也</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
