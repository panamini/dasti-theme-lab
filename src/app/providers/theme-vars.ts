import type { FontPair, RadiusState, ThemeResult, ThemeVars } from "@/types";

export function createSemanticAliases(vars: ThemeVars): ThemeVars {
  return {
    "--color-canvas": vars["--canvas"] ?? "",
    "--color-surface": vars["--surface"] ?? "",
    "--color-surface-muted": vars["--surface-muted"] ?? "",
    "--color-surface-raised": vars["--surface-raised"] ?? "",
    "--color-text": vars["--text"] ?? "",
    "--color-text-muted": vars["--text-muted"] ?? "",
    "--color-text-subtle": vars["--text-subtle"] ?? "",
    "--color-border": vars["--border"] ?? "",
    "--color-border-strong": vars["--border-strong"] ?? "",
    "--color-accent": vars["--accent"] ?? "",
    "--color-accent-hover": vars["--accent-hover"] ?? "",
    "--color-accent-soft": vars["--accent-soft"] ?? "",
    "--color-on-accent": vars["--on-accent"] ?? "",
    "--color-success-bg": vars["--success-bg"] ?? "",
    "--color-success": vars["--success-text"] ?? "",
    "--color-danger-bg": vars["--danger-bg"] ?? "",
    "--color-danger": vars["--danger-text"] ?? "",
    "--color-warning-bg": vars["--warning-bg"] ?? "",
    "--color-warning": vars["--warning-text"] ?? "",
    "--color-focus": vars["--accent"] ?? vars["--text"] ?? "",
    "--color-surface-2": vars["--surface-muted"] ?? "",
    "--color-success-soft": vars["--success-bg"] ?? "",
    "--color-danger-soft": vars["--danger-bg"] ?? "",
    "--color-warning-soft": vars["--warning-bg"] ?? "",
  };
}

export function createFontVars(pair: FontPair): ThemeVars {
  return {
    "--font-heading-family": pair.headingFamily,
    "--font-body-family": pair.bodyFamily,
    "--font-heading-weight": String(pair.headingWeight),
    "--font-body-weight": String(pair.bodyWeight),
    "--font-editorial-family": pair.editorialFamily,
    "--font-editorial-weight": String(pair.editorialWeight),
  };
}

export function createSwatchVars(theme: ThemeResult): ThemeVars {
  return Object.fromEntries(
    theme.swatches.map((swatch, index) => [`--swatch-${index + 1}`, swatch.color]),
  );
}

export function createRadiusVars(radius: RadiusState): ThemeVars {
  return {
    "--radius-sm": `${radius.control}px`,
    "--radius-md": `${radius.panel}px`,
    "--radius-lg": `${radius.large}px`,
    "--radius-pill": `${radius.pill}px`,
    "--radius-inline": `${Math.max(6, radius.control)}px`,
    "--radius-item": `${Math.max(8, Math.min(radius.panel, 12))}px`,
    "--radius-card": `${Math.max(14, Math.max(radius.panel, 16))}px`,
    "--radius-surface": `${Math.max(radius.large, 18)}px`,
    "--radius-input-pillish": `${Math.min(24, Math.max(16, radius.panel * 2))}px`,
  };
}

export function createAppliedThemeVars(params: {
  pair: FontPair;
  composedTheme: ThemeResult;
  semanticAliasVars: ThemeVars;
  radiusVars: ThemeVars;
  swatchTheme: ThemeResult;
}): ThemeVars {
  return {
    ...createFontVars(params.pair),
    ...params.composedTheme.surfaces,
    ...params.composedTheme.text,
    ...params.composedTheme.accent,
    ...params.semanticAliasVars,
    ...params.radiusVars,
    ...createSwatchVars(params.swatchTheme),
  };
}

export function createExportedThemeVars(params: {
  pair: FontPair;
  composedTheme: ThemeResult;
  semanticAliasVars: ThemeVars;
  radiusVars: ThemeVars;
}): ThemeVars {
  return {
    ...params.composedTheme.surfaces,
    ...params.composedTheme.text,
    ...params.composedTheme.accent,
    ...params.semanticAliasVars,
    ...params.radiusVars,
    ...createFontVars(params.pair),
  };
}