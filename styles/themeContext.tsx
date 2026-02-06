"use client";

import React, { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import {
  defaultThemeName,
  getThemeDefinition,
  isThemeName,
  type ThemeName,
  type ThemeDefinition,
  type ThemeTokens,
} from "./themes/index";
import {
  buildThemeDefinitionFromCustomTheme,
  type CustomThemeRecord,
} from "./themes/customTheme";

type HighContrastPreference = "off" | "light" | "dark";

export type AccessibilityPreferences = {
  highContrastMode: HighContrastPreference;
};

type CustomThemeData = CustomThemeRecord;

type ThemeContextValue = {
  themeName: ThemeName | "custom";
  tokens: ThemeTokens;
  assets: ThemeDefinition["assets"];
  customTheme: CustomThemeData | null;
  definition: ThemeDefinition;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveThemeName(themeName: string | null | undefined): ThemeName {
  if (themeName && isThemeName(themeName)) {
    return themeName;
  }
  return defaultThemeName;
}

export function ThemeProvider({
  children,
  initialThemeName,
  initialCustomThemeShareCode,
  customThemeData,
  initialAccessibilityPreferences,
}: {
  children: ReactNode;
  initialThemeName?: string | null;
  initialCustomThemeShareCode?: string | null;
  customThemeData?: CustomThemeData | null;
  initialAccessibilityPreferences?: AccessibilityPreferences | null;
}) {
  const [themeName, setThemeName] = useState<ThemeName | "custom">(
    resolveThemeName(initialThemeName)
  );
  const [customTheme, setCustomTheme] = useState<CustomThemeData | null>(null);
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>(
    initialAccessibilityPreferences ?? { highContrastMode: "off" }
  );

  // Load custom theme when data becomes available
  useEffect(() => {
    if (customThemeData && initialCustomThemeShareCode) {
      setCustomTheme(customThemeData);
      setThemeName("custom");
    } else if (initialCustomThemeShareCode) {
      setCustomTheme(null);
      setThemeName(resolveThemeName(initialThemeName));
    } else {
      // Reset to built-in theme if no custom theme share code
      setCustomTheme(null);
      setThemeName(resolveThemeName(initialThemeName));
    }
  }, [customThemeData, initialCustomThemeShareCode, initialThemeName]);

  useEffect(() => {
    if (initialAccessibilityPreferences === undefined) {
      return;
    }
    setAccessibilityPreferences(initialAccessibilityPreferences ?? { highContrastMode: "off" });
  }, [initialAccessibilityPreferences]);

  const definition = useMemo(() => {
    if (accessibilityPreferences.highContrastMode === "light") {
      return getThemeDefinition("highContrastLight");
    }

    if (accessibilityPreferences.highContrastMode === "dark") {
      return getThemeDefinition("highContrastDark");
    }

    if (themeName === "custom" && customTheme) {
      return buildThemeDefinitionFromCustomTheme(customTheme);
    }
    return getThemeDefinition(themeName as ThemeName);
  }, [accessibilityPreferences.highContrastMode, themeName, customTheme]);

  const tokens = definition.tokens;

  const value = useMemo(
    () => ({
      themeName,
      tokens,
      assets: definition.assets,
      customTheme,
      definition,
    }),
    [themeName, tokens, definition, customTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useTokens() {
  const { tokens } = useTheme();
  return tokens;
}
