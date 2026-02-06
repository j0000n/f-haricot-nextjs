// Ported from haricot-rn/styles/themes/types.ts
// Adapted for web/CSS instead of React Native

export const FULL_WIDTH = "100%" as const;

export type ShadowName = "card" | "floating";

export type TabBarIconTokens = {
  show: boolean;
  family: string;
  size: number;
  inactiveColor: string;
  activeColor: string;
  names: Record<string, string>;
};

export type TabBarTokens = {
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
    shadow: ShadowName | null;
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
  icon?: TabBarIconTokens;
};

type ThemeSpacingLegacy = {
  none: 0;
  xxxs: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

type ThemeSpacingSemantic = {
  spacingMicro: number;
  spacingTight: number;
  spacingCompact: number;
  spacingStandard: number;
  spacingComfortable: number;
  spacingRoomy: number;
  spacingSpacious: number;
  spacingHero: number;
};

type ThemeRadiiLegacy = {
  sm: number;
  md: number;
  lg: number;
  round: number;
};

type ThemeRadiiSemantic = {
  radiusControl: number;
  radiusCard: number;
  radiusSurface: number;
  radiusPill: number;
};

type ThemeTypographyLegacy = {
  display: number;
  title: number;
  heading: number;
  subheading: number;
  body: number;
  extraSmall: number;
  small: number;
  tiny: number;
};

type ThemeTypographySemantic = {
  typeDisplay: number;
  typeTitle: number;
  typeHeading: number;
  typeSubheading: number;
  typeBody: number;
  typeBodySmall: number;
  typeCaption: number;
  typeMicro: number;
};

type ThemeSpacingInput = ThemeSpacingLegacy & Partial<ThemeSpacingSemantic>;
type ThemeRadiiInput = ThemeRadiiLegacy & Partial<ThemeRadiiSemantic>;
type ThemeTypographyInput = ThemeTypographyLegacy & Partial<ThemeTypographySemantic>;

export type ThemeSpacingTokens = ThemeSpacingLegacy & ThemeSpacingSemantic;
export type ThemeRadiiTokens = ThemeRadiiLegacy & ThemeRadiiSemantic;
export type ThemeTypographyTokens = ThemeTypographyLegacy & ThemeTypographySemantic;

export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    overlay: string;
    surfaceVariant: string;
    surfaceSubdued: string;
    surfaceMuted: string;
    primary: string;
    onPrimary: string;
    muted: string;
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
    logoPrimaryColor: string;
    logoSecondaryColor: string;
    logoTertiaryColor: string;
    imageBackgroundColor: string;
  };
  spacing: ThemeSpacingTokens;
  padding: {
    screen: number;
    section: number;
    card: number;
    compact: number;
  };
  radii: ThemeRadiiTokens;
  typography: ThemeTypographyTokens;
  fontFamilies: {
    display: string;
    regular: string;
    light: string;
    lightItalic: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  layout: {
    headerTopPadding: number;
    maxFormWidth: number;
    fabSize: number;
    fabOffsetBottom: number;
    fabOffsetLeft: number;
  };
  shadows: Record<ShadowName, {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  }>;
  borderWidths: {
    hairline: number;
    thin: number;
    regular: number;
    thick: number;
  };
  lineHeights: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
  };
  opacity: {
    disabled: number;
  };
  iconSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  widths: {
    full: typeof FULL_WIDTH;
  };
  componentSizes: {
    textAreaMinHeight: number;
  };
  components: {
    tabBar: TabBarTokens;
    card: {
      padding: number;
      borderRadius: number;
      gap: number;
      margin: number;
      imageHeight: number;
    };
    button: {
      primary: {
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
        fontSize: number;
        colorCustom?: string;
        textColorCustom?: string;
      };
      secondary: {
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
        fontSize: number;
      };
      pill: {
        paddingHorizontal: number;
        paddingVertical: number;
        borderRadius: number;
        colorCustom?: string;
        textColorCustom?: string;
      };
      text: {
        paddingHorizontal: number;
        paddingVertical: number;
      };
    };
    list: {
      itemPadding: { horizontal: number; vertical: number };
      itemGap: number;
      borderRadius: number;
      headerPadding: { horizontal: number; vertical: number };
    };
    header: {
      page: {
        paddingTop: number;
        paddingHorizontal: number;
        paddingBottom: number;
        gap: number;
      };
      section: {
        marginBottom: number;
        gap: number;
      };
    };
    input: {
      paddingHorizontal: number;
      paddingVertical: number;
      borderRadius: number;
      fontSize: number;
      labelGap: number;
    };
    textArea: {
      minHeight: number;
      padding: number;
      borderRadius: number;
    };
    rail: {
      headerGap: number;
      headerMarginBottom: number;
      cardGap: number;
      scrollPadding: number;
    };
  };
};

