
'use client'

import { Reveal } from './ClientUI'

const EVIDENCE_LABELS = {
  established: 'Established',
  supported: 'Supported',
  emerging: 'Emerging',
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol)
      ? url.href
      : null
  } catch {
    return null
  }
}

function ReferenceLink({ reference }) {
  const title =
    reference.title ||
    reference.label ||
    reference.doi ||
    reference.url

  const href = safeExternalUrl(
    reference.url ||
    (reference.doi
      ? `https://doi.org/${reference.doi.replace(/^https?:\/\/doi\.org\//, '')}`
      : '')
  )

  if (!href || !title) return null

  return (
    <li className="ip-reference">
      <div>
        <strong>{title}</strong>

        {reference.authors && (
          <p>{reference.authors}</p>
        )}

        {(reference.year || reference.journal) && (
          <p>
            {[reference.journal, reference.year]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        {reference.note && (
          <p>{reference.note}</p>
        )}
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read source ↗
      </a>
    </li>
  )
}

export function IngredientPage({
  slug,
  ingredient,
  mechanisms = [],
  biomarkers = [],
  stacks = [],
}) {
  const evidence = ingredient.evidenceLevel || 'unrated'
  const evidenceLabel =
    EVIDENCE_LABELS[evidence] || 'Not rated'

  const forms = ingredient.forms || []
  const sources = ingredient.sources || ingredient.references || []

  return (
    <>
      <section
        className="hero ip-hero"
        aria-labelledby="ingredient-title"
      >
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <a href="/">HOME</a>
            <span className="sep" aria-hidden="true">/</span>
            <a href="/ingredients/">INGREDIENTS</a>
            <span className="sep" aria-hidden="true">/</span>
            <span className="cur" aria-current="page">
              {ingredient.label.toUpperCase()}
            </span>
          </nav>

          <div className="ip-hero-grid">
            <div>
              <div className="kicker">
                <span className="dot" />
                {ingredient.category || 'OTHER'} · REFERENCE ENTRY
              </div>

              <h1 id="ingredient-title" className="ip-title">
                <span className="line">
                  <span>{ingredient.label}</span>
                </span>
              </h1>

              {ingredient.short &&
                ingredient.short !== ingredient.label && (
                  <p className="ip-alias">
                    Also known as: {ingredient.short}
                  </p>
                )}

              <p className="hero-copy ip-description">
                {(ingredient.description ||
                  'A detailed description for this ingredient has not yet been added.').split('\n\n').map((paragraph, i) => (
                    <span key={i} className="ip-description-paragraph">{paragraph}</span>
                  ))}
              </p>

              <div className="ip-quick-facts">
                <div className="ip-fact">
                  <span>DATABASE EVIDENCE LABEL</span>
                  <strong className={`evidence-${evidence}`}>
                    {evidenceLabel}
                  </strong>
                </div>

                {ingredient.priceBand && (
                  <div className="ip-fact">
                    <span>RELATIVE PRICE</span>
                    <strong>{ingredient.priceBand}</strong>
                    <small>Indicative, not a live price</small>
                  </div>
                )}

                <div className="ip-fact">
                  <span>AVAILABLE FORMS</span>
                  <strong>{forms.length}</strong>
                </div>

                {ingredient.typicalIntake && (
                  <div className="ip-fact ip-fact-wide">
                    <span>TYPICAL INTAKE</span>
                    <strong>{ingredient.typicalIntake}</strong>
                  </div>
                )}
              </div>

            </div>

            <aside className="ip-side-panel">
              <span className="ip-eyebrow">ON THIS PAGE</span>

              <a href="#forms">Available forms</a>
              <a href="#mechanisms">Biological pathways</a>
              <a href="#research">Research & references</a>
              <a href="#related-stacks">Related stacks</a>

              <a
                className="ip-back-link"
                href="/ingredients/"
              >
                ← All ingredients
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section id="forms" className="ip-section">
        <div className="container">
          <Reveal>
            <div className="ip-heading">
              <div className="ix-eyebrow">01 / FORMULATION</div>
              <h2>Available <span>forms.</span></h2>
              <p>
                Different forms may differ in composition, tolerability,
                evidence and cost. Their inclusion here does not mean
                that they are equally effective or interchangeable.
              </p>
            </div>
          </Reveal>

          {forms.length > 0 ? (
            <div className="ip-forms-grid">
              {forms.map((form, index) => (
                <article className="ip-form-card" key={form}>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{form}</h3>
                </article>
              ))}
            </div>
          ) : (
            <p className="ip-empty">
              Forms have not yet been documented.
            </p>
          )}
        </div>
      </section>

      <section id="mechanisms" className="ip-section">
        <div className="container">
          <Reveal>
            <div className="ip-heading">
              <div className="ix-eyebrow">02 / BIOLOGY</div>
              <h2>How it <br /><span>works.</span></h2>
              <p>
                These links describe pathways associated with this
                ingredient in the current database. A mechanistic
                connection alone does not establish a meaningful
                clinical benefit.
              </p>
            </div>
          </Reveal>

          {mechanisms.length > 0 ? (
            <div className="ip-mechanisms-grid">
              {mechanisms.map((mechanism) => (
                <article
                  className="ip-mechanism-card"
                  key={mechanism.slug}
                >
                  <div className="ip-mechanism-top">
                    <span className="ip-eyebrow">
                      {mechanism.evidenceLevel || 'PATHWAY'}
                    </span>
                  </div>

                  <h3>
                    <a href={`/mechanisms/${mechanism.slug}/`}>
                      {mechanism.label} ↗
                    </a>
                  </h3>

                  {mechanism.short && (
                    <p className="ip-mechanism-short">
                      {mechanism.short}
                    </p>
                  )}

                  {mechanism.description && (
                    <p>{mechanism.description}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="ip-empty">
              No biological pathways are linked to this entry yet.
            </p>
          )}
        </div>
      </section>

      {biomarkers.length > 0 && (
        <section id="biomarkers" className="ip-section">
          <div className="container">
            <Reveal>
              <div className="ip-heading">
                <div className="ix-eyebrow">03 / MEASURABLE</div>
                <h2>Linked <span>biomarkers.</span></h2>
                <p>
                  These are measurable variables connected to the pathways mapped for this ingredient.
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
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="research" className="ip-section">
        <div className="container">
          <Reveal>
            <div className="ip-heading">
              <div className="ix-eyebrow">03 / SOURCES</div>
              <h2>Research & <span>references.</span></h2>
              <p>
                Sources should support specific claims, not simply
                demonstrate that an ingredient has been studied.
                Review study design, population, outcomes and
                limitations before drawing conclusions.
              </p>
            </div>
          </Reveal>

          {sources.length > 0 ? (
            <ol className="ip-references">
              {sources.map((reference, index) => (
                <ReferenceLink
                  key={
                    reference.doi ||
                    reference.url ||
                    reference.title ||
                    index
                  }
                  reference={
                    typeof reference === 'string'
                      ? { url: reference, title: reference }
                      : reference
                  }
                />
              ))}
            </ol>
          ) : (
            <div className="ip-no-sources">
              <h3>References need to be added</h3>
              <p>
                The current data record does not contain a
                structured list of sources for this ingredient.
                Add verified publications before presenting
                ingredient-specific efficacy claims as established.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="related-stacks" className="ip-section">
        <div className="container">
          <Reveal>
            <div className="ip-heading">
              <div className="ix-eyebrow">04 / CONNECTIONS</div>
              <h2>Related <span>stacks.</span></h2>
              <p>
                These combinations include this ingredient in the current database.
                Use the linked evidence record to inspect the specific combination.
              </p>
            </div>
          </Reveal>

          {stacks.length > 0 ? (
            <div className="ip-stacks-grid">
              {stacks.map((stack) => (
                <article className="ip-stack-card" key={stack.slug}>
                  <span className="ip-eyebrow">
                    {stack.cat || 'COMBINATION'}
                  </span>

                  <h3>
                    <a href={`/stack/${stack.slug}/`}>
                      {stack.formula || stack.slug} ↗
                    </a>
                  </h3>

                  <p>{stack.desc}</p>

                  {stack.evidence && (
                    <span className="ip-stack-evidence">
                      {stack.evidence}
                    </span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="ip-no-sources">
              <h3>No published combinations linked yet</h3>
              <p>
                This ingredient is available as a reference entry,
                but no related stacks are currently listed.
              </p>
              <a href="/stacks/">Explore all stacks ↗</a>
            </div>
          )}
        </div>
      </section>

      <section className="ip-final">
        <div className="container">
          <div className="ip-final-card">
            <div className="ip-eyebrow">KEEP EXPLORING</div>
            <h2>Follow the <span>evidence.</span></h2>
            <p>Explore the linked pathways and combinations, and check the underlying research before drawing conclusions.</p>
            <div className="ip-final-links">
              <a href="/ingredients/">All ingredients ↗</a>
              <a href="/stacks/">Explore stacks ↗</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
