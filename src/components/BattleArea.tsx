import React from 'react';

interface BattleAreaProps {
  inBattle: boolean;
  onStartBattle: () => void;
}

const BattleArea: React.FC<BattleAreaProps> = ({ 
  inBattle, 
  onStartBattle
}) => {
  // Don't show anything if in battle (modal handles it)
  if (inBattle) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-red-700">
      <h3 className="text-xl font-bold text-center mb-4 text-red-900" style={{ fontFamily: 'serif' }}>⚔️ 战斗准备 ⚔️</h3>
      
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🗡️</div>
        
        <p className="text-red-800 font-medium mb-4">
          准备好面对妖魔的挑战了吗？<br />
          在战斗中运用你的修为，获得经验与灵石！
        </p>
        
        <button
          onClick={onStartBattle}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 border-2 border-red-800 shadow-lg"
        >
          ⚔️ 开始战斗
        </button>
        
        <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
          <div className="font-bold mb-1">战斗提示：</div>
          <div>• 选择目标敌人进行攻击</div>
          <div>• 使用法术消耗MP但威力更强</div>
          <div>• 战斗胜利获得经验和灵石</div>
          <div>• 战败会损失经验但HP/MP会恢复</div>
        </div>
      </div>
    </div>
  );
};

export default BattleArea;
