import React from "react";
import "./resume-preview.css";

import { resumeLayoutSpec } from "./resume-layout.spec";
import { resumeMockOnecol as onecolData } from "./resume.mock";
import type { ResumeData } from "./resume.types";

type ResumePageMode =
  | "comparison"
  | "comparisonAll"
  | "robial"
  | "onecol";

type ResumePageProps = {
  data: ResumeData;
  mode?: ResumePageMode;
};

type ResumeVariant =
  (typeof resumeLayoutSpec.variants)[keyof typeof resumeLayoutSpec.variants];

type OnecolMetaItem = {
  label: string;
  value: string;
};

type AutoFitLevel = "0" | "1" | "2" | "3" | "4";
const AUTO_FIT_LEVELS: AutoFitLevel[] = ["0", "1", "2", "3", "4"];



function useAutoFitPage() {
  const pageRef = React.useRef<HTMLElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const applyFit = React.useCallback(() => {
    const page = pageRef.current;
    const inner = innerRef.current;
    if (!page || !inner) return;

    const overflows = () => inner.scrollHeight > inner.clientHeight + 1;

    for (const fit of AUTO_FIT_LEVELS) {
      page.dataset.fit = fit;

      if (!overflows() || fit === AUTO_FIT_LEVELS[AUTO_FIT_LEVELS.length - 1]) {
        break;
      }
    }
  }, []);

  const scheduleFit = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      applyFit();
    });
  }, [applyFit]);

  React.useLayoutEffect(() => {
    const page = pageRef.current;
    const inner = innerRef.current;
    if (!page || !inner) return;

    const ro = new ResizeObserver(scheduleFit);
    const mo = new MutationObserver(scheduleFit);
    const fonts = document.fonts;

    ro.observe(page);
    ro.observe(inner);
    mo.observe(inner, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", scheduleFit);

    if (fonts?.ready) {
      fonts.ready.then(scheduleFit);
    }

    fonts?.addEventListener?.("loadingdone", scheduleFit);

    scheduleFit();

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", scheduleFit);
      fonts?.removeEventListener?.("loadingdone", scheduleFit);
    };
  }, [scheduleFit]);

  React.useLayoutEffect(() => {
    scheduleFit();
  });

  return { pageRef, innerRef };
}

function SidebarSection({
  title,
  children,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  variant: ResumeVariant;
}) {
  return (
    <section className={`sidebar-section sidebar-section--${variant.id}`}>
      <h3 className={`sidebar-title sidebar-title--${variant.id}`}>{title}</h3>
      <div className={`sidebar-content sidebar-content--${variant.id}`}>
        {children}
      </div>
    </section>
  );
}

function MainSection({
  title,
  children,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  variant: ResumeVariant;
}) {
  return (
    <section className={`main-section main-section--${variant.id}`}>
      <div className={`main-heading-row main-heading-row--${variant.id}`}>
        <h2 className={`main-heading main-heading--${variant.id}`}>{title}</h2>
        <div className={`main-heading-rule main-heading-rule--${variant.id}`} />
      </div>
      {children}
    </section>
  );
}

