"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api, type Id } from "@haricot/convex-client";
import { useTranslation } from "@/i18n/useTranslation";
import { ThemeProvider, useTheme, useTokens } from "@/styles/themeContext";
import { ThemeStyles } from "@/components/ThemeStyles";
import {
  themeDefinitions,
  themeOptions,
  getThemeDefinition,
  defaultThemeName,
  isThemeName,
  type ThemeName,
  type ThemeTokens,
} from "@/styles/themes";
import {
  normalizeCustomThemeToTokens,
  type CreateCustomThemePayload,
  type CustomThemeRecord,
} from "@/styles/themes/customTheme";
import styles from "@/components/theme/theme.module.css";
import { ThemeOptionCard } from "@/components/theme/ThemeOptionCard";
import { ThemeInspector } from "@/components/theme/ThemeInspector";
import { ThemePreview } from "@/components/theme/ThemePreview";
import {
  ThemeGalleryCarousel,
  type GalleryThemeItem,
} from "@/components/theme/ThemeGalleryCarousel";
import { ThemeBuilderWizard } from "@/components/theme/ThemeBuilderWizard";

const isHighContrastTheme = (name: ThemeName) =>
  name === "highContrastLight" || name === "highContrastDark";

type HighContrastPreference = "off" | "light" | "dark";
type ThemeMode = "explore" | "build" | "gallery";

type ThemeState = {
  themeName: ThemeName;
  customShareCode: string | null;
  highContrastMode: HighContrastPreference;
};

type UserProfileLike = {
  preferredTheme?: string | null;
  customThemeShareCode?: string | null;
  highContrastMode?: HighContrastPreference | boolean | null;
};

type StatusMessage = {
  type: "success" | "error" | "info";
  text: string;
};

type CustomThemeDoc = {
  _id?: Id<"customThemes">;
  _creationTime?: number;
  name: string;
  shareCode: string;
  colors?: Partial<ThemeTokens["colors"]>;
  spacing?: Partial<ThemeTokens["spacing"]>;
  padding?: Partial<ThemeTokens["padding"]>;
  radii?: Partial<ThemeTokens["radii"]>;
  typography?: Partial<ThemeTokens["typography"]>;
  fontFamilies?: Partial<ThemeTokens["fontFamilies"]>;
  tabBar?: ThemeTokens["components"]["tabBar"] | null;
  hiddenBy?: Array<Id<"users">>;
};

function normalizeHighContrastMode(
  value: HighContrastPreference | boolean | null | undefined
): HighContrastPreference {
  if (typeof value === "boolean") {
    return value ? "dark" : "off";
  }
  return value ?? "off";
}

function toCustomThemeRecord(theme: CustomThemeDoc): CustomThemeRecord {
  return {
    name: theme.name,
    shareCode: theme.shareCode,
    colors: theme.colors,
    spacing: theme.spacing,
    padding: theme.padding,
    radii: theme.radii,
    typography: theme.typography,
    fontFamilies: theme.fontFamilies,
    tabBar: theme.tabBar ?? undefined,
  };
}

