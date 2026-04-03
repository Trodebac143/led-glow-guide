import React from 'react';

interface ResistorColorCodeProps {
  colors: string[];
  labels: string[];
  value: number;
}

const ResistorColorCode: React.FC<ResistorColorCodeProps> = ({ colors, labels, value }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Resistor body */}
      <svg width="220" height="64" viewBox="0 0 220 64">
        {/* Leads */}
        <line x1="0" y1="32" x2="30" y2="32" stroke="hsl(var(--circuit-line))" strokeWidth="2.5" />
        <line x1="190" y1="32" x2="220" y2="32" stroke="hsl(var(--circuit-line))" strokeWidth="2.5" />
        
        {/* Resistor body */}
        <rect x="30" y="10" width="160" height="44" rx="10" ry="10"
              fill="hsl(35, 30%, 75%)" stroke="hsl(35, 20%, 60%)" strokeWidth="1.5" />
        
        {/* Color bands */}
        {colors.map((color, i) => {
          const positions = [58, 88, 118, 158];
          const widths = [16, 16, 16, 10];
          return (
            <rect
              key={i}
              x={positions[i]}
              y="12"
              width={widths[i]}
              height="40"
              rx="2"
              fill={color}
              stroke={color === '#f5f5f5' || color === '#FFD700' || color === '#C0C0C0' ? 'hsl(var(--border))' : 'rgba(0,0,0,0.15)'}
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Band labels */}
      <div className="flex gap-2 flex-wrap justify-center">
        {labels.map((label, i) => (
          <span key={i} className="text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full mr-1 align-middle border border-border"
              style={{ backgroundColor: colors[i] }}
            />
            {label}
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{value}Ω — 4 bandas</p>
    </div>
  );
};

export default ResistorColorCode;
