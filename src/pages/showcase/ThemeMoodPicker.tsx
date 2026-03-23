
import type { ChangeEvent } from "react";

import { Stack } from "@/components/layout/Stack";
import { Select } from "@/components/ui/Select/Select";
import type { PaletteType } from "@/types";

import { findThemeMood, themeMoods } from "./theme-moods";

type ThemeMoodPickerProps = {
  baseColor: string;
  paletteType: PaletteType;
  globalHue: number;
  globalSaturation: number;
  globalLightness: number;
  setBaseColor: (value: string) => void;
  setPaletteType: (value: PaletteType) => void;
  setGlobalHue: (value: number) => void;
  setGlobalSaturation: (value: number) => void;
  setGlobalLightness: (value: number) => void;
};

export function ThemeMoodPicker({
  baseColor,
  paletteType,
  globalHue,
  globalSaturation,
  globalLightness,
  setBaseColor,
  setPaletteType,
  setGlobalHue,
  setGlobalSaturation,
  setGlobalLightness,
}: ThemeMoodPickerProps) {
  const activeMood = findThemeMood({
    baseColor,
    paletteType,
    globalHue,
    globalSaturation,
    globalLightness,
  });

  const helperText =
    activeMood?.shortHint ?? "Choose a starting direction, then refine it with the current controls.";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextMood = themeMoods.find((mood) => mood.id === event.target.value);

    if (!nextMood) {
      return;
    }

    setBaseColor(nextMood.baseColor);
    setPaletteType(nextMood.paletteType);
    setGlobalHue(nextMood.globalHue);
    setGlobalSaturation(nextMood.globalSaturation);
    setGlobalLightness(nextMood.globalLightness);
  };

  return (
    <Stack space="sm">
      <label htmlFor="lab-mood" className="text-sm font-medium text-textMuted">
        Mood
      </label>
      <Select id="lab-mood" value={activeMood?.id ?? ""} onChange={handleChange} fullWidth>
        <option value="">Current direction</option>
        {themeMoods.map((mood) => (
          <option key={mood.id} value={mood.id}>
            {mood.label}
          </option>
        ))}
      </Select>
      <p className="m-0 text-sm text-textSubtle">{helperText}</p>
    </Stack>
  );
}