export default function ThemePage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const createCustomTheme = useMutation(api.customThemes.createCustomTheme);
  const hideTheme = useMutation(api.customThemes.hideTheme);
  const reportTheme = useMutation(api.customThemes.reportTheme);

  const [mode, setMode] = useState<ThemeMode>("explore");
  const [themeState, setThemeState] = useState<ThemeState>({
    themeName: defaultThemeName,
    customShareCode: null,
    highContrastMode: "off",
  });
  const [pendingThemeName, setPendingThemeName] = useState<ThemeName | null>(null);
  const [shareCodeInput, setShareCodeInput] = useState("");
  const [pendingShareCode, setPendingShareCode] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [builderDraftTokens, setBuilderDraftTokens] = useState<ThemeTokens | null>(null);
  const [builderStep, setBuilderStep] = useState(0);
  const [builderSession, setBuilderSession] = useState(0);
  const [galleryFocusId, setGalleryFocusId] = useState<string | null>(null);
  const [undoThemeState, setUndoThemeState] = useState<ThemeState | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const profile = user as UserProfileLike;
    const preferredTheme = profile.preferredTheme;
    const customShareCode = profile.customThemeShareCode ?? null;
    const highContrastMode = normalizeHighContrastMode(profile.highContrastMode);

    const resolvedThemeName =
      preferredTheme && isThemeName(preferredTheme)
        ? preferredTheme
        : defaultThemeName;

    setThemeState({
      themeName: resolvedThemeName,
      customShareCode,
      highContrastMode,
    });
  }, [user]);

  const currentCustomThemeQuery = useQuery(
    api.customThemes.getThemeByShareCode,
    themeState.customShareCode ? { shareCode: themeState.customShareCode } : "skip"
  ) as CustomThemeDoc | null | undefined;

  const pendingCustomTheme = useQuery(
    api.customThemes.getThemeByShareCode,
    pendingShareCode ? { shareCode: pendingShareCode } : "skip"
  ) as CustomThemeDoc | null | undefined;

  const myThemes = useQuery(
    api.customThemes.getMyCustomThemes,
    isAuthenticated ? {} : "skip"
  ) as CustomThemeDoc[] | undefined;

  const publicThemes = useQuery(
    api.customThemes.getPublicThemes,
    isAuthenticated ? { limit: 24 } : "skip"
  ) as CustomThemeDoc[] | undefined;

  const resolvedCurrentCustomTheme = useMemo(
    () =>
      currentCustomThemeQuery
        ? toCustomThemeRecord(currentCustomThemeQuery)
        : null,
    [currentCustomThemeQuery]
  );

  useEffect(() => {
    if (!pendingShareCode || pendingCustomTheme === undefined) {
      return;
    }

    if (pendingCustomTheme) {
      const shareCode = pendingCustomTheme.shareCode;
      setThemeState((prev) => ({
        ...prev,
        customShareCode: shareCode,
        highContrastMode: "off",
      }));
      void updateProfile({
        customThemeShareCode: shareCode,
        preferredTheme: null,
        highContrastMode: "off",
      });
      setStatusMessage({
        type: "success",
        text: t("themeSwitcher.shareCodeSuccessMessage", {
          name: pendingCustomTheme.name,
          defaultValue: `Custom theme \"${pendingCustomTheme.name}\" has been applied!`,
        }),
      });
      setShareCodeInput("");
      setMode("explore");
    } else {
      setStatusMessage({
        type: "error",
        text: t("themeSwitcher.shareCodeNotFoundMessage", {
          defaultValue: "No theme found with that share code.",
        }),
      });
    }

    setPendingShareCode(null);
  }, [pendingCustomTheme, pendingShareCode, t, updateProfile]);

  const handleThemeSelection = async (nextTheme: ThemeName) => {
    if (isHighContrastTheme(nextTheme)) {
      const nextMode = nextTheme === "highContrastLight" ? "light" : "dark";
      setThemeState({ themeName: nextTheme, customShareCode: null, highContrastMode: nextMode });
      await updateProfile({
        preferredTheme: nextTheme,
        customThemeShareCode: null,
        highContrastMode: nextMode,
      });
      return;
    }

    if (themeState.highContrastMode !== "off") {
      setPendingThemeName(nextTheme);
      return;
    }

    setThemeState({ themeName: nextTheme, customShareCode: null, highContrastMode: "off" });
    await updateProfile({ preferredTheme: nextTheme, customThemeShareCode: null, highContrastMode: "off" });
  };

  const handleApplyShareCode = () => {
    const trimmed = shareCodeInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: "error",
        text: t("themeSwitcher.shareCodeRequiredMessage", {
          defaultValue: "Please enter a theme share code.",
        }),
      });
      return;
    }
    setStatusMessage({ type: "info", text: t("themeSwitcher.loading", { defaultValue: "Loading..." }) });
    setPendingShareCode(trimmed.toUpperCase());
  };

  const confirmHighContrastSwitch = async () => {
    if (!pendingThemeName) {
      return;
    }

    setThemeState({ themeName: pendingThemeName, customShareCode: null, highContrastMode: "off" });
    await updateProfile({ preferredTheme: pendingThemeName, customThemeShareCode: null, highContrastMode: "off" });
    setPendingThemeName(null);
  };

  const cancelHighContrastSwitch = () => {
    setPendingThemeName(null);
  };

  const galleryItems = useMemo<GalleryThemeItem[]>(() => {
    const my = [...(myThemes ?? [])]
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .map((theme) => {
        const record = toCustomThemeRecord(theme);
        return {
          id: `mine-${record.shareCode}`,
          source: "mine" as const,
          docId: theme._id,
          label: record.name,
          description: `Share code: ${record.shareCode}`,
          tokens: normalizeCustomThemeToTokens(record),
          shareCode: record.shareCode,
          customTheme: record,
        };
      });

    const builtIn = (
      Object.entries(themeDefinitions) as Array<[ThemeName, (typeof themeDefinitions)[ThemeName]]>
    ).map(([name, definition]) => ({
      id: `builtin-${name}`,
      source: "builtIn" as const,
      label: t(`themes.${name}.name`, { defaultValue: definition.label }),
      description: t(`themes.${name}.description`, { defaultValue: definition.description }),
      tokens: definition.tokens,
      themeName: name,
    }));

    const myShareCodes = new Set(my.map((item) => item.shareCode));
    const publicList = [...(publicThemes ?? [])]
      .filter((theme) => !myShareCodes.has(theme.shareCode))
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .map((theme) => {
        const record = toCustomThemeRecord(theme);
        return {
          id: `public-${record.shareCode}`,
          source: "public" as const,
          docId: theme._id,
          label: record.name,
          description: `Community theme · ${record.shareCode}`,
          tokens: normalizeCustomThemeToTokens(record),
          shareCode: record.shareCode,
          customTheme: record,
        };
      });

    return [...my, ...builtIn, ...publicList];
  }, [myThemes, publicThemes, t]);

  const activeThemeName: ThemeName =
    themeState.highContrastMode === "light"
      ? "highContrastLight"
      : themeState.highContrastMode === "dark"
      ? "highContrastDark"
      : themeState.themeName;

  const galleryInitialIndex = useMemo(() => {
    if (galleryItems.length === 0) {
      return 0;
    }

    if (galleryFocusId) {
      const focusIndex = galleryItems.findIndex((item) => item.id === galleryFocusId);
      if (focusIndex >= 0) {
        return focusIndex;
      }
    }

    if (themeState.customShareCode) {
      const customIndex = galleryItems.findIndex(
        (item) => item.shareCode === themeState.customShareCode
      );
      if (customIndex >= 0) {
        return customIndex;
      }
    }

    const builtInIndex = galleryItems.findIndex(
      (item) => item.themeName === activeThemeName
    );

    return builtInIndex >= 0 ? builtInIndex : 0;
  }, [activeThemeName, galleryFocusId, galleryItems, themeState.customShareCode]);

  const handleApplyGalleryTheme = async (item: GalleryThemeItem) => {
    const previousThemeState = { ...themeState };

    if (item.themeName) {
      const requiresConfirm =
        themeState.highContrastMode !== "off" &&
        !isHighContrastTheme(item.themeName);
      await handleThemeSelection(item.themeName);
      if (requiresConfirm) {
        setStatusMessage({
          type: "info",
          text: t("themeSwitcher.leaveHighContrastMessage", {
            defaultValue:
              "Choosing a different theme will disable your high-contrast preference.",
          }),
        });
      } else {
        setUndoThemeState(previousThemeState);
        setStatusMessage({
          type: "success",
          text: t("themeGallery.applied", {
            defaultValue: "Theme applied.",
          }),
        });
      }
      return;
    }

    if (!item.shareCode) {
      return;
    }

    setThemeState((prev) => ({
      ...prev,
      customShareCode: item.shareCode ?? null,
      highContrastMode: "off",
    }));

    await updateProfile({
      customThemeShareCode: item.shareCode,
      preferredTheme: null,
      highContrastMode: "off",
    });

    setUndoThemeState(previousThemeState);
    setStatusMessage({
      type: "success",
      text: t("themeGallery.applied", {
        defaultValue: "Theme applied.",
      }),
    });
  };

  const handleCreateAndApply = async (payload: CreateCustomThemePayload) => {
    const previousThemeState = { ...themeState };
    const result = await createCustomTheme(payload);

    await updateProfile({
      customThemeShareCode: result.shareCode,
      preferredTheme: null,
      highContrastMode: "off",
    });

    setThemeState((prev) => ({
      ...prev,
      customShareCode: result.shareCode,
      highContrastMode: "off",
    }));

    const galleryId = `mine-${result.shareCode}`;
    setGalleryFocusId(galleryId);
    setMode("gallery");
    setUndoThemeState(previousThemeState);
    setStatusMessage({
      type: "success",
      text: t("themeBuilder.created", {
        shareCode: result.shareCode,
        defaultValue: `Theme created and applied. Share code: ${result.shareCode}`,
      }),
    });

    return {
      shareCode: result.shareCode,
      name: payload.name,
    };
  };

  const handleHidePublicTheme = async (item: GalleryThemeItem) => {
    if (!item.id.startsWith("public-") || !item.docId) {
      return;
    }

    await hideTheme({ themeId: item.docId });
    setStatusMessage({
      type: "info",
      text: t("themeGallery.hidden", {
        defaultValue: "Theme hidden from your gallery.",
      }),
    });
  };

  const handleReportPublicTheme = async (item: GalleryThemeItem) => {
    if (!item.id.startsWith("public-") || !item.docId) {
      return;
    }

    await reportTheme({ themeId: item.docId, reason: "Gallery report" });
    setStatusMessage({
      type: "info",
      text: t("themeGallery.reported", {
        defaultValue: "Theme reported and hidden.",
      }),
    });
  };

  const handleUndoThemeApply = async () => {
    if (!undoThemeState) {
      return;
    }

    setThemeState(undoThemeState);
    if (undoThemeState.customShareCode) {
      await updateProfile({
        customThemeShareCode: undoThemeState.customShareCode,
        preferredTheme: null,
        highContrastMode: undoThemeState.highContrastMode,
      });
    } else {
      await updateProfile({
        customThemeShareCode: null,
        preferredTheme: undoThemeState.themeName,
        highContrastMode: undoThemeState.highContrastMode,
      });
    }

    setUndoThemeState(null);
    setStatusMessage({
      type: "info",
      text: t("themeGallery.undoApplied", {
        defaultValue: "Reverted to previous theme.",
      }),
    });
  };

  const handleModeSwitch = (nextMode: ThemeMode) => {
    setMode(nextMode);

    if (nextMode === "build") {
      setBuilderDraftTokens(null);
      setBuilderStep(0);
      setBuilderSession((prev) => prev + 1);
    }

    if (nextMode === "gallery") {
      setGalleryFocusId(null);
    }
  };

  if (isLoading || user === undefined) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ThemeProvider
      initialThemeName={themeState.themeName}
      initialCustomThemeShareCode={themeState.customShareCode}
      customThemeData={resolvedCurrentCustomTheme}
      initialAccessibilityPreferences={{ highContrastMode: themeState.highContrastMode }}
    >
      <ThemeStyles />
      <ThemePageContent
        mode={mode}
        onModeSwitch={handleModeSwitch}
        themeState={themeState}
        statusMessage={statusMessage}
        pendingThemeName={pendingThemeName}
        onThemeSelect={handleThemeSelection}
        onConfirmHighContrast={confirmHighContrastSwitch}
        onCancelHighContrast={cancelHighContrastSwitch}
        shareCodeInput={shareCodeInput}
        onShareCodeInput={setShareCodeInput}
        onApplyShareCode={handleApplyShareCode}
        customThemeData={resolvedCurrentCustomTheme}
        onBuilderDraftChange={(tokens) => {
          setBuilderDraftTokens(tokens);
        }}
        onBuilderStepChange={setBuilderStep}
        onCreateAndApply={handleCreateAndApply}
        galleryItems={galleryItems}
        galleryInitialIndex={galleryInitialIndex}
        onApplyGalleryTheme={handleApplyGalleryTheme}
        onHideGalleryTheme={handleHidePublicTheme}
        onReportGalleryTheme={handleReportPublicTheme}
        onUndoThemeApply={handleUndoThemeApply}
        canUndoThemeApply={undoThemeState !== null}
        builderPreviewTokens={builderDraftTokens}
        builderStep={builderStep}
        builderSession={builderSession}
      />
    </ThemeProvider>
  );
}

