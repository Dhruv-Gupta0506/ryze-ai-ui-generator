import React from 'react';

export const Input = ({ label, placeholder }) => (
  <div className="flex flex-col w-full mb-3">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input 
      className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full" 
      placeholder={placeholder} 
    />
  </div>
);