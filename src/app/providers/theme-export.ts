import type { ColorAdjustments, DomainState, TextAdjustments, ThemeVars } from "@/types";

function describeColorMode(label: string, linked: boolean, adjustments: ColorAdjustments) {
  if (linked) {
    return `${label}: linked to Global`;
  }

  return `${label}: local layer over live Global · h ${adjustments.hueShift} / s ${adjustments.saturationBias} / l ${adjustments.lightnessBias}`;
}

function describeTextMode(linked: boolean, adjustments: TextAdjustments) {
  if (linked) {
    return "text: derived from composed surfaces";
  }

  return `text: local tone layer over composed surfaces · contrast ${adjustments.contrastBias} / muted ${adjustments.mutedBias} / subtle ${adjustments.subtleBias} / warmth ${adjustments.warmthBias}`;
}

export function buildThemeCss(params: {
  dark: boolean;
  globalPreset: DomainState;
  accentOverrideEnabled: boolean;
  surfaceOverrideEnabled: boolean;
  textOverrideEnabled: boolean;
  accentAdjustments: ColorAdjustments;
  surfaceAdjustments: ColorAdjustments;
  textAdjustments: TextAdjustments;
  exportedVars: ThemeVars;
}) {
  const entries = Object.entries(params.exportedVars)
    .filter(([key, value]) => key.startsWith("--") && typeof value === "string" && value.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  const lines = [
    "/* DASTI exported theme */",
    "/* global master + local layer composition */",
    `/* appearance: ${params.dark ? "dark" : "light"} */`,
    `/* global: ${params.globalPreset.baseColor.toUpperCase()} · ${params.globalPreset.paletteType} · h ${params.globalPreset.hue} / s ${params.globalPreset.saturation} / l ${params.globalPreset.lightness} */`,
    `/* ${describeColorMode("accent", !params.accentOverrideEnabled, params.accentAdjustments)} */`,
    `/* ${describeColorMode("surface", !params.surfaceOverrideEnabled, params.surfaceAdjustments)} */`,
    `/* ${describeTextMode(!params.textOverrideEnabled, params.textAdjustments)} */`,
    ":root {",
    ...entries.map(([key, value]) => `  ${key}: ${value};`),
    "}",
  ];

  return lines.join("\n");
}

export function buildStarterSiteCss(themeCss: string) {
  return `${themeCss}

html, body {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--color-canvas);
  color: var(--color-text);
  font-family: var(--font-body-family, system-ui, sans-serif);
  font-weight: var(--font-body-weight, 400);
  font-size: var(--text-body-size, 16px);
  line-height: var(--text-body-line, 24px);
}

::selection {
  background: var(--color-accent-soft);
  color: var(--color-text);
}

a {
  color: var(--color-accent);
  text-decoration-color: color-mix(in srgb, var(--color-accent) 42%, transparent);
  text-underline-offset: 0.16em;
}

a:hover {
  color: var(--color-accent-hover);
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading-family, serif);
  font-weight: var(--font-heading-weight, 700);
  letter-spacing: -0.02em;
}

h1 {
  font-size: clamp(34px, 4vw, 48px);
  line-height: 1.04;
}

h2 {
  font-size: var(--text-display-size, 32px);
  line-height: var(--text-display-line, 40px);
}

h3 {
  font-size: var(--text-title-size, 20px);
  line-height: var(--text-title-line, 30px);
}

p {
  margin: 0;
}

.container {
  width: min(100% - 2 * var(--gutter-mobile, 16px), var(--container-lg, 1024px));
  margin-inline: auto;
}

.card {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card, 16px);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4, 32px);
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-surface, 18px);
  padding: var(--space-4, 32px);
}

.button,
button {
  appearance: none;
  border: 1px solid transparent;
  border-radius: var(--radius-inline, 6px);
  min-height: var(--control-md, 40px);
  padding-inline: var(--space-3, 24px);
  font: inherit;
  font-weight: 600;
  transition:
    background-color var(--duration-fast, 120ms) var(--ease-standard, ease),
    border-color var(--duration-fast, 120ms) var(--ease-standard, ease),
    color var(--duration-fast, 120ms) var(--ease-standard, ease),
    box-shadow var(--duration-fast, 120ms) var(--ease-standard, ease);
  cursor: pointer;
}

.button-primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.button-primary:hover {
  background: var(--color-accent-hover);
}

.button-secondary {
  background: var(--color-surface-raised);
  color: var(--color-text);
  border-color: var(--color-border);
}

.button-secondary:hover {
  background: var(--color-surface-muted, var(--color-surface-2));
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-inline, 6px);
  background: var(--color-surface-raised);
  color: var(--color-text);
  font: inherit;
  min-height: var(--control-md, 40px);
  padding: 0.75rem 0.875rem;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible,
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-focus);
}

.status {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-sm, 32px);
  padding-inline: 0.75rem;
  border-radius: var(--radius-pill, 999px);
  font-size: var(--text-body-sm-size, 14px);
  line-height: 1;
}

.status-success {
  background: var(--color-success-bg, var(--color-success-soft));
  color: var(--color-success);
}

.status-danger {
  background: var(--color-danger-bg, var(--color-danger-soft));
  color: var(--color-danger);
}

.status-warning {
  background: var(--color-warning-bg, var(--color-warning-soft));
  color: var(--color-warning);
}
`;
}
