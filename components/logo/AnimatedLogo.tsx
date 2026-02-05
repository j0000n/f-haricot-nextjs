"use client";

import React, { useEffect, useRef, useState } from "react";
import { useId } from "react";

interface AnimatedLogoProps {
  size?: number | string;
  className?: string;
  baseColor?: string; // Base color to generate 3 tones from
}

// Helper function to convert hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate 3 tones from a base color
function generateThreeTones(baseColor: string): [string, string, string] {
  const [h, s, l] = hexToHsl(baseColor);
  
  // Light tone: increase lightness by 30%
  const lightL = Math.min(100, l + 30);
  const lightColor = hslToHex(h, s, lightL);
  
  // Medium tone: base color
  const mediumColor = baseColor;
  
  // Dark tone: decrease lightness by 30%
  const darkL = Math.max(0, l - 30);
  const darkColor = hslToHex(h, s, darkL);
  
  return [lightColor, mediumColor, darkColor];
}

export function AnimatedLogo({
  size = 100,
  className,
  baseColor = "#4a1f1f", // Default dark burgundy
}: AnimatedLogoProps) {
  const instanceId = useId().replace(/:/g, "-");
  const cls1 = `logo-cls-1-${instanceId}`;
  const cls2 = `logo-cls-2-${instanceId}`;
  const cls3 = `logo-cls-3-${instanceId}`;

  // Generate 3 tones from base color
  const [lightTone, mediumTone, darkTone] = generateThreeTones(baseColor);
  
  // Create color arrays for smooth animation
  const color1Tones = [lightTone, mediumTone, darkTone, lightTone];
  const color2Tones = [mediumTone, darkTone, lightTone, mediumTone];
  const color3Tones = [darkTone, lightTone, mediumTone, darkTone];

  const [color1, setColor1] = useState(color1Tones[0]);
  const [color2, setColor2] = useState(color2Tones[0]);
  const [color3, setColor3] = useState(color3Tones[0]);

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const duration = 14000; // 14 seconds for full cycle

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = (elapsed % duration) / duration;

      // Calculate which segment we're in (0-3)
      const segmentCount = color1Tones.length - 1;
      const segmentSize = 1 / segmentCount;
      const segmentIndex = Math.min(
        Math.floor(progress / segmentSize),
        segmentCount - 1
      );

      const segmentStart = segmentIndex * segmentSize;
      const segmentEnd = (segmentIndex + 1) * segmentSize;
      const ratio = (progress - segmentStart) / (segmentEnd - segmentStart);

      // Interpolate between colors in current segment
      const interpolateHex = (color1: string, color2: string, ratio: number): string => {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);

        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);

        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      };

      setColor1(interpolateHex(color1Tones[segmentIndex], color1Tones[segmentIndex + 1], ratio));
      setColor2(interpolateHex(color2Tones[segmentIndex], color2Tones[segmentIndex + 1], ratio));
      setColor3(interpolateHex(color3Tones[segmentIndex], color3Tones[segmentIndex + 1], ratio));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [baseColor]);

  return (
    <svg
      id={`Layer_2_${instanceId}`}
      data-name="Layer 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <style>
          {`.${cls1} { fill: ${color1} !important; }
            .${cls2} { fill: ${color2} !important; }
            .${cls3} { fill: ${color3} !important; }`}
        </style>
      </defs>
      <g id={`Layer_1-2_${instanceId}`} data-name="Layer 1">
        <g>
          <rect className={cls2} width="33.33" height="100" rx="8.12" ry="8.12" />
          <rect className={cls2} x="66.66" width="33.33" height="100" rx="8.12" ry="8.12" />
          <path
            className={cls1}
            d="M66.67,16.67h0c0,9.2-7.46,16.67-16.67,16.67h0c-9.2,0-16.67-7.46-16.67-16.67h0C33.33,7.46,25.87,0,16.67,0h0C7.46,0,0,7.46,0,16.67v16.67s0,33.33,0,33.33v16.67c0,9.2,7.46,16.67,16.67,16.67h0c9.2,0,16.67-7.46,16.67-16.67h0c0-9.2,7.46-16.67,16.67-16.67h0c9.2,0,16.67,7.46,16.67,16.67h0c0,9.2,7.46,16.67,16.67,16.67h0c9.2,0,16.67-7.46,16.67-16.67v-16.67s0-33.33,0-33.33v-16.67C100,7.46,92.54,0,83.33,0h0c-9.2,0-16.67,7.46-16.67,16.67Z"
          />
          <path
            className={cls2}
            d="M83.33,0c-9.2,0-16.67,7.46-16.67,16.66v16.67h-33.33v-16.67C33.33,7.46,25.87,0,16.67,0S0,7.46,0,16.66v66.67c0,9.2,7.46,16.66,16.67,16.66s16.66-7.46,16.66-16.66v-16.67h33.33v16.67c0,9.2,7.46,16.66,16.67,16.66s16.66-7.46,16.66-16.66V16.66c0-9.2-7.46-16.66-16.66-16.66ZM94.99,83.34c0,6.44-5.22,11.66-11.66,11.66s-11.67-5.22-11.67-11.66v-21.67H28.33v21.67c0,6.44-5.22,11.66-11.66,11.66s-11.67-5.22-11.67-11.66V16.66c0-6.44,5.22-11.66,11.67-11.66s11.66,5.22,11.66,11.66v21.67h43.33v-21.67c0-6.44,5.22-11.66,11.67-11.66s11.66,5.22,11.66,11.66v66.67Z"
          />
          <g>
            <path className={cls3} d="M5,50s0,.07,0,.1v-.2s0,.07,0,.1Z" />
            <path
              className={cls3}
              d="M5.01,38.1v-21.44c0-6.44,5.22-11.66,11.67-11.66s11.66,5.22,11.66,11.66v16.67h5v-16.67C33.34,7.46,25.87,0,16.67,0S0,7.46,0,16.66v33.24c.03-4.62,1.94-8.79,5-11.8Z"
            />
            <path
              className={cls3}
              d="M28.34,83.34c0,6.44-5.22,11.66-11.66,11.66s-11.67-5.22-11.67-11.66v-21.44C1.94,58.89.03,54.72,0,50.1v33.24c0,9.2,7.46,16.66,16.67,16.66s16.66-7.46,16.66-16.66v-16.67h-5v16.67Z"
            />
            <rect className={cls3} x="28.34" y="38.33" width="5" height="23.33" />
            <path
              className={cls3}
              d="M95,49.9v-11.8c-3.01-2.95-7.12-4.77-11.66-4.77h-11.67v5h11.67c6.41,0,11.61,5.17,11.66,11.57Z"
            />
            <path
              className={cls3}
              d="M16.66,38.33h11.67v-5h-11.67c-4.54,0-8.65,1.82-11.66,4.77v11.8c.05-6.4,5.25-11.57,11.66-11.57Z"
            />
            <rect className={cls3} x="33.34" y="61.66" width="33.33" height="5" />
            <path
              className={cls3}
              d="M5.01,50.1v11.8c3.01,2.95,7.12,4.77,11.66,4.77h11.67v-5h-11.67c-6.41,0-11.61-5.17-11.66-11.57Z"
            />
            <rect className={cls3} x="33.34" y="33.33" width="33.33" height="5" />
            <path className={cls3} d="M0,50s0,.07,0,.1v-.2s0,.07,0,.1Z" />
            <path className={cls3} d="M100,50s0-.06,0-.1v.2s0-.06,0-.1Z" />
            <path
              className={cls3}
              d="M83.34,61.66h-11.67v5h11.67c4.54,0,8.65-1.82,11.66-4.77v-11.8c-.05,6.4-5.25,11.57-11.66,11.57Z"
            />
            <path
              className={cls3}
              d="M71.67,16.66c0-6.44,5.22-11.66,11.67-11.66s11.66,5.22,11.66,11.66v21.44c3.06,3,4.97,7.18,5,11.8V16.66c0-9.2-7.46-16.66-16.66-16.66s-16.67,7.46-16.67,16.66v16.67h5v-16.67Z"
            />
            <path
              className={cls3}
              d="M95,61.9v21.44c0,6.44-5.22,11.66-11.66,11.66s-11.67-5.22-11.67-11.66v-16.67h-5v16.67c0,9.2,7.46,16.66,16.67,16.66s16.66-7.46,16.66-16.66v-33.24c-.03,4.62-1.94,8.8-5,11.8Z"
            />
            <path className={cls3} d="M95,50s0-.06,0-.1v.2s0-.06,0-.1Z" />
            <rect className={cls3} x="66.67" y="38.33" width="5" height="23.33" />
          </g>
        </g>
      </g>
    </svg>
  );
}
