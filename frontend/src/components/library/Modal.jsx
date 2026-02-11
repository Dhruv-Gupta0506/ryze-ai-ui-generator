import React from 'react';

export const Modal = ({ title, isOpen, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};