import React from 'react';

export const Chart = ({ type = 'bar', data = [], title }) => {
  const maxValue = Math.max(...data.map(d => d.value || 0));
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {title && <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>}
      
      {type === 'bar' && (
        <div className="flex items-end gap-4 h-48">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-gray-600 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      )}
      
      {type === 'line' && (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p>Line chart with {data.length} data points</p>
        </div>
      )}
      
      {type === 'pie' && (
        <div className="space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ background: `hsl(${i * 60}, 70%, 55%)` }}
              />
              <span className="text-sm text-gray-700">{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};