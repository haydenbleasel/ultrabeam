'use client';

import createGlobe, { type Marker } from 'cobe';
import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useSpring } from 'react-spring';

type GlobeProps = {
  readonly lat?: number;
  readonly long?: number;
  readonly markers?: Marker[];
};

const locationToAngles = (lat: number, long: number) => [
  Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
];

export const Globe: FC<GlobeProps> = ({ lat, long, markers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef([0, 0]);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 80,
      friction: 50,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    if (!lat && !long) {
      focusRef.current = [0, 0];
    } else {
      focusRef.current = locationToAngles(lat ?? 0, long ?? 0);
    }
  }, [lat, long]);

  useEffect(() => {
    let width = 0;
    let currentPhi = 0;
    let currentTheta = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);

    onResize();

    if (!canvasRef.current) {
      return undefined;
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.14, 0.36, 0.92],
      glowColor: [1, 1, 1],
      markers: markers ?? [],
      onRender: (state) => {
        if (!pointerInteracting.current || !focusRef.current[0]) {
          currentPhi += 0.003;
        }
        const newPhi = currentPhi + r.get();
        state.phi = newPhi;
        state.theta = currentTheta;
        state.width = width * 2;
        state.height = width * 2;
        if (focusRef.current[0] !== 0) {
          const [focusPhi, focusTheta] = focusRef.current;
          const distPositive =
            (focusPhi - newPhi + Math.PI * 2) % (Math.PI * 2);
          const distNegative =
            (newPhi - focusPhi + Math.PI * 2) % (Math.PI * 2);
          if (distPositive < distNegative) {
            currentPhi += distPositive * 0.08;
          } else {
            currentPhi -= distNegative * 0.08;
          }
          currentTheta = currentTheta * 0.92 + focusTheta * 0.08;
        }
      },
    });

    setTimeout(() => {
      if (!canvasRef.current) {
        return;
      }
      canvasRef.current.style.opacity = '0.5';
    }, 200);

    return () => globe.destroy();
  }, [r, markers]);

  return (
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        aria-label="Planet"
        onPointerDown={(event) => {
          pointerInteracting.current =
            event.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing';
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab';
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(event) => {
          if (pointerInteracting.current !== null) {
            const delta = event.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        className="h-full w-full cursor-grab opacity-0 transition duration-1000"
        style={{
          contain: 'layout paint size',
        }}
      />
    </div>
  );
};
