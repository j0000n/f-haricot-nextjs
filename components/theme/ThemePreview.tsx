"use client";

import { Logo } from "@/components/logo/Logo";
import type { ThemeTokens } from "@/styles/themes";

type ThemePreviewFocus =
  | "identity"
  | "palette"
  | "typography"
  | "spacing"
  | "navigation"
  | null;

type ThemePreviewProps = {
  tokens: ThemeTokens;
  focus?: ThemePreviewFocus;
};

const colorKeys: Array<keyof ThemeTokens["colors"]> = [
  "background",
  "surface",
  "overlay",
  "surfaceVariant",
  "surfaceSubdued",
  "surfaceMuted",
  "primary",
  "onPrimary",
  "muted",
  "textPrimary",
  "textSecondary",
  "textMuted",
  "border",
  "accent",
  "accentOnPrimary",
  "success",
  "danger",
  "info",
];

function focusFrame(active: boolean, tokens: ThemeTokens): React.CSSProperties {
  if (!active) {
    return {};
  }

  return {
    boxShadow: `0 0 0 3px ${tokens.colors.accent}33`,
    borderColor: tokens.colors.accent,
  };
}

export function ThemePreview({ tokens, focus = null }: ThemePreviewProps) {
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
      style={{
        backgroundColor: tokens.colors.background,
        color: tokens.colors.textPrimary,
        minHeight: "100vh",
        padding: tokens.padding.section,
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.spacingRoomy,
      }}
    >
      <section
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radii.radiusSurface,
          border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
          padding: tokens.padding.card,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: tokens.spacing.spacingComfortable,
          ...focusFrame(focus === "identity", tokens),
        }}
      >
        <Logo
          size={64}
          color1={tokens.colors.logoPrimaryColor}
          color2={tokens.colors.logoSecondaryColor}
          color3={tokens.colors.logoTertiaryColor}
        />
        <div style={{ flex: "1 1 240px" }}>
          <div
            style={{
              fontFamily: tokens.fontFamilies.display,
              fontSize: tokens.typography.typeTitle,
              lineHeight: tokens.lineHeights.tight,
            }}
          >
            Theme Preview
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.typeCaption,
              color: tokens.colors.textSecondary,
            }}
          >
            Rails, cards, typography, and spacing rendered with the active tokens.
          </div>
        </div>
        <button
          type="button"
          style={{
            backgroundColor: primaryBackground,
            color: primaryText,
            borderRadius: tokens.components.button.primary.borderRadius,
            border: "none",
            padding: `${tokens.components.button.primary.paddingVertical}px ${tokens.components.button.primary.paddingHorizontal}px`,
            fontFamily: tokens.fontFamilies.semiBold,
            fontSize: tokens.components.button.primary.fontSize,
            cursor: "pointer",
          }}
        >
          Primary Action
        </button>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: tokens.spacing.spacingComfortable,
          ...focusFrame(focus === "spacing", tokens),
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`card-${index}`}
            style={{
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.components.card.borderRadius,
              border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
              padding: tokens.components.card.padding,
              display: "flex",
              flexDirection: "column",
              gap: tokens.components.card.gap,
            }}
          >
            <div
              style={{
                height: tokens.components.card.imageHeight,
                borderRadius: tokens.radii.radiusControl,
                background: tokens.colors.imageBackgroundColor,
              }}
            />
            <div
              style={{
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeBody,
              }}
            >
              Card Title {index + 1}
            </div>
            <div
              style={{
                fontFamily: tokens.fontFamilies.regular,
                fontSize: tokens.typography.typeMicro,
                color: tokens.colors.textSecondary,
              }}
            >
              Short description copy using the theme's text color scale.
            </div>
          </div>
        ))}
      </section>

      <section style={{ ...focusFrame(focus === "spacing", tokens) }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: tokens.components.rail.headerGap,
            marginBottom: tokens.components.rail.headerMarginBottom,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.typeSubheading,
            }}
          >
            Preview Rail
          </h2>
          <span
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.typeMicro,
              color: tokens.colors.textSecondary,
            }}
          >
            Card spacing + scroll padding
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: tokens.components.rail.cardGap,
            overflowX: "auto",
            paddingBottom: tokens.components.rail.scrollPadding,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`rail-${index}`}
              style={{
                minWidth: 180,
                backgroundColor: tokens.colors.surfaceVariant,
                borderRadius: tokens.radii.radiusCard,
                padding: tokens.spacing.spacingStandard,
                border: `${tokens.borderWidths.hairline}px solid ${tokens.colors.border}`,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.spacingCompact,
              }}
            >
              <div
                style={{
                  height: 72,
                  borderRadius: tokens.radii.radiusControl,
                  background: tokens.colors.surfaceMuted,
                }}
              />
              <div
                style={{
                  fontFamily: tokens.fontFamilies.semiBold,
                  fontSize: tokens.typography.typeCaption,
                }}
              >
                Rail Card {index + 1}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.typeMicro,
                  color: tokens.colors.textSecondary,
                }}
              >
                Compact copy
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: tokens.spacing.spacingRoomy,
        }}
      >
        <div
          style={{
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radii.radiusCard,
            border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
            padding: tokens.padding.card,
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.spacingStandard,
            ...focusFrame(focus === "typography", tokens),
          }}
        >
          <div
            style={{
              fontFamily: tokens.fontFamilies.display,
              fontSize: tokens.typography.typeDisplay,
            }}
          >
            Display
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.typeTitle,
            }}
          >
            Title Text
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.medium,
              fontSize: tokens.typography.typeHeading,
            }}
          >
            Heading Sample
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.typeBody,
            }}
          >
            Body copy example with relaxed line height.
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.typeMicro,
              color: tokens.colors.textSecondary,
            }}
          >
            Tiny helper text
          </div>
        </div>

        <div
          style={{
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radii.radiusCard,
            border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
            padding: tokens.padding.card,
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.spacingStandard,
            ...focusFrame(focus === "typography", tokens),
          }}
        >
          <label
            style={{
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.typeCaption,
            }}
          >
            Input label
          </label>
          <input
            placeholder="Type something"
            style={{
              padding: `${tokens.components.input.paddingVertical}px ${tokens.components.input.paddingHorizontal}px`,
              borderRadius: tokens.components.input.borderRadius,
              border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
              backgroundColor: tokens.colors.surfaceSubdued,
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.components.input.fontSize,
              color: tokens.colors.textPrimary,
            }}
          />
          <textarea
            placeholder="Longer text area"
            style={{
              minHeight: tokens.components.textArea.minHeight,
              padding: tokens.components.textArea.padding,
              borderRadius: tokens.components.textArea.borderRadius,
              border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
              backgroundColor: tokens.colors.surfaceSubdued,
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.typeBody,
              color: tokens.colors.textPrimary,
              resize: "vertical",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: tokens.spacing.spacingCompact,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={{
                backgroundColor: tokens.colors.surfaceVariant,
                color: tokens.colors.textPrimary,
                borderRadius: tokens.components.button.secondary.borderRadius,
                border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                padding: `${tokens.components.button.secondary.paddingVertical}px ${tokens.components.button.secondary.paddingHorizontal}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.components.button.secondary.fontSize,
                cursor: "pointer",
              }}
            >
              Secondary
            </button>
            <button
              type="button"
              style={{
                backgroundColor: pillBackground,
                color: pillText,
                borderRadius: tokens.components.button.pill.borderRadius,
                border: "none",
                padding: `${tokens.components.button.pill.paddingVertical}px ${tokens.components.button.pill.paddingHorizontal}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeMicro,
                cursor: "pointer",
              }}
            >
              Pill
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "transparent",
                color: tokens.colors.accent,
                border: "none",
                padding: `${tokens.components.button.text.paddingVertical}px ${tokens.components.button.text.paddingHorizontal}px`,
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeCaption,
                cursor: "pointer",
              }}
            >
              Text Button
            </button>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radii.radiusCard,
          border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
          padding: tokens.padding.card,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: tokens.spacing.spacingStandard,
          ...focusFrame(focus === "palette", tokens),
        }}
      >
        {colorKeys.map((key) => (
          <div
            key={key}
            style={{
              borderRadius: tokens.radii.radiusControl,
              border: `${tokens.borderWidths.hairline}px solid ${tokens.colors.border}`,
              overflow: "hidden",
              backgroundColor: tokens.colors[key],
              minHeight: 72,
              display: "flex",
              alignItems: "flex-end",
              padding: tokens.spacing.spacingTight,
            }}
          >
            <span
              style={{
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.typeMicro,
                color: tokens.colors.textPrimary,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radii.radiusControl,
                padding: "2px 6px",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </section>

      <section
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radii.radiusCard,
          border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
          padding: tokens.padding.card,
          ...focusFrame(focus === "navigation", tokens),
        }}
      >
        <div
          style={{
            fontFamily: tokens.fontFamilies.semiBold,
            fontSize: tokens.typography.typeCaption,
            marginBottom: tokens.spacing.spacingCompact,
          }}
        >
          Navigation preview
        </div>
        <div
          style={{
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
            const iconName = tokens.components.tabBar.icon?.names[tabKey] ?? tabKey;
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
                }}
              >
                {tokens.components.tabBar.icon?.show ? (
                  <span
                    style={{
                      fontFamily: tokens.fontFamilies.medium,
                      color: isActive
                        ? tokens.components.tabBar.icon.activeColor
                        : tokens.components.tabBar.icon.inactiveColor,
                      fontSize: 10,
                    }}
                  >
                    {iconName}
                  </span>
                ) : null}
                {tokens.components.tabBar.label.show ? (
                  <span
                    style={{
                      fontFamily: tokens.fontFamilies.semiBold,
                      color: isActive
                        ? tokens.components.tabBar.label.activeColor
                        : tokens.components.tabBar.label.color,
                      fontSize: tokens.typography.typeMicro,
                      textTransform: tokens.components.tabBar.label.uppercase
                        ? "uppercase"
                        : "none",
                    }}
                  >
                    {tabKey}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
