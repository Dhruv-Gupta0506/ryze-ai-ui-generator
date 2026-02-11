import React from 'react';
import { Button } from './library/Button';
import { Card } from './library/Card';
import { Input } from './library/Input';
import { Table } from './library/Table';
import { Navbar } from './library/Navbar';
import { Sidebar } from './library/Sidebar';
import { Modal } from './library/Modal';
import { Chart } from './library/Chart';
import { Badge } from './library/Badge';
import { Alert } from './library/Alert';

const ComponentRegistry = {
  Button,
  Card,
  Input,
  Table,
  Navbar,
  Sidebar,
  Modal,
  Chart,
  Badge,
  Alert
};

// ✅ WHITELIST VALIDATION
const ALLOWED_COMPONENTS = Object.keys(ComponentRegistry);

const UIRenderer = ({ layout }) => {
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl">
        <p className="text-gray-400 font-medium">Describe a UI to see the magic happen...</p>
      </div>
    );
  }

  return (
    <>
      {layout.map((item, index) => {
        // ✅ SECURITY: Validate component is in whitelist
        if (!ALLOWED_COMPONENTS.includes(item.component)) {
          return (
            <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg mb-2">
              <p className="text-red-600 font-semibold">⚠️ Security Error</p>
              <p className="text-sm text-red-500">Component "{item.component}" is not allowed.</p>
            </div>
          );
        }

        const Component = ComponentRegistry[item.component];
        if (!Component) return null;

        return (
          <Component key={index} {...item.props}>
            {item.children && Array.isArray(item.children) && <UIRenderer layout={item.children} />}
          </Component>
        );
      })}
    </>
  );
};

export default UIRenderer;