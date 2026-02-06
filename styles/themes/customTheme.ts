import {
  defaultThemeName,
  getThemeDefinition,
  type ThemeName,
} from "./index";
import {
  toLegacyRadii,
  toLegacySpacing,
  toLegacyTypography,
  toSemanticRadii,
  toSemanticSpacing,
  toSemanticTypography,
} from "@haricot/convex-client";
import {
  generateComponentTokensFromGlobal,
  type TabBarTokens,
  type ThemeDefinition,
  type ThemeTokens,
} from "./types";

type ThemeColorInput = Partial<ThemeTokens["colors"]>;

export type CustomThemeRecord = {
  name: string;
  shareCode: string;
  colors?: ThemeColorInput;
  spacing?: Partial<ThemeTokens["spacing"]>;
  padding?: Partial<ThemeTokens["padding"]>;
  radii?: Partial<ThemeTokens["radii"]>;
  typography?: Partial<ThemeTokens["typography"]>;
  fontFamilies?: Partial<ThemeTokens["fontFamilies"]>;
  tabBar?: TabBarTokens | null;
};

export type ThemeBuilderDraft = {
  name: string;
  isPublic: boolean;
  tokens: ThemeTokens;
};

export type CreateCustomThemePayload = {
  name: string;
  colors: {
    background: string;
    surface: string;
    overlay: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    accent: string;
    accentOnPrimary: string;
    success: string;
    danger: string;
    info: string;
    logoFill: string;
  };
  spacing: {
    spacingMicro: number;
    spacingTight: number;
    spacingCompact: number;
    spacingStandard: number;
    spacingComfortable: number;
    spacingRoomy: number;
    spacingSpacious: number;
    spacingHero: number;
  };
  padding: {
    screen: number;
    section: number;
    card: number;
    compact: number;
  };
  radii: {
    radiusControl: number;
    radiusCard: number;
    radiusSurface: number;
    radiusPill: number;
  };
  typography: {
    typeDisplay: number;
    typeTitle: number;
    typeHeading: number;
    typeSubheading: number;
    typeBody: number;
    typeBodySmall: number;
    typeCaption: number;
    typeMicro: number;
  };
  fontFamilies: {
    display: string;
    regular: string;
    light: string;
    lightItalic: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  isPublic: boolean;
  tabBar?: {
    containerBackground: string;
    slotBackground: string;
    list: {
      paddingHorizontal: number;
      paddingVertical: number;
      marginHorizontal: number;
      marginBottom: number;
      borderRadius: number;
      backgroundColor: string;
      borderWidth: number;
      borderColor: string;
      shadow: "card" | "floating" | null;
    };
    trigger: {
      paddingHorizontal: number;
      paddingVertical: number;
      borderRadius: number;
      minHeight: number;
      squareSize?: number;
      shape: "pill" | "square";
      inactiveBackgroundColor: string;
      activeBackgroundColor: string;
    };
    label: {
      show: boolean;
      color: string;
      activeColor: string;
      uppercase: boolean;
      letterSpacing: number;
      marginLeftWithIcon: number;
    };
    icon?: {
      show: boolean;
      family: string;
      size: number;
      inactiveColor: string;
      activeColor: string;
      names: {
        home: string;
        kitchen: string;
        lists: string;
      };
    };
  };
};

const normalizeTabBar = (tabBar: TabBarTokens): TabBarTokens => ({
  ...tabBar,
  icon: tabBar.icon
    ? {
        ...tabBar.icon,
        names: {
          home: tabBar.icon.names.home ?? "home",
          kitchen: tabBar.icon.names.kitchen ?? "shopping-cart",
          lists: tabBar.icon.names.lists ?? "list",
        },
      }
    : undefined,
});

const toPayloadTabBar = (tabBar: TabBarTokens): NonNullable<CreateCustomThemePayload["tabBar"]> => ({
  containerBackground: tabBar.containerBackground,
  slotBackground: tabBar.slotBackground,
  list: {
    paddingHorizontal: tabBar.list.paddingHorizontal,
    paddingVertical: tabBar.list.paddingVertical,
    marginHorizontal: tabBar.list.marginHorizontal,
    marginBottom: tabBar.list.marginBottom,
    borderRadius: tabBar.list.borderRadius,
    backgroundColor: tabBar.list.backgroundColor,
    borderWidth: tabBar.list.borderWidth,
    borderColor: tabBar.list.borderColor,
    shadow: tabBar.list.shadow,
  },
  trigger: {
    paddingHorizontal: tabBar.trigger.paddingHorizontal,
    paddingVertical: tabBar.trigger.paddingVertical,
    borderRadius: tabBar.trigger.borderRadius,
    minHeight: tabBar.trigger.minHeight,
    squareSize: tabBar.trigger.squareSize,
    shape: tabBar.trigger.shape,
    inactiveBackgroundColor: tabBar.trigger.inactiveBackgroundColor,
    activeBackgroundColor: tabBar.trigger.activeBackgroundColor,
  },
  label: {
    show: tabBar.label.show,
    color: tabBar.label.color,
    activeColor: tabBar.label.activeColor,
    uppercase: tabBar.label.uppercase,
    letterSpacing: tabBar.label.letterSpacing,
    marginLeftWithIcon: tabBar.label.marginLeftWithIcon,
  },
  icon: tabBar.icon
    ? {
        show: tabBar.icon.show,
        family: tabBar.icon.family,
        size: tabBar.icon.size,
        inactiveColor: tabBar.icon.inactiveColor,
        activeColor: tabBar.icon.activeColor,
        names: {
          home: tabBar.icon.names.home ?? "home",
          kitchen: tabBar.icon.names.kitchen ?? "shopping-cart",
          lists: tabBar.icon.names.lists ?? "list",
        },
      }
    : undefined,
});

export function normalizeCustomThemeToTokens(
  customThemeRecord: CustomThemeRecord,
  fallbackThemeName: ThemeName = defaultThemeName
): ThemeTokens {
  const fallbackDefinition = getThemeDefinition(fallbackThemeName);
  const fallbackTokens = fallbackDefinition.tokens;
  const mergedColors = {
    ...fallbackTokens.colors,
    ...(customThemeRecord.colors ?? {}),
  };

  const colors: ThemeTokens["colors"] = {
    ...mergedColors,
    logoFill: mergedColors.logoFill ?? mergedColors.textPrimary ?? fallbackTokens.colors.logoFill,
    imageBackgroundColor:
      mergedColors.imageBackgroundColor ??
      mergedColors.surface ??
      mergedColors.background,
    primary: mergedColors.primary ?? mergedColors.accent,
    onPrimary:
      mergedColors.onPrimary ??
      mergedColors.accentOnPrimary ??
      mergedColors.textPrimary,
    muted: mergedColors.muted ?? mergedColors.overlay ?? mergedColors.surface,
    surfaceVariant: mergedColors.surfaceVariant ?? mergedColors.surface,
    surfaceSubdued:
      mergedColors.surfaceSubdued ??
      mergedColors.overlay ??
      mergedColors.surface,
    surfaceMuted:
      mergedColors.surfaceMuted ??
      mergedColors.overlay ??
      mergedColors.surface,
    logoPrimaryColor:
      mergedColors.logoPrimaryColor ??
      mergedColors.accent ??
      fallbackTokens.colors.logoPrimaryColor,
    logoSecondaryColor:
      mergedColors.logoSecondaryColor ??
      mergedColors.surfaceVariant ??
      fallbackTokens.colors.logoSecondaryColor,
    logoTertiaryColor:
      mergedColors.logoTertiaryColor ??
      mergedColors.danger ??
      fallbackTokens.colors.logoTertiaryColor,
  };

  const spacing: ThemeTokens["spacing"] = {
    ...toLegacySpacing(fallbackTokens.spacing),
    ...toSemanticSpacing(fallbackTokens.spacing),
    ...toLegacySpacing(customThemeRecord.spacing),
    ...toSemanticSpacing(customThemeRecord.spacing),
    none: 0,
  };
  const padding: ThemeTokens["padding"] = {
    ...fallbackTokens.padding,
    ...(customThemeRecord.padding ?? {}),
  };
  const radii: ThemeTokens["radii"] = {
    ...toLegacyRadii(fallbackTokens.radii),
    ...toSemanticRadii(fallbackTokens.radii),
    ...toLegacyRadii(customThemeRecord.radii),
    ...toSemanticRadii(customThemeRecord.radii),
  };
  const typography: ThemeTokens["typography"] = {
    ...toLegacyTypography(fallbackTokens.typography),
    ...toSemanticTypography(fallbackTokens.typography),
    ...toLegacyTypography(customThemeRecord.typography),
    ...toSemanticTypography(customThemeRecord.typography),
  };
  const fontFamilies: ThemeTokens["fontFamilies"] = {
    ...fallbackTokens.fontFamilies,
    ...(customThemeRecord.fontFamilies ?? {}),
  };

  const generatedComponents = generateComponentTokensFromGlobal(
    spacing,
    padding,
    radii,
    typography,
    fallbackTokens.layout,
    fallbackTokens.componentSizes
  );

  return {
    ...fallbackTokens,
    colors,
    spacing,
    padding,
    radii,
    typography,
    fontFamilies,
    components: {
      ...generatedComponents,
      tabBar: normalizeTabBar(customThemeRecord.tabBar ?? fallbackTokens.components.tabBar),
    },
  };
}

export function buildThemeDefinitionFromCustomTheme(
  customThemeRecord: CustomThemeRecord,
  fallbackThemeName: ThemeName = defaultThemeName
): ThemeDefinition {
  const fallbackDefinition = getThemeDefinition(fallbackThemeName);
  return {
    ...fallbackDefinition,
    label: customThemeRecord.name,
    description: `Custom theme: ${customThemeRecord.name}`,
    tokens: normalizeCustomThemeToTokens(customThemeRecord, fallbackThemeName),
    assets: {
      logo: fallbackDefinition.assets.logo,
    },
  };
}

export function buildCreateCustomThemePayload(
  draft: ThemeBuilderDraft,
  baseTokens: ThemeTokens
): CreateCustomThemePayload {
  const tokens = draft.tokens ?? baseTokens;
  const tabBar = normalizeTabBar(tokens.components.tabBar ?? baseTokens.components.tabBar);

  return {
    name: draft.name.trim(),
    colors: {
      background: tokens.colors.background,
      surface: tokens.colors.surface,
      overlay: tokens.colors.overlay,
      textPrimary: tokens.colors.textPrimary,
      textSecondary: tokens.colors.textSecondary,
      textMuted: tokens.colors.textMuted,
      border: tokens.colors.border,
      accent: tokens.colors.accent,
      accentOnPrimary: tokens.colors.accentOnPrimary,
      success: tokens.colors.success,
      danger: tokens.colors.danger,
      info: tokens.colors.info,
      logoFill: tokens.colors.logoFill ?? tokens.colors.textPrimary,
    },
    spacing: {
      spacingMicro: tokens.spacing.spacingMicro,
      spacingTight: tokens.spacing.spacingTight,
      spacingCompact: tokens.spacing.spacingCompact,
      spacingStandard: tokens.spacing.spacingStandard,
      spacingComfortable: tokens.spacing.spacingComfortable,
      spacingRoomy: tokens.spacing.spacingRoomy,
      spacingSpacious: tokens.spacing.spacingSpacious,
      spacingHero: tokens.spacing.spacingHero,
    },
    padding: {
      screen: tokens.padding.screen,
      section: tokens.padding.section,
      card: tokens.padding.card,
      compact: tokens.padding.compact,
    },
    radii: {
      radiusControl: tokens.radii.radiusControl,
      radiusCard: tokens.radii.radiusCard,
      radiusSurface: tokens.radii.radiusSurface,
      radiusPill: tokens.radii.radiusPill,
    },
    typography: {
      typeDisplay: tokens.typography.typeDisplay,
      typeTitle: tokens.typography.typeTitle,
      typeHeading: tokens.typography.typeHeading,
      typeSubheading: tokens.typography.typeSubheading,
      typeBody: tokens.typography.typeBody,
      typeBodySmall: tokens.typography.typeBodySmall,
      typeCaption: tokens.typography.typeCaption,
      typeMicro: tokens.typography.typeMicro,
    },
    fontFamilies: {
      display: tokens.fontFamilies.display,
      regular: tokens.fontFamilies.regular,
      light: tokens.fontFamilies.light,
      lightItalic: tokens.fontFamilies.lightItalic,
      medium: tokens.fontFamilies.medium,
      semiBold: tokens.fontFamilies.semiBold,
      bold: tokens.fontFamilies.bold,
    },
    isPublic: draft.isPublic,
    tabBar: toPayloadTabBar(tabBar),
  };
}
