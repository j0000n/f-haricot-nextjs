"use client";

import type { ThemeTokens } from "@/styles/themes";

type ThemeOptionCardProps = {
  label: string;
  description: string;
  tokens: ThemeTokens;
  isActive: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export function ThemeOptionCard({
  label,
  description,
  tokens,
  isActive,
  disabled,
  onSelect,
}: ThemeOptionCardProps) {
  const backgroundColor = isActive ? tokens.colors.accent : tokens.colors.surface;
  const borderColor = isActive ? tokens.colors.accent : tokens.colors.border;
  const textColor = isActive ? tokens.colors.accentOnPrimary : tokens.colors.textPrimary;
  const descriptionColor = isActive ? tokens.colors.accentOnPrimary : tokens.colors.textSecondary;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      style={{
        width: "100%",
        textAlign: "left",
        backgroundColor,
        border: `${tokens.borderWidths.thin}px solid ${borderColor}`,
        borderRadius: tokens.radii.sm,
        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.xxs,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? tokens.opacity.disabled : 1,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        color: textColor,
      }}
      onMouseEnter={(event) => {
        if (disabled) return;
        event.currentTarget.style.transform = "translateY(-1px)";
        event.currentTarget.style.boxShadow = `0 6px 14px ${tokens.colors.overlay}`;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      <span
        style={{
          fontFamily: tokens.fontFamilies.display,
          fontSize: tokens.typography.body,
          lineHeight: tokens.lineHeights.normal,
          color: textColor,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: tokens.fontFamilies.regular,
          fontSize: tokens.typography.tiny,
          color: descriptionColor,
        }}
      >
        {description}
      </span>
    </button>
  );
}
