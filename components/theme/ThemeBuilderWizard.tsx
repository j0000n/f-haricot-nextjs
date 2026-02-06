"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import {
  generateComponentTokensFromGlobal,
  type ThemeTokens,
} from "@/styles/themes";
import {
  buildCreateCustomThemePayload,
  type CreateCustomThemePayload,
} from "@/styles/themes/customTheme";
import {
  contrastRatio,
  generatePaletteSuggestions,
  normalizeHex,
  readableTextColor,
  type PaletteSuggestion,
} from "@/styles/themes/colorUtils";
import { ThemePhonePreview } from "./ThemePhonePreview";
import styles from "./theme.module.css";

type ThemeBuilderWizardProps = {
  baseTokens: ThemeTokens;
  onDraftTokensChange: (tokens: ThemeTokens, definitionLabel: string) => void;
  onStepChange?: (step: number) => void;
  onCreateAndApply: (
    payload: CreateCustomThemePayload
  ) => Promise<{ shareCode: string; name: string }>;
};

type ColorKey = keyof ThemeTokens["colors"];

const CORE_COLOR_KEYS: Array<{ key: ColorKey; label: string; description: string }> = [
  { key: "background", label: "App background", description: "Primary page canvas" },
  { key: "surface", label: "Surface", description: "Cards and containers" },
  { key: "overlay", label: "Overlay", description: "Elevated layers and muted panels" },
  { key: "textPrimary", label: "Primary text", description: "Main readable text" },
  { key: "textSecondary", label: "Secondary text", description: "Supporting copy" },
  { key: "textMuted", label: "Muted text", description: "Hints and tertiary labels" },
  { key: "border", label: "Border", description: "Outlines and separators" },
  { key: "accent", label: "Accent", description: "Primary interactive color" },
  { key: "accentOnPrimary", label: "Text on accent", description: "Readable on accent fills" },
  { key: "success", label: "Success", description: "Positive status state" },
  { key: "danger", label: "Danger", description: "Error/destructive state" },
  { key: "info", label: "Info", description: "Informational state" },
  { key: "logoFill", label: "Logo fill", description: "Wordmark fill override" },
];

const FONT_LIBRARY: Array<{ id: string; label: string; stack: string; tone: "serif" | "sans" | "display" | "mono" }> = [
  { id: "peignot", label: "Peignot", stack: '"Peignot", Georgia, serif', tone: "display" },
  { id: "east-market", label: "East Market", stack: '"East Market NF", Georgia, serif', tone: "display" },
  { id: "gloock", label: "Gloock", stack: '"Gloock-Regular", Georgia, serif', tone: "serif" },
  { id: "sprat-regular", label: "Sprat Regular", stack: '"Sprat-Regular", "Trebuchet MS", sans-serif', tone: "display" },
  { id: "sprat-bold", label: "Sprat Bold", stack: '"Sprat-Bold", "Trebuchet MS", sans-serif', tone: "display" },
  { id: "source-sans", label: "Source Sans Pro", stack: '"Source Sans Pro", Arial, sans-serif', tone: "sans" },
  { id: "source-sans-semibold", label: "Source Sans SemiBold", stack: '"Source Sans Pro SemiBold", Arial, sans-serif', tone: "sans" },
  { id: "saira-regular", label: "Saira Regular", stack: '"Saira-Regular", Arial, sans-serif', tone: "sans" },
  { id: "saira-semibold", label: "Saira SemiBold", stack: '"Saira-SemiBold", Arial, sans-serif', tone: "sans" },
  { id: "amiamie-regular", label: "Amiamie Regular", stack: '"Amiamie-Regular", Arial, sans-serif', tone: "sans" },
  { id: "amiamie-black", label: "Amiamie Black", stack: '"Amiamie-Black", Arial, sans-serif', tone: "sans" },
  { id: "ft88-regular", label: "FT88 Regular", stack: '"FT88-Regular", "Courier New", monospace', tone: "mono" },
  { id: "ft88-bold", label: "FT88 Bold", stack: '"FT88-Bold", "Courier New", monospace', tone: "mono" },
  { id: "cutive-mono", label: "Cutive Mono", stack: '"CutiveMono-Regular", "Courier New", monospace', tone: "mono" },
  { id: "national-park", label: "National Park", stack: '"NationalPark-VariableVF", Arial, sans-serif', tone: "sans" },
  { id: "open-dyslexic", label: "OpenDyslexic", stack: '"OpenDyslexic-Regular", Arial, sans-serif', tone: "sans" },
];

