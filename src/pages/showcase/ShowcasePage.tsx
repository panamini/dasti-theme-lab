import { useThemeSystem } from "@/app/providers/ThemeProvider";
import { Cluster } from "@/components/layout/Cluster";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Pill } from "@/components/ui/Pill/Pill";
import { Select } from "@/components/ui/Select/Select";
import { Status } from "@/components/ui/Status/Status";
import type { ThemeSwatch } from "@/types";

import { ThemeLabPanel } from "./ThemeLabPanel";

const previewSurfaces = [
  { label: "Canvas", className: "bg-canvas" },
  { label: "Surface", className: "bg-surface" },
  { label: "Muted", className: "bg-surfaceMuted" },
  { label: "Raised", className: "bg-surfaceRaised" },
  { label: "Accent", className: "bg-accent" },
  { label: "Text", className: "bg-text" },
] as const;

const typeSamples = [
  { label: "Display", className: "font-editorial text-2xl tracking-[-0.02em]", copy: "Theme Lab preview" },
  { label: "Heading", className: "font-heading text-lg tracking-[-0.01em]", copy: "System section heading" },
  { label: "Body", className: "text-base", copy: "Body copy keeps the composed theme readable while controls change." },
  { label: "Meta", className: "text-sm text-textMuted", copy: "Supporting detail and helper text" },
] as const;

const spacing = ["8", "16", "24", "32", "48"] as const;

export function ShowcasePage() {
  const { dark, paletteType, selectedPair, composedTheme } = useThemeSystem();

  return (
    <main className="min-h-screen bg-canvas py-6 text-text">
      <Container size="xl">
        <div className="grid items-start gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
          <aside>
            <ThemeLabPanel />
          </aside>

          <Stack space="lg">
            <Card padding="section" className="rounded-surface bg-gradient-to-b from-surface to-surfaceRaised">
              <Stack space="lg">
                <Cluster justify="between" align="start" className="gap-3">
                  <Stack space="sm" className="min-w-0">
                    <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-accentHover">Preview</p>
                    <h1 className="m-0 max-w-[12ch] font-heading text-[clamp(34px,4.5vw,50px)] leading-[1.03] tracking-[-0.03em] text-heading">
                      Final composed theme.
                    </h1>
                    <p className="m-0 max-w-[44ch] text-base text-textMuted">
                      Switching modes only changes the editing console. The preview always shows the active result.
                    </p>
                  </Stack>

                  <Cluster className="gap-2">
                    <Pill tone="accent">{dark ? "Dark" : "Light"}</Pill>
                    <Pill>{paletteType}</Pill>
                    <Pill>{selectedPair.label}</Pill>
                  </Cluster>
                </Cluster>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <Card padding="section" className="rounded-surface border-borderStrong">
                    <Stack space="md">
                      <Stack space="sm">
                        <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Hero</p>
                        <h2 className="m-0 font-editorial text-2xl tracking-[-0.02em] text-heading">
                          Brand system preview
                        </h2>
                        <p className="m-0 max-w-[54ch] text-base text-textMuted">
                          Accent, surfaces, text, type, and radius are all coming from the current composed theme.
                        </p>
                      </Stack>

                      <Cluster className="gap-2">
                        <Button variant="primary">Primary action</Button>
                        <Button variant="secondary">Secondary action</Button>
                      </Cluster>

                      <Grid cols={3} gap="sm">
                        <Status tone="success">Success</Status>
                        <Status tone="warning">Warning</Status>
                        <Status tone="danger">Error</Status>
                      </Grid>
                    </Stack>
                  </Card>

                  <Card padding="panel" tone="muted" className="rounded-surface">
                    <Stack space="md">
                      <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Surface stack</p>
                      <Stack space="sm">
                        {previewSurfaces.map((surface) => (
                          <div key={surface.label} className="grid grid-cols-[auto_1fr] items-center gap-3">
                            <div className={`h-10 w-10 rounded-inline border border-border ${surface.className}`} />
                            <span className="text-sm text-textMuted">{surface.label}</span>
                          </div>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                </div>
              </Stack>
            </Card>

            <Grid cols={2} gap="lg" align="stretch">
              <Card padding="section" className="rounded-surface">
                <Stack space="md">
                  <Cluster justify="between" align="center">
                    <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Components</p>
                    <Pill>Starter set</Pill>
                  </Cluster>

                  <Grid cols={1} gap="md">
                    <Card padding="panel" tone="muted">
                      <Stack space="sm">
                        <p className="m-0 text-sm font-semibold text-text">Editorial card</p>
                        <h3 className="m-0 font-heading text-lg tracking-[-0.01em] text-heading">Structured, not noisy</h3>
                        <p className="m-0 text-sm text-textMuted">
                          The preview stays product-facing while the controls live in the console.
                        </p>
                      </Stack>
                    </Card>

                    <Card padding="panel" tone="muted">
                      <Stack space="sm">
                        <p className="m-0 text-sm font-semibold text-text">Form block</p>
                        <input
                          type="text"
                          placeholder="Email address"
                          className="h-control-md rounded-inline border border-border bg-surfaceRaised px-3 text-sm text-text outline-none"
                        />
                        <Select defaultValue="starter" fullWidth>
                          <option value="starter">Starter option</option>
                          <option value="secondary">Secondary option</option>
                        </Select>
                      </Stack>
                    </Card>
                  </Grid>
                </Stack>
              </Card>

              <Card padding="section" className="rounded-surface">
                <Stack space="md">
                  <Cluster justify="between" align="center">
                    <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Harmony</p>
                    <Pill>Global source</Pill>
                  </Cluster>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {composedTheme.swatches.map((swatch: ThemeSwatch, index: number) => (
                      <div
                        key={`${swatch.hue}-${index}`}
                        className="rounded-item border border-border bg-surface p-2 text-sm text-text"
                      >
                        <div
                          className="mb-2 h-10 rounded-inline border border-border"
                          style={{ background: swatch.color }}
                        />
                        <span className="text-textSubtle">H {swatch.hue}</span>
                      </div>
                    ))}
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid cols={2} gap="lg" align="stretch">
              <Card padding="section" className="rounded-surface">
                <Stack space="md">
                  <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Type</p>
                  <Stack space="sm">
                    {typeSamples.map((item, index) => (
                      <div key={item.label} className={index === 0 ? "grid gap-1" : "grid gap-1 border-t border-border pt-3"}>
                        <p className={item.className}>{item.copy}</p>
                        <span className="text-sm text-textSubtle">{item.label}</span>
                      </div>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              <Card padding="section" className="rounded-surface">
                <Stack space="md">
                  <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-accentHover">Rhythm</p>
                  <Stack space="sm">
                    {spacing.map((value, index) => (
                      <div key={value} className={index === 0 ? "grid gap-2" : "grid gap-2 border-t border-border pt-3"}>
                        <Cluster justify="between" align="center">
                          <span className="text-sm text-textMuted">Space {value}</span>
                          <span className="text-sm text-textSubtle">{value}px</span>
                        </Cluster>
                        <div className="h-3 rounded-pill bg-accent" style={{ width: `${Number(value) * 2}px` }} />
                      </div>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </div>
      </Container>
    </main>
  );
}
