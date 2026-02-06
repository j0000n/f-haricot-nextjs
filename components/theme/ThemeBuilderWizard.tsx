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
  generatePaletteSuggestions,
  normalizeHex,
  type PaletteSuggestion,
} from "@/styles/themes/colorUtils";
import { ThemePhonePreview } from "./ThemePhonePreview";
import styles from "./theme.module.css";

type ThemeBuilderWizardProps = {
  baseTokens: ThemeTokens;
  onDraftTokensChange: (tokens: ThemeTokens, definitionLabel: string) => void;
  onCreateAndApply: (
    payload: CreateCustomThemePayload
  ) => Promise<{ shareCode: string; name: string }>;
};

const LOGO_OPTIONS = [
  "/assets/images/logo-jan-23.svg",
  "/assets/images/sunrise-logo.svg",
  "/assets/images/midnight-logo.svg",
  "/assets/images/haricot-logo.svg",
  "/assets/images/logo.svg",
  "/assets/images/black-metal-logo.png",
  "/assets/images/black-metal.svg",
  "/assets/images/1950s.svg",
  "/assets/images/1960s.svg",
  "/assets/images/1990s.svg",
  "/assets/images/springfield-logo.svg",
] as const;

type ColorKey = keyof ThemeTokens["colors"];

const CORE_COLOR_KEYS: ColorKey[] = [
  "background",
  "surface",
  "overlay",
  "textPrimary",
  "textSecondary",
  "textMuted",
  "border",
  "accent",
  "accentOnPrimary",
  "success",
  "danger",
  "info",
  "logoFill",
];

const cloneTokens = (tokens: ThemeTokens): ThemeTokens =>
  JSON.parse(JSON.stringify(tokens)) as ThemeTokens;

const updateComponentsFromGlobal = (tokens: ThemeTokens): ThemeTokens => {
  const generated = generateComponentTokensFromGlobal(
    tokens.spacing,
    tokens.padding,
    tokens.radii,
    tokens.typography,
    tokens.layout,
    tokens.componentSizes
  );

  return {
    ...tokens,
    components: {
      ...generated,
      tabBar: tokens.components.tabBar,
    },
  };
};