const FONT_PRESETS: Array<{
  id: string;
  label: string;
  description: string;
  display: string;
  body: string;
}> = [
  {
    id: "heritage",
    label: "Heritage Editorial",
    description: "Confident display with neutral body copy",
    display: '"Peignot", Georgia, serif',
    body: '"Source Sans Pro", Arial, sans-serif',
  },
  {
    id: "modern-sans",
    label: "Modern Sans",
    description: "Balanced sans stack for product interfaces",
    display: '"Saira-SemiBold", Arial, sans-serif',
    body: '"Saira-Regular", Arial, sans-serif',
  },
  {
    id: "print-club",
    label: "Print Club",
    description: "Retro poster headlines with legible forms",
    display: '"Sprat-Bold", "Trebuchet MS", sans-serif',
    body: '"Amiamie-Regular", Arial, sans-serif',
  },
  {
    id: "mono-lab",
    label: "Mono Lab",
    description: "Technical monochrome style",
    display: '"FT88-Bold", "Courier New", monospace',
    body: '"FT88-Regular", "Courier New", monospace',
  },
];

const TAB_ICON_OPTIONS = [
  "home",
  "grid",
  "shopping-cart",
  "list",
  "book-open",
  "compass",
  "heart",
  "star",
  "clock",
  "layers",
  "sun",
  "moon",
  "feather",
  "sparkles",
];

const STEP_LABELS = [
  "Palette",
  "Typography",
  "Spacing & Shape",
  "Navigation",
  "Review",
  "Identity",
];

const cloneTokens = (tokens: ThemeTokens): ThemeTokens =>
  JSON.parse(JSON.stringify(tokens)) as ThemeTokens;

const normalizeSpacingAliases = (
  spacing: ThemeTokens["spacing"]
): ThemeTokens["spacing"] => ({
  ...spacing,
  none: 0,
  xxxs: spacing.spacingMicro,
  xxs: spacing.spacingTight,
  xs: spacing.spacingCompact,
  sm: spacing.spacingStandard,
  md: spacing.spacingComfortable,
  lg: spacing.spacingRoomy,
  xl: spacing.spacingSpacious,
  xxl: spacing.spacingHero,
  spacingMicro: spacing.spacingMicro,
  spacingTight: spacing.spacingTight,
  spacingCompact: spacing.spacingCompact,
  spacingStandard: spacing.spacingStandard,
  spacingComfortable: spacing.spacingComfortable,
  spacingRoomy: spacing.spacingRoomy,
  spacingSpacious: spacing.spacingSpacious,
  spacingHero: spacing.spacingHero,
});

const normalizeRadiiAliases = (radii: ThemeTokens["radii"]): ThemeTokens["radii"] => ({
  ...radii,
  sm: radii.radiusControl,
  md: radii.radiusCard,
  lg: radii.radiusSurface,
  round: radii.radiusPill,
  radiusControl: radii.radiusControl,
  radiusCard: radii.radiusCard,
  radiusSurface: radii.radiusSurface,
  radiusPill: radii.radiusPill,
});

const normalizeTypographyAliases = (
  typography: ThemeTokens["typography"]
): ThemeTokens["typography"] => ({
  ...typography,
  display: typography.typeDisplay,
  title: typography.typeTitle,
  heading: typography.typeHeading,
  subheading: typography.typeSubheading,
  body: typography.typeBody,
  extraSmall: typography.typeBodySmall,
  small: typography.typeCaption,
  tiny: typography.typeMicro,
  typeDisplay: typography.typeDisplay,
  typeTitle: typography.typeTitle,
  typeHeading: typography.typeHeading,
  typeSubheading: typography.typeSubheading,
  typeBody: typography.typeBody,
  typeBodySmall: typography.typeBodySmall,
  typeCaption: typography.typeCaption,
  typeMicro: typography.typeMicro,
});

