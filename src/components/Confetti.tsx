"use client";

import { useEffect, useState, type CSSProperties } from "react";

const COLORS = ["#58cc02", "#1cb0f6", "#ffc800", "#ff9600", "#ce82ff", "#ff4b4b"];

type Piece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
  color: string;
};

function createPieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.2,
    rotation: 360 + Math.random() * 360,
    drift: (Math.random() - 0.5) * 140,
    color: COLORS[id % COLORS.length],
  }));
}

export function Confetti({ pieceCount = 70 }: { pieceCount?: number }) {
  const [pieces] = useState(() => createPieces(pieceCount));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 3600);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti-fall absolute top-[-10px] block h-2.5 w-1.5 rounded-sm"
          style={
            {
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--confetti-rotation": `${piece.rotation}deg`,
              "--confetti-drift": `${piece.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
