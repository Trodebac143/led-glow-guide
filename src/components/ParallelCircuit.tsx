import React from 'react';

interface ParallelCircuitProps {
  numLeds: number;
  ledColor: string;
  voltage: number;
  resistance: number;
}

const ParallelCircuit: React.FC<ParallelCircuitProps> = ({ numLeds, ledColor, voltage, resistance }) => {
  const maxVisible = Math.min(numLeds, 5);
  const showEllipsis = numLeds > 5;

  const branchSpacing = 50;
  const branchesHeight = maxVisible * branchSpacing;
  const totalHeight = branchesHeight + (showEllipsis ? 60 : 30);
  const totalWidth = 320;

  const busLeftX = 50;
  const busRightX = 270;
  const firstBranchY = 35;

  const lastBranchY = firstBranchY + (maxVisible - 1) * branchSpacing;

  const strokeColor = 'hsl(var(--circuit-line))';
  const textColor = 'hsl(var(--muted-foreground))';

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="max-w-full"
    >
      {/* +V label & terminal on left bus */}
      <text x={busLeftX} y={firstBranchY - 18} textAnchor="middle" fontSize="9" fontWeight="700" fill={textColor}>+{voltage}V</text>
      <circle cx={busLeftX} cy={firstBranchY - 8} r="3" fill={strokeColor} />
      <line x1={busLeftX} y1={firstBranchY - 8} x2={busLeftX} y2={firstBranchY} stroke={strokeColor} strokeWidth="2.5" />

      {/* Left bus (positive) */}
      <line x1={busLeftX} y1={firstBranchY} x2={busLeftX} y2={lastBranchY} stroke={strokeColor} strokeWidth="2" />

      {/* GND label & symbol on right bus */}
      <text x={busRightX} y={firstBranchY - 18} textAnchor="middle" fontSize="9" fontWeight="700" fill={textColor}>GND</text>
      <line x1={busRightX} y1={firstBranchY - 8} x2={busRightX} y2={firstBranchY} stroke={strokeColor} strokeWidth="2.5" />
      {/* GND symbol lines */}
      <line x1={busRightX - 8} y1={firstBranchY - 8} x2={busRightX + 8} y2={firstBranchY - 8} stroke={strokeColor} strokeWidth="2" />
      <line x1={busRightX - 5} y1={firstBranchY - 13} x2={busRightX + 5} y2={firstBranchY - 13} stroke={strokeColor} strokeWidth="1.5" />
      <line x1={busRightX - 2} y1={firstBranchY - 17} x2={busRightX + 2} y2={firstBranchY - 17} stroke={strokeColor} strokeWidth="1" />

      {/* Right bus (GND) */}
      <line x1={busRightX} y1={firstBranchY} x2={busRightX} y2={lastBranchY} stroke={strokeColor} strokeWidth="2" />

      {/* Branches */}
      {Array.from({ length: maxVisible }).map((_, i) => {
        const y = firstBranchY + i * branchSpacing;
        const resistorX = 80;
        const resistorW = 44;
        const ledX = 195;

        return (
          <g key={i}>
            {/* Branch line from left bus to resistor */}
            <line x1={busLeftX} y1={y} x2={resistorX} y2={y} stroke={strokeColor} strokeWidth="1.5" />

            {/* Resistor */}
            <rect x={resistorX} y={y - 9} width={resistorW} height="18" rx="3.5"
                  fill="hsl(35, 30%, 80%)" stroke={strokeColor} strokeWidth="1" />
            <text x={resistorX + resistorW / 2} y={y + 3.5} textAnchor="middle" fontSize="7" fontWeight="600" fill={strokeColor}>
              {resistance}Ω
            </text>

            {/* Wire from resistor to LED */}
            <line x1={resistorX + resistorW} y1={y} x2={ledX - 10} y2={y} stroke={strokeColor} strokeWidth="1.5" />

            {/* LED */}
            <polygon
              points={`${ledX - 10},${y - 9} ${ledX + 6},${y} ${ledX - 10},${y + 9}`}
              fill={ledColor}
              fillOpacity={0.3}
              stroke={ledColor}
              strokeWidth="1.3"
            />
            <line x1={ledX + 6} y1={y - 9} x2={ledX + 6} y2={y + 9} stroke={ledColor} strokeWidth="1.8" />

            {/* Rays */}
            <line x1={ledX} y1={y - 13} x2={ledX + 7} y2={y - 19} stroke={ledColor} strokeWidth="0.7" />
            <line x1={ledX + 4} y1={y - 12} x2={ledX + 11} y2={y - 18} stroke={ledColor} strokeWidth="0.7" />

            {/* Wire from LED to right bus */}
            <line x1={ledX + 6} y1={y} x2={busRightX} y2={y} stroke={strokeColor} strokeWidth="1.5" />

            {/* Label */}
            <text x={busRightX + 6} y={y + 3} fontSize="7" fill={textColor}>LED{i + 1}</text>
          </g>
        );
      })}

      {/* Ellipsis */}
      {showEllipsis && (() => {
        const ellipsisY = firstBranchY + maxVisible * branchSpacing - 10;
        return (
          <text x={totalWidth / 2} y={ellipsisY} textAnchor="middle" fontSize="16" fontWeight="700" fill={textColor}>
            ⋮
          </text>
        );
      })()}
    </svg>
  );
};

export default ParallelCircuit;
