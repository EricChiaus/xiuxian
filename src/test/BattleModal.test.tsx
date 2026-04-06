import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BattleModal from '../components/BattleModal';
import { Enemy } from '../types/game';

const enemy: Enemy = {
  id: 'e1',
  name: 'Slime',
  level: 1,
  hp: 10,
  maxHp: 10,
  pa: 2,
  pd: 1,
  ma: 1,
  md: 1,
  expReward: 10,
  coinReward: 5,
  hasMagic: false,
  hasHeal: false,
  elements: {},
  elementResistance: {}
};

describe('BattleModal', () => {
  it('shows action buttons during player turn', () => {
    const onAction = vi.fn();
    render(
      <BattleModal
        inBattle={true}
        currentEnemy={enemy}
        enemies={[enemy]}
        selectedEnemyId={enemy.id}
        isPlayerTurn={true}
        battleLog={[]}
        battleResult={null}
        rewards={null}
        onAction={onAction}
        onSelectEnemy={vi.fn()}
        onCloseModal={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('⚔️ 攻击'));
    expect(onAction).toHaveBeenCalledWith('attack');
  });

  it('shows result screen and close button', () => {
    const onCloseModal = vi.fn();
    render(
      <BattleModal
        inBattle={false}
        currentEnemy={null}
        enemies={[]}
        selectedEnemyId={null}
        isPlayerTurn={false}
        battleLog={[]}
        battleResult="victory"
        rewards={{ expGained: 10, coinsGained: 5, expLost: 0 }}
        onAction={vi.fn()}
        onSelectEnemy={vi.fn()}
        onCloseModal={onCloseModal}
      />
    );

    expect(screen.getByText('胜利！')).toBeInTheDocument();
    fireEvent.click(screen.getByText('继续修仙'));
    expect(onCloseModal).toHaveBeenCalled();
  });
});
