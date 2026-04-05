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
  const totalWidth = Math.max(320, ledsWidth + 180);
  const totalHeight = 90;
  const centerY = 45;

  const startX = 40;
  const resistorX = startX + 30;
  const resistorW = 50;
  const startLedsX = resistorX + resistorW + 20;

  const strokeColor = 'hsl(var(--circuit-line))';
  const textColor = 'hsl(var(--muted-foreground))';

  // GND terminal helper
  const lastLedEndX = startLedsX + (maxVisible - 1) * ledSpacing + 28 + (showEllipsis ? 40 : 0);
  const gndX = lastLedEndX + 30;
  const endX = gndX;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${Math.max(totalWidth, endX + 40)} ${totalHeight}`}
      className="max-w-full"
    >
      {/* +V Terminal */}
      <line x1={startX} y1={centerY - 12} x2={startX} y2={centerY + 12} stroke={strokeColor} strokeWidth="2.5" />
      <circle cx={startX} cy={centerY} r="3" fill={strokeColor} />
      <text x={startX} y={centerY - 18} textAnchor="middle" fontSize="9" fontWeight="700" fill={textColor}>+{voltage}V</text>

      {/* Wire from +V to resistor */}
      <line x1={startX} y1={centerY} x2={resistorX} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />

      {/* Current flow arrow */}
      <polygon
        points={`${startX + 10},${centerY - 5} ${startX + 18},${centerY} ${startX + 10},${centerY + 5}`}
        fill="hsl(var(--primary))"
        opacity="0.5"
      />
      <text x={startX + 14} y={centerY - 9} textAnchor="middle" fontSize="7" fill="hsl(var(--primary))">I</text>

      {/* Resistor */}
      <rect x={resistorX} y={centerY - 10} width={resistorW} height="20" rx="4"
            fill="hsl(35, 30%, 80%)" stroke={strokeColor} strokeWidth="1.2" />
      <text x={resistorX + resistorW / 2} y={centerY + 3.5} textAnchor="middle" fontSize="8" fontWeight="600" fill={strokeColor}>
        {resistance}Ω
      </text>
      <text x={resistorX + resistorW / 2} y={centerY - 16} textAnchor="middle" fontSize="8" fill={textColor}>R</text>

      {/* Wire from resistor to first LED */}
      <line x1={resistorX + resistorW} y1={centerY} x2={startLedsX} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />

      {/* LEDs */}
      {Array.from({ length: maxVisible }).map((_, i) => {
        const cx = startLedsX + i * ledSpacing + 10;
        return (
          <g key={i}>
            {/* Wire to LED */}
            {i > 0 && (
              <line x1={cx - ledSpacing + 18} y1={centerY} x2={cx - 8} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />
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
            <line x1={cx + 8} y1={centerY} x2={cx + 18} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />
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

      {/* Wire from last LED to GND */}
      <line x1={lastLedEndX} y1={centerY} x2={gndX} y2={centerY} stroke={strokeColor} strokeWidth="1.8" />

      {/* GND symbol */}
      <line x1={gndX} y1={centerY} x2={gndX} y2={centerY + 8} stroke={strokeColor} strokeWidth="2" />
      <line x1={gndX - 10} y1={centerY + 8} x2={gndX + 10} y2={centerY + 8} stroke={strokeColor} strokeWidth="2" />
      <line x1={gndX - 6} y1={centerY + 13} x2={gndX + 6} y2={centerY + 13} stroke={strokeColor} strokeWidth="1.5" />
      <line x1={gndX - 3} y1={centerY + 17} x2={gndX + 3} y2={centerY + 17} stroke={strokeColor} strokeWidth="1" />
      <text x={gndX} y={centerY - 8} textAnchor="middle" fontSize="8" fontWeight="600" fill={textColor}>GND</text>
    </svg>
  );
};

export default SeriesCircuit;
