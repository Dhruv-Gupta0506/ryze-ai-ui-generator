import React from 'react';

export const Card = ({ title, children }) => (
  <div className="border border-gray-200 p-6 rounded-xl shadow-md bg-white w-full mb-4">
    {title && <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>}
    <div className="space-y-4">{children}</div>
  </div>
);