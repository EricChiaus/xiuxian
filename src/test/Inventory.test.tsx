import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Inventory from '../components/Inventory';
import { Character } from '../types/game';

const character: Character = {
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  pa: 10,
  ma: 8,
  pd: 5,
  md: 5,
  level: 1,
  exp: 0,
  expToNext: 100,
  coin: 100,
  avatar: 'male_cultivator_1',
  elements: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 },
  elementResistance: { metal: 0, wood: 0, water: 0, fire: 0, earth: 0, yin: 0, yang: 0 },
  inventory: [
    {
      id: 'eq1',
      name: '测试剑',
      type: 'weapon',
      rarity: 'common',
      level: 1,
      bonus: { pa: 5 },
      elements: {},
      price: 50,
      sellPrice: 25,
      equipped: false
    }
  ]
};

describe('Inventory', () => {
  it('renders item and triggers equip/sell handlers', () => {
    const onEquipItem = vi.fn();
    const onUnequipItem = vi.fn();
    const onSellItem = vi.fn();

    render(
      <Inventory
        character={character}
        onEquipItem={onEquipItem}
        onUnequipItem={onUnequipItem}
        onSellItem={onSellItem}
      />
    );

    expect(screen.getByText('测试剑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('🎯 装备'));
    expect(onEquipItem).toHaveBeenCalledWith('eq1');

    fireEvent.click(screen.getByText('💰 出售'));
    expect(onSellItem).toHaveBeenCalledWith('eq1');
    expect(onUnequipItem).not.toHaveBeenCalled();
  });
});
