import React from 'react';

interface SeriesCircuitProps {
  numLeds: number;
  ledColor: string;
  voltage: number;
  resistance: number;
}

const SeriesCircuit: React.FC<SeriesCircuitProps> = ({ numLeds, ledColor, voltage, resistance }) => {
  const maxVisible = Math.min(numLeds, 6);
  const showEllipsis = numLeds > 6;
  
  const ledSpacing = 52;
  const ledsWidth = maxVisible * ledSpacing + (showEllipsis ? 40 : 0);
  const totalWidth = Math.max(320, ledsWidth + 160);
  const totalHeight = 160;
  const centerY = 80;
  
  const resistorX = 80;
  const resistorW = 50;
  const startLedsX = resistorX + resistorW + 30;

  const strokeColor = 'hsl(var(--circuit-line))';
  const textColor = 'hsl(var(--muted-foreground))';

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="max-w-full"
    >
      {/* Source + label */}
      <circle cx="30" cy={centerY} r="14" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <text x="30" y={centerY - 2} textAnchor="middle" fontSize="8" fontWeight="700" fill={strokeColor}>+</text>
      <text x="30" y={centerY + 7} textAnchor="middle" fontSize="6" fill={strokeColor}>−</text>
      <text x="30" y={centerY - 22} textAnchor="middle" fontSize="9" fontWeight="600" fill={textColor}>{voltage}V</text>

      {/* Wire from source to resistor */}
      <line x1="44" y1={centerY} x2={resistorX} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />

      {/* Resistor */}
      <rect x={resistorX} y={centerY - 10} width={resistorW} height="20" rx="4" 
            fill="hsl(35, 30%, 80%)" stroke={strokeColor} strokeWidth="1.2" />
      <text x={resistorX + resistorW / 2} y={centerY + 3.5} textAnchor="middle" fontSize="8" fontWeight="600" fill={strokeColor}>
        {resistance}Ω
      </text>
      <text x={resistorX + resistorW / 2} y={centerY - 16} textAnchor="middle" fontSize="8" fill={textColor}>R</text>

      {/* Wire from resistor to LEDs */}
      <line x1={resistorX + resistorW} y1={centerY} x2={startLedsX} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />

      {/* LEDs */}
      {Array.from({ length: maxVisible }).map((_, i) => {
        const cx = startLedsX + i * ledSpacing + 20;
        return (
          <g key={i}>
            {/* Wire to LED */}
            {i > 0 && (
              <line x1={cx - ledSpacing + 28} y1={centerY} x2={cx - 8} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />
            )}
            {/* LED triangle */}
            <polygon
              points={`${cx - 8},${centerY - 10} ${cx + 8},${centerY} ${cx - 8},${centerY + 10}`}
              fill={ledColor}
              fillOpacity={0.3}
              stroke={ledColor}
              strokeWidth="1.5"
            />
            {/* LED bar */}
            <line x1={cx + 8} y1={centerY - 10} x2={cx + 8} y2={centerY + 10} stroke={ledColor} strokeWidth="2" />
            {/* Arrow rays */}
            <line x1={cx + 2} y1={centerY - 14} x2={cx + 10} y2={centerY - 20} stroke={ledColor} strokeWidth="0.8" />
            <line x1={cx + 6} y1={centerY - 13} x2={cx + 14} y2={centerY - 19} stroke={ledColor} strokeWidth="0.8" />
            {/* Wire out */}
            <line x1={cx + 8} y1={centerY} x2={cx + 28} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />
            {/* Label */}
            <text x={cx} y={centerY + 24} textAnchor="middle" fontSize="7" fill={textColor}>LED{i + 1}</text>
          </g>
        );
      })}

      {/* Ellipsis */}
      {showEllipsis && (
        <text
          x={startLedsX + maxVisible * ledSpacing + 10}
          y={centerY + 4}
          fontSize="14"
          fontWeight="700"
          fill={textColor}
        >...</text>
      )}

      {/* Return wire */}
      {(() => {
        const lastLedEndX = startLedsX + (maxVisible - 1) * ledSpacing + 48 + (showEllipsis ? 40 : 0);
        const rightEdge = totalWidth - 20;
        return (
          <>
            <line x1={lastLedEndX} y1={centerY} x2={rightEdge} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />
            <line x1={rightEdge} y1={centerY} x2={rightEdge} y2={centerY + 36} stroke={strokeColor} strokeWidth="1.8" />
            <line x1={rightEdge} y1={centerY + 36} x2={30} y2={centerY + 36} stroke={strokeColor} strokeWidth="1.8" />
            <line x1={30} y1={centerY + 36} x2={30} y2={centerY + 14} stroke={strokeColor} strokeWidth="1.8" />
            <text x={rightEdge - 4} y={centerY + 50} textAnchor="end" fontSize="8" fontWeight="600" fill={textColor}>GND</text>
          </>
        );
      })()}

      {/* Current flow arrow */}
      <polygon
        points={`60,${centerY - 6} 68,${centerY} 60,${centerY + 6}`}
        fill="hsl(var(--primary))"
        opacity="0.5"
      />
      <text x="64" y={centerY - 10} textAnchor="middle" fontSize="7" fill="hsl(var(--primary))">I</text>
    </svg>
  );
};

export default SeriesCircuit;
