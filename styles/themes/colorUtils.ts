type Rgb = {
  r: number;
  g: number;
  b: number;
};

type Hsl = {
  h: number;
  s: number;
  l: number;
};

export type PaletteColors = {
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

export type PaletteSuggestion = {
  id: string;
  name: string;
  description: string;
  colors: PaletteColors;
};

type PaletteMode = "light" | "dark";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const toHex = (value: number) => {
  const normalized = clamp(Math.round(value), 0, 255);
  const hex = normalized.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

export function normalizeHex(value: string): string {
  const cleaned = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return `#${cleaned
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
      .toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  return "#000000";
}

export function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex).replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex(rgb: Rgb): string {
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    h: hue,
    s: saturation * 100,
    l: lightness * 100,
  };
}

export function hslToRgb(hsl: Hsl): Rgb {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
  };
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl));
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const transform = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const foreground = relativeLuminance(foregroundHex);
  const background = relativeLuminance(backgroundHex);
  const lighter = Math.max(foreground, background);
  const darker = Math.min(foreground, background);
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableTextColor(backgroundHex: string): string {
  const whiteContrast = contrastRatio("#FFFFFF", backgroundHex);
  const darkContrast = contrastRatio("#111111", backgroundHex);
  return whiteContrast >= darkContrast ? "#FFFFFF" : "#111111";
}

const shiftHue = (hue: number, amount: number) => (hue + amount + 360) % 360;

const paletteFromAccent = (accentHex: string, mode: PaletteMode): PaletteColors => {
  const accentHsl = rgbToHsl(hexToRgb(accentHex));
  const isLight = mode === "light";

  const background = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * (isLight ? 0.18 : 0.24), isLight ? 5 : 8, isLight ? 22 : 28),
    l: isLight ? 97 : 8,
  });
  const surface = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * (isLight ? 0.28 : 0.34), isLight ? 6 : 10, isLight ? 28 : 34),
    l: isLight ? 99 : 12,
  });
  const overlay = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * (isLight ? 0.32 : 0.36), isLight ? 8 : 12, isLight ? 32 : 36),
    l: isLight ? 95 : 16,
  });

  const textPrimary = readableTextColor(background);
  const textSecondary = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * 0.2, 8, 18),
    l: isLight ? 34 : 74,
  });
  const textMuted = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * 0.16, 6, 16),
    l: isLight ? 52 : 58,
  });
  const border = hslToHex({
    h: accentHsl.h,
    s: clamp(accentHsl.s * 0.28, 8, 22),
    l: isLight ? 80 : 30,
  });

  const accent = normalizeHex(accentHex);
  const accentOnPrimary = readableTextColor(accent);
  const success = hslToHex({
    h: 145,
    s: isLight ? 60 : 55,
    l: isLight ? 38 : 48,
  });
  const danger = hslToHex({
    h: 4,
    s: isLight ? 74 : 68,
    l: isLight ? 48 : 58,
  });
  const info = hslToHex({
    h: 210,
    s: isLight ? 70 : 64,
    l: isLight ? 48 : 58,
  });
  const logoSecondary = hslToHex({
    h: shiftHue(accentHsl.h, 24),
    s: clamp(accentHsl.s * 0.7, 35, 78),
    l: clamp(accentHsl.l + (isLight ? 8 : 14), 35, 74),
  });
  const logoTertiary = hslToHex({
    h: shiftHue(accentHsl.h, -32),
    s: clamp(accentHsl.s * 0.9, 42, 88),
    l: clamp(accentHsl.l + (isLight ? -2 : 10), 28, 72),
  });

  return {
    background,
    surface,
    overlay,
    surfaceVariant: hslToHex({
      h: accentHsl.h,
      s: clamp(accentHsl.s * 0.28, 6, 26),
      l: isLight ? 92 : 18,
    }),
    surfaceSubdued: hslToHex({
      h: accentHsl.h,
      s: clamp(accentHsl.s * 0.25, 6, 24),
      l: isLight ? 90 : 14,
    }),
    surfaceMuted: hslToHex({
      h: accentHsl.h,
      s: clamp(accentHsl.s * 0.23, 6, 20),
      l: isLight ? 87 : 21,
    }),
    primary: accent,
    onPrimary: accentOnPrimary,
    muted: hslToHex({
      h: accentHsl.h,
      s: clamp(accentHsl.s * 0.12, 4, 14),
      l: isLight ? 86 : 24,
    }),
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    accentOnPrimary,
    success,
    danger,
    info,
    logoFill: textPrimary,
    logoPrimaryColor: accent,
    logoSecondaryColor: logoSecondary,
    logoTertiaryColor: logoTertiary,
    imageBackgroundColor: surface,
  };
};

export function generatePaletteSuggestions(
  seedHex: string,
  mode: PaletteMode
): PaletteSuggestion[] {
  const normalizedSeed = normalizeHex(seedHex);
  const baseHsl = rgbToHsl(hexToRgb(normalizedSeed));

  const variants = [
    {
      id: "analogous",
      name: "Analogous",
      description: "Close hues with gentle transitions and cohesive surfaces.",
      accent: hslToHex({
        h: shiftHue(baseHsl.h, 24),
        s: clamp(baseHsl.s + 8, 35, 88),
        l: clamp(baseHsl.l, 28, 66),
      }),
    },
    {
      id: "complementary",
      name: "Complementary",
      description: "Balanced contrast using a color opposite on the wheel.",
      accent: hslToHex({
        h: shiftHue(baseHsl.h, 180),
        s: clamp(baseHsl.s + 10, 36, 90),
        l: clamp(baseHsl.l + 2, 30, 68),
      }),
    },
    {
      id: "triadic",
      name: "Triadic",
      description: "Vibrant palette with bolder interplay across interface accents.",
      accent: hslToHex({
        h: shiftHue(baseHsl.h, 120),
        s: clamp(baseHsl.s + 6, 34, 88),
        l: clamp(baseHsl.l + 4, 30, 70),
      }),
    },
    {
      id: "monochrome",
      name: "Monochrome",
      description: "Single-hue identity with restrained visual hierarchy.",
      accent: hslToHex({
        h: baseHsl.h,
        s: clamp(baseHsl.s, 28, 78),
        l: clamp(baseHsl.l, 30, 64),
      }),
    },
  ];

  return variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    description: variant.description,
    colors: paletteFromAccent(variant.accent, mode),
  }));
}
