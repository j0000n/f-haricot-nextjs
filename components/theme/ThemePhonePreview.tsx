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
    <div
      className={styles.phoneShell}
      style={{
        background: `
          radial-gradient(120% 80% at 100% 0%, ${tokens.colors.accent}22 0%, transparent 60%),
          radial-gradient(120% 80% at 0% 100%, ${tokens.colors.info}18 0%, transparent 65%),
          linear-gradient(160deg, ${tokens.colors.surfaceVariant}66, ${tokens.colors.overlay}99)
        `,
      }}
    >
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
            gap: tokens.spacing.spacingCompact,
            padding: tokens.spacing.spacingStandard,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.spacingCompact,
            }}
          >
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
                  fontSize: tokens.typography.typeBody,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.typeMicro,
                  color: tokens.colors.textSecondary,
                }}
              >
                {subtitle ?? "Theme preview"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: tokens.spacing.spacingCompact }}>
            <button
              type="button"
              style={{
                backgroundColor: primaryBackground,
                color: primaryText,
                borderRadius: tokens.components.button.primary.borderRadius,
                border: "none",
                padding: `${tokens.spacing.spacingTight}px ${tokens.spacing.spacingStandard}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeMicro,
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
                padding: `${tokens.spacing.spacingTight}px ${tokens.spacing.spacingStandard}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeMicro,
              }}
            >
              Pill
            </button>
          </div>
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.spacingCompact,
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.typeCaption,
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
                  borderRadius: tokens.radii.radiusControl,
                  borderColor: tokens.colors.border,
                  backgroundColor: tokens.colors.surfaceVariant,
                }}
              >
                <div
                  style={{
                    height: 56,
                    borderRadius: tokens.radii.radiusControl,
                    backgroundColor: tokens.colors.imageBackgroundColor,
                  }}
                />
                <div
                  style={{
                    fontFamily: tokens.fontFamilies.semiBold,
                    fontSize: tokens.typography.typeMicro,
                    color: tokens.colors.textPrimary,
                  }}
                >
                  Rail Card {index + 1}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.phoneCards}
          style={{ gap: tokens.spacing.spacingCompact }}
        >
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
                  borderRadius: tokens.radii.radiusControl,
                  backgroundColor: tokens.colors.surfaceSubdued,
                }}
              />
              <div
                style={{
                  fontFamily: tokens.fontFamilies.semiBold,
                  fontSize: tokens.typography.typeCaption,
                }}
              >
                Card {index + 1}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.typeMicro,
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

        <nav
          style={{
            marginTop: "auto",
            backgroundColor: tokens.components.tabBar.list.backgroundColor,
            border: `${tokens.components.tabBar.list.borderWidth}px solid ${tokens.components.tabBar.list.borderColor}`,
            borderRadius: tokens.components.tabBar.list.borderRadius,
            padding: `${tokens.components.tabBar.list.paddingVertical}px ${tokens.components.tabBar.list.paddingHorizontal}px`,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: tokens.spacing.spacingCompact,
          }}
        >
          {(["home", "kitchen", "lists"] as const).map((tabKey, index) => {
            const isActive = index === 1;
            const iconName = tokens.components.tabBar.icon?.names?.[tabKey] ?? tabKey;

            return (
              <div
                key={tabKey}
                style={{
                  borderRadius: tokens.components.tabBar.trigger.borderRadius,
                  minHeight: tokens.components.tabBar.trigger.minHeight,
                  backgroundColor: isActive
                    ? tokens.components.tabBar.trigger.activeBackgroundColor
                    : tokens.components.tabBar.trigger.inactiveBackgroundColor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  border:
                    tokens.components.tabBar.trigger.shape === "square"
                      ? `1px solid ${tokens.colors.border}`
                      : "none",
                }}
              >
                {tokens.components.tabBar.icon?.show ? (
                  <span
                    style={{
                      fontSize: 10,
                      color: isActive
                        ? tokens.components.tabBar.icon.activeColor
                        : tokens.components.tabBar.icon.inactiveColor,
                      fontFamily: tokens.fontFamilies.medium,
                    }}
                  >
                    {iconName}
                  </span>
                ) : null}
                {tokens.components.tabBar.label.show ? (
                  <span
                    style={{
                      fontSize: tokens.typography.typeMicro,
                      fontFamily: tokens.fontFamilies.semiBold,
                      color: isActive
                        ? tokens.components.tabBar.label.activeColor
                        : tokens.components.tabBar.label.color,
                      textTransform: tokens.components.tabBar.label.uppercase
                        ? "uppercase"
                        : "none",
                      letterSpacing: tokens.components.tabBar.label.letterSpacing,
                    }}
                  >
                    {tabKey}
                  </span>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
