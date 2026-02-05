import React, { useId } from "react";

interface LogoProps {
  size?: number | string;
  className?: string;
  color1?: string; // Light blue - cls-1
  color2?: string; // Yellow - cls-2
  color3?: string; // Green - cls-3
}

export function Logo({
  size = 100,
  className,
  color1 = "#b3e2f0",
  color2 = "#ffd325",
  color3 = "#78c58b",
}: LogoProps) {
  // Create unique class names for this instance to avoid style conflicts
  const instanceId = useId().replace(/:/g, "-");
  const cls1 = `logo-cls-1-${instanceId}`;
  const cls2 = `logo-cls-2-${instanceId}`;
  const cls3 = `logo-cls-3-${instanceId}`;
  
  return (
    <svg
      id="Layer_2"
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
      <g id="Layer_1-2" data-name="Layer 1">
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
