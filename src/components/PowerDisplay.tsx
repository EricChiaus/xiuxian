import React from 'react';
import { Powers, PowerResistance, getPowerColor, getPowerName } from '../types/game';

interface PowerDisplayProps {
  powers: Partial<Powers>;
  powerResistance: Partial<PowerResistance>;
  title?: string;
  showResistance?: boolean;
}

const PowerDisplay: React.FC<PowerDisplayProps> = ({ 
  powers, 
  powerResistance, 
  title = "元素之力", 
  showResistance = true 
}) => {
  const powerTypes: Array<keyof Powers> = ['metal', 'wood', 'water', 'fire', 'earth', 'yin', 'yang'];
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-300">
      <h4 className="text-sm font-bold text-purple-900 mb-2">{title}</h4>
      
      <div className="space-y-2">
        {/* Powers */}
        <div>
          <div className="text-xs font-semibold text-purple-700 mb-1">力量:</div>
          <div className="flex flex-wrap gap-1">
            {powerTypes.map(power => {
              const value = powers[power];
              if (!value || value === 0) return null;
              
              return (
                <div
                  key={power}
                  className="px-2 py-1 rounded text-xs font-bold text-white border border-gray-800"
                  style={{ backgroundColor: getPowerColor(power) }}
                >
                  {getPowerName(power)} {value}
                </div>
              );
            })}
            {Object.values(powers).every(v => !v || v === 0) && (
              <div className="text-xs text-gray-500">无</div>
            )}
          </div>
        </div>
        
        {/* Resistance */}
        {showResistance && (
          <div>
            <div className="text-xs font-semibold text-purple-700 mb-1">抗性:</div>
            <div className="flex flex-wrap gap-1">
              {powerTypes.map(power => {
                const value = powerResistance[power];
                if (!value || value === 0) return null;
                
                return (
                  <div
                    key={power}
                    className="px-2 py-1 rounded text-xs font-bold border-2"
                    style={{ 
                      backgroundColor: getPowerColor(power) + '30',
                      borderColor: getPowerColor(power),
                      color: getPowerColor(power)
                    }}
                  >
                    {getPowerName(power)} {value}
                  </div>
                );
              })}
            {Object.values(powerResistance).every(v => !v || v === 0) && (
              <div className="text-xs text-gray-500">无</div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerDisplay;
