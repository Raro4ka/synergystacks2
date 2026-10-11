'use client'

import { Reveal } from './ClientUI'

const EVIDENCE_LABELS = {
  established: 'Established',
  supported: 'Supported',
  emerging: 'Emerging',
  theoretical: 'Theoretical',
}

export function MechanismPage({
  slug,
  mechanism,
  biomarkers = [],
  ingredients = [],
  goals = [],
}) {
  const evidence = mechanism.evidenceLevel || 'unrated'
  const evidenceLabel = EVIDENCE_LABELS[evidence] || 'Not rated'

  return (
    <>
      <section className="ip-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/">HOME</a>
            <span className="sep" aria-hidden="true">/</span>
            <a href="/mechanisms/">MECHANISMS</a>
            <span className="sep" aria-hidden="true">/</span>
            <span className="cur" aria-current="page">
              {mechanism.short ? mechanism.short.toUpperCase() : mechanism.label.toUpperCase()}
            </span>
          </nav>

          <div className="ip-hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                {mechanism.category} · PATHWAY
              </div>

              <h1 className="ip-title">
                <span className="line"><span>{mechanism.label}</span></span>
              </h1>

              {mechanism.short && mechanism.short !== mechanism.label && (
                <p className="ip-alias">{mechanism.short}</p>
              )}

              <p className="hero-copy ip-description">
                {(mechanism.description ||
                  'A description for this pathway has not yet been added.').split('\n\n').map((paragraph, i) => (
                    <span key={i} className="ip-description-paragraph">{paragraph}</span>
                  ))}
              </p>

              {mechanism.evidenceNote && (
                <div className="mech-note">
                  <strong>Evidence note:</strong> {mechanism.evidenceNote}
                </div>
              )}

              <div className="ip-quick-facts">
                <div className="ip-fact">
                  <span>DATABASE EVIDENCE LABEL</span>
                  <strong className={`evidence-${evidence}`}>
                    {evidenceLabel}
                  </strong>
                </div>

                {biomarkers.length > 0 && (
                  <div className="ip-fact">
                    <span>BIOMARKERS</span>
                    <strong>{biomarkers.length}</strong>
                  </div>
                )}

                {ingredients.length > 0 && (
                  <div className="ip-fact">
                    <span>INGREDIENTS</span>
                    <strong>{ingredients.length}</strong>
                  </div>
                )}
              </div>

              <p className="ip-evidence-note">
                A mechanistic pathway being plausible does not prove
                that an intervention changes a clinical outcome. Read
                the underlying sources before drawing conclusions.
              </p>
            </div>

            <aside className="ip-side-panel">
              <span className="ip-eyebrow">ON THIS PAGE</span>

              {biomarkers.length > 0 && <a href="#biomarkers">Biomarkers</a>}
              {ingredients.length > 0 && <a href="#ingredients">Ingredients</a>}
              {goals.length > 0 && <a href="#goals">Goals</a>}

              <a className="ip-back-link" href="/mechanisms/">
                ← All mechanisms
              </a>
            </aside>
          </div>
        </div>
      </section>

      {biomarkers.length > 0 && (
        <section id="biomarkers" className="ip-section">
          <div className="container">
            <Reveal>
              <div className="ip-heading">
                <div className="ix-eyebrow">01 / MEASURABLE</div>
                <h2>What it <span>changes.</span></h2>
                <p>
                  Activating this pathway is associated with the
                  following biomarkers. Association is not causation —
                  review the study design.
                </p>
              </div>
            </Reveal>

            <div className="bio-grid">
              {biomarkers.map((b) => (
                <Reveal key={b.slug}>
                  <a className="bio-card" href={`/biomarkers/${b.slug}/`}>
                    <div className={'bio-direction dir-' + b.direction}>
                      {b.direction === 'higher-better' && '↑'}
                      {b.direction === 'lower-better' && '↓'}
                      {b.direction === 'target-range' && '↔'}
                    </div>
                    <div className="bio-label">{b.label}</div>
                    <div className="bio-unit">{b.unit}</div>
                    {b.normalRange && (
                      <div className="bio-range">{b.normalRange}</div>
                    )}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {ingredients.length > 0 && (
        <section id="ingredients" className="ip-section">
          <div className="container">
            <Reveal>
              <div className="ip-heading">
                <div className="ix-eyebrow">02 / AFFECTS THIS PATHWAY</div>
                <h2>What <span>affects it.</span></h2>
                <p>
                  These ingredients are linked to this pathway in the
                  current database. A mechanistic link is not evidence
                  of a clinically meaningful effect.
                </p>
              </div>
            </Reveal>

            <div className="ingredients-grid">
              {ingredients.map((ing) => (
                <Reveal key={ing.slug}>
                  <a className="ingredient-card" href={`/ingredients/${ing.slug}/`}>
                    <div className="ing-category">{ing.category}</div>
                    <div className="ing-label">{ing.label}</div>
                    <p className="ing-desc">{ing.description}</p>
                    <div className="ing-meta">
                      <span className={'evidence-' + ing.evidenceLevel}>
                        {ing.evidenceLevel}
                      </span>
                      {ing.priceBand && (
                        <span className="ing-price">{ing.priceBand}</span>
                      )}
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {goals.length > 0 && (
        <section id="goals" className="ip-section">
          <div className="container">
            <Reveal>
              <div className="ip-heading">
                <div className="ix-eyebrow">03 / CONTRIBUTES TO</div>
                <h2>Related <span>goals.</span></h2>
                <p>
                  Outcomes this pathway is associated with. A pathway
                  can contribute to multiple goals.
                </p>
              </div>
            </Reveal>

            <div className="goals-grid">
              {goals.map((g) => (
                <Reveal key={g.slug}>
                  <a className="goal-card" href={`/goals/${g.slug}/`}>
                    <div className="goal-icon">{g.icon}</div>
                    <div className="goal-label">{g.label}</div>
                    <p className="goal-desc">{g.description}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {biomarkers.length === 0 && ingredients.length === 0 && (
        <section className="ip-section">
          <div className="container">
            <div className="empty-state">
              <div className="empty-tag">NO LINKS YET</div>
              <p>
                No biomarkers or ingredients are linked to this pathway
                yet. It appears here for reference — check back as the
                database grows.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}