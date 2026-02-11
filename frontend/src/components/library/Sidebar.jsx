import React from 'react';

export const Sidebar = ({ title, items = [] }) => (
  <div className="w-64 bg-gray-50 border-r border-gray-200 h-full p-4 rounded-l-xl">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{title || "Menu"}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all">
          {item}
        </li>
      ))}
    </ul>
  </div>
);