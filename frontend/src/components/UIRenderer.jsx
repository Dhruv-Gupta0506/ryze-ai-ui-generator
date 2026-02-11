import React from 'react';
import { Button } from './library/Button';
import { Card } from './library/Card';
import { Input } from './library/Input';

// This is the Registry that maps the AI's string to your real components
const ComponentRegistry = {
  Button,
  Card,
  Input
};

const UIRenderer = ({ layout }) => {
  // If no layout is provided, show a placeholder
  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return <p className="text-gray-400">Waiting for your description...</p>;
  }

  return (
    <>
      {layout.map((item, index) => {
        const Component = ComponentRegistry[item.component];
        
        // Safety check: if the AI halluncinates a component we don't have, skip it
        if (!Component) return <div key={index} className="text-red-500">Error: Component {item.component} not allowed.</div>;

        return (
          <Component key={index} {...item.props}>
            {/* This handles nested components (e.g., Inputs inside a Card) */}
            {item.children && <UIRenderer layout={item.children} />}
          </Component>
        );
      })}
    </>
  );
};

export default UIRenderer;