const updateComponentsFromGlobal = (tokens: ThemeTokens): ThemeTokens => {
  const normalizedSpacing = normalizeSpacingAliases(tokens.spacing);
  const normalizedRadii = normalizeRadiiAliases(tokens.radii);
  const normalizedTypography = normalizeTypographyAliases(tokens.typography);

  const generated = generateComponentTokensFromGlobal(
    normalizedSpacing,
    tokens.padding,
    normalizedRadii,
    normalizedTypography,
    tokens.layout,
    tokens.componentSizes
  );

  return {
    ...tokens,
    spacing: normalizedSpacing,
    radii: normalizedRadii,
    typography: normalizedTypography,
    components: {
      ...generated,
      tabBar: tokens.components.tabBar,
    },
  };
};

const enforceAccessiblePalette = (
  colors: ThemeTokens["colors"]
): ThemeTokens["colors"] => {
  const next = { ...colors };

  if (contrastRatio(next.textPrimary, next.background) < 4.5) {
    next.textPrimary = readableTextColor(next.background);
  }

  if (contrastRatio(next.textSecondary, next.background) < 4.5) {
    next.textSecondary = next.textPrimary;
  }

  if (contrastRatio(next.textMuted, next.background) < 3) {
    next.textMuted = next.textSecondary;
  }

  if (contrastRatio(next.accentOnPrimary, next.accent) < 4.5) {
    next.accentOnPrimary = readableTextColor(next.accent);
  }

  if (contrastRatio(next.border, next.background) < 3) {
    next.border = next.textMuted;
  }

  if (contrastRatio(next.logoFill, next.background) < 3) {
    next.logoFill = next.textPrimary;
  }

  return next;
};

const applyPaletteSuggestion = (
  tokens: ThemeTokens,
  suggestion: PaletteSuggestion
): ThemeTokens => {
  const nextColors = enforceAccessiblePalette({
    ...tokens.colors,
    ...suggestion.colors,
  });

  const tabBar = tokens.components.tabBar;

  return {
    ...tokens,
    colors: nextColors,
    components: {
      ...tokens.components,
      tabBar: {
        ...tabBar,
        containerBackground: nextColors.background,
        slotBackground: nextColors.background,
        list: {
          ...tabBar.list,
          backgroundColor: nextColors.surface,
          borderColor: nextColors.border,
        },
        trigger: {
          ...tabBar.trigger,
          activeBackgroundColor: nextColors.accent,
        },
        label: {
          ...tabBar.label,
          color: nextColors.textSecondary,
          activeColor: nextColors.accentOnPrimary,
        },
        icon: tabBar.icon
          ? {
              ...tabBar.icon,
              inactiveColor: nextColors.textSecondary,
              activeColor: nextColors.accentOnPrimary,
            }
          : undefined,
      },
    },
  };
};

