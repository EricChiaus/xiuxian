import React from 'react';
import { Elements, ElementResistance, getElementColor, getElementName } from '../types/game';

interface PowerDisplayProps {
  elements: Partial<Elements>;
  elementResistance: Partial<ElementResistance>;
  title?: string;
  showResistance?: boolean;
}

const PowerDisplay: React.FC<PowerDisplayProps> = ({ 
  Elements, 
  ElementResistance, 
  title = "元素之力", 
  showResistance = true 
}) => {
  const ElementTypes: Array<keyof Elements> = ['metal', 'wood', 'water', 'fire', 'earth', 'yin', 'yang'];
  
  // Ensure Elements and ElementResistance are defined
  const safeElements = Elements || {};
  const safeElementResistance = ElementResistance || {};
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-300">
      <h4 className="text-sm font-bold text-purple-900 mb-2">{title}</h4>
      
      <div className="space-y-2">
        {/* Elements */}
        <div>
          <div className="text-xs font-semibold text-purple-700 mb-1">力量:</div>
          <div className="flex flex-wrap gap-1">
            {ElementTypes.map(power => {
              const value = safeElements[power];
              if (!value || value === 0) return null;
              
              return (
                <div
                  key={power}
                  className="px-2 py-1 rounded text-xs font-bold text-white border border-gray-800"
                  style={{ backgroundColor: getElementColor(power) }}
                >
                  {getElementName(power)} {value}
                </div>
              );
            })}
            {Object.values(safeElements).every(v => !v || v === 0) && (
              <div className="text-xs text-gray-500">无</div>
            )}
          </div>
        </div>
        
        {/* Resistance */}
        {showResistance && (
          <div>
            <div className="text-xs font-semibold text-purple-700 mb-1">抗性:</div>
            <div className="flex flex-wrap gap-1">
              {ElementTypes.map(power => {
                const value = safeElementResistance[power];
                if (!value || value === 0) return null;
                
                return (
                  <div
                    key={power}
                    className="px-2 py-1 rounded text-xs font-bold border-2"
                    style={{ 
                      backgroundColor: getElementColor(power) + '30',
                      borderColor: getElementColor(power),
                      color: getElementColor(power)
                    }}
                  >
                    {getElementName(power)} {value}
                  </div>
                );
              })}
            {Object.values(safeElementResistance).every(v => !v || v === 0) && (
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
