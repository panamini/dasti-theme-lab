import { useMemo, useState, type ReactNode } from "react";

import { useThemeSystem } from "@/app/providers/ThemeProvider";
import { Cluster } from "@/components/layout/Cluster";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Pill } from "@/components/ui/Pill/Pill";
import { Select } from "@/components/ui/Select/Select";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch/ThemeSwitch";
import { cn } from "@/lib/cn";
import type { ThemeMode } from "@/types";

type SectionProps = {
  label: string;
  title: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
};

function ThemeLabSection({ label, title, hint, actions, children }: SectionProps) {
  return (
    <Card padding="md" tone="muted" className="rounded-surface">
      <Stack space="md">
        <Cluster justify="between" align="start" className="gap-3">
          <Stack space="xs" className="min-w-0">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-accentHover">{label}</p>
            <h2 className="m-0 text-base font-semibold text-text">{title}</h2>
            {hint ? <p className="m-0 text-sm text-textSubtle">{hint}</p> : null}
          </Stack>
          {actions}
        </Cluster>
        {children}
      </Stack>
    </Card>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <Stack space="sm" className={disabled ? "opacity-55" : undefined}>
      <Cluster justify="between" align="center" className="gap-2">
        <label htmlFor={id} className="text-sm font-medium text-textMuted">
          {label}
        </label>
        <span className="text-sm text-textSubtle">{value}</span>
      </Cluster>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-pill bg-surfaceMuted accent-accent disabled:cursor-not-allowed"
      />
    </Stack>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-control-md rounded-inline border px-3 text-sm font-medium transition duration-fast ease-standard",
        active
          ? "border-transparent bg-accent text-onAccent shadow-a"
          : "border-border bg-surfaceRaised text-text hover:bg-surfaceMuted",
      )}
    >
      {label}
    </button>
  );
}

function SourceToggle({
  isCustom,
  onLinked,
  onCustom,
  linkedLabel = "Linked",
  customLabel = "Custom",
}: {
  isCustom: boolean;
  onLinked: () => void;
  onCustom: () => void;
  linkedLabel?: string;
  customLabel?: string;
}) {
  return (
    <div className="inline-flex rounded-inline border border-border bg-surfaceRaised p-1">
      <button
        type="button"
        onClick={onLinked}
        className={cn(
          "h-[calc(var(--control-sm)-4px)] rounded-[calc(var(--radius-inline)-2px)] px-3 text-sm font-medium transition duration-fast ease-standard",
          !isCustom ? "bg-surface text-text shadow-sm" : "text-textMuted hover:text-text",
        )}
      >
        {linkedLabel}
      </button>
      <button
        type="button"
        onClick={onCustom}
        className={cn(
          "h-[calc(var(--control-sm)-4px)] rounded-[calc(var(--radius-inline)-2px)] px-3 text-sm font-medium transition duration-fast ease-standard",
          isCustom ? "bg-surface text-text shadow-sm" : "text-textMuted hover:text-text",
        )}
      >
        {customLabel}
      </button>
    </div>
  );
}