function HeaderMeta({
  items,
  variant,
}: {
  items: ResumeData["metadata"];
  variant: ResumeVariant;
}) {
  return (
    <dl
      className={`meta-grid meta-grid--${variant.id}`}
      aria-label="Resume metadata"
    >
      {items.map((item) => (
        <div key={item.label} className="meta-item">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function OneColumnSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="onecol-section">
      <div className="onecol-section-rule" />
      <h2 className="onecol-section-title">{title}</h2>
      <div className="onecol-section-body">{children}</div>
    </section>
  );
}

function buildPageVars(variant: ResumeVariant): React.CSSProperties {
  return {
    "--page-width": resumeLayoutSpec.page.width,
    "--page-height": resumeLayoutSpec.page.height,
    "--page-radius": resumeLayoutSpec.page.borderRadius,
    "--margin-top": variant.margins.top,
    "--margin-right": variant.margins.right,
    "--margin-bottom": variant.margins.bottom,
    "--margin-left": variant.margins.left,
    "--sidebar-width": variant.columns.sidebar,
    "--gutter-width": variant.columns.gutter,
    "--main-width": variant.columns.main,
    "--header-row-gap": variant.header.rowGap,
    "--header-bottom-padding": variant.header.bottomPadding,
    "--header-summary-width": variant.header.summaryMaxWidth,
    "--header-title-margin-top": variant.header.titleMarginTop,
    "--body-row-gap": variant.body.rowGap,
    "--sidebar-right-padding": variant.body.sidebarRightPadding,
    "--main-left-padding": variant.body.mainLeftPadding,
    "--sidebar-section-gap": variant.sidebarSection.marginBottom,
    "--sidebar-title-margin": variant.sidebarSection.titleMarginBottom,
    "--sidebar-title-padding": variant.sidebarSection.titlePaddingBottom,
    "--sidebar-content-gap": variant.sidebarSection.contentGap,
    "--main-section-gap": variant.mainSection.marginBottom,
    "--main-heading-gap": variant.mainSection.headingGap,
    "--main-heading-margin": variant.mainSection.headingMarginBottom,
    "--experience-date-column": variant.experience.dateColumn,
    "--experience-column-gap": variant.experience.columnGap,
    "--experience-item-gap": variant.experience.itemGap,
    "--experience-org-margin": variant.experience.orgMarginBottom,
    "--experience-bullets-padding": variant.experience.bulletsPaddingLeft,
    "--experience-bullets-gap": variant.experience.bulletsGap,
    "--project-gap": variant.projects.cardGap,
    "--project-padding": variant.projects.cardPadding,
    "--education-gap": variant.education.itemGap,
    "--skill-gap": variant.skills.gap,
    "--skill-padding-inline": variant.skills.paddingInline,
    "--skill-padding-block": variant.skills.paddingBlock,
    "--display-size-adjust": variant.density.displaySizeAdjust,
    "--title-size-adjust": variant.density.titleSizeAdjust,
    "--body-size-adjust": variant.density.bodySizeAdjust,
    "--body-sm-size-adjust": variant.density.bodySmSizeAdjust,
    "--section-gap-adjust": variant.density.sectionGapAdjust,
    "--heading-margin-adjust": variant.density.headingMarginAdjust,
    "--bullet-gap-adjust": variant.density.bulletGapAdjust,
    "--project-gap-adjust": variant.density.projectGapAdjust,
    "--project-padding-adjust": variant.density.projectPaddingAdjust,
  } as React.CSSProperties;
}

function RobialPeriod({ period }: { period: string }) {
  const parts = period.split(/\s*[—–-]\s*/);

  if (parts.length === 2) {
    return (
      <span className="robial-period-stack robial-period-stack--no-sep">
        <span>{parts[0]}</span>
        <span>{parts[1]}</span>
      </span>
    );
  }

  return <span>{period}</span>;
}

function ClassicResumePage({
  variant,
  data,
}: {
  variant: ResumeVariant;
  data: ResumeData;
}) {
  const pageVars = buildPageVars(variant);
  const { pageRef, innerRef } = useAutoFitPage();

  return (
    <div className="resume-page-frame">
      <article
        ref={pageRef}
        className={`resume-page resume-page--${variant.id}`}
        style={pageVars}
        aria-label={variant.label}
      >
        <div className="page-label">{variant.label}</div>

        <div ref={innerRef} className="resume-inner">
          <header className="resume-header">
            <div className="header-copy">
              <p className="eyebrow">Résumé</p>
              <h1 className="name">{data.name}</h1>
              <p className="title">{data.title}</p>
              <p className="summary">{data.summary}</p>
            </div>
            <HeaderMeta items={data.metadata} variant={variant} />
          </header>

          <div className="resume-grid">
            <aside className="resume-sidebar">
              <SidebarSection title="Contact" variant={variant}>
                <ul className="compact-list">
                  {data.contact.map((item) => (
                    <li key={item.label}>
                      <span className="label">{item.label}</span>
                      <span className="value">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </SidebarSection>

              <SidebarSection title="Skills" variant={variant}>
                <ul className="skills-list">
                  {data.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </SidebarSection>

              <SidebarSection title="Languages" variant={variant}>
                <ul className="compact-list compact-list--languages">
                  {data.languages.map((language) => (
                    <li key={language.name}>
                      <span className="label">{language.name}</span>
                      <span className="value">{language.level}</span>
                    </li>
                  ))}
                </ul>
              </SidebarSection>
            </aside>

            <div className="resume-divider" aria-hidden="true" />

            <main className="resume-main">
              <MainSection title="Experience" variant={variant}>
                <div className="experience-stack">
                  {data.experience.map((item) => (
                    <article
                      key={`${item.company}-${item.role}`}
                      className="experience-item"
                    >
<div
  className={`experience-period ${
    variant.id === "robial" ? "experience-period--robial" : ""
  }`}
>
  {variant.id === "robial" ? (
    <RobialPeriod period={item.period} />
  ) : (
    item.period
  )}
</div>                      <div>
                        <h3 className="entry-title">{item.role}</h3>
                        <p className="entry-subtitle">
                          {item.company} · {item.location}
                        </p>
                        <ul className="bullet-list">
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </MainSection>

              <MainSection title="Selected projects" variant={variant}>
                <div className="projects-grid">
                  {data.projects.map((project) => (
                    <article
                      className={`project-card project-card--${variant.id}`}
                      key={project.name}
                    >
                      <h3 className="entry-title">{project.name}</h3>
                      <p className="entry-subtitle entry-subtitle--project">
                        {project.meta}
                      </p>
                      <p className="project-copy">{project.description}</p>
                    </article>
                  ))}
                </div>
              </MainSection>

              <MainSection title="Education" variant={variant}>
                <div className="education-stack">
                  {data.education.map((item) => (
                    <article
                      key={`${item.school}-${item.degree}`}
                      className="education-item"
                    >
                      <div>
                        <h3 className="entry-title">{item.degree}</h3>
                        <p className="entry-subtitle">{item.school}</p>
                      </div>
                      <p className="education-period">{item.period}</p>
                    </article>
                  ))}
                </div>
              </MainSection>
            </main>
          </div>
        </div>
      </article>
    </div>
  );
}

function OneColumnPage({
  variant,
  data,
}: {
  variant: ResumeVariant;
  data: ResumeData;
}) {
  const pageVars = buildPageVars(variant);
  const { pageRef, innerRef } = useAutoFitPage();

  const emailItem = data.contact.find(
    (item) => item.label.toLowerCase() === "email"
  );

  const phoneItem = data.contact.find(
    (item) => item.label.toLowerCase() === "phone"
  );

const portfolioItem =
  data.contact.find((item) => item.label.toLowerCase() === "web") ??
  data.contact.find((item) => item.label.toLowerCase() === "portfolio") ??
  data.metadata.find((item) => item.label.toLowerCase() === "portfolio");

const onecolMetaItems: OnecolMetaItem[] = [
    phoneItem ? { label: "Phone", value: phoneItem.value } : null,

  emailItem ? { label: "Email", value: emailItem.value } : null,
  portfolioItem ? { label: "Portfolio", value: portfolioItem.value } : null,
].filter((item): item is OnecolMetaItem => item !== null);

  return (
    <div className="resume-page-frame">
      <article
  ref={pageRef}
  className={`resume-page resume-page--${variant.id}`}
  style={pageVars}
  aria-label={variant.label}
>
        <div className="page-label">{variant.label}</div>

        <div ref={innerRef} className="resume-inner resume-inner--onecol">
          <header className="onecol-header">
            <div className="header-copy header-copy--onecol">
              <h1 className="name name--onecol">{data.name}</h1>
              <p className="title title--onecol">{data.title}</p>
              <p className="summary summary--onecol">{data.summary}</p>
            </div>

<dl
  className="onecol-meta"
  aria-label="Resume metadata"
  style={{
    gridTemplateColumns: `repeat(${Math.max(1, onecolMetaItems.length)}, minmax(0, 1fr))`,
  }}
>              {onecolMetaItems.map((item) => (
                <div key={item.label} className="onecol-meta-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <main className="onecol-main">
            <OneColumnSection title="Experience">
              <div className="onecol-experience-stack">
                {data.experience.map((item) => (
                  <article
                    key={`${item.company}-${item.role}`}
                    className="onecol-entry"
                  >
                    <div className="onecol-entry-head">
                      <div>
                        <div className="onecol-entry-eyebrow">{item.company}</div>
                        <h3 className="entry-title">{item.role}</h3>
                        <p className="entry-subtitle">{item.location}</p>
                      </div>
                      <p className="experience-period">{item.period}</p>
                    </div>

                    <ul className="bullet-list bullet-list--onecol">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </OneColumnSection>

            {!!data.achievements?.length && (
              <OneColumnSection title="Achievements">
                <ul className="bullet-list bullet-list--onecol bullet-list--achievements">
                  {data.achievements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </OneColumnSection>
            )}

            <OneColumnSection title="Education">
              <div className="education-stack education-stack--onecol">
                {data.education.map((item) => (
                  <article
                    key={`${item.school}-${item.degree}`}
                    className="education-item"
                  >
                    <div>
                      <h3 className="entry-title">{item.degree}</h3>
                      <p className="entry-subtitle">{item.school}</p>
                    </div>
                    <p className="education-period">{item.period}</p>
                  </article>
                ))}
              </div>
            </OneColumnSection>

            <OneColumnSection title="Skills">
              <ul className="skills-list skills-list--onecol">
                {data.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </OneColumnSection>

            <OneColumnSection title="Languages">
              <ul className="compact-list compact-list--languages compact-list--onecol">
                {data.languages.map((language) => (
                  <li key={language.name}>
                    <span className="label">{language.name}</span>
                    <span className="value">{language.level}</span>
                  </li>
                ))}
              </ul>
            </OneColumnSection>

            <div className="onecol-bottom-space" />
          </main>
        </div>
      </article>
    </div>
  );
}

function ResumeVariantPage({
  variant,
  data,
}: {
  variant: ResumeVariant;
  data: ResumeData;
}) {
  if (variant.id === "onecol") {
    return <OneColumnPage variant={variant} data={data} />;
  }

  return <ClassicResumePage variant={variant} data={data} />;
}

export default function ResumePage({
  data,
  mode = "comparison",
}: ResumePageProps) {
  const variants =
    mode === "comparison"
      ? [
          resumeLayoutSpec.variants.robial,
          resumeLayoutSpec.variants.onecol,
        ]
      : mode === "comparisonAll"
        ? [
            resumeLayoutSpec.variants.robial,
            resumeLayoutSpec.variants.onecol,
          ]
        : [resumeLayoutSpec.variants[mode]];

  const comparisonStyle: React.CSSProperties =
    mode === "comparison" || mode === "comparisonAll"
      ? {
          gridTemplateColumns: `repeat(${variants.length}, 210mm)`,
          width: "max-content",
          gap: "10mm",
        }
      : {};

  return (
    <div className="resume-preview-shell">
      <div className="resume-preview-grid" style={comparisonStyle}>
        {variants.map((variant) => (
          <ResumeVariantPage
            key={variant.id}
            variant={variant}
            data={
              mode === "comparisonAll" && variant.id === "onecol"
                ? onecolData
                : data
            }
          />
        ))}
      </div>
    </div>
  );
}
