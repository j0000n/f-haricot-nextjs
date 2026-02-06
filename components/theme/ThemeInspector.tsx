"use client";

import type { ThemeDefinition, ThemeTokens } from "@/styles/themes";
import styles from "./theme.module.css";

type TokenEntry = {
  key: string;
  value: string | number | boolean;
};

function flattenTokens(obj: Record<string, unknown>, prefix = ""): TokenEntry[] {
  const entries: TokenEntry[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      entries.push({ key: nextKey, value: value.join(", ") });
      continue;
    }

    if (typeof value === "object") {
      entries.push(...flattenTokens(value as Record<string, unknown>, nextKey));
      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      entries.push({ key: nextKey, value });
      continue;
    }

    entries.push({ key: nextKey, value: String(value) });
  }

  return entries;
}

type ThemeInspectorProps = {
  definition: ThemeDefinition;
  tokens: ThemeTokens;
};

export function ThemeInspector({ definition, tokens }: ThemeInspectorProps) {
  const groups: Array<{ title: string; entries: TokenEntry[]; isColor?: boolean }> = [
    { title: "Colors", entries: flattenTokens(tokens.colors), isColor: true },
    { title: "Spacing", entries: flattenTokens(tokens.spacing) },
    { title: "Padding", entries: flattenTokens(tokens.padding) },
    { title: "Radii", entries: flattenTokens(tokens.radii) },
    { title: "Typography", entries: flattenTokens(tokens.typography) },
    { title: "Font Families", entries: flattenTokens(tokens.fontFamilies) },
    { title: "Layout", entries: flattenTokens(tokens.layout) },
    { title: "Shadows", entries: flattenTokens(tokens.shadows) },
    { title: "Border Widths", entries: flattenTokens(tokens.borderWidths) },
    { title: "Line Heights", entries: flattenTokens(tokens.lineHeights) },
    { title: "Letter Spacing", entries: flattenTokens(tokens.letterSpacing) },
    { title: "Opacity", entries: flattenTokens(tokens.opacity) },
    { title: "Icon Sizes", entries: flattenTokens(tokens.iconSizes) },
    { title: "Widths", entries: flattenTokens(tokens.widths) },
    { title: "Component Sizes", entries: flattenTokens(tokens.componentSizes) },
    { title: "Components", entries: flattenTokens(tokens.components) },
    { title: "Assets", entries: [{ key: "logo", value: definition.assets.logo }] },
  ];

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.md,
        padding: tokens.spacing.md,
        borderRadius: tokens.radii.md,
        border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div className={styles.sectionHeader}>
        <h2
          style={{
            margin: 0,
            fontFamily: tokens.fontFamilies.display,
            fontSize: tokens.typography.subheading,
            color: tokens.colors.textPrimary,
          }}
        >
          {definition.label}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: tokens.fontFamilies.regular,
            fontSize: tokens.typography.tiny,
            color: tokens.colors.textSecondary,
          }}
        >
          {definition.description}
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.title}>
          <h3
            className={styles.sectionTitle}
            style={{
              color: tokens.colors.textSecondary,
              fontFamily: tokens.fontFamilies.semiBold,
            }}
          >
            {group.title}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {group.entries.map((entry) => (
              <div
                key={`${group.title}-${entry.key}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.extraSmall,
                  color: tokens.colors.textPrimary,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {group.isColor && typeof entry.value === "string" ? (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `1px solid ${tokens.colors.border}`,
                        backgroundColor: entry.value,
                        display: "inline-block",
                      }}
                    />
                  ) : null}
                  <span style={{ color: tokens.colors.textSecondary }}>{entry.key}</span>
                </div>
                <span style={{ color: tokens.colors.textPrimary }}>{String(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
