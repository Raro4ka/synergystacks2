'use client'

import { Reveal } from './ClientUI'

export function BiomarkerPage({ slug, biomarker, mechanisms, ingredients }) {
  const dirLabel =
    biomarker.direction === 'higher-better' ? '↑ higher is better' :
    biomarker.direction === 'lower-better'  ? '↓ lower is better' :
    '↔ target range'

  const dirClass = 'dir-' + biomarker.direction

  return (
    <>
      <section className="hero" style={{ minHeight: 'auto', padding: '140px 0 60px' }}>
        <div className="container">
          <div className="crumbs">
            <a href="/">HOME</a>
            <span className="sep">/</span>
            <a href="/biomarkers">BIOMARKERS</a>
            <span className="sep">/</span>
            <span className="cur">{biomarker.short.toUpperCase()}</span>
          </div>

          <div className="ing-hero">
            <div>
              <div className="kicker">
                <span className="dot"></span>
                {biomarker.category} · {biomarker.unit}
              </div>
              <h1 style={{ fontSize: 'clamp(40px,6.5vw,84px)' }}>
                <span className="line"><span>{biomarker.label}</span></span>
              </h1>
              <div className="hero-copy">{(biomarker.description || '').split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>

              <div className="ing-quick-facts">
                <div className="ing-fact">
                  <div className="ing-fact-label">DIRECTION</div>
                  <div className={'ing-fact-value bio-dir-label ' + dirClass}>
                    {dirLabel}
                  </div>
                </div>
                {biomarker.normalRange && (
                  <div className="ing-fact">
                    <div className="ing-fact-label">NORMAL RANGE</div>
                    <div className="ing-fact-value">{biomarker.normalRange}</div>
                  </div>
                )}
                {mechanisms && mechanisms.length > 0 && (
                  <div className="ing-fact">
                    <div className="ing-fact-label">MECHANISMS</div>
                    <div className="ing-fact-value">{mechanisms.length}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {mechanisms && mechanisms.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <h2 className="section-heading">What <br /><span>moves it.</span></h2>
            </Reveal>
            <Reveal delay={80}>
              <p style={{ maxWidth: 640, marginBottom: 40, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
                These biological pathways influence {biomarker.label}. Click any to see what affects it.
              </p>
            </Reveal>
            <div className="mech-grid">
              {mechanisms.map((m, i) => (
                <Reveal key={m.slug} delay={i * 60}>
                  <a className="mech-card" href={`/mechanisms/${m.slug}`}>
                    <div className={'mech-evidence evidence-' + m.evidenceLevel}>
                      {m.evidenceLevel}
                    </div>
                    <div className="mech-short">{m.short}</div>
                    <div className="mech-label">{m.label}</div>
                    <p className="mech-desc">{m.description}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {ingredients && ingredients.length > 0 && (
        <section>
          <div className="container">
            <Reveal>
              <h2 className="section-heading">What <br /><span>affects it.</span></h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="ingredients-grid">
                {ingredients.map((ing, i) => (
                  <Reveal key={ing.slug} delay={i * 60}>
                    <a className="ingredient-card" href={`/ingredients/${ing.slug}`}>
                      <div className="ing-category">{ing.category}</div>
                      <div className="ing-label">{ing.label}</div>
                      <p className="ing-desc">{ing.description}</p>
                      <div className="ing-meta">
                        <span className={'evidence-' + ing.evidenceLevel}>
                          {ing.evidenceLevel}
                        </span>
                        {ing.priceBand && <span className="ing-price">{ing.priceBand}</span>}
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {(!ingredients || ingredients.length === 0) && (!mechanisms || mechanisms.length === 0) && (
        <section>
          <div className="container">
            <div className="empty-state">
              <div className="empty-tag">NO LINKS YET</div>
              <p>No mechanisms or ingredients are linked to this biomarker yet. It appears here for reference — check back as the database grows.</p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}