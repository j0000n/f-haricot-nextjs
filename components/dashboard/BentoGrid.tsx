"use client";

import { type ReactNode } from "react";
import { useTokens } from "@/hooks/useTheme";

interface BentoGridProps {
  children: ReactNode;
}

export function BentoGrid({ children }: BentoGridProps) {
  const tokens = useTokens();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        padding: `${tokens.padding.screen}px 0`,
      }}
    >
      {children}
    </div>
  );
}
