import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  ColorAdjustments,
  DomainKey,
  DomainState,
  FontPair,
  FontPairId,
  ModeOption,
  PaletteOption,
  PaletteType,
  RadiusState,
  TextAdjustments,
  ThemeMode,
  ThemeResult,
  ThemeVars,
} from "@/types";
import {
  DEFAULT_GLOBAL_PRESET,
  DEFAULTS,
  NEUTRAL_COLOR_ADJUSTMENTS,
  NEUTRAL_TEXT_ADJUSTMENTS,
  fontPairs,
  modeOptions,
  paletteOptions,
} from "./theme-catalogs";
import { buildThemeFromAdjustments, buildThemeFromPreset } from "./theme-engine";
import { buildStarterSiteCss, buildThemeCss } from "./theme-export";
import { applyThemeToRoot, copyCssToClipboard, downloadCssFile } from "./theme-runtime";
import { buildTextLayer, createTextSeedFromSurfaces, getDefaultTextSeed } from "./theme-text";
import {
  createAppliedThemeVars,
  createCanonicalSemanticAliases,
  createCompatibilitySemanticAliases,
  createExportedThemeVars,
  createRadiusVars,
} from "./theme-vars";

type ThemeContextValue = {
  dark: boolean;
  setDark: (value: boolean) => void;
  toggleTheme: () => void;
  baseColor: string;
  setBaseColor: (value: string) => void;
  paletteType: PaletteType;
  setPaletteType: (value: PaletteType) => void;
  themeMode: ThemeMode;
  setThemeMode: (value: ThemeMode) => void;
  globalHue: number;
  setGlobalHue: (value: number) => void;
  globalSaturation: number;
  setGlobalSaturation: (value: number) => void;
  globalLightness: number;
  setGlobalLightness: (value: number) => void;
  localHueShift: number;
  setLocalHueShift: (value: number) => void;
  localSaturationBias: number;
  setLocalSaturationBias: (value: number) => void;
  localLightnessBias: number;
  setLocalLightnessBias: (value: number) => void;
  textContrastBias: number;
  setTextContrastBias: (value: number) => void;
  textMutedBias: number;
  setTextMutedBias: (value: number) => void;
  textSubtleBias: number;
  setTextSubtleBias: (value: number) => void;
  textWarmthBias: number;
  setTextWarmthBias: (value: number) => void;
  resetCurrentModeAdjustments: () => void;
  selectedPairId: FontPairId;
  setSelectedPairId: (value: FontPairId) => void;
  selectedPair: FontPair;
  fontPairs: FontPair[];
  paletteOptions: PaletteOption[];
  modeOptions: ModeOption[];
  radius: RadiusState;
  setRadiusControl: (value: number) => void;
  setRadiusPanel: (value: number) => void;
  setRadiusLarge: (value: number) => void;
  setRadiusPill: (value: number) => void;
  theme: ThemeResult;
  composedTheme: ThemeResult;
  activeThemeVars: ThemeVars;
  radiusVars: ThemeVars;
  exportThemeCss: string;
  exportSiteCss: string;
  copyThemeCss: () => Promise<void>;
  downloadThemeCss: () => void;
  copySiteCss: () => Promise<void>;
  downloadSiteCss: () => void;
  activeDomain: "global" | DomainKey;
  isUsingGlobalForCurrentMode: boolean;
  currentModeUsesLocalOverride: boolean;
  currentModeCanUseLocalOverride: boolean;
  setCurrentModeUseLocalOverride: (value: boolean) => void;
  detachCurrentModeFromGlobal: () => void;
  resetCurrentModeToGlobal: () => void;
  resetAllModesToGlobal: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function cloneColorAdjustments(adjustments: ColorAdjustments): ColorAdjustments {
  return { ...adjustments };
}

function cloneTextAdjustments(adjustments: TextAdjustments): TextAdjustments {
  return { ...adjustments };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [radiusControl, setRadiusControl] = useState(DEFAULTS.radiusControl);
  const [radiusPanel, setRadiusPanel] = useState(DEFAULTS.radiusPanel);
  const [radiusLarge, setRadiusLarge] = useState(DEFAULTS.radiusLarge);
  const [radiusPill, setRadiusPill] = useState(DEFAULTS.radiusPill);
  const [dark, setDark] = useState(DEFAULTS.dark);
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULTS.themeMode);

  const [globalPreset, setGlobalPreset] = useState<DomainState>(DEFAULT_GLOBAL_PRESET);

  const [accentOverrideEnabled, setAccentOverrideEnabled] = useState(false);
  const [surfaceOverrideEnabled, setSurfaceOverrideEnabled] = useState(false);
  const [textOverrideEnabled, setTextOverrideEnabled] = useState(false);

  const [accentAdjustments, setAccentAdjustments] = useState<ColorAdjustments>(
    NEUTRAL_COLOR_ADJUSTMENTS,
  );
  const [surfaceAdjustments, setSurfaceAdjustments] = useState<ColorAdjustments>(
    NEUTRAL_COLOR_ADJUSTMENTS,
  );
  const [textAdjustments, setTextAdjustments] = useState<TextAdjustments>(
    NEUTRAL_TEXT_ADJUSTMENTS,
  );

  const [selectedPairId, setSelectedPairId] = useState<FontPairId>(DEFAULTS.selectedPairId);

  const selectedPair = useMemo(
    () => fontPairs.find((pair) => pair.id === selectedPairId) ?? fontPairs[0],
    [selectedPairId],
  );

  const sourceState = useMemo(
    () => ({
      globalPreset,
      accentOverrideEnabled,
      surfaceOverrideEnabled,
      textOverrideEnabled,
      accentAdjustments,
      surfaceAdjustments,
      textAdjustments,
    }),
    [
      accentAdjustments,
      accentOverrideEnabled,
      globalPreset,
      surfaceAdjustments,
      surfaceOverrideEnabled,
      textAdjustments,
      textOverrideEnabled,
    ],
  );

  const globalTheme = useMemo(
    () => buildThemeFromPreset(sourceState.globalPreset, dark),
    [dark, sourceState.globalPreset],
  );

  const effectiveAccentSettings = useMemo(
    () => ({
      seed: sourceState.globalPreset,
      adjustments: sourceState.accentOverrideEnabled
        ? sourceState.accentAdjustments
        : NEUTRAL_COLOR_ADJUSTMENTS,
    }),
    [sourceState.accentAdjustments, sourceState.accentOverrideEnabled, sourceState.globalPreset],
  );

  const effectiveSurfaceSettings = useMemo(
    () => ({
      seed: sourceState.globalPreset,
      adjustments: sourceState.surfaceOverrideEnabled
        ? sourceState.surfaceAdjustments
        : NEUTRAL_COLOR_ADJUSTMENTS,
    }),
    [sourceState.globalPreset, sourceState.surfaceAdjustments, sourceState.surfaceOverrideEnabled],
  );

  const accentTheme = useMemo(
    () => buildThemeFromAdjustments(effectiveAccentSettings.seed, effectiveAccentSettings.adjustments, dark),
    [dark, effectiveAccentSettings],
  );

  const surfaceTheme = useMemo(
    () => buildThemeFromAdjustments(effectiveSurfaceSettings.seed, effectiveSurfaceSettings.adjustments, dark),
    [dark, effectiveSurfaceSettings],
  );

  const linkedTextSeed = useMemo(
    () => createTextSeedFromSurfaces(surfaceTheme.surfaces, dark) ?? getDefaultTextSeed(dark),
    [dark, surfaceTheme.surfaces],
  );

  const effectiveTextSettings = useMemo(
    () => ({
      seed: linkedTextSeed,
      adjustments: sourceState.textOverrideEnabled
        ? sourceState.textAdjustments
        : NEUTRAL_TEXT_ADJUSTMENTS,
    }),
    [linkedTextSeed, sourceState.textAdjustments, sourceState.textOverrideEnabled],
  );

  const textThemeVars = useMemo(
    () => buildTextLayer(effectiveTextSettings.seed, dark, effectiveTextSettings.adjustments),
    [dark, effectiveTextSettings],
  );

  const composedTheme = useMemo<ThemeResult>(
    () => ({
      swatches: globalTheme.swatches,
      accent: accentTheme.accent,
      surfaces: surfaceTheme.surfaces,
      text: textThemeVars,
    }),
    [accentTheme.accent, globalTheme.swatches, surfaceTheme.surfaces, textThemeVars],
  );

  const activeDomain = useMemo<"global" | DomainKey>(() => {
    if (themeMode === "accent") return "accent";
    if (themeMode === "surface") return "surface";
    if (themeMode === "text") return "text";
    return "global";
  }, [themeMode]);

  const isUsingGlobalForCurrentMode = useMemo(() => {
    if (themeMode === "accent") return !sourceState.accentOverrideEnabled;
    if (themeMode === "surface") return !sourceState.surfaceOverrideEnabled;
    if (themeMode === "text") return !sourceState.textOverrideEnabled;
    return false;
  }, [sourceState.accentOverrideEnabled, sourceState.surfaceOverrideEnabled, sourceState.textOverrideEnabled, themeMode]);

  const currentModeCanUseLocalOverride = activeDomain !== "global";
  const currentModeUsesLocalOverride = currentModeCanUseLocalOverride && !isUsingGlobalForCurrentMode;

  const swatchTheme = useMemo<ThemeResult>(() => {
    if (themeMode === "accent") {
      return accentTheme;
    }

    if (themeMode === "surface") {
      return surfaceTheme;
    }

    return globalTheme;
  }, [accentTheme, globalTheme, surfaceTheme, themeMode]);

  const activeThemeVars = useMemo<ThemeVars>(() => {
    if (themeMode === "accent") return composedTheme.accent;
    if (themeMode === "surface") return composedTheme.surfaces;
    if (themeMode === "text") return composedTheme.text;

    return {
      ...composedTheme.surfaces,
      ...composedTheme.text,
      ...composedTheme.accent,
    };
  }, [composedTheme, themeMode]);

  const canonicalAliasVars = useMemo<ThemeVars>(
    () =>
      createCanonicalSemanticAliases({
        ...composedTheme.surfaces,
        ...composedTheme.text,
        ...composedTheme.accent,
      }),
    [composedTheme],
  );

  const compatibilityAliasVars = useMemo<ThemeVars>(
    () =>
      createCompatibilitySemanticAliases({
        ...composedTheme.surfaces,
        ...composedTheme.text,
        ...composedTheme.accent,
      }),
    [composedTheme],
  );

  const radius = useMemo<RadiusState>(
    () => ({
      control: radiusControl,
      panel: radiusPanel,
      large: radiusLarge,
      pill: radiusPill,
    }),
    [radiusControl, radiusLarge, radiusPanel, radiusPill],
  );

  const radiusVars = useMemo(() => createRadiusVars(radius), [radius]);

  const setCurrentColorAdjustmentPatch = useCallback(
    (patch: Partial<ColorAdjustments>) => {
      if (themeMode === "accent") {
        if (!sourceState.accentOverrideEnabled) return;
        setAccentAdjustments((current) => ({ ...current, ...patch }));
        return;
      }

      if (themeMode === "surface") {
        if (!sourceState.surfaceOverrideEnabled) return;
        setSurfaceAdjustments((current) => ({ ...current, ...patch }));
      }
    },
    [sourceState.accentOverrideEnabled, sourceState.surfaceOverrideEnabled, themeMode],
  );

  const setCurrentTextAdjustmentPatch = useCallback(
    (patch: Partial<TextAdjustments>) => {
      if (themeMode !== "text" || !sourceState.textOverrideEnabled) {
        return;
      }

      setTextAdjustments((current) => ({ ...current, ...patch }));
    },
    [sourceState.textOverrideEnabled, themeMode],
  );

  const resetCurrentModeAdjustments = useCallback(() => {
    if (themeMode === "global") {
      setGlobalPreset((current) => ({ ...current, hue: 0, saturation: 0, lightness: 0 }));
      return;
    }

    if (themeMode === "accent") {
      setAccentAdjustments(cloneColorAdjustments(NEUTRAL_COLOR_ADJUSTMENTS));
      return;
    }

    if (themeMode === "surface") {
      setSurfaceAdjustments(cloneColorAdjustments(NEUTRAL_COLOR_ADJUSTMENTS));
      return;
    }

    setTextAdjustments(cloneTextAdjustments(NEUTRAL_TEXT_ADJUSTMENTS));
  }, [themeMode]);

  const setCurrentModeUseLocalOverride = useCallback(
    (value: boolean) => {
      if (themeMode === "accent") {
        setAccentOverrideEnabled(value);
        return;
      }

      if (themeMode === "surface") {
        setSurfaceOverrideEnabled(value);
        return;
      }

      if (themeMode === "text") {
        setTextOverrideEnabled(value);
      }
    },
    [themeMode],
  );

  const detachCurrentModeFromGlobal = useCallback(() => {
    setCurrentModeUseLocalOverride(true);
  }, [setCurrentModeUseLocalOverride]);

  const resetCurrentModeToGlobal = useCallback(() => {
    setCurrentModeUseLocalOverride(false);
  }, [setCurrentModeUseLocalOverride]);

  const resetAllModesToGlobal = useCallback(() => {
    setAccentOverrideEnabled(false);
    setSurfaceOverrideEnabled(false);
    setTextOverrideEnabled(false);
  }, []);

  const exportedThemeVars = useMemo(
    () =>
      createExportedThemeVars({
        pair: selectedPair,
        composedTheme,
        canonicalAliasVars,
        radiusVars,
      }),
    [canonicalAliasVars, composedTheme, radiusVars, selectedPair],
  );

  const exportThemeCss = useMemo(
    () =>
      buildThemeCss({
        dark,
        globalPreset: sourceState.globalPreset,
        accentOverrideEnabled: sourceState.accentOverrideEnabled,
        surfaceOverrideEnabled: sourceState.surfaceOverrideEnabled,
        textOverrideEnabled: sourceState.textOverrideEnabled,
        accentAdjustments: sourceState.accentAdjustments,
        surfaceAdjustments: sourceState.surfaceAdjustments,
        textAdjustments: sourceState.textAdjustments,
        exportedVars: exportedThemeVars,
      }),
    [dark, exportedThemeVars, sourceState],
  );

  const exportSiteCss = useMemo(() => buildStarterSiteCss(exportThemeCss), [exportThemeCss]);

  const copyThemeCss = useCallback(async () => {
    await copyCssToClipboard(exportThemeCss);
  }, [exportThemeCss]);

  const downloadThemeCss = useCallback(() => {
    downloadCssFile({
      css: exportThemeCss,
      filename: `dasti-theme-${dark ? "dark" : "light"}.css`,
    });
  }, [dark, exportThemeCss]);

  const copySiteCss = useCallback(async () => {
    await copyCssToClipboard(exportSiteCss);
  }, [exportSiteCss]);

  const downloadSiteCss = useCallback(() => {
    downloadCssFile({
      css: exportSiteCss,
      filename: `dasti-site-starter-${dark ? "dark" : "light"}.css`,
    });
  }, [dark, exportSiteCss]);

  const appliedVars = useMemo(
    () =>
      createAppliedThemeVars({
        pair: selectedPair,
        composedTheme,
        canonicalAliasVars,
        compatibilityAliasVars,
        radiusVars,
        swatchTheme,
      }),
    [canonicalAliasVars, compatibilityAliasVars, composedTheme, radiusVars, selectedPair, swatchTheme],
  );

  useEffect(() => {
    return applyThemeToRoot(document.documentElement, { dark, vars: appliedVars });
  }, [appliedVars, dark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      dark,
      setDark,
      toggleTheme: () => setDark((current) => !current),
      baseColor: sourceState.globalPreset.baseColor,
      setBaseColor: (value) => setGlobalPreset((current) => ({ ...current, baseColor: value })),
      paletteType: sourceState.globalPreset.paletteType,
      setPaletteType: (value) => setGlobalPreset((current) => ({ ...current, paletteType: value })),
      themeMode,
      setThemeMode,
      globalHue: sourceState.globalPreset.hue,
      setGlobalHue: (value) => setGlobalPreset((current) => ({ ...current, hue: value })),
      globalSaturation: sourceState.globalPreset.saturation,
      setGlobalSaturation: (value) => setGlobalPreset((current) => ({ ...current, saturation: value })),
      globalLightness: sourceState.globalPreset.lightness,
      setGlobalLightness: (value) => setGlobalPreset((current) => ({ ...current, lightness: value })),
      localHueShift:
        themeMode === "accent"
          ? sourceState.accentAdjustments.hueShift
          : themeMode === "surface"
            ? sourceState.surfaceAdjustments.hueShift
            : 0,
      setLocalHueShift: (value) => setCurrentColorAdjustmentPatch({ hueShift: value }),
      localSaturationBias:
        themeMode === "accent"
          ? sourceState.accentAdjustments.saturationBias
          : themeMode === "surface"
            ? sourceState.surfaceAdjustments.saturationBias
            : 0,
      setLocalSaturationBias: (value) => setCurrentColorAdjustmentPatch({ saturationBias: value }),
      localLightnessBias:
        themeMode === "accent"
          ? sourceState.accentAdjustments.lightnessBias
          : themeMode === "surface"
            ? sourceState.surfaceAdjustments.lightnessBias
            : 0,
      setLocalLightnessBias: (value) => setCurrentColorAdjustmentPatch({ lightnessBias: value }),
      textContrastBias: themeMode === "text" ? sourceState.textAdjustments.contrastBias : 0,
      setTextContrastBias: (value) => setCurrentTextAdjustmentPatch({ contrastBias: value }),
      textMutedBias: themeMode === "text" ? sourceState.textAdjustments.mutedBias : 0,
      setTextMutedBias: (value) => setCurrentTextAdjustmentPatch({ mutedBias: value }),
      textSubtleBias: themeMode === "text" ? sourceState.textAdjustments.subtleBias : 0,
      setTextSubtleBias: (value) => setCurrentTextAdjustmentPatch({ subtleBias: value }),
      textWarmthBias: themeMode === "text" ? sourceState.textAdjustments.warmthBias : 0,
      setTextWarmthBias: (value) => setCurrentTextAdjustmentPatch({ warmthBias: value }),
      resetCurrentModeAdjustments,
      selectedPairId,
      setSelectedPairId,
      selectedPair,
      fontPairs,
      paletteOptions,
      modeOptions,
      radius,
      setRadiusControl,
      setRadiusPanel,
      setRadiusLarge,
      setRadiusPill,
      theme: swatchTheme,
      composedTheme,
      activeThemeVars,
      radiusVars,
      exportThemeCss,
      exportSiteCss,
      copyThemeCss,
      downloadThemeCss,
      copySiteCss,
      downloadSiteCss,
      activeDomain,
      isUsingGlobalForCurrentMode,
      currentModeUsesLocalOverride,
      currentModeCanUseLocalOverride,
      setCurrentModeUseLocalOverride,
      detachCurrentModeFromGlobal,
      resetCurrentModeToGlobal,
      resetAllModesToGlobal,
    }),
    [
      activeDomain,
      activeThemeVars,
      composedTheme,
      copySiteCss,
      copyThemeCss,
      currentModeCanUseLocalOverride,
      currentModeUsesLocalOverride,
      dark,
      detachCurrentModeFromGlobal,
      downloadSiteCss,
      downloadThemeCss,
      exportSiteCss,
      exportThemeCss,
      isUsingGlobalForCurrentMode,
      radius,
      radiusVars,
      resetAllModesToGlobal,
      resetCurrentModeAdjustments,
      resetCurrentModeToGlobal,
      selectedPair,
      selectedPairId,
      setCurrentColorAdjustmentPatch,
      setCurrentModeUseLocalOverride,
      setCurrentTextAdjustmentPatch,
      sourceState.accentAdjustments.hueShift,
      sourceState.accentAdjustments.lightnessBias,
      sourceState.accentAdjustments.saturationBias,
      sourceState.globalPreset.baseColor,
      sourceState.globalPreset.hue,
      sourceState.globalPreset.lightness,
      sourceState.globalPreset.paletteType,
      sourceState.globalPreset.saturation,
      sourceState.surfaceAdjustments.hueShift,
      sourceState.surfaceAdjustments.lightnessBias,
      sourceState.surfaceAdjustments.saturationBias,
      sourceState.textAdjustments.contrastBias,
      sourceState.textAdjustments.mutedBias,
      sourceState.textAdjustments.subtleBias,
      sourceState.textAdjustments.warmthBias,
      swatchTheme,
      themeMode,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeSystem() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeSystem must be used within ThemeProvider.");
  }

  return context;
}
