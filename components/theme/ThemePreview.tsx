"use client";

import { Logo } from "@/components/logo/Logo";
import type { ThemeTokens } from "@/styles/themes";

type ThemePreviewProps = {
  tokens: ThemeTokens;
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

export function ThemePreview({ tokens }: ThemePreviewProps) {
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
        gap: tokens.spacing.lg,
      }}
    >
      <section
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radii.lg,
          border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
          padding: tokens.padding.card,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: tokens.spacing.md,
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
              fontSize: tokens.typography.title,
              lineHeight: tokens.lineHeights.tight,
            }}
          >
            Theme Preview
          </div>
          <div
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.small,
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
          gap: tokens.spacing.md,
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
                borderRadius: tokens.radii.sm,
                background: tokens.colors.imageBackgroundColor,
              }}
            />
            <div
              style={{
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.body,
              }}
            >
              Card Title {index + 1}
            </div>
            <div
              style={{
                fontFamily: tokens.fontFamilies.regular,
                fontSize: tokens.typography.tiny,
                color: tokens.colors.textSecondary,
              }}
            >
              Short description copy using the theme's text color scale.
            </div>
          </div>
        ))}
      </section>

      <section>
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
              fontSize: tokens.typography.subheading,
            }}
          >
            Preview Rail
          </h2>
          <span
            style={{
              fontFamily: tokens.fontFamilies.regular,
              fontSize: tokens.typography.tiny,
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
                borderRadius: tokens.radii.md,
                padding: tokens.spacing.sm,
                border: `${tokens.borderWidths.hairline}px solid ${tokens.colors.border}`,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.xs,
              }}
            >
              <div
                style={{
                  height: 72,
                  borderRadius: tokens.radii.sm,
                  background: tokens.colors.surfaceMuted,
                }}
              />
              <div
                style={{
                  fontFamily: tokens.fontFamilies.semiBold,
                  fontSize: tokens.typography.small,
                }}
              >
                Rail Card {index + 1}
              </div>
              <div
                style={{
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.tiny,
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
          gap: tokens.spacing.lg,
        }}
      >
        <div
          style={{
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radii.md,
            border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
            padding: tokens.padding.card,
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.sm,
          }}
        >
          <div style={{ fontFamily: tokens.fontFamilies.display, fontSize: tokens.typography.display }}>
            Display
          </div>
          <div style={{ fontFamily: tokens.fontFamilies.semiBold, fontSize: tokens.typography.title }}>
            Title Text
          </div>
          <div style={{ fontFamily: tokens.fontFamilies.medium, fontSize: tokens.typography.heading }}>
            Heading Sample
          </div>
          <div style={{ fontFamily: tokens.fontFamilies.regular, fontSize: tokens.typography.body }}>
            Body copy example with relaxed line height.
          </div>
          <div style={{ fontFamily: tokens.fontFamilies.regular, fontSize: tokens.typography.tiny, color: tokens.colors.textSecondary }}>
            Tiny helper text
          </div>
        </div>

        <div
          style={{
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radii.md,
            border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
            padding: tokens.padding.card,
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.sm,
          }}
        >
          <label
            style={{
              fontFamily: tokens.fontFamilies.semiBold,
              fontSize: tokens.typography.small,
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
              fontSize: tokens.typography.body,
              color: tokens.colors.textPrimary,
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: tokens.spacing.xs, flexWrap: "wrap" }}>
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
                fontSize: tokens.typography.tiny,
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
                fontSize: tokens.typography.small,
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
          borderRadius: tokens.radii.md,
          border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
          padding: tokens.padding.card,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: tokens.spacing.sm,
        }}
      >
        {colorKeys.map((key) => (
          <div
            key={key}
            style={{
              borderRadius: tokens.radii.sm,
              border: `${tokens.borderWidths.hairline}px solid ${tokens.colors.border}`,
              overflow: "hidden",
              backgroundColor: tokens.colors[key],
              minHeight: 72,
              display: "flex",
              alignItems: "flex-end",
              padding: tokens.spacing.xxs,
            }}
          >
            <span
              style={{
                fontFamily: tokens.fontFamilies.semiBold,
                fontSize: tokens.typography.tiny,
                color: tokens.colors.textPrimary,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radii.sm,
                padding: "2px 6px",
              }}
            >
              {key}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
