import React, { useState } from 'react';
import { Character, Equipment, getRarityName, getRarityColor, getEquipmentTypeName, getElementName } from '../types/game';
import { getComparisonRows, getItemDetailLines } from '../utils/inventoryDisplay';

interface InventoryProps {
  character: Character;
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (itemId: string) => void;
  onSellItem: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ character, onEquipItem, onUnequipItem, onSellItem }) => {
  const [hoveredItem, setHoveredItem] = useState<{ id: string; type: 'item' | 'equip' | 'sell' } | null>(null);

  // Check if item is equipped
  const isItemEquipped = (itemId: string): boolean => {
    const equipment = character.inventory.find(eq => eq.id === itemId);
    return equipment?.equipped || false;
  };

  // Get currently equipped equipment of the same type
  const getEquippedEquipmentByType = (type: Equipment['type'] | 'accessory2'): Equipment | undefined => {
    if (type === 'accessory2') {
      // For the second accessory slot, find the second equipped accessory
      const equippedAccessories = character.inventory.filter(eq => eq.equipped && eq.type === 'accessory');
      return equippedAccessories[1]; // Return the second accessory
    }
    return character.inventory.find(eq => eq.equipped && eq.type === type);
  };

  // Get equipment icon based on type
  const getEquipmentIcon = (type: Equipment['type']) => {
    const icons = {
      weapon: '⚔️',
      armor: '🛡️',
      helmet: '🎯',
      boots: '👢',
      ring: '💍',
      necklace: '📿',
      accessory: '🧿'
    };
    return icons[type] || '📦';
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-amber-700 max-w-7xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6 text-red-900" style={{ fontFamily: 'serif' }}>📜 藏宝阁</h3>
      
      {/* Equipped Items Section */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-6 border border-amber-600 mb-6">
        <h4 className="text-xl font-bold text-red-900 mb-4" style={{ fontFamily: 'serif' }}>⚔️ 装备栏</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['weapon', 'armor', 'helmet', 'boots', 'ring', 'necklace', 'accessory', 'accessory2'].map(type => {
            const equippedItem = getEquippedEquipmentByType(type as Equipment['type']);
            return (
              <div 
                key={type}
                className="p-4 border-2 rounded-lg transition-all relative"
                style={{ 
                  backgroundColor: equippedItem ? getRarityColor(equippedItem.rarity) + '20' : '#f3f4f6',
                  borderColor: equippedItem ? getRarityColor(equippedItem.rarity) : '#9ca3af'
                }}
                onMouseEnter={() => equippedItem && setHoveredItem({ id: equippedItem.id, type: 'item' })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {getEquipmentIcon(type as Equipment['type'])}
                  </div>
                  <div className="text-sm font-bold text-gray-700 mb-1">
                    {getEquipmentTypeName(type as Equipment['type'])}
                  </div>
                  {equippedItem ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">
                          {getEquipmentIcon(equippedItem.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-xs font-bold px-2 py-1 rounded text-white"
                              style={{ backgroundColor: getRarityColor(equippedItem.rarity) }}
                            >
                              {getRarityName(equippedItem.rarity)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {getEquipmentTypeName(equippedItem.type)}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-red-900" style={{ fontFamily: 'serif' }}>
                            {equippedItem.name}
                          </div>
                          <div className="text-xs text-amber-700">
                            等级 {equippedItem.level}
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-xs text-gray-700 mt-2">
                        {equippedItem.bonus?.pa && <div>物攻 +{equippedItem.bonus.pa}</div>}
                        {equippedItem.bonus?.ma && <div>魔攻 +{equippedItem.bonus.ma}</div>}
                        {equippedItem.bonus?.pd && <div>物防 +{equippedItem.bonus.pd}</div>}
                        {equippedItem.bonus?.md && <div>魔防 +{equippedItem.bonus.md}</div>}
                        {equippedItem.bonus?.maxHp && <div>生命 +{equippedItem.bonus.maxHp}</div>}
                        {equippedItem.bonus?.maxMp && <div>法力 +{equippedItem.bonus.maxMp}</div>}
                      </div>
                      
                      {/* Elements */}
                      {equippedItem.elements && Object.keys(equippedItem.elements).length > 0 && (
                        <div className="text-xs text-purple-700 mt-1">
                          {Object.entries(equippedItem.elements)
                            .filter(([_, value]) => value > 0)
                            .map(([element, value]) => `${getElementName(element as any)} ${Math.floor(value)}`)
                            .join(', ')}
                        </div>
                      )}
                      
                      {/* Unequip Button */}
                      <div className="mt-3">
                        <button
                          onClick={() => onUnequipItem(equippedItem.id)}
                          className="px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded hover:from-red-700 hover:to-orange-700 transition-colors w-full"
                        >
                          🔓 卸下
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      空
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Inventory Items */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-6 border border-amber-600">
        <h4 className="text-xl font-bold text-red-900 mb-4" style={{ fontFamily: 'serif' }}>🎒 背包物品</h4>
        {character.inventory && character.inventory.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {character.inventory.filter(equipment => !equipment.equipped).map((equipment, index) => {
              if (!equipment) return null;
              
              const equipped = isItemEquipped(equipment.id);
              
              return (
                <div 
                  key={index} 
                  className="p-3 border-2 rounded-lg transition-all hover:shadow-md cursor-pointer relative"
                  style={{ 
                    backgroundColor: equipped ? getRarityColor(equipment.rarity) + '20' : '#ffffff',
                    borderColor: getRarityColor(equipment.rarity)
                  }}
                  onMouseEnter={() => setHoveredItem({ id: equipment.id, type: 'item' })}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="text-xl">
                        {getEquipmentIcon(equipment.type)}
                      </div>
                      <div>
                        <div 
                          className="text-xs font-bold px-2 py-1 rounded text-white"
                          style={{ backgroundColor: getRarityColor(equipment.rarity) }}
                        >
                          {getRarityName(equipment.rarity)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {getEquipmentTypeName(equipment.type)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-900" style={{ fontFamily: 'serif' }}>
                      {equipment.name}
                    </div>
                    <div className="text-xs text-amber-700">
                      等级 {equipment.level}
                    </div>
                  </div>
                  
                  {/* Detail tooltip */}
                  {hoveredItem?.id === equipment.id && hoveredItem.type === 'item' && (
                    <div className="absolute z-10 w-80 p-4 bg-gradient-to-br from-amber-900 to-orange-800 text-white text-xs rounded-lg shadow-xl bottom-full mb-2 left-0 border border-amber-600 space-y-1">
                      {getItemDetailLines(equipment).map((line, detailIdx) => (
                        <div key={`${equipment.id}-detail-${detailIdx}`}>{line}</div>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    {!equipped && (
                      <div className="relative">
                        <button
                          onClick={() => onEquipItem(equipment.id)}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setHoveredItem({ id: equipment.id, type: 'equip' });
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setHoveredItem({ id: equipment.id, type: 'item' });
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                          🎯 装备
                        </button>
                        
                        {/* Comparison tooltip */}
                        {hoveredItem?.id === equipment.id && hoveredItem.type === 'equip' && (
                          <div className="absolute z-50 w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl bottom-full left-1/2 transform -translate-x-1/2 mb-2 space-y-1">
                            {getComparisonRows(equipment, getEquippedEquipmentByType(equipment.type)).map((row, rowIdx) => {
                              const color = row.diff > 0 ? 'text-green-400' : row.diff < 0 ? 'text-red-400' : 'text-gray-300';
                              const arrow = row.diff > 0 ? '↑' : row.diff < 0 ? '↓' : '=';
                              return (
                                <div key={`${equipment.id}-cmp-${rowIdx}`} className={color}>
                                  {row.label}: {row.current} → {row.next} {arrow}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    {equipped && (
                      <button
                        onClick={() => onUnequipItem(equipment.id)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded hover:from-red-700 hover:to-orange-700 transition-colors"
                      >
                        🔓 卸下
                      </button>
                    )}
                    <div className="relative flex-1">
                      <button
                        onClick={() => onSellItem(equipment.id)}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredItem({ id: equipment.id, type: 'sell' });
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          setHoveredItem({ id: equipment.id, type: 'item' });
                        }}
                        className="w-full px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded hover:from-green-700 hover:to-emerald-700 transition-colors"
                      >
                        💰 出售
                      </button>

                      {/* Sell price tooltip — only shown when hovering sell button */}
                      {hoveredItem?.id === equipment.id && hoveredItem.type === 'sell' && (
                        <div className="absolute z-50 w-40 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-center">
                          出售价格: <span className="text-yellow-300 font-bold">{equipment.sellPrice} 灵石</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-amber-700 font-semibold text-lg">藏宝阁空空如也</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
