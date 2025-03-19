'use client';

import { useEffect, useState } from 'react';

const maxValue = 2200;
const targetValue = 1100;

export const Speedometer = () => {
  const [value, setValue] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (animating) {
      const animationDuration = 1500; // ms
      const startTime = Date.now();

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        // Easing function for smoother animation
        const easedProgress = 1 - (1 - progress) ** 3;

        setValue(Math.floor(easedProgress * targetValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setValue(targetValue);
          setAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }

    return () => {
      setAnimating(false);
    };
  }, [animating]);

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full overflow-hidden"
      role="img"
      aria-label="Speedometer showing performance metrics"
    >
      {/* Outer gray track (full circle) */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Colored progress arc (full circle with dashoffset) - fixed orientation */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray="565.48" // 2πr where r=90
        strokeDashoffset={565.48 - (565.48 * value) / maxValue}
        transform="rotate(180, 100, 100)" // Rotate to start from the top
      />

      {/* Tick marks */}
      {Array.from({ length: 21 }).map((_, i) => {
        // Adjust to start from bottom (-90 degrees) and span 180 degrees
        const percentage = i / 20;
        const theta = Math.PI * (1 + percentage); // Start at bottom (π) and go to top (2π)
        const x = 100 + 80 * Math.cos(theta);
        const y = 100 + 80 * Math.sin(theta);
        const textX = 100 + 60 * Math.cos(theta);
        const textY = 100 + 60 * Math.sin(theta);

        // Only show labels at reasonable intervals to prevent overlap
        const showLabel = i % 5 === 0;

        return (
          <g key={i}>
            <line
              x1={x}
              y1={y}
              x2={x - 5 * Math.cos(theta)}
              y2={y - 5 * Math.sin(theta)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            {showLabel && (
              <text
                x={textX}
                y={textY}
                fontSize="6"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--muted-foreground)"
              >
                {i * 100}
              </text>
            )}
          </g>
        );
      })}

      {/* Needle - fixed orientation */}
      <g transform={`rotate(${(value / maxValue) * 360 - 90}, 100, 100)`}>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="5" fill="var(--foreground))" />
      </g>
    </svg>
  );
};
