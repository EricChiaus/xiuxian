import React from 'react';
import { Enemy } from '../types/game';
import PowerDisplay from './PowerDisplay';
import { getCultivatorLevelName } from '../types/game';

interface EnemyTooltipProps {
  enemy: Enemy;
  children: React.ReactNode;
}

const EnemyTooltip: React.FC<EnemyTooltipProps> = ({ enemy, children }) => {
  return (
    <div className="relative group">
      {children}
      
      {/* Tooltip */}
      <div className="absolute z-50 invisible group-hover:visible bg-gray-900 text-white p-3 rounded-lg shadow-xl border-2 border-red-800 w-64 -top-2 left-full ml-2">
        <div className="absolute right-full top-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-900 border-b-8 border-b-transparent"></div>
        
        <h3 className="font-bold text-red-400 mb-2">{enemy.name}</h3>
        
        <div className="text-xs space-y-1">
          <div>境界: {getCultivatorLevelName(enemy.level)} (Lv.{enemy.level})</div>
          <div>生命: {enemy.hp}/{enemy.maxHp}</div>
          <div>攻击: {enemy.pa} | 魔攻: {enemy.ma}</div>
          <div>防御: {enemy.pd} | 魔防: {enemy.md}</div>
          
          {enemy.isElite && (
            <div className="text-yellow-400 font-bold">精英敌人!</div>
          )}
          
          {enemy.hasMagic && (
            <div className="text-blue-400">拥有魔法</div>
          )}
          
          {enemy.hasHeal && (
            <div className="text-green-400">可以治疗</div>
          )}
          
          {/* Powers and Resistance */}
          <PowerDisplay
            powers={enemy.powers}
            powerResistance={enemy.powerResistance}
            title=""
            showResistance={true}
          />
          
          {/* Rewards */}
          <div className="pt-2 border-t border-gray-700">
            <div className="text-yellow-300">奖励:</div>
            <div>经验: {enemy.expReward} | 金币: {enemy.coinReward}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyTooltip;
