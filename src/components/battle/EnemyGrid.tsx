import React from 'react';
import { Enemy, getElementColor } from '../../types/game';

interface EnemyGridProps {
  enemies: Enemy[];
  selectedEnemyId: string | null;
  onSelectEnemy: (enemyId: string) => void;
}

const EnemyGrid: React.FC<EnemyGridProps> = ({ enemies, selectedEnemyId, onSelectEnemy }) => {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-xl font-bold text-center text-red-900" style={{ fontFamily: 'serif' }}>👹 妖魔群</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedEnemyId === enemy.id
                ? 'border-red-500 bg-red-50'
                : enemy.hp <= 0
                  ? 'border-gray-300 bg-gray-50 opacity-50'
                  : 'border-red-300 bg-red-100 hover:border-red-400'
            }`}
            onClick={() => enemy.hp > 0 && onSelectEnemy(enemy.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-red-900">{enemy.name}</h4>
              <span className="text-2xl">👹</span>
            </div>
            <div className="mb-2">
              <div className="text-sm text-red-800 font-semibold mb-1">生命值</div>
              <div className="w-full bg-red-200 rounded-full h-3 relative border border-red-400">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-800 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {enemy.hp}/{enemy.maxHp}
                  </span>
                </div>
              </div>
            </div>
            {Object.entries(enemy.elements).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(enemy.elements).map(([element, value]) => (
                  <div
                    key={element}
                    className="px-2 py-1 rounded text-xs font-bold text-white border border-gray-800"
                    style={{ backgroundColor: getElementColor(element as any) }}
                  >
                    {element} {Math.floor(value)}
                  </div>
                ))}
              </div>
            )}
            {enemy.hp <= 0 && <div className="text-center text-red-600 font-bold mt-2">已击败</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnemyGrid;