function ThemePageContent({
  mode,
  onModeSwitch,
  themeState,
  statusMessage,
  pendingThemeName,
  onThemeSelect,
  onConfirmHighContrast,
  onCancelHighContrast,
  shareCodeInput,
  onShareCodeInput,
  onApplyShareCode,
  customThemeData,
  onBuilderDraftChange,
  onBuilderStepChange,
  onCreateAndApply,
  galleryItems,
  galleryInitialIndex,
  onApplyGalleryTheme,
  onHideGalleryTheme,
  onReportGalleryTheme,
  onUndoThemeApply,
  canUndoThemeApply,
  builderPreviewTokens,
  builderStep,
  builderSession,
}: {
  mode: ThemeMode;
  onModeSwitch: (mode: ThemeMode) => void;
  themeState: ThemeState;
  statusMessage: StatusMessage | null;
  pendingThemeName: ThemeName | null;
  onThemeSelect: (name: ThemeName) => void | Promise<void>;
  onConfirmHighContrast: () => void;
  onCancelHighContrast: () => void;
  shareCodeInput: string;
  onShareCodeInput: (value: string) => void;
  onApplyShareCode: () => void;
  customThemeData: CustomThemeRecord | null;
  onBuilderDraftChange: (tokens: ThemeTokens, label: string) => void;
  onBuilderStepChange: (step: number) => void;
  onCreateAndApply: (payload: CreateCustomThemePayload) => Promise<{ shareCode: string; name: string }>;
  galleryItems: GalleryThemeItem[];
  galleryInitialIndex: number;
  onApplyGalleryTheme: (item: GalleryThemeItem) => Promise<void>;
  onHideGalleryTheme: (item: GalleryThemeItem) => Promise<void>;
  onReportGalleryTheme: (item: GalleryThemeItem) => Promise<void>;
  onUndoThemeApply: () => Promise<void>;
  canUndoThemeApply: boolean;
  builderPreviewTokens: ThemeTokens | null;
  builderStep: number;
  builderSession: number;
}) {
  const { t } = useTranslation();
  const tokens = useTokens();
  const { definition } = useTheme();

  const activeThemeName: ThemeName =
    themeState.highContrastMode === "light"
      ? "highContrastLight"
      : themeState.highContrastMode === "dark"
      ? "highContrastDark"
      : themeState.themeName;

  const themeCards = useMemo(
    () =>
      themeOptions.map((option) => {
        const themeDefinition = getThemeDefinition(option.name);
        return {
          name: option.name,
          label: t(`themes.${option.name}.name`, { defaultValue: option.label }),
          description: t(`themes.${option.name}.description`, { defaultValue: option.description }),
          tokens: themeDefinition.tokens,
        };
      }),
    [t]
  );

  return (
    <main
      style={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.textPrimary,
        width: "100%",
        minWidth: 0,
        overflowX: "clip",
      }}
    >
      <div className={styles.themePage}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sectionHeader}>
              <h1
                style={{
                  margin: 0,
                  fontFamily: tokens.fontFamilies.display,
                  fontSize: tokens.typography.title,
                }}
              >
                {t("theme.title", { defaultValue: "Theme Lab" })}
              </h1>
              <p
                style={{
                  margin: 0,
                  fontFamily: tokens.fontFamilies.regular,
                  fontSize: tokens.typography.small,
                  color: tokens.colors.textSecondary,
                }}
              >
                {t("theme.description", {
                  defaultValue:
                    "Explore presets, craft your own palette, and browse gallery themes.",
                })}
              </p>
            </div>

            <div className={styles.modeSwitch}>
              <button
                type="button"
                className={`${styles.modeButton} ${
                  mode === "explore" ? styles.modeButtonActive : ""
                }`}
                onClick={() => onModeSwitch("explore")}
                style={{
                  borderColor: tokens.colors.border,
                  color: tokens.colors.textPrimary,
                  backgroundColor:
                    mode === "explore" ? tokens.colors.surfaceVariant : tokens.colors.surface,
                }}
              >
                Explore
              </button>
              <button
                type="button"
                className={`${styles.modeButton} ${
                  mode === "build" ? styles.modeButtonActive : ""
                }`}
                onClick={() => onModeSwitch("build")}
                style={{
                  borderColor: tokens.colors.border,
                  color: tokens.colors.textPrimary,
                  backgroundColor:
                    mode === "build" ? tokens.colors.surfaceVariant : tokens.colors.surface,
                }}
              >
                Build
              </button>
              <button
                type="button"
                className={`${styles.modeButton} ${
                  mode === "gallery" ? styles.modeButtonActive : ""
                }`}
                onClick={() => onModeSwitch("gallery")}
                style={{
                  borderColor: tokens.colors.border,
                  color: tokens.colors.textPrimary,
                  backgroundColor:
                    mode === "gallery" ? tokens.colors.surfaceVariant : tokens.colors.surface,
                }}
              >
                Gallery
              </button>
            </div>

            {pendingThemeName ? (
              <div
                className={styles.notice}
                style={{
                  backgroundColor: tokens.colors.overlay,
                  color: tokens.colors.textPrimary,
                  border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                }}
              >
                <div style={{ fontFamily: tokens.fontFamilies.semiBold }}>
                  {t("themeSwitcher.leaveHighContrastTitle", {
                    defaultValue: "Turn off high contrast?",
                  })}
                </div>
                <div style={{ marginTop: 4, color: tokens.colors.textSecondary }}>
                  {t("themeSwitcher.leaveHighContrastMessage", {
                    defaultValue:
                      "Choosing a different theme will disable your high-contrast preference.",
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={onCancelHighContrast}
                    style={{
                      backgroundColor: "transparent",
                      color: tokens.colors.textPrimary,
                      border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                      borderRadius: tokens.radii.sm,
                      padding: `${tokens.spacing.xxs}px ${tokens.spacing.sm}px`,
                      cursor: "pointer",
                      fontFamily: tokens.fontFamilies.semiBold,
                    }}
                  >
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirmHighContrast}
                    style={{
                      backgroundColor: tokens.colors.accent,
                      color: tokens.colors.accentOnPrimary,
                      border: "none",
                      borderRadius: tokens.radii.sm,
                      padding: `${tokens.spacing.xxs}px ${tokens.spacing.sm}px`,
                      cursor: "pointer",
                      fontFamily: tokens.fontFamilies.semiBold,
                    }}
                  >
                    {t("themeSwitcher.leaveHighContrastConfirm", {
                      defaultValue: "Switch theme",
                    })}
                  </button>
                </div>
              </div>
            ) : null}

            {statusMessage ? (
              <div
                className={styles.notice}
                style={{
                  backgroundColor:
                    statusMessage.type === "error"
                      ? tokens.colors.surfaceMuted
                      : statusMessage.type === "success"
                      ? tokens.colors.surfaceVariant
                      : tokens.colors.overlay,
                  color: tokens.colors.textPrimary,
                  border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                }}
              >
                <div>{statusMessage.text}</div>
                {canUndoThemeApply ? (
                  <button
                    type="button"
                    onClick={() => void onUndoThemeApply()}
                    style={{
                      marginTop: 8,
                      borderRadius: tokens.radii.radiusControl,
                      border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                      backgroundColor: tokens.colors.surface,
                      color: tokens.colors.textPrimary,
                      padding: `${tokens.spacing.spacingTight}px ${tokens.spacing.spacingStandard}px`,
                      fontFamily: tokens.fontFamilies.semiBold,
                      cursor: "pointer",
                    }}
                  >
                    {t("common.undo", { defaultValue: "Undo" })}
                  </button>
                ) : null}
              </div>
            ) : null}

            {mode === "explore" ? (
              <>
                <div>
                  <h2
                    className={styles.sectionTitle}
                    style={{
                      color: tokens.colors.textSecondary,
                      fontFamily: tokens.fontFamilies.semiBold,
                    }}
                  >
                    {t("theme.themesLabel", { defaultValue: "Themes" })}
                  </h2>
                  <div className={styles.cardList}>
                    {themeCards.map((option) => (
                      <ThemeOptionCard
                        key={option.name}
                        label={option.label}
                        description={option.description}
                        tokens={option.tokens}
                        isActive={
                          option.name === activeThemeName && themeState.customShareCode === null
                        }
                        onSelect={() => onThemeSelect(option.name)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2
                    className={styles.sectionTitle}
                    style={{
                      color: tokens.colors.textSecondary,
                      fontFamily: tokens.fontFamilies.semiBold,
                    }}
                  >
                    {t("themeSwitcher.shareCodePrompt", {
                      defaultValue: "Have a share code?",
                    })}
                  </h2>
                  <div className={styles.shareCodeRow}>
                    <input
                      value={shareCodeInput}
                      onChange={(event) => onShareCodeInput(event.target.value)}
                      placeholder={t("themeSwitcher.shareCodePlaceholder", {
                        defaultValue: "Enter code",
                      })}
                      className={styles.shareInput}
                      style={{
                        backgroundColor: tokens.colors.surface,
                        borderColor: tokens.colors.border,
                        color: tokens.colors.textPrimary,
                        fontFamily: tokens.fontFamilies.regular,
                      }}
                    />
                    <button
                      type="button"
                      onClick={onApplyShareCode}
                      className={styles.shareButton}
                      style={{
                        backgroundColor: tokens.colors.accent,
                        color: tokens.colors.accentOnPrimary,
                        fontFamily: tokens.fontFamilies.semiBold,
                      }}
                    >
                      {t("themeSwitcher.apply", { defaultValue: "Apply" })}
                    </button>
                  </div>
                </div>

                {customThemeData ? (
                  <div
                    className={styles.notice}
                    style={{
                      backgroundColor: tokens.colors.surfaceVariant,
                      color: tokens.colors.textPrimary,
                      border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                    }}
                  >
                    <strong style={{ fontFamily: tokens.fontFamilies.semiBold }}>
                      {t("themeSwitcher.customThemeLabel", {
                        defaultValue: "Custom theme",
                      })}
                      :
                    </strong>{" "}
                    {customThemeData.name}
                    <div style={{ marginTop: 4, color: tokens.colors.textSecondary }}>
                      {t("themeSwitcher.shareCodeDisplay", {
                        code: customThemeData.shareCode,
                        defaultValue: `Share code: ${customThemeData.shareCode}`,
                      })}
                    </div>
                  </div>
                ) : null}

                <ThemeInspector definition={definition} tokens={tokens} />
              </>
            ) : null}

            {mode === "build" ? (
              <ThemeBuilderWizard
                key={`builder-${builderSession}`}
                baseTokens={tokens}
                onDraftTokensChange={onBuilderDraftChange}
                onStepChange={onBuilderStepChange}
                onCreateAndApply={onCreateAndApply}
              />
            ) : null}

            {mode === "gallery" ? (
              <div
                className={styles.notice}
                style={{
                  backgroundColor: tokens.colors.surface,
                  border: `${tokens.borderWidths.thin}px solid ${tokens.colors.border}`,
                }}
              >
                {t("themeGallery.description", {
                  defaultValue:
                    "Browse one theme at a time in phone view, then apply instantly.",
                })}
              </div>
            ) : null}
          </div>
        </aside>

        <div className={styles.preview}>
          {mode === "gallery" ? (
            <ThemeGalleryCarousel
              items={galleryItems}
              initialIndex={galleryInitialIndex}
              onApplyTheme={onApplyGalleryTheme}
              onHideTheme={onHideGalleryTheme}
              onReportTheme={onReportGalleryTheme}
            />
          ) : (
            <ThemePreview
              tokens={mode === "build" && builderPreviewTokens ? builderPreviewTokens : tokens}
              focus={
                mode !== "build"
                  ? null
                  : builderStep === 0
                  ? "identity"
                  : builderStep === 1
                  ? "palette"
                  : builderStep === 2
                  ? "typography"
                  : builderStep === 3
                  ? "spacing"
                  : builderStep === 4
                  ? "navigation"
                  : null
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
