import React from 'react';

export const Navbar = ({ logo, links = [] }) => (
  <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm mb-6 rounded-xl">
    <div className="text-xl font-bold text-blue-600">{logo || "Ryze UI"}</div>
    <div className="flex gap-6">
      {links.map((link, i) => (
        <a key={i} href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
          {link}
        </a>
      ))}
    </div>
  </nav>
);