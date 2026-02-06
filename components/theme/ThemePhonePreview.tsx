"use client";

import { Logo } from "@/components/logo/Logo";
import type { ThemeTokens } from "@/styles/themes";
import styles from "./theme.module.css";

type ThemePhonePreviewProps = {
  tokens: ThemeTokens;
  label: string;
  subtitle?: string;
  showChrome?: boolean;
};

export function ThemePhonePreview({
  tokens,
  label,
  subtitle,
  showChrome = true,
}: ThemePhonePreviewProps) {
  const primaryBackground =
    tokens.components.button.primary.colorCustom ?? tokens.colors.accent;
  const primaryText =
    tokens.components.button.primary.textColorCustom ??
    tokens.colors.accentOnPrimary;
  const pillBackground =
    tokens.components.button.pill.colorCustom ?? tokens.colors.accent;
  const pillText =
    tokens.components.button.pill.textColorCustom ??
    tokens.colors.accentOnPrimary;

  return (
    <div className={styles.phoneShell}>
      {showChrome ? (
        <div className={styles.phoneNotch}>
          <span />
        </div>
      ) : null}

      <div
        className={styles.phoneScreen}
        style={{
          backgroundColor: tokens.colors.background,
          color: tokens.colors.textPrimary,
        }}
      >
        <section
          className={styles.phoneHeader}
          style={{
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.border,
            borderRadius: tokens.radii.md,
            gap: tokens.spacing.xs,
            padding: tokens.spacing.sm,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.xs }}>
            <Logo
              size={44}
              color1={tokens.colors.logoPrimaryColor}
              color2={tokens.colors.logoSecondaryColor}
              color3={tokens.colors.logoTertiaryColor}
            />
            <div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.display,
                  fontSize: tokens.typography.body,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.tiny,
                  color: tokens.colors.textSecondary,
                }}
              >
                {subtitle ?? "Theme preview"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: tokens.spacing.xs }}>
            <button
              type="button"
              style={{
                backgroundColor: primaryBackground,
                color: primaryText,
                borderRadius: tokens.components.button.primary.borderRadius,
                border: "none",
                padding: `${tokens.spacing.xxs}px ${tokens.spacing.sm}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.tiny,
              }}
            >
              Primary
            </button>
            <button
              type="button"
              style={{
                backgroundColor: pillBackground,
                color: pillText,
                borderRadius: tokens.components.button.pill.borderRadius,
                border: "none",
                padding: `${tokens.spacing.xxs}px ${tokens.spacing.sm}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.tiny,
              }}
            >
              Pill
            </button>
          </div>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.xs }}>
          <div
            style={{
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.small,
              color: tokens.colors.textSecondary,
            }}
          >
            Featured Rail
          </div>
          <div className={styles.phoneRail} style={{ gap: tokens.components.rail.cardGap }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`phone-rail-${index}`}
                className={styles.phoneRailCard}
                style={{
                  borderRadius: tokens.radii.sm,
                  borderColor: tokens.colors.border,
                  backgroundColor: tokens.colors.surfaceVariant,
                }}
              >
                <div
                  style={{
                    height: 56,
                    borderRadius: tokens.radii.sm,
                    backgroundColor: tokens.colors.imageBackgroundColor,
                  }}
                />
                <div
                  style={{
                    fontFamily: tokens.fontFamilies.semiBold,
                    fontSize: tokens.typography.tiny,
                    color: tokens.colors.textPrimary,
                  }}
                >
                  Rail Card {index + 1}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.phoneCards} style={{ gap: tokens.spacing.xs }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <article
              key={`phone-card-${index}`}
              style={{
                borderRadius: tokens.components.card.borderRadius,
                border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                backgroundColor: tokens.colors.surface,
                padding: tokens.components.card.padding,
                display: "flex",
                flexDirection: "column",
                gap: tokens.components.card.gap,
              }}
            >
              <div
                style={{
                  height: 72,
                  borderRadius: tokens.radii.sm,
                  backgroundColor: tokens.colors.surfaceSubdued,
                }}
              />
              <div
                style={{
                  fontFamily: tokens.fontFamilies.semiBold,
                  fontSize: tokens.typography.small,
                }}
              >
                Card {index + 1}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.tiny,
                  color: tokens.colors.textSecondary,
                }}
              >
                Spacing, typography, and card chrome from this theme.
              </div>
            </article>
          ))}
        </section>

        <section className={styles.paletteStrip}>
          {[
            tokens.colors.background,
            tokens.colors.surface,
            tokens.colors.overlay,
            tokens.colors.accent,
            tokens.colors.success,
            tokens.colors.danger,
            tokens.colors.info,
          ].map((color) => (
            <span
              key={color}
              style={{
                backgroundColor: color,
                borderColor: tokens.colors.border,
              }}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
