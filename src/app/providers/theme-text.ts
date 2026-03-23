import type { TextAdjustmentSeed, TextAdjustments, ThemeVars, ToneSeed } from "@/types";
import { buildThemeFromPreset, clamp, hsl, wrapHue } from "./theme-engine";
import { DEFAULT_GLOBAL_PRESET } from "./theme-catalogs";

function parseHslTone(value: string): ToneSeed | null {
  const match = value.match(/hsl\(\s*([-\d.]+)\s+([-\d.]+)%\s+([-\d.]+)%/i);

  if (!match) {
    return null;
  }

  return {
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  };
}

export function createTextSeed(vars: ThemeVars): TextAdjustmentSeed | null {
  const text = parseHslTone(vars["--text"] ?? "");
  const muted = parseHslTone(vars["--text-muted"] ?? "");
  const subtle = parseHslTone(vars["--text-subtle"] ?? "");

  if (!text || !muted || !subtle) {
    return null;
  }

  return { text, muted, subtle };
}

export function createTextSeedFromSurfaces(vars: ThemeVars, dark: boolean): TextAdjustmentSeed | null {
  const canvas = parseHslTone(vars["--canvas"] ?? "");
  const surface = parseHslTone(vars["--surface"] ?? "");
  const surfaceMuted = parseHslTone(vars["--surface-muted"] ?? "");
  const surfaceRaised = parseHslTone(vars["--surface-raised"] ?? "");

  if (!canvas || !surface || !surfaceMuted || !surfaceRaised) {
    return null;
  }

  const baseSaturation = (canvas.s + surface.s + surfaceMuted.s + surfaceRaised.s) / 4;
  const baseLightness = (canvas.l + surface.l + surfaceRaised.l) / 3;
  const subtleSaturation = (surface.s + surfaceMuted.s) / 2;

  if (dark) {
    return {
      text: {
        h: surface.h,
        s: clamp(baseSaturation + 8, 4, 24),
        l: clamp(baseLightness + 75, 72, 96),
      },
      muted: {
        h: surface.h,
        s: clamp(baseSaturation + 6, 4, 20),
        l: clamp(baseLightness + 49, 46, 78),
      },
      subtle: {
        h: surfaceMuted.h,
        s: clamp(subtleSaturation + 4, 2, 18),
        l: clamp(surfaceMuted.l + 26, 28, 62),
      },
    };
  }

  return {
    text: {
      h: surface.h,
      s: clamp(baseSaturation + 4, 4, 24),
      l: clamp(baseLightness - 82, 8, 24),
    },
    muted: {
      h: surface.h,
      s: clamp(baseSaturation, 4, 20),
      l: clamp(baseLightness - 52, 28, 58),
    },
    subtle: {
      h: surfaceMuted.h,
      s: clamp(subtleSaturation - 2, 2, 18),
      l: clamp(surfaceMuted.l - 26, 42, 78),
    },
  };
}

function adjustTextTone(
  tone: ToneSeed,
  dark: boolean,
  lightnessBias: number,
  saturationBias: number,
  warmthBias: number,
) {
  const direction = dark ? 1 : -1;

  return {
    h: wrapHue(tone.h + warmthBias),
    s: clamp(tone.s + saturationBias, 0, 100),
    l: clamp(tone.l + lightnessBias * direction, 0, 100),
  };
}

export function buildTextLayer(seed: TextAdjustmentSeed, dark: boolean, adjustments: TextAdjustments): ThemeVars {
  const textTone = adjustTextTone(
    seed.text,
    dark,
    adjustments.contrastBias,
    adjustments.warmthBias * 0.18,
    adjustments.warmthBias * 0.7,
  );

  const mutedTone = adjustTextTone(
    seed.muted,
    dark,
    adjustments.contrastBias * 0.55 + adjustments.mutedBias,
    adjustments.mutedBias * 0.18 + adjustments.warmthBias * 0.12,
    adjustments.warmthBias * 0.55,
  );

  const subtleTone = adjustTextTone(
    seed.subtle,
    dark,
    adjustments.contrastBias * 0.3 + adjustments.mutedBias * 0.45 + adjustments.subtleBias,
    adjustments.subtleBias * 0.18 + adjustments.warmthBias * 0.08,
    adjustments.warmthBias * 0.4,
  );

  return {
    "--text": hsl(textTone.h, textTone.s, textTone.l),
    "--text-muted": hsl(mutedTone.h, mutedTone.s, mutedTone.l),
    "--text-subtle": hsl(subtleTone.h, subtleTone.s, subtleTone.l),
  };
}

export function getDefaultTextSeed(dark: boolean): TextAdjustmentSeed {
  const defaultTheme = buildThemeFromPreset(DEFAULT_GLOBAL_PRESET, dark);

  return (
    createTextSeedFromSurfaces(defaultTheme.surfaces, dark) ??
    createTextSeed(defaultTheme.text) ?? {
      text: { h: 0, s: 0, l: 0 },
      muted: { h: 0, s: 0, l: 0 },
      subtle: { h: 0, s: 0, l: 0 },
    }
  );
}