const applyPaletteSuggestion = (
  tokens: ThemeTokens,
  suggestion: PaletteSuggestion
): ThemeTokens => {
  const nextColors = {
    ...tokens.colors,
    ...suggestion.colors,
  };
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

const FONT_PRESETS: Array<{ id: string; label: string; families: ThemeTokens["fontFamilies"] }> = [
  {
    id: "heritage",
    label: "Heritage",
    families: {
      display: "Peignot, serif",
      regular: "Source Sans Pro, sans-serif",
      light: "Source Sans Pro Light, sans-serif",
      lightItalic: "Source Sans Pro Light Italic, sans-serif",
      medium: "Source Sans Pro, sans-serif",
      semiBold: "Source Sans Pro SemiBold, sans-serif",
      bold: "Source Sans Pro Bold, sans-serif",
    },
  },
  {
    id: "editorial",
    label: "Editorial",
    families: {
      display: "Gloock-Regular, Georgia, serif",
      regular: "Amiamie-Regular, Arial, sans-serif",
      light: "Amiamie-Light, Arial, sans-serif",
      lightItalic: "Amiamie-Italic, Arial, sans-serif",
      medium: "Amiamie-RegularRound, Arial, sans-serif",
      semiBold: "Amiamie-Black, Arial, sans-serif",
      bold: "Amiamie-BlackRound, Arial, sans-serif",
    },
  },
  {
    id: "mono",
    label: "Monospaced",
    families: {
      display: "FT88-Bold, Courier New, monospace",
      regular: "FT88-Regular, Courier New, monospace",
      light: "FT88-Regular, Courier New, monospace",
      lightItalic: "FT88-Italic, Courier New, monospace",
      medium: "FT88-School, Courier New, monospace",
      semiBold: "FT88-Bold, Courier New, monospace",
      bold: "FT88-Bold, Courier New, monospace",
    },
  },
];

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className={styles.builderColorControl}>
      <label>{label}</label>
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
  onCreateAndApply,
}: ThemeBuilderWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [themeName, setThemeName] = useState("");
  const [logoAsset, setLogoAsset] = useState<string>(LOGO_OPTIONS[4]);
  const [isPublic, setIsPublic] = useState(true);
  const [paletteMode, setPaletteMode] = useState<"light" | "dark">("light");
  const [seedHex, setSeedHex] = useState(baseTokens.colors.accent);
  const [draftTokens, setDraftTokens] = useState<ThemeTokens>(() =>
    cloneTokens(baseTokens)
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title = themeName.trim() || "Untitled Theme";

  useEffect(() => {
    onDraftTokensChange(draftTokens, title);
  }, [draftTokens, onDraftTokensChange, title]);

  const suggestions = useMemo(
    () => generatePaletteSuggestions(seedHex, paletteMode),
    [paletteMode, seedHex]
  );

  const canMoveNext = step !== 0 || themeName.trim().length >= 2;

  const updateColor = (key: ColorKey, nextColor: string) => {
    const normalized = normalizeHex(nextColor);
    setDraftTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: normalized,
      },
    }));

    if (key === "accent") {
      setSeedHex(normalized);
    }
  };

  const updateTypography = (
    key: keyof ThemeTokens["typography"],
    value: number
  ) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        typography: {
          ...prev.typography,
          [key]: value,
        },
      })
    );
  };

  const updateSpacing = (key: keyof ThemeTokens["spacing"], value: number) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        spacing: {
          ...prev.spacing,
          [key]: value,
        },
      })
    );
  };

  const updateRadii = (key: keyof ThemeTokens["radii"], value: number) => {
    setDraftTokens((prev) =>
      updateComponentsFromGlobal({
        ...prev,
        radii: {
          ...prev.radii,
          [key]: value,
        },
      })
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);

      const payload = buildCreateCustomThemePayload(
        {
          name: themeName.trim(),
          isPublic,
          logoAsset,
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
              "Build a custom theme step-by-step and watch it update live.",
          })}
        </p>
      </header>

      <div className={styles.builderSteps}>
        {["Identity", "Palette", "Typography & Space", "Review"].map(
          (label, index) => (
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
          )
        )}
      </div>

      {step === 0 ? (
        <div className={styles.builderPanel}>
          <label className={styles.builderField}>
            <span>Theme name</span>
            <input
              value={themeName}
              onChange={(event) => setThemeName(event.target.value)}
              placeholder="My Signature Theme"
            />
          </label>

          <label className={styles.builderField}>
            <span>Logo asset</span>
            <select
              value={logoAsset}
              onChange={(event) => setLogoAsset(event.target.value)}
            >
              {LOGO_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.replace("/assets/images/", "")}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <div className={styles.builderPanel}>
          <div className={styles.builderPaletteHeader}>
            <ColorControl
              label="Seed accent"
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
                <option value="light">Light</option>
                <option value="dark">Dark</option>
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

          <div className={styles.builderColorGrid}>
            {CORE_COLOR_KEYS.map((key) => (
              <ColorControl
                key={key}
                label={key}
                value={draftTokens.colors[key]}
                onChange={(next) => updateColor(key, next)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className={styles.builderPanel}>
          <div className={styles.builderFontPresets}>
            {FONT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={styles.builderSuggestion}
                onClick={() =>
                  setDraftTokens((prev) => ({
                    ...prev,
                    fontFamilies: preset.families,
                  }))
                }
              >
                <strong>{preset.label}</strong>
                <span style={{ fontFamily: preset.families.display }}>
                  Display
                </span>
                <span style={{ fontFamily: preset.families.regular }}>
                  Body
                </span>
              </button>
            ))}
          </div>

          <div className={styles.builderRangeGroup}>
            <RangeControl
              label="Title size"
              min={24}
              max={56}
              value={draftTokens.typography.title}
              onChange={(value) => updateTypography("title", value)}
            />
            <RangeControl
              label="Heading size"
              min={16}
              max={40}
              value={draftTokens.typography.heading}
              onChange={(value) => updateTypography("heading", value)}
            />
            <RangeControl
              label="Body size"
              min={12}
              max={24}
              value={draftTokens.typography.body}
              onChange={(value) => updateTypography("body", value)}
            />
            <RangeControl
              label="Spacing sm"
              min={4}
              max={24}
              value={draftTokens.spacing.sm}
              onChange={(value) => updateSpacing("sm", value)}
            />
            <RangeControl
              label="Spacing md"
              min={8}
              max={32}
              value={draftTokens.spacing.md}
              onChange={(value) => updateSpacing("md", value)}
            />
            <RangeControl
              label="Spacing lg"
              min={10}
              max={44}
              value={draftTokens.spacing.lg}
              onChange={(value) => updateSpacing("lg", value)}
            />
            <RangeControl
              label="Radius sm"
              min={2}
              max={20}
              value={draftTokens.radii.sm}
              onChange={(value) => updateRadii("sm", value)}
            />
            <RangeControl
              label="Radius md"
              min={4}
              max={30}
              value={draftTokens.radii.md}
              onChange={(value) => updateRadii("md", value)}
            />
            <RangeControl
              label="Radius lg"
              min={8}
              max={48}
              value={draftTokens.radii.lg}
              onChange={(value) => updateRadii("lg", value)}
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className={styles.builderPanel}>
          <ThemePhonePreview
            tokens={draftTokens}
            label={title}
            subtitle="Final phone preview"
            showChrome
          />

          <label className={styles.builderCheckbox}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            <span>Make this theme public in gallery</span>
          </label>

          <button
            type="button"
            className={styles.builderToggleAdvanced}
            onClick={() => setShowAdvanced((prev) => !prev)}
          >
            {showAdvanced ? "Hide" : "Show"} advanced tuning
          </button>

          {showAdvanced ? (
            <div className={styles.builderAdvanced}>
              <div className={styles.builderColorGrid}>
                <ColorControl
                  label="success"
                  value={draftTokens.colors.success}
                  onChange={(next) => updateColor("success", next)}
                />
                <ColorControl
                  label="danger"
                  value={draftTokens.colors.danger}
                  onChange={(next) => updateColor("danger", next)}
                />
                <ColorControl
                  label="info"
                  value={draftTokens.colors.info}
                  onChange={(next) => updateColor("info", next)}
                />
              </div>

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
              ) : null}
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

        {step < 3 ? (
          <button
            type="button"
            className={`${styles.builderNav} ${styles.builderPrimary}`}
            onClick={() => setStep((prev) => Math.min(prev + 1, 3))}
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
