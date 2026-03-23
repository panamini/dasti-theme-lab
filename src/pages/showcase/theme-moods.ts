import type { PaletteType } from "@/types";

export type ThemeMood = {
  id: string;
  label: string;
  baseColor: string;
  paletteType: PaletteType;
  globalHue: number;
  globalSaturation: number;
  globalLightness: number;
  shortHint: string;
};

export const themeMoods: ThemeMood[] = [
  {
    id: "studio-sage",
    label: "Studio Sage",
    baseColor: "#5E8E74",
    paletteType: "analogous",
    globalHue: 0,
    globalSaturation: 0,
    globalLightness: 0,
    shortHint: "Calm, balanced, premium",
  },
  {
    id: "slate-signal",
    label: "Slate Signal",
    baseColor: "#5B64C8",
    paletteType: "analogous",
    globalHue: 0,
    globalSaturation: 2,
    globalLightness: -1,
    shortHint: "Clean, focused, professional",
  },
  {
    id: "editorial-warm",
    label: "Editorial Warm",
    baseColor: "#8A634A",
    paletteType: "analogous",
    globalHue: 0,
    globalSaturation: -2,
    globalLightness: 1,
    shortHint: "Warm, refined, editorial",
  },
  {
    id: "ceramic-light",
    label: "Ceramic Light",
    baseColor: "#B68C6A",
    paletteType: "monochromatic",
    globalHue: 0,
    globalSaturation: -4,
    globalLightness: 2,
    shortHint: "Soft, tactile, minimal",
  },
  {
    id: "night-signal",
    label: "Night Signal",
    baseColor: "#3E6A8D",
    paletteType: "split-complementary",
    globalHue: 0,
    globalSaturation: 2,
    globalLightness: -2,
    shortHint: "Sharp, modern, dark-ready",
  },
  {
    id: "civic-ink",
    label: "Civic Ink",
    baseColor: "#46627A",
    paletteType: "analogous",
    globalHue: 0,
    globalSaturation: -1,
    globalLightness: 0,
    shortHint: "Classic, stable, timeless",
  },
];

export function findThemeMood(params: {
  baseColor: string;
  paletteType: PaletteType;
  globalHue: number;
  globalSaturation: number;
  globalLightness: number;
}) {
  const normalizedBaseColor = params.baseColor.toLowerCase();

  return themeMoods.find(
    (mood) =>
      mood.baseColor.toLowerCase() === normalizedBaseColor &&
      mood.paletteType === params.paletteType &&
      mood.globalHue === params.globalHue &&
      mood.globalSaturation === params.globalSaturation &&
      mood.globalLightness === params.globalLightness,
  );
}