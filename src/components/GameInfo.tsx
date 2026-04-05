import React from 'react';

interface GameInfoProps {
  onResetGame: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({ onResetGame }) => {
  return (
    <div className="text-center">
      <button
        onClick={onResetGame}
        className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
      >
        🔄 Reset Game
      </button>
    </div>
  );
};

export default GameInfo;
