import type { ThemeVars } from "@/types";

export function applyThemeToRoot(root: HTMLElement, params: { dark: boolean; vars: ThemeVars }) {
  root.dataset.theme = params.dark ? "dark" : "light";
  root.style.colorScheme = params.dark ? "dark" : "light";

  Object.entries(params.vars).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      root.style.setProperty(key, value);
    }
  });

  return () => {
    Object.keys(params.vars).forEach((key) => {
      root.style.removeProperty(key);
    });
    delete root.dataset.theme;
    root.style.removeProperty("color-scheme");
  };
}

export async function copyCssToClipboard(css: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard API unavailable in this environment.");
  }

  await navigator.clipboard.writeText(css);
}

export function downloadCssFile(params: { css: string; filename: string }) {
  if (typeof document === "undefined") return;

  const blob = new Blob([params.css], { type: "text/css;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = params.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
