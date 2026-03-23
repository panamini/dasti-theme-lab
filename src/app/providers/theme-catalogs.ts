import type {
  ColorAdjustments,
  DomainState,
  FontPair,
  FontPairId,
  ModeOption,
  PaletteOption,
  TextAdjustments,
  ThemeMode,
} from "@/types";

export const DEFAULTS = {
  radiusControl: 6,
  radiusPanel: 12,
  radiusLarge: 18,
  radiusPill: 999,
  dark: false,
  themeMode: "global" as ThemeMode,
  selectedPairId: "cormorant-source" as FontPairId,
};

export const DEFAULT_GLOBAL_PRESET: DomainState = {
  baseColor: "#3f8f74",
  paletteType: "analogous",
  hue: 0,
  saturation: 0,
  lightness: 0,
};

export const NEUTRAL_COLOR_ADJUSTMENTS: ColorAdjustments = {
  hueShift: 0,
  saturationBias: 0,
  lightnessBias: 0,
};

export const NEUTRAL_TEXT_ADJUSTMENTS: TextAdjustments = {
  contrastBias: 0,
  mutedBias: 0,
  subtleBias: 0,
  warmthBias: 0,
};

export const fontPairs: FontPair[] = [
  {
    id: "fraunces-syne",
    label: "Fraunces Bold / Syne Regular",
    headingFamily: '"Fraunces", serif',
    bodyFamily: '"Syne", system-ui, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    editorialFamily: '"Fraunces", serif',
    editorialWeight: 700,
  },
  {
    id: "cormorant-source",
    label: "Cormorant Bold / Source Sans Regular",
    headingFamily: '"Cormorant Garamond", serif',
    bodyFamily: '"Source Sans 3", system-ui, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    editorialFamily: '"Cormorant Garamond", serif',
    editorialWeight: 700,
  },
  {
    id: "brico-source",
    label: "Bricolage Grotesque / Source Sans",
    headingFamily: '"Bricolage Grotesque", system-ui, sans-serif',
    bodyFamily: '"Source Sans 3", system-ui, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    editorialFamily: '"Bricolage Grotesque", system-ui, sans-serif',
    editorialWeight: 700,
  },
  {
    id: "fraunces-source-serif",
    label: "Fraunces / Source Serif",
    headingFamily: '"Fraunces", serif',
    bodyFamily: '"Source Serif 4", serif',
    headingWeight: 600,
    bodyWeight: 400,
    editorialFamily: '"Fraunces", serif',
    editorialWeight: 600,
  },
];

export const paletteOptions: PaletteOption[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split-complementary", label: "Split-complementary" },
  { id: "tetradic", label: "Tetradic" },
  { id: "monochromatic", label: "Monochromatic" },
];

export const modeOptions: ModeOption[] = [
  {
    id: "global",
    label: "Global",
    description:
      "Master generator. Editing Global updates the palette source and every mode that is still linked to it.",
  },
  {
    id: "accent",
    label: "Accent",
    description:
      "Accent is a local adjustment layer over Global. It can shift hue, saturation, and lightness without becoming its own preset source.",
  },
  {
    id: "surface",
    label: "Surface",
    description:
      "Surface is a local adjustment layer over Global for canvas, panels, and borders. It is not a separate palette generator.",
  },
  {
    id: "text",
    label: "Text",
    description:
      "Text is a contrast and tone layer derived from the system. Use local override only for text-specific bias controls.",
  },
];
