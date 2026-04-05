import React, { useState } from 'react';
import { Character, Equipment, getRarityName, getRarityColor, getEquipmentTypeName, getElementName } from '../types/game';

interface InventoryProps {
  character: Character;
  allEquipment: Equipment[];
  onEquipItem: (itemId: string) => void;
  onUnequipItem: (slot: keyof Character['equippedItems']) => void;
  onSellItem: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ 
  character, 
  allEquipment, 
  onEquipItem, 
  onUnequipItem, 
  onSellItem 
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get equipment data by ID
  const getEquipmentById = (id: string): Equipment | undefined => {
    return allEquipment.find(eq => eq.id === id);
  };

  // Get equipped equipment data
  const getEquippedEquipment = (slot: keyof Character['equippedItems']): Equipment | undefined => {
    const itemId = character.equippedItems[slot];
    return itemId ? getEquipmentById(itemId) : undefined;
  };

  // Check if item is equipped
  const isItemEquipped = (itemId: string): boolean => {
    return Object.values(character.equippedItems).includes(itemId);
  };

  // Get equipment type from item
  const getEquipmentType = (itemId: string): keyof Character['equippedItems'] | null => {
    const equipment = getEquipmentById(itemId);
    return equipment?.type as keyof Character['equippedItems'] || null;
  };

  // Calculate stat comparison
  const getStatComparison = (item: Equipment, equippedItem?: Equipment) => {
    const comparison: { [key: string]: { current: number; new: number } } = {};
    
    // Compare stats
    if (item.bonus.pa) {
      comparison.pa = {
        current: equippedItem?.bonus.pa || 0,
        new: item.bonus.pa
      };
    }
    if (item.bonus.ma) {
      comparison.ma = {
        current: equippedItem?.bonus.ma || 0,
        new: item.bonus.ma
      };
    }
    if (item.bonus.pd) {
      comparison.pd = {
        current: equippedItem?.bonus.pd || 0,
        new: item.bonus.pd
      };
    }
    if (item.bonus.md) {
      comparison.md = {
        current: equippedItem?.bonus.md || 0,
        new: item.bonus.md
      };
    }
    if (item.bonus.maxHp) {
      comparison.maxHp = {
        current: equippedItem?.bonus.maxHp || 0,
        new: item.bonus.maxHp
      };
    }
    if (item.bonus.maxMp) {
      comparison.maxMp = {
        current: equippedItem?.bonus.maxMp || 0,
        new: item.bonus.maxMp
      };
    }
    
    // Compare elements
    Object.entries(item.elements).forEach(([element, value]) => {
      if (value > 0) {
        const currentElementValue = equippedItem?.elements[element as keyof typeof item.elements] || 0;
        comparison[element] = {
          current: currentElementValue,
          new: value
        };
      }
    });
    
    return comparison;
  };

