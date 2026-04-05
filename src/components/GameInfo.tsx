import React from 'react';

interface GameInfoProps {
  onResetGame: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ onResetGame }) => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Game Info</h3>
      
      <div className="bg-gray-50 bg-opacity-70 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Current Status:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Battle enemies to gain EXP</li>
          <li>• Earn coins from victories</li>
          <li>• Level up to increase stats</li>
          <li>• Reach level 99 to fight the boss</li>
          <li>• Game saves automatically</li>
        </ul>
      </div>
      
      <div className="text-center">
        <button
          onClick={onResetGame}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          🔄 Reset Game
        </button>
      </div>
    </div>
  );
};

export default GameInfo;
