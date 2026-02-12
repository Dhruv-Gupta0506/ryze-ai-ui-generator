import React from 'react';

export const Chart = ({ type = 'bar', data = [], title }) => {
  // Normalize any key format the AI might use
  const normalized = data.map(d => ({
    label: d.label || d.name || '',
    value: Number(d.value ?? d.uv ?? d.count ?? d.amount ?? d.total ?? 0),
  }));

  const maxValue = Math.max(...normalized.map(d => d.value), 1);

  return (
    <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {title && (
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
          {title}
        </h3>
      )}

      {type === 'bar' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '192px', padding: '8px 0' }}>
          {normalized.map((item, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{item.value}</span>
              <div
                style={{
                  width: '100%',
                  background: '#2563eb',
                  borderRadius: '4px 4px 0 0',
                  height: `${Math.max((item.value / maxValue) * 150, 4)}px`,
                  transition: 'all 0.3s ease',
                  minHeight: '4px',
                }}
              />
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500', textAlign: 'center' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div style={{ height: '192px', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          {normalized.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', width: '60px', flexShrink: 0 }}>{item.label}</span>
              <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                <div style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  background: '#2563eb',
                  height: '100%',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151', width: '40px', textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {type === 'pie' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {normalized.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                background: `hsl(${i * 60}, 70%, 55%)`
              }} />
              <span style={{ fontSize: '14px', color: '#374151', flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};