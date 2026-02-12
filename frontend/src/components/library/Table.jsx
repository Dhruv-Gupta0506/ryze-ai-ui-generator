import React from 'react';

export const Table = ({ headers, rows, columns, data }) => {
  // Accept both naming conventions the AI might use
  const finalHeaders = headers || columns || [];
  const finalRows = rows || data || [];

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm w-full bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {finalHeaders.map((h, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {finalRows.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};