export function ThemeLabPanel() {
  const {
    themeMode,
    setThemeMode,
    modeOptions,
    activeDomain,
    currentModeCanUseLocalOverride,
    currentModeUsesLocalOverride,
    setCurrentModeUseLocalOverride,
    resetCurrentModeToGlobal,
    resetCurrentModeAdjustments,
    resetAllModesToGlobal,
    dark,
    paletteType,
    baseColor,
    setBaseColor,
    paletteOptions,
    setPaletteType,
    globalHue,
    setGlobalHue,
    globalSaturation,
    setGlobalSaturation,
    globalLightness,
    setGlobalLightness,
    localHueShift,
    setLocalHueShift,
    localSaturationBias,
    setLocalSaturationBias,
    localLightnessBias,
    setLocalLightnessBias,
    textContrastBias,
    setTextContrastBias,
    textMutedBias,
    setTextMutedBias,
    textSubtleBias,
    setTextSubtleBias,
    textWarmthBias,
    setTextWarmthBias,
    selectedPairId,
    setSelectedPairId,
    selectedPair,
    fontPairs,
    radius,
    setRadiusControl,
    setRadiusPanel,
    setRadiusLarge,
    setRadiusPill,
    exportThemeCss,
    exportSiteCss,
    copyThemeCss,
    downloadThemeCss,
    copySiteCss,
    downloadSiteCss,
  } = useThemeSystem();

  const [exportView, setExportView] = useState<"theme" | "site">("theme");

  const currentMode = useMemo(
    () => modeOptions.find((option) => option.id === themeMode),
    [modeOptions, themeMode],
  );

  const isGlobalWorkspace = activeDomain === "global";
  const isTextWorkspace = themeMode === "text";
  const controlsAreEditable = isGlobalWorkspace || currentModeUsesLocalOverride;
  const linkedSourceLabel = isTextWorkspace ? "Auto" : "Linked";
  const sourceLabel = isGlobalWorkspace ? "System source" : currentModeUsesLocalOverride ? "Custom" : linkedSourceLabel;
  const sourceHint = isGlobalWorkspace
    ? "The master palette updates the full preview."
    : currentModeUsesLocalOverride
      ? isTextWorkspace
        ? "Custom text bias settings are active for this layer."
        : "Custom settings are active for this layer."
      : isTextWorkspace
        ? "Saved custom settings stay here while text follows the visible surface mix."
        : "Saved custom settings stay here while this layer follows Global.";
  const resetLabel = isGlobalWorkspace
    ? "Reset global"
    : currentModeUsesLocalOverride
      ? "Reset custom"
      : "Clear saved custom";
  const relinkLabel = isTextWorkspace ? "Use auto text" : "Link to Global";
  const exportValue = exportView === "theme" ? exportThemeCss : exportSiteCss;
  const exportHint =
    exportView === "theme"
      ? "Canonical theme tokens"
      : "Starter CSS built on canonical theme tokens";

  const handleCopyExport = async () => {
    try {
      if (exportView === "theme") {
        await copyThemeCss();
        return;
      }

      await copySiteCss();
    } catch (error) {
      console.error("Failed to copy export CSS", error);
    }
  };

  const handleDownloadExport = () => {
    if (exportView === "theme") {
      downloadThemeCss();
      return;
    }

    downloadSiteCss();
  };

  return (
    <Stack space="md" className="xl:sticky xl:top-6">
      <Card padding="md" className="rounded-surface border-borderStrong shadow-md backdrop-blur">
        <Stack space="md">
          <Cluster justify="between" align="start" className="gap-3">
            <Stack space="xs" className="min-w-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-accentHover">Theme Lab</p>
              <h1 className="m-0 text-xl font-heading tracking-[-0.02em] text-heading">V2 control console</h1>
              <p className="m-0 text-sm text-textSubtle">Compact controls. Stable preview.</p>
            </Stack>
            <ThemeSwitch />
          </Cluster>

          <Cluster gap="sm" className="gap-2">
            <Pill tone="accent">{dark ? "Dark" : "Light"}</Pill>
            <Pill>{paletteType}</Pill>
            <Pill>{selectedPair.label}</Pill>
          </Cluster>

          <div className="grid grid-cols-2 gap-2">
            {modeOptions.map((option) => (
              <ModeButton
                key={option.id}
                active={option.id === themeMode}
                label={option.label}
                onClick={() => setThemeMode(option.id as ThemeMode)}
              />
            ))}
          </div>
        </Stack>
      </Card>

      <ThemeLabSection
        label={currentMode?.label ?? "Mode"}
        title={sourceLabel}
        hint={sourceHint}
        actions={
          <Pill tone={currentModeUsesLocalOverride ? "accent" : "neutral"}>
            {currentModeUsesLocalOverride ? "Custom" : isGlobalWorkspace ? "Global" : linkedSourceLabel}
          </Pill>
        }
      >
        <Stack space="md">
          {currentModeCanUseLocalOverride ? (
            <Stack space="sm">
              <SourceToggle
                isCustom={currentModeUsesLocalOverride}
                onLinked={() => setCurrentModeUseLocalOverride(false)}
                onCustom={() => setCurrentModeUseLocalOverride(true)}
                linkedLabel={linkedSourceLabel}
              />
              <Cluster className="gap-2">
                <Button variant="secondary" onClick={resetCurrentModeToGlobal} disabled={!currentModeUsesLocalOverride}>
                  {relinkLabel}
                </Button>
                <Button variant="secondary" onClick={resetCurrentModeAdjustments}>
                  {resetLabel}
                </Button>
              </Cluster>
            </Stack>
          ) : (
            <Cluster className="gap-2">
              <Button variant="secondary" onClick={resetCurrentModeAdjustments}>
                {resetLabel}
              </Button>
              <Button variant="secondary" onClick={resetAllModesToGlobal}>
                Link all layers
              </Button>
            </Cluster>
          )}

          {isGlobalWorkspace ? (
            <Stack space="md">
              <Stack space="sm">
                <label htmlFor="lab-base-color" className="text-sm font-medium text-textMuted">
                  Base color
                </label>
                <div className="flex items-center gap-3 rounded-card border border-border bg-surfaceRaised px-3 py-3">
                  <input
                    id="lab-base-color"
                    type="color"
                    value={baseColor}
                    onChange={(event) => setBaseColor(event.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-inline border border-border bg-transparent"
                  />
                  <span className="font-mono text-sm text-textSubtle">{baseColor.toUpperCase()}</span>
                </div>
              </Stack>

              <Stack space="sm">
                <label htmlFor="lab-palette" className="text-sm font-medium text-textMuted">
                  Palette
                </label>
                <Select
                  id="lab-palette"
                  value={paletteType}
                  onChange={(event) => setPaletteType(event.target.value as typeof paletteType)}
                  fullWidth
                >
                  {paletteOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Stack>

              <Grid cols={1} gap="md">
                <SliderField id="global-hue" label="Hue" min={-180} max={180} value={globalHue} onChange={setGlobalHue} />
                <SliderField
                  id="global-saturation"
                  label="Saturation"
                  min={-36}
                  max={36}
                  value={globalSaturation}
                  onChange={setGlobalSaturation}
                />
                <SliderField
                  id="global-lightness"
                  label="Lightness"
                  min={-24}
                  max={24}
                  value={globalLightness}
                  onChange={setGlobalLightness}
                />
              </Grid>
            </Stack>
          ) : null}

          {(themeMode === "accent" || themeMode === "surface") ? (
            <Grid cols={1} gap="md">
              <SliderField
                id="local-hue"
                label="Hue shift"
                min={-90}
                max={90}
                value={localHueShift}
                onChange={setLocalHueShift}
                disabled={!controlsAreEditable}
              />
              <SliderField
                id="local-saturation"
                label="Saturation"
                min={-24}
                max={24}
                value={localSaturationBias}
                onChange={setLocalSaturationBias}
                disabled={!controlsAreEditable}
              />
              <SliderField
                id="local-lightness"
                label="Lightness"
                min={-18}
                max={18}
                value={localLightnessBias}
                onChange={setLocalLightnessBias}
                disabled={!controlsAreEditable}
              />
            </Grid>
          ) : null}

          {themeMode === "text" ? (
            <Grid cols={1} gap="md">
              <SliderField
                id="text-contrast"
                label="Contrast"
                min={-24}
                max={24}
                value={textContrastBias}
                onChange={setTextContrastBias}
                disabled={!controlsAreEditable}
              />
              <SliderField
                id="text-muted"
                label="Muted"
                min={-20}
                max={20}
                value={textMutedBias}
                onChange={setTextMutedBias}
                disabled={!controlsAreEditable}
              />
              <SliderField
                id="text-subtle"
                label="Subtle"
                min={-20}
                max={20}
                value={textSubtleBias}
                onChange={setTextSubtleBias}
                disabled={!controlsAreEditable}
              />
              <SliderField
                id="text-warmth"
                label="Warmth"
                min={-30}
                max={30}
                value={textWarmthBias}
                onChange={setTextWarmthBias}
                disabled={!controlsAreEditable}
              />
            </Grid>
          ) : null}
        </Stack>
      </ThemeLabSection>

      <ThemeLabSection label="Type" title="Locked pairing" hint="Pairing changes both heading and body.">
        <Stack space="sm">
          <Select
            id="lab-font-pair"
            value={selectedPairId}
            onChange={(event) => setSelectedPairId(event.target.value as typeof selectedPairId)}
            fullWidth
          >
            {fontPairs.map((pair) => (
              <option key={pair.id} value={pair.id}>
                {pair.label}
              </option>
            ))}
          </Select>
          <p className="m-0 text-sm text-textSubtle">Current pair: {selectedPair.label}</p>
        </Stack>
      </ThemeLabSection>

      <ThemeLabSection label="Radius" title="Shape controls" hint="Control, panel, large, pill.">
        <Grid cols={1} gap="md">
          <SliderField id="radius-control" label="Control" min={4} max={16} value={radius.control} onChange={setRadiusControl} />
          <SliderField id="radius-panel" label="Panel" min={8} max={24} value={radius.panel} onChange={setRadiusPanel} />
          <SliderField id="radius-large" label="Large" min={14} max={32} value={radius.large} onChange={setRadiusLarge} />
          <SliderField id="radius-pill" label="Pill" min={24} max={999} value={radius.pill} onChange={setRadiusPill} />
        </Grid>
      </ThemeLabSection>

      <ThemeLabSection label="Export" title="Ready outputs" hint={exportHint}>
        <Stack space="md">
          <SourceToggle
            isCustom={exportView === "site"}
            onLinked={() => setExportView("theme")}
            onCustom={() => setExportView("site")}
            linkedLabel="Theme CSS"
            customLabel="Starter CSS"
          />
          <textarea
            value={exportValue}
            readOnly
            aria-label={exportView === "theme" ? "Theme CSS export" : "Starter site CSS export"}
            className="min-h-[220px] w-full rounded-card border border-border bg-surfaceRaised p-3 font-mono text-sm text-text outline-none"
          />
          <Cluster className="gap-2">
            <Button variant="secondary" onClick={handleCopyExport}>
              Copy {exportView === "theme" ? "theme" : "starter"} CSS
            </Button>
            <Button variant="primary" onClick={handleDownloadExport}>
              Download {exportView === "theme" ? "theme" : "starter"} CSS
            </Button>
          </Cluster>
        </Stack>
      </ThemeLabSection>
    </Stack>
  );
}