export type ThemeAssets = {
  logo: string; // For web, this will be a path/URL instead of ImageSourcePropType
};

export type ThemeTokensInput = Omit<ThemeTokens, "spacing" | "radii" | "typography"> & {
  spacing: ThemeSpacingInput;
  radii: ThemeRadiiInput;
  typography: ThemeTypographyInput;
};

export type ThemeDefinition = {
  label: string;
  description: string;
  tokens: ThemeTokens;
  assets: ThemeAssets;
};

export type ThemeDefinitionInput = Omit<ThemeDefinition, "tokens"> & {
  tokens: ThemeTokensInput;
};

export const baseTypography = {
  display: 40,
  title: 32,
  heading: 24,
  subheading: 18,
  body: 16,
  extraSmall: 14,
  small: 14,
  tiny: 12,
  typeDisplay: 40,
  typeTitle: 32,
  typeHeading: 24,
  typeSubheading: 18,
  typeBody: 16,
  typeBodySmall: 14,
  typeCaption: 14,
  typeMicro: 12,
} as const;

export const baseFontFamilies = {
  display: "Peignot, serif",
  regular: "Source Sans Pro, sans-serif",
  light: "Source Sans Pro Light, sans-serif",
  lightItalic: "Source Sans Pro Light Italic, sans-serif",
  medium: "Source Sans Pro, sans-serif",
  semiBold: "Source Sans Pro SemiBold, sans-serif",
  bold: "Source Sans Pro Bold, sans-serif",
} as const;

export const baseLayout = {
  headerTopPadding: 50,
  maxFormWidth: 384,
  fabSize: 56,
  fabOffsetBottom: 110,
  fabOffsetLeft: 5,
} as const;

export const baseSpacing = {
  none: 0,
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 40,
  spacingMicro: 2,
  spacingTight: 4,
  spacingCompact: 8,
  spacingStandard: 12,
  spacingComfortable: 16,
  spacingRoomy: 20,
  spacingSpacious: 24,
  spacingHero: 40,
} as const;

export const basePadding = {
  screen: 12,
  section: 16,
  card: 10,
  compact: 6,
} as const;

export const baseRadii = {
  sm: 8,
  md: 12,
  lg: 28,
  round: 999,
  radiusControl: 8,
  radiusCard: 12,
  radiusSurface: 28,
  radiusPill: 999,
} as const;

export const baseIconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const baseBorderWidths = {
  hairline: 0.5,
  thin: 1,
  regular: 1.5,
  thick: 2,
} as const;

export const baseLineHeights = {
  tight: 1.2,
  snug: 1.3,
  normal: 1.375,
  relaxed: 1.5,
} as const;

export const baseLetterSpacing = {
  tight: 0.5,
  normal: 0.75,
} as const;

export const baseOpacity = {
  disabled: 0.5,
} as const;

export const baseComponentSizes = {
  textAreaMinHeight: 150,
} as const;

export const baseComponentTokens = {
  card: {
    padding: basePadding.card,
    borderRadius: baseRadii.md,
    gap: baseSpacing.xs,
    margin: baseSpacing.xs,
    imageHeight: 120,
  },
  button: {
    primary: {
      paddingHorizontal: baseSpacing.lg,
      paddingVertical: baseSpacing.sm,
      borderRadius: baseRadii.sm,
      fontSize: baseTypography.body,
    },
    secondary: {
      paddingHorizontal: baseSpacing.md,
      paddingVertical: baseSpacing.sm,
      borderRadius: baseRadii.sm,
      fontSize: baseTypography.body,
    },
    pill: {
      paddingHorizontal: baseSpacing.xs,
      paddingVertical: baseSpacing.xxs,
      borderRadius: baseRadii.sm,
    },
    text: {
      paddingHorizontal: baseSpacing.md,
      paddingVertical: baseSpacing.xs,
    },
  },
  list: {
    itemPadding: { horizontal: baseSpacing.md, vertical: baseSpacing.md },
    itemGap: baseSpacing.md,
    borderRadius: baseRadii.md,
    headerPadding: { horizontal: baseSpacing.md, vertical: baseSpacing.sm },
  },
  header: {
    page: {
      paddingTop: baseLayout.headerTopPadding,
      paddingHorizontal: baseSpacing.lg,
      paddingBottom: baseSpacing.sm,
      gap: baseSpacing.xs,
    },
    section: {
      marginBottom: baseSpacing.sm,
      gap: baseSpacing.xxs,
    },
  },
  input: {
    paddingHorizontal: baseSpacing.md,
    paddingVertical: baseSpacing.xs,
    borderRadius: baseRadii.sm,
    fontSize: baseTypography.body,
    labelGap: baseSpacing.xxs,
  },
  textArea: {
    minHeight: baseComponentSizes.textAreaMinHeight,
    padding: baseSpacing.lg,
    borderRadius: baseRadii.md,
  },
  rail: {
    headerGap: baseSpacing.xxs,
    headerMarginBottom: baseSpacing.sm,
    cardGap: baseSpacing.xxs,
    scrollPadding: 0,
  },
} as const;

