
import React from 'react';

interface SkinHealthOverviewProps {
  score: number;
  concerns: {
    name: string;
    score: number;
  }[];
}

const SkinHealthOverview: React.FC<SkinHealthOverviewProps> = ({ score, concerns }) => {
  return (
    <div>
      <div className="flex items-center justify-center py-4">
        <div className="relative w-36 h-36">
          <div className="w-full h-full rounded-full bg-skin-blue/20 flex items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{score}%</span>
          </div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary border-r-transparent"
            style={{ transform: `rotate(${45 + (score * 2.7)}deg)` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {concerns.map((concern) => (
          <div key={concern.name} className="text-sm">
            <div className="flex justify-between mb-1">
              <span>{concern.name}</span>
              <span className="font-medium">{concern.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-primary" 
                style={{ width: `${concern.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkinHealthOverview;