function ColorControl({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className={styles.builderColorControl}>
      <label>{label}</label>
      <small>{description}</small>
      <div>
        <input
          type="color"
          value={normalizeHex(value)}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          value={value.toUpperCase()}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className={styles.builderRangeControl}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function ThemeBuilderWizard({
  baseTokens,
  onDraftTokensChange,
  onStepChange,
  onCreateAndApply,
}: ThemeBuilderWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [themeName, setThemeName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [paletteMode, setPaletteMode] = useState<"light" | "dark">("light");
  const [seedHex, setSeedHex] = useState(baseTokens.colors.accent);
  const [fontSearch, setFontSearch] = useState("");
  const [draftTokens, setDraftTokens] = useState<ThemeTokens>(() =>
    updateComponentsFromGlobal(cloneTokens(baseTokens))
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title = themeName.trim() || "Untitled Theme";

  useEffect(() => {
    onStepChange?.(step);
  }, [onStepChange, step]);

  useEffect(() => {
    onDraftTokensChange(draftTokens, title);
  }, [draftTokens, onDraftTokensChange, title]);

  const suggestions = useMemo(
    () => generatePaletteSuggestions(seedHex, paletteMode),
    [paletteMode, seedHex]
  );

  const canMoveNext = true;

  const diagnostics = useMemo(
    () => [
      {
        id: "textPrimary",
        label: "Primary text on background",
        ratio: contrastRatio(draftTokens.colors.textPrimary, draftTokens.colors.background),
        target: 4.5,
      },
      {
        id: "textSecondary",
        label: "Secondary text on background",
        ratio: contrastRatio(draftTokens.colors.textSecondary, draftTokens.colors.background),
        target: 4.5,
      },
      {
        id: "accentText",
        label: "Accent text contrast",
        ratio: contrastRatio(draftTokens.colors.accentOnPrimary, draftTokens.colors.accent),
        target: 4.5,
      },
      {
        id: "border",
        label: "Border on background",
        ratio: contrastRatio(draftTokens.colors.border, draftTokens.colors.background),
        target: 3,
      },
    ],
    [draftTokens.colors]
  );

  const filteredFonts = useMemo(() => {
    const query = fontSearch.trim().toLowerCase();
    if (!query) {
      return FONT_LIBRARY;
    }
    return FONT_LIBRARY.filter((font) =>
      `${font.label} ${font.tone}`.toLowerCase().includes(query)
    );
  }, [fontSearch]);

  const updateColor = (key: ColorKey, nextColor: string) => {
    const normalized = normalizeHex(nextColor);

    setDraftTokens((prev) => ({
      ...prev,
      colors: enforceAccessiblePalette({
        ...prev.colors,
        [key]: normalized,
      }),
    }));

    if (key === "accent") {
      setSeedHex(normalized);
    }
  };

  const updateTypography = (
    key: keyof ThemeTokens["typography"],
    aliasKey: keyof ThemeTokens["typography"],
    value: number
  ) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        typography: {
          ...prev.typography,
          [key]: value,
          [aliasKey]: value,
        },
      })
    );
  };

  const updateSpacing = (
    key: keyof ThemeTokens["spacing"],
    aliasKey: keyof ThemeTokens["spacing"],
    value: number
  ) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        spacing: {
          ...prev.spacing,
          [key]: value,
          [aliasKey]: value,
        },
      })
    );
  };

  const updateRadii = (
    key: keyof ThemeTokens["radii"],
    aliasKey: keyof ThemeTokens["radii"],
    value: number
  ) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        radii: {
          ...prev.radii,
          [key]: value,
          [aliasKey]: value,
        },
      })
    );
  };

  const handleApplyFontPreset = (display: string, body: string) => {
    setDraftTokens((prev) => ({
      ...prev,
      fontFamilies: {
        ...prev.fontFamilies,
        display,
        regular: body,
        light: body,
        lightItalic: body,
        medium: body,
        semiBold: body,
        bold: display,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      const payload = buildCreateCustomThemePayload(
        {
          name: themeName.trim(),
          isPublic,
          tokens: draftTokens,
        },
        baseTokens
      );

      if (!payload.name) {
        payload.name = `Custom Theme ${Math.floor(Math.random() * 999) + 1}`;
      }

      await onCreateAndApply(payload);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        t("themeCreator.alerts.errorMessage", {
          defaultValue: "Failed to save theme. Please try again.",
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={styles.builderRoot}>
      <header className={styles.builderHeader}>
        <h2>{t("themeBuilder.title", { defaultValue: "Theme Builder" })}</h2>
        <p>
          {t("themeBuilder.subtitle", {
            defaultValue:
              "Shape your theme with guided steps and live previews.",
          })}
        </p>
      </header>

      <div className={styles.builderSteps}>
        {STEP_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`${styles.builderStep} ${
              index === step ? styles.builderStepActive : ""
            }`}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <div className={styles.builderStepSummary}>Editing: {STEP_LABELS[step]}</div>

      {step === 5 ? (
        <div className={styles.builderPanel}>
          <label className={styles.builderField}>
            <span>Theme name</span>
            <input
              value={themeName}
              onChange={(event) => setThemeName(event.target.value)}
              placeholder="My Signature Theme"
            />
          </label>

          <label className={styles.builderCheckbox}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            <span>Publish this theme to the community gallery</span>
          </label>
        </div>
      ) : null}

      {step === 0 ? (
        <div className={styles.builderPanel}>
          <div className={styles.builderPaletteHeader}>
            <ColorControl
              label="Seed accent"
              description="Used to generate palette suggestions"
              value={seedHex}
              onChange={setSeedHex}
            />
            <label>
              Palette mode
              <select
                value={paletteMode}
                onChange={(event) =>
                  setPaletteMode(event.target.value as "light" | "dark")
                }
              >
                <option value="light">Light surfaces</option>
                <option value="dark">Dark surfaces</option>
              </select>
            </label>
          </div>

          <div className={styles.builderSuggestions}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className={styles.builderSuggestion}
                onClick={() =>
                  setDraftTokens((prev) =>
                    applyPaletteSuggestion(prev, suggestion)
                  )
                }
              >
                <strong>{suggestion.name}</strong>
                <span>{suggestion.description}</span>
                <div className={styles.builderSuggestionColors}>
                  <i style={{ backgroundColor: suggestion.colors.background }} />
                  <i style={{ backgroundColor: suggestion.colors.surface }} />
                  <i style={{ backgroundColor: suggestion.colors.accent }} />
                  <i style={{ backgroundColor: suggestion.colors.textPrimary }} />
                </div>
              </button>
            ))}
          </div>

          <div className={styles.builderContrastList}>
            {diagnostics.map((diagnostic) => {
              const pass = diagnostic.ratio >= diagnostic.target;
              return (
                <div key={diagnostic.id} className={styles.builderContrastItem}>
                  <span>{diagnostic.label}</span>
                  <strong>{diagnostic.ratio.toFixed(2)} : 1</strong>
                  <em>{pass ? "AA pass" : `Needs ${diagnostic.target}:1`}</em>
                </div>
              );
            })}
          </div>

          <div className={styles.builderColorGrid}>
            {CORE_COLOR_KEYS.map((entry) => (
              <ColorControl
                key={entry.key}
                label={entry.label}
                description={entry.description}
                value={draftTokens.colors[entry.key]}
                onChange={(next) => updateColor(entry.key, next)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className={styles.builderPanel}>
          <div className={styles.builderFontPresets}>
            {FONT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={styles.builderSuggestion}
                onClick={() => handleApplyFontPreset(preset.display, preset.body)}
              >
                <strong>{preset.label}</strong>
                <span>{preset.description}</span>
                <span style={{ fontFamily: preset.display }}>Display sample</span>
                <span style={{ fontFamily: preset.body }}>Body sample</span>
              </button>
            ))}
          </div>

          <label className={styles.builderField}>
            <span>Search curated fonts</span>
            <input
              value={fontSearch}
              onChange={(event) => setFontSearch(event.target.value)}
              placeholder="Search serif, sans, mono..."
            />
          </label>

          <div className={styles.builderFontLibrary}>
            {filteredFonts.map((font) => (
              <button
                key={font.id}
                type="button"
                className={styles.builderSuggestion}
                onClick={() =>
                  setDraftTokens((prev) => ({
                    ...prev,
                    fontFamilies: {
                      ...prev.fontFamilies,
                      display: font.stack,
                    },
                  }))
                }
              >
                <strong>{font.label}</strong>
                <span>{font.tone}</span>
                <span style={{ fontFamily: font.stack }}>The quick brown fox</span>
              </button>
            ))}
          </div>

          <div className={styles.builderRangeGroup}>
            <RangeControl
              label="Display size"
              min={26}
              max={72}
              value={draftTokens.typography.typeDisplay}
              onChange={(value) => updateTypography("typeDisplay", "display", value)}
            />
            <RangeControl
              label="Title size"
              min={24}
              max={56}
              value={draftTokens.typography.typeTitle}
              onChange={(value) => updateTypography("typeTitle", "title", value)}
            />
            <RangeControl
              label="Heading size"
              min={16}
              max={40}
              value={draftTokens.typography.typeHeading}
              onChange={(value) => updateTypography("typeHeading", "heading", value)}
            />
            <RangeControl
              label="Body size"
              min={12}
              max={24}
              value={draftTokens.typography.typeBody}
              onChange={(value) => updateTypography("typeBody", "body", value)}
            />
            <RangeControl
              label="Caption size"
              min={10}
              max={18}
              value={draftTokens.typography.typeCaption}
              onChange={(value) => updateTypography("typeCaption", "small", value)}
            />
            <RangeControl
              label="Micro size"
              min={9}
              max={16}
              value={draftTokens.typography.typeMicro}
              onChange={(value) => updateTypography("typeMicro", "tiny", value)}
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className={styles.builderPanel}>
          <div className={styles.builderRangeGroup}>
            <RangeControl
              label="Micro spacing"
              min={1}
              max={8}
              value={draftTokens.spacing.spacingMicro}
              onChange={(value) => updateSpacing("spacingMicro", "xxxs", value)}
            />
            <RangeControl
              label="Tight spacing"
              min={2}
              max={12}
              value={draftTokens.spacing.spacingTight}
              onChange={(value) => updateSpacing("spacingTight", "xxs", value)}
            />
            <RangeControl
              label="Compact spacing"
              min={4}
              max={20}
              value={draftTokens.spacing.spacingCompact}
              onChange={(value) => updateSpacing("spacingCompact", "xs", value)}
            />
            <RangeControl
              label="Standard spacing"
              min={6}
              max={28}
              value={draftTokens.spacing.spacingStandard}
              onChange={(value) => updateSpacing("spacingStandard", "sm", value)}
            />
            <RangeControl
              label="Comfortable spacing"
              min={8}
              max={36}
              value={draftTokens.spacing.spacingComfortable}
              onChange={(value) => updateSpacing("spacingComfortable", "md", value)}
            />
            <RangeControl
              label="Roomy spacing"
              min={10}
              max={44}
              value={draftTokens.spacing.spacingRoomy}
              onChange={(value) => updateSpacing("spacingRoomy", "lg", value)}
            />
            <RangeControl
              label="Control corner radius"
              min={2}
              max={20}
              value={draftTokens.radii.radiusControl}
              onChange={(value) => updateRadii("radiusControl", "sm", value)}
            />
            <RangeControl
              label="Card corner radius"
              min={4}
              max={30}
              value={draftTokens.radii.radiusCard}
              onChange={(value) => updateRadii("radiusCard", "md", value)}
            />
            <RangeControl
              label="Surface corner radius"
              min={8}
              max={48}
              value={draftTokens.radii.radiusSurface}
              onChange={(value) => updateRadii("radiusSurface", "lg", value)}
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className={styles.builderPanel}>
          <label className={styles.builderField}>
            <span>Tab button shape</span>
            <select
              value={draftTokens.components.tabBar.trigger.shape}
              onChange={(event) =>
                setDraftTokens((prev) => ({
                  ...prev,
                  components: {
                    ...prev.components,
                    tabBar: {
                      ...prev.components.tabBar,
                      trigger: {
                        ...prev.components.tabBar.trigger,
                        shape: event.target.value as "pill" | "square",
                      },
                    },
                  },
                }))
              }
            >
              <option value="pill">Pill</option>
              <option value="square">Square</option>
            </select>
          </label>

          <label className={styles.builderCheckbox}>
            <input
              type="checkbox"
              checked={draftTokens.components.tabBar.label.show}
              onChange={(event) =>
                setDraftTokens((prev) => ({
                  ...prev,
                  components: {
                    ...prev.components,
                    tabBar: {
                      ...prev.components.tabBar,
                      label: {
                        ...prev.components.tabBar.label,
                        show: event.target.checked,
                      },
                    },
                  },
                }))
              }
            />
            <span>Show tab labels</span>
          </label>

          <label className={styles.builderCheckbox}>
            <input
              type="checkbox"
              checked={draftTokens.components.tabBar.label.uppercase}
              onChange={(event) =>
                setDraftTokens((prev) => ({
                  ...prev,
                  components: {
                    ...prev.components,
                    tabBar: {
                      ...prev.components.tabBar,
                      label: {
                        ...prev.components.tabBar.label,
                        uppercase: event.target.checked,
                      },
                    },
                  },
                }))
              }
            />
            <span>Uppercase tab labels</span>
          </label>

          {draftTokens.components.tabBar.icon ? (
            <>
              <label className={styles.builderCheckbox}>
                <input
                  type="checkbox"
                  checked={draftTokens.components.tabBar.icon.show}
                  onChange={(event) =>
                    setDraftTokens((prev) => ({
                      ...prev,
                      components: {
                        ...prev.components,
                        tabBar: {
                          ...prev.components.tabBar,
                          icon: prev.components.tabBar.icon
                            ? {
                                ...prev.components.tabBar.icon,
                                show: event.target.checked,
                              }
                            : undefined,
                        },
                      },
                    }))
                  }
                />
                <span>Show tab icons</span>
              </label>

              <div className={styles.builderIconGrid}>
                {(["home", "kitchen", "lists"] as const).map((tabKey) => (
                  <label key={tabKey} className={styles.builderField}>
                    <span>{tabKey} icon</span>
                    <select
                      value={
                        draftTokens.components.tabBar.icon?.names[tabKey] ??
                        "home"
                      }
                      onChange={(event) =>
                        setDraftTokens((prev) => ({
                          ...prev,
                          components: {
                            ...prev.components,
                            tabBar: {
                              ...prev.components.tabBar,
                              icon: prev.components.tabBar.icon
                                ? {
                                    ...prev.components.tabBar.icon,
                                    names: {
                                      ...prev.components.tabBar.icon.names,
                                      [tabKey]: event.target.value,
                                    },
                                  }
                                : undefined,
                            },
                          },
                        }))
                      }
                    >
                      {TAB_ICON_OPTIONS.map((iconName) => (
                        <option key={`${tabKey}-${iconName}`} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {step === 4 ? (
        <div className={styles.builderPanel}>
          <ThemePhonePreview
            tokens={draftTokens}
            label={title}
            subtitle="Final phone preview"
            showChrome
          />

          <button
            type="button"
            className={styles.builderToggleAdvanced}
            onClick={() => setShowAdvanced((prev) => !prev)}
          >
            {showAdvanced ? "Hide" : "Show"} advanced token controls
          </button>

          {showAdvanced ? (
            <div className={styles.builderAdvanced}>
              <div className={styles.builderColorGrid}>
                <ColorControl
                  label="Success status"
                  description="Positive outcomes and confirmations"
                  value={draftTokens.colors.success}
                  onChange={(next) => updateColor("success", next)}
                />
                <ColorControl
                  label="Danger status"
                  description="Error and destructive actions"
                  value={draftTokens.colors.danger}
                  onChange={(next) => updateColor("danger", next)}
                />
                <ColorControl
                  label="Info status"
                  description="Informational accents"
                  value={draftTokens.colors.info}
                  onChange={(next) => updateColor("info", next)}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {errorMessage ? <div className={styles.notice}>{errorMessage}</div> : null}

      <footer className={styles.builderFooter}>
        <button
          type="button"
          className={styles.builderNav}
          disabled={step === 0}
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
        >
          Back
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            className={`${styles.builderNav} ${styles.builderPrimary}`}
            onClick={() =>
              setStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1))
            }
            disabled={!canMoveNext}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.builderNav} ${styles.builderPrimary}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Creating..." : "Create & apply theme"}
          </button>
        )}
      </footer>
    </section>
  );
}
