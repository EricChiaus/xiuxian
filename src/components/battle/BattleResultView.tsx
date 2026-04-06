import React from 'react';

interface BattleResultViewProps {
  battleResult: 'victory' | 'defeat';
  rewards: {
    expGained: number;
    coinsGained: number;
    expLost: number;
  } | null;
  onCloseModal: () => void;
}

const BattleResultView: React.FC<BattleResultViewProps> = ({ battleResult, rewards, onCloseModal }) => {
  return (
    <div className="text-center space-y-6">
      <div className="text-4xl">{battleResult === 'victory' ? '🎉' : '💀'}</div>
      <h3 className={`text-3xl font-bold ${battleResult === 'victory' ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'serif' }}>
        {battleResult === 'victory' ? '胜利！' : '失败！'}
      </h3>
      {rewards && (
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border-2 border-amber-700">
          <h4 className="text-xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'serif' }}>
            {battleResult === 'victory' ? '🏆 战利品' : '💔 损失'}
          </h4>
          <div className="space-y-3">
            {battleResult === 'victory' ? (
              <>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="font-bold text-green-700">🌟 修为</span>
                  <span className="text-green-600 font-bold">+{rewards.expGained}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="font-bold text-yellow-700">🪙 灵石</span>
                  <span className="text-yellow-600 font-bold">+{rewards.coinsGained}</span>
                </div>
                <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">✨ HP/MP 已完全恢复</div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="font-bold text-red-700">🌟 修为</span>
                  <span className="text-red-600 font-bold">-{rewards.expLost}</span>
                </div>
                <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">💔 HP/MP 已完全恢复</div>
              </>
            )}
          </div>
        </div>
      )}
      <button
        onClick={onCloseModal}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 border-2 border-purple-800"
      >
        继续修仙
      </button>
    </div>
  );
};

export default BattleResultView;
