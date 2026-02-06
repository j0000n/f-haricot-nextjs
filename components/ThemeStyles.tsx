"use client";

import { useTokens } from "@/hooks/useTheme";
import { useEffect } from "react";

export function ThemeStyles() {
  const tokens = useTokens();

  useEffect(() => {
    // Apply theme tokens as CSS variables to document root
    const root = document.documentElement;
    
    // Colors
    root.style.setProperty("--color-background", tokens.colors.background);
    root.style.setProperty("--color-surface", tokens.colors.surface);
    root.style.setProperty("--color-overlay", tokens.colors.overlay);
    root.style.setProperty("--color-text-primary", tokens.colors.textPrimary);
    root.style.setProperty("--color-text-secondary", tokens.colors.textSecondary);
    root.style.setProperty("--color-text-muted", tokens.colors.textMuted);
    root.style.setProperty("--color-border", tokens.colors.border);
    root.style.setProperty("--color-accent", tokens.colors.accent);
    root.style.setProperty("--color-success", tokens.colors.success);
    root.style.setProperty("--color-danger", tokens.colors.danger);
    root.style.setProperty("--color-info", tokens.colors.info);

    // Spacing
    root.style.setProperty("--spacing-xs", `${tokens.spacing.xs}px`);
    root.style.setProperty("--spacing-sm", `${tokens.spacing.sm}px`);
    root.style.setProperty("--spacing-md", `${tokens.spacing.md}px`);
    root.style.setProperty("--spacing-lg", `${tokens.spacing.lg}px`);
    root.style.setProperty("--spacing-xl", `${tokens.spacing.xl}px`);

    // Typography
    root.style.setProperty("--font-display", tokens.fontFamilies.display);
    root.style.setProperty("--font-regular", tokens.fontFamilies.regular);
    root.style.setProperty("--font-bold", tokens.fontFamilies.bold);
    root.style.setProperty("--font-size-body", `${tokens.typography.body}px`);
    root.style.setProperty("--font-size-heading", `${tokens.typography.heading}px`);
    root.style.setProperty("--font-size-subheading", `${tokens.typography.subheading}px`);

    // Radii
    root.style.setProperty("--radius-sm", `${tokens.radii.sm}px`);
    root.style.setProperty("--radius-md", `${tokens.radii.md}px`);
    root.style.setProperty("--radius-lg", `${tokens.radii.lg}px`);

    // Padding
    root.style.setProperty("--padding-screen", `${tokens.padding.screen}px`);
    root.style.setProperty("--padding-section", `${tokens.padding.section}px`);
    root.style.setProperty("--padding-card", `${tokens.padding.card}px`);

    return () => {
      // Cleanup: remove CSS variables on unmount
      root.style.removeProperty("--color-background");
      root.style.removeProperty("--color-surface");
      root.style.removeProperty("--color-overlay");
      root.style.removeProperty("--color-text-primary");
      root.style.removeProperty("--color-text-secondary");
      root.style.removeProperty("--color-text-muted");
      root.style.removeProperty("--color-border");
      root.style.removeProperty("--color-accent");
      root.style.removeProperty("--color-success");
      root.style.removeProperty("--color-danger");
      root.style.removeProperty("--color-info");
      root.style.removeProperty("--spacing-xs");
      root.style.removeProperty("--spacing-sm");
      root.style.removeProperty("--spacing-md");
      root.style.removeProperty("--spacing-lg");
      root.style.removeProperty("--spacing-xl");
      root.style.removeProperty("--font-display");
      root.style.removeProperty("--font-regular");
      root.style.removeProperty("--font-bold");
      root.style.removeProperty("--font-size-body");
      root.style.removeProperty("--font-size-heading");
      root.style.removeProperty("--font-size-subheading");
      root.style.removeProperty("--radius-sm");
      root.style.removeProperty("--radius-md");
      root.style.removeProperty("--radius-lg");
      root.style.removeProperty("--padding-screen");
      root.style.removeProperty("--padding-section");
      root.style.removeProperty("--padding-card");
    };
  }, [tokens]);

  return null;
}
