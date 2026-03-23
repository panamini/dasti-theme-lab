import type {
  ColorAdjustments,
  DomainState,
  PaletteType,
  ThemeResult,
} from "@/types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function wrapHue(hue: number) {
  const value = hue % 360;
  return value < 0 ? value + 360 : value;
}

export function hexToHsl(hex: string) {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    if (max === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      hue = 60 * ((b - r) / delta + 2);
    } else {
      hue = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    h: wrapHue(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function hsl(h: number, s: number, l: number) {
  return `hsl(${Math.round(wrapHue(h))} ${Math.round(clamp(s, 0, 100))}% ${Math.round(
    clamp(l, 0, 100),
  )}%)`;
}

export function hsla(h: number, s: number, l: number, a: number) {
  return `hsl(${Math.round(wrapHue(h))} ${Math.round(clamp(s, 0, 100))}% ${Math.round(
    clamp(l, 0, 100),
  )}% / ${a})`;
}

export function applyColorAdjustmentsToPreset(seed: DomainState, adjustments: ColorAdjustments): DomainState {
  return {
    ...seed,
    hue: seed.hue + adjustments.hueShift,
    saturation: seed.saturation + adjustments.saturationBias,
    lightness: seed.lightness + adjustments.lightnessBias,
  };
}

function createHarmonySwatches(baseHue: number, type: PaletteType, dark: boolean) {
  const configs: Record<PaletteType, number[]> = {
    complementary: [0, 180],
    analogous: [-30, 0, 30],
    triadic: [0, 120, 240],
    "split-complementary": [0, 150, 210],
    tetradic: [0, 90, 180, 270],
    monochromatic: [0, 0, 0, 0],
  };

  const offsets = configs[type];

  return offsets.map((offset, index) => {
    const hue = wrapHue(baseHue + offset);
    const saturation =
      type === "monochromatic"
        ? clamp(28 + index * 12, 22, 72)
        : clamp(44 + (index % 2) * 10, 36, 72);

    const lightness = dark
      ? clamp(58 + (index % 2) * 8 - Math.floor(index / 2) * 3, 50, 76)
      : clamp(42 + (index % 2) * 8 - Math.floor(index / 2) * 2, 34, 64);

    return {
      hue,
      color: hsl(hue, saturation, lightness),
    };
  });
}

export function buildThemeVars(
  baseHue: number,
  type: PaletteType,
  dark: boolean,
  saturationBias: number,
  lightnessBias: number,
): ThemeResult {
  const swatches = createHarmonySwatches(baseHue, type, dark);
  const accentHue = swatches[0]?.hue ?? baseHue;
  const secondaryHue = swatches[1]?.hue ?? wrapHue(baseHue + 30);
  const tertiaryHue = swatches[2]?.hue ?? wrapHue(baseHue - 28);

  const accentSat = clamp((dark ? 52 : 46) + saturationBias, 18, 78);
  const accentHoverSat = clamp((dark ? 56 : 50) + saturationBias, 20, 82);
  const accentLight = clamp((dark ? 62 : 34) + lightnessBias, dark ? 36 : 20, dark ? 82 : 56);
  const accentHoverLight = clamp((dark ? 70 : 44) + lightnessBias, dark ? 42 : 24, dark ? 90 : 66);

  const accent = hsl(accentHue, accentSat, accentLight);
  const accentHover = hsl(accentHue, accentHoverSat, accentHoverLight);
  const accentSoft = dark
    ? hsl(
        secondaryHue,
        clamp(20 + saturationBias * 0.4, 8, 32),
        clamp(20 + lightnessBias * 0.4, 10, 30),
      )
    : hsl(
        secondaryHue,
        clamp(20 + saturationBias * 0.4, 8, 34),
        clamp(88 + lightnessBias * 0.4, 76, 96),
      );
  const onAccent = dark ? hsl(accentHue, 10, 8) : hsl(40, 20, 99);

  const canvas = dark
    ? hsl(baseHue, clamp(8 + saturationBias * 0.15, 2, 18), clamp(8 + lightnessBias, 4, 22))
    : hsl(baseHue, clamp(18 + saturationBias * 0.2, 6, 28), clamp(96 + lightnessBias, 86, 99));
  const surface = dark
    ? hsl(baseHue, clamp(8 + saturationBias * 0.12, 2, 16), clamp(11 + lightnessBias, 6, 24))
    : hsl(baseHue, clamp(14 + saturationBias * 0.18, 6, 24), clamp(93 + lightnessBias, 82, 98));
  const surfaceMuted = dark
    ? hsl(secondaryHue, clamp(8 + saturationBias * 0.16, 2, 18), clamp(16 + lightnessBias, 8, 28))
    : hsl(secondaryHue, clamp(14 + saturationBias * 0.2, 6, 26), clamp(88 + lightnessBias, 76, 96));
  const surfaceRaised = dark
    ? hsl(tertiaryHue, clamp(7 + saturationBias * 0.12, 2, 16), clamp(19 + lightnessBias, 10, 30))
    : hsl(tertiaryHue, clamp(16 + saturationBias * 0.18, 6, 26), clamp(99 + lightnessBias, 90, 100));

  const text = dark
    ? hsl(baseHue, clamp(12 + saturationBias * 0.12, 4, 22), clamp(88 + lightnessBias * 0.5, 72, 96))
    : hsl(baseHue, clamp(16 + saturationBias * 0.12, 4, 24), clamp(12 - lightnessBias * 0.4, 8, 24));
  const textMuted = dark
    ? hsl(baseHue, clamp(10 + saturationBias * 0.1, 4, 20), clamp(62 + lightnessBias * 0.45, 46, 78))
    : hsl(baseHue, clamp(10 + saturationBias * 0.1, 4, 20), clamp(42 - lightnessBias * 0.35, 28, 58));
  const textSubtle = dark
    ? hsl(baseHue, clamp(8 + saturationBias * 0.08, 2, 18), clamp(42 + lightnessBias * 0.4, 28, 62))
    : hsl(baseHue, clamp(8 + saturationBias * 0.08, 2, 18), clamp(62 - lightnessBias * 0.35, 42, 78));
  const border = dark
    ? hsla(baseHue, clamp(12 + saturationBias * 0.08, 2, 20), clamp(86 + lightnessBias * 0.3, 70, 96), 0.08)
    : hsla(baseHue, clamp(14 + saturationBias * 0.08, 2, 22), clamp(12 - lightnessBias * 0.2, 8, 20), 0.08);
  const borderStrong = dark
    ? hsla(baseHue, clamp(12 + saturationBias * 0.08, 2, 20), clamp(86 + lightnessBias * 0.3, 70, 96), 0.16)
    : hsla(baseHue, clamp(14 + saturationBias * 0.08, 2, 22), clamp(12 - lightnessBias * 0.2, 8, 20), 0.14);

  const successHue = wrapHue(baseHue + 110);
  const dangerHue = wrapHue(baseHue + 180);
  const warningHue = wrapHue(baseHue + 60);

  const successBg = dark
    ? hsl(successHue, clamp(20 + saturationBias * 0.25, 10, 34), clamp(14 + lightnessBias * 0.4, 8, 26))
    : hsl(successHue, clamp(28 + saturationBias * 0.25, 16, 46), clamp(92 + lightnessBias * 0.35, 82, 98));
  const successText = dark
    ? hsl(successHue, clamp(34 + saturationBias * 0.22, 18, 54), clamp(72 + lightnessBias * 0.35, 58, 86))
    : hsl(successHue, clamp(34 + saturationBias * 0.22, 18, 54), clamp(24 - lightnessBias * 0.2, 18, 34));
  const dangerBg = dark
    ? hsl(dangerHue, clamp(20 + saturationBias * 0.25, 10, 34), clamp(14 + lightnessBias * 0.4, 8, 26))
    : hsl(dangerHue, clamp(28 + saturationBias * 0.25, 16, 46), clamp(92 + lightnessBias * 0.35, 82, 98));
  const dangerText = dark
    ? hsl(dangerHue, clamp(34 + saturationBias * 0.22, 18, 54), clamp(72 + lightnessBias * 0.35, 58, 86))
    : hsl(dangerHue, clamp(34 + saturationBias * 0.22, 18, 54), clamp(24 - lightnessBias * 0.2, 18, 34));
  const warningBg = dark
    ? hsl(warningHue, clamp(20 + saturationBias * 0.25, 10, 34), clamp(14 + lightnessBias * 0.4, 8, 26))
    : hsl(warningHue, clamp(28 + saturationBias * 0.25, 16, 46), clamp(92 + lightnessBias * 0.35, 82, 98));
  const warningText = dark
    ? hsl(warningHue, clamp(34 + saturationBias * 0.22, 18, 54), clamp(72 + lightnessBias * 0.35, 58, 86))
    : hsl(warningHue, clamp(36 + saturationBias * 0.22, 18, 56), clamp(26 - lightnessBias * 0.2, 18, 36));

  return {
    swatches,
    accent: {
      "--accent": accent,
      "--accent-hover": accentHover,
      "--accent-soft": accentSoft,
      "--on-accent": onAccent,
      "--success-bg": successBg,
      "--success-text": successText,
      "--danger-bg": dangerBg,
      "--danger-text": dangerText,
      "--warning-bg": warningBg,
      "--warning-text": warningText,
    },
    surfaces: {
      "--canvas": canvas,
      "--surface": surface,
      "--surface-muted": surfaceMuted,
      "--surface-raised": surfaceRaised,
      "--border": border,
      "--border-strong": borderStrong,
    },
    text: {
      "--text": text,
      "--text-muted": textMuted,
      "--text-subtle": textSubtle,
    },
  };
}

export function buildThemeFromPreset(preset: DomainState, dark: boolean): ThemeResult {
  const baseHsl = hexToHsl(preset.baseColor);
  const effectiveHue = wrapHue(baseHsl.h + preset.hue);

  return buildThemeVars(
    effectiveHue,
    preset.paletteType,
    dark,
    preset.saturation,
    preset.lightness,
  );
}

export function buildThemeFromAdjustments(
  seed: DomainState,
  adjustments: ColorAdjustments,
  dark: boolean,
): ThemeResult {
  const seededPreset: DomainState = {
    ...seed,
    hue: seed.hue + adjustments.hueShift,
    saturation: seed.saturation + adjustments.saturationBias,
    lightness: seed.lightness + adjustments.lightnessBias,
  };

  return buildThemeFromPreset(seededPreset, dark);
}
