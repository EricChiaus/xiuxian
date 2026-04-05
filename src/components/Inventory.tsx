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
          <div className="space-y-3">
            {character.inventory.map((itemId, index) => (
              <div key={index} className="flex justify-between items-center p-4 border-2 border-amber-600 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16">
                    {/* Item icon */}
                    {itemId.includes('sword') && (
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <rect x="45" y="10" width="10" height="60" fill="#8B4513"/>
                        <rect x="40" y="5" width="20" height="10" fill="#654321"/>
                        <circle cx="50" cy="80" r="8" fill="#FFD700"/>
                      </svg>
                    )}
                    {itemId.includes('staff') && (
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <rect x="48" y="20" width="4" height="60" fill="#8B4513"/>
                        <circle cx="50" cy="20" r="8" fill="#4B0082"/>
                        <circle cx="50" cy="20" r="4" fill="#FFD700"/>
                      </svg>
                    )}
                    {itemId.includes('armor') && (
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path d="M 30 30 L 70 30 L 70 70 L 30 70 Z" fill="#708090"/>
                        <path d="M 25 25 L 75 25 L 75 75 L 25 75 Z" fill="#708090" opacity="0.3"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-900" style={{ fontFamily: 'serif' }}>
                      {itemId === 'sword1' && '⚔️ 铁剑'}
                      {itemId === 'sword2' && '⚔️ 钢剑'}
                      {itemId === 'staff1' && '🔮 木杖'}
                      {itemId === 'staff2' && '🔮 水晶杖'}
                      {itemId === 'armor1' && '🛡️ 皮甲'}
                      {itemId === 'armor2' && '🛡️ 铁甲'}
                      {itemId === 'armor3' && '👘 道袍'}
                      {itemId === 'armor4' && '👘 法袍'}
                    </div>
                    <div className="text-sm text-amber-700">
                      {itemId === 'sword1' && '+5 攻击力'}
                      {itemId === 'sword2' && '+10 攻击力'}
                      {itemId === 'staff1' && '+5 法术攻击'}
                      {itemId === 'staff2' && '+12 法术攻击'}
                      {itemId === 'armor1' && '+3 防御力'}
                      {itemId === 'armor2' && '+6 防御力'}
                      {itemId === 'armor3' && '+4 抗法'}
                      {itemId === 'armor4' && '+8 抗法'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUseItem(itemId)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors border-2 border-blue-800"
                  >
                    🎯 装备
                  </button>
                  <button
                    onClick={() => onSellItem(itemId)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-colors border-2 border-red-800"
                  >
                    💰 出售
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-amber-700 font-semibold text-lg">藏宝阁空空如也</p>
        )}
      </div>
      
      {/* Equipped Items Section */}
      <div className="mt-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border-2 border-red-600">
        <h4 className="text-lg font-bold text-red-900 mb-3" style={{ fontFamily: 'serif' }}>🎯 当前装备</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-amber-800 font-semibold">武器:</span>
            <span className="text-red-900">
              {character.equippedItems.weapon ? (
                <>
                  {character.equippedItems.weapon === 'sword1' && '⚔️ 铁剑'}
                  {character.equippedItems.weapon === 'sword2' && '⚔️ 钢剑'}
                  {character.equippedItems.weapon === 'staff1' && '🔮 木杖'}
                  {character.equippedItems.weapon === 'staff2' && '🔮 水晶杖'}
                </>
              ) : (
                <span className="text-gray-500">未装备</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-800 font-semibold">护甲:</span>
            <span className="text-red-900">
              {character.equippedItems.armor ? (
                <>
                  {character.equippedItems.armor === 'armor1' && '🛡️ 皮甲'}
                  {character.equippedItems.armor === 'armor2' && '🛡️ 铁甲'}
                  {character.equippedItems.armor === 'armor3' && '👘 道袍'}
                  {character.equippedItems.armor === 'armor4' && '👘 法袍'}
                </>
              ) : (
                <span className="text-gray-500">未装备</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