/**
 * Helper function to generate component tokens from global tokens.
 * Useful for backward compatibility during migration.
 */
export function generateComponentTokensFromGlobal(
  spacing: ThemeTokens["spacing"],
  padding: ThemeTokens["padding"],
  radii: ThemeTokens["radii"],
  typography: ThemeTokens["typography"],
  layout: ThemeTokens["layout"],
  componentSizes: ThemeTokens["componentSizes"]
): ThemeTokens["components"] {
  return {
    card: {
      padding: padding.card,
      borderRadius: radii.md,
      gap: spacing.xs,
      margin: spacing.xs,
      imageHeight: 120,
    },
    button: {
      primary: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.sm,
        fontSize: typography.body,
      },
      secondary: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.sm,
        fontSize: typography.body,
      },
      pill: {
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xxs,
        borderRadius: radii.sm,
      },
      text: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
      },
    },
    list: {
      itemPadding: { horizontal: spacing.md, vertical: spacing.md },
      itemGap: spacing.md,
      borderRadius: radii.md,
      headerPadding: { horizontal: spacing.md, vertical: spacing.sm },
    },
    header: {
      page: {
        paddingTop: layout.headerTopPadding,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
        gap: spacing.xs,
      },
      section: {
        marginBottom: spacing.sm,
        gap: spacing.xxs,
      },
    },
    input: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
      fontSize: typography.body,
      labelGap: spacing.xxs,
    },
    textArea: {
      minHeight: componentSizes.textAreaMinHeight,
      padding: spacing.lg,
      borderRadius: radii.md,
    },
    rail: {
      headerGap: spacing.xxs,
      headerMarginBottom: spacing.sm,
      cardGap: spacing.xxs,
      scrollPadding: 0,
    },
    // tabBar must be provided separately as it requires colors and other tokens
    tabBar: {} as TabBarTokens,
  };
}

export function defineThemes<T extends Record<string, ThemeDefinitionInput>>(
  themes: T
): { [K in keyof T]: ThemeDefinition } {
  const entries = Object.entries(themes).map(([key, definition]) => {
    const spacing = definition.tokens.spacing;
    const radii = definition.tokens.radii;
    const typography = definition.tokens.typography;

    const normalizedDefinition: ThemeDefinition = {
      ...definition,
      tokens: {
        ...definition.tokens,
        spacing: {
          ...spacing,
          spacingMicro: spacing.spacingMicro ?? spacing.xxxs,
          spacingTight: spacing.spacingTight ?? spacing.xxs,
          spacingCompact: spacing.spacingCompact ?? spacing.xs,
          spacingStandard: spacing.spacingStandard ?? spacing.sm,
          spacingComfortable: spacing.spacingComfortable ?? spacing.md,
          spacingRoomy: spacing.spacingRoomy ?? spacing.lg,
          spacingSpacious: spacing.spacingSpacious ?? spacing.xl,
          spacingHero: spacing.spacingHero ?? spacing.xxl,
        },
        radii: {
          ...radii,
          radiusControl: radii.radiusControl ?? radii.sm,
          radiusCard: radii.radiusCard ?? radii.md,
          radiusSurface: radii.radiusSurface ?? radii.lg,
          radiusPill: radii.radiusPill ?? radii.round,
        },
        typography: {
          ...typography,
          typeDisplay: typography.typeDisplay ?? typography.display,
          typeTitle: typography.typeTitle ?? typography.title,
          typeHeading: typography.typeHeading ?? typography.heading,
          typeSubheading: typography.typeSubheading ?? typography.subheading,
          typeBody: typography.typeBody ?? typography.body,
          typeBodySmall: typography.typeBodySmall ?? typography.extraSmall,
          typeCaption: typography.typeCaption ?? typography.small,
          typeMicro: typography.typeMicro ?? typography.tiny,
        },
      },
    };

    return [key, normalizedDefinition] as const;
  });

  return Object.fromEntries(entries) as { [K in keyof T]: ThemeDefinition };
}