  // Format stat comparison for tooltip
  const formatStatComparison = (comparison: ReturnType<typeof getStatComparison>) => {
    const lines: string[] = [];
    
    const statNames: { [key: string]: string } = {
      pa: '物攻',
      ma: '魔攻',
      pd: '物防',
      md: '魔防',
      maxHp: '生命',
      maxMp: '法力',
      metal: '金',
      wood: '木',
      water: '水',
      fire: '火',
      earth: '土',
      yin: '阴',
      yang: '阳'
    };
    
    Object.entries(comparison).forEach(([stat, values]) => {
      const diff = values.new - values.current;
      const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '=';
      const color = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600';
      
      lines.push(
        `<span class="${color}">${statNames[stat]}: ${values.current} → ${values.new} ${arrow}</span>`
      );
    });
    
    return lines.join('<br>');
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

  const equipmentSlots: Array<{ key: keyof Character['equippedItems']; name: string }> = [
    { key: 'weapon', name: '武器' },
    { key: 'armor', name: '护甲' },
    { key: 'helmet', name: '头盔' },
    { key: 'boots', name: '靴子' },
    { key: 'ring', name: '戒指' },
    { key: 'necklace', name: '项链' },
    { key: 'accessory', name: '饰品' }
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>📜 藏宝阁</h3>
      
      {/* Inventory Items */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-4 border border-amber-600 mb-6">
        <h4 className="text-lg font-bold text-red-900 mb-3" style={{ fontFamily: 'serif' }}>🎒 背包物品</h4>
        {character.inventory && character.inventory.length > 0 ? (
          <div className="space-y-3">
            {character.inventory.map((itemId, index) => {
              const equipment = getEquipmentById(itemId);
              if (!equipment) return null;
              
              const equipped = isItemEquipped(itemId);
              const type = getEquipmentType(itemId);
              
              return (
                <div 
                  key={index} 
                  className="p-4 border-2 rounded-lg transition-all"
                  style={{ 
                    backgroundColor: getRarityColor(equipment.rarity) + '20',
                    borderColor: getRarityColor(equipment.rarity),
                    opacity: equipped ? 0.6 : 1
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getEquipmentIcon(equipment.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-sm font-bold px-2 py-1 rounded text-white"
                            style={{ backgroundColor: getRarityColor(equipment.rarity) }}
                          >
                            {getRarityName(equipment.rarity)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {getEquipmentTypeName(equipment.type)}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-red-900" style={{ fontFamily: 'serif' }}>
                          {equipment.name}
                        </div>
                        <div className="text-sm text-amber-700">
                          等级 {equipment.level}
                        </div>
                        
                        {/* Stats */}
                        <div className="text-xs text-gray-700 mt-1">
                          {equipment.bonus.pa && <div>物攻 +{equipment.bonus.pa}</div>}
                          {equipment.bonus.ma && <div>魔攻 +{equipment.bonus.ma}</div>}
                          {equipment.bonus.pd && <div>物防 +{equipment.bonus.pd}</div>}
                          {equipment.bonus.md && <div>魔防 +{equipment.bonus.md}</div>}
                          {equipment.bonus.maxHp && <div>生命 +{equipment.bonus.maxHp}</div>}
                          {equipment.bonus.maxMp && <div>法力 +{equipment.bonus.maxMp}</div>}
                        </div>
                        
                        {/* Elements */}
                        {Object.keys(equipment.elements).length > 0 && (
                          <div className="text-xs text-purple-700 mt-1">
                            {Object.entries(equipment.elements)
                              .filter(([_, value]) => value > 0)
                              .map(([element, value]) => `${getElementName(element as any)} ${Math.floor(value)}`)
                              .join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!equipped && type && (
                        <div className="relative">
                          <button
                            onClick={() => onEquipItem(itemId)}
                            onMouseEnter={() => setHoveredItem(itemId)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors border-2 border-blue-800"
                          >
                            🎯 装备
                          </button>
                          
                          {/* Tooltip for stat comparison */}
                          {hoveredItem === itemId && (
                            <div 
                              className="absolute z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg bottom-full mb-2 left-0"
                              dangerouslySetInnerHTML={{ 
                                __html: formatStatComparison(
                                  getStatComparison(equipment, getEquippedEquipment(type!))
                                )
                              }}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="relative">
                        <button
                          onClick={() => onSellItem(itemId)}
                          onMouseEnter={() => setHoveredItem(itemId + '_sell')}
                          onMouseLeave={() => setHoveredItem(null)}
                          className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-colors border-2 border-red-800"
                          disabled={equipped}
                        >
                          💰 出售
                        </button>
                        
                          {/* Tooltip for sell price */}
                          {hoveredItem === itemId + '_sell' && (
                            <div className="absolute z-10 w-32 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg bottom-full mb-2 right-0">
                              售价: {Math.floor(equipment.price / 2)} 🪙
                            </div>
                          )}
                      </div>
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
      
      {/* Equipped Items Section */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border-2 border-red-600">
        <h4 className="text-lg font-bold text-red-900 mb-3" style={{ fontFamily: 'serif' }}>🎯 当前装备</h4>
        <div className="grid grid-cols-2 gap-3">
          {equipmentSlots.map(slot => {
            const equippedItem = getEquippedEquipment(slot.key);
            
            return (
              <div 
                key={slot.key}
                className="p-3 border-2 rounded-lg"
                style={{ borderColor: '#dc2626' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-800 font-semibold">{slot.name}:</span>
                  {equippedItem && (
                    <button
                      onClick={() => onUnequipItem(slot.key)}
                      className="px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded hover:from-orange-700 hover:to-red-700 transition-colors"
                    >
                      脱下
                    </button>
                  )}
                </div>
                
                <div className="text-red-900">
                  {equippedItem ? (
                    <div className="flex items-center gap-2">
                      <div className="text-lg">
                        {getEquipmentIcon(equippedItem.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs font-bold px-1 py-0.5 rounded text-white"
                            style={{ backgroundColor: getRarityColor(equippedItem.rarity) }}
                          >
                            {getRarityName(equippedItem.rarity)}
                          </span>
                        </div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'serif' }}>
                          {equippedItem.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          等级 {equippedItem.level}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">未装备</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
