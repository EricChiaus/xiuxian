import React from 'react';

interface OfflineExpNotificationProps {
  amount: number;
}

const OfflineExpNotification: React.FC<OfflineExpNotificationProps> = ({ amount }) => {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6 text-center animate-pulse">
      <strong className="text-yellow-800">Welcome back!</strong> 
      <span className="text-yellow-700"> You earned </span>
      <span className="font-bold text-yellow-800">{amount}</span>
      <span className="text-yellow-700"> EXP while away!</span>
    </div>
  );
};

export default OfflineExpNotification;
