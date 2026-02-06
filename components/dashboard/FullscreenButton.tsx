"use client";

import { useFullscreen, useWakeLock } from "@/hooks/useFullscreen";
import { useTokens } from "@/hooks/useTheme";

export function FullscreenButton() {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();
  const { requestWakeLock, releaseWakeLock, isActive: wakeLockActive } = useWakeLock();
  const tokens = useTokens();

  const handleClick = async () => {
    const willBeFullscreen = !isFullscreen;
    await toggleFullscreen();
    
    // Request wake lock when entering fullscreen
    if (willBeFullscreen) {
      await requestWakeLock();
    } else {
      await releaseWakeLock();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        top: tokens.spacing.md,
        right: tokens.spacing.md,
        zIndex: 1000,
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
        backgroundColor: tokens.colors.surface,
        border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.sm,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.fontFamilies.medium,
        fontSize: tokens.typography.small,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.xs,
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
      }}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      <span>{isFullscreen ? "⤓" : "⤢"}</span>
      <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
      {wakeLockActive && <span style={{ fontSize: "0.75em" }}>🔒</span>}
    </button>
  );
}
