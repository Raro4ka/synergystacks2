import { Reveal, Counter, ParallaxVisual, SpotlightCard, FAQ } from './components/ClientUI'
import { stacks } from './data/stacks'
import { ingredients } from './data/ingredients'
import { mechanisms } from './data/mechanisms'
import { biomarkers } from './data/biomarkers'

const stats = {
  ingredients: Object.keys(ingredients).length,
  stacks: Object.keys(stacks).length,
  pathways: Object.keys(mechanisms).length,
  biomarkers: Object.keys(biomarkers).length,
}

const homeFaq = [
  {
    q: 'Is this site medical advice?',
    a: [
      'No. <strong>SynergyStacks is an educational reference, not a medical service.</strong> We translate published research into plain language and explain mechanisms.',
      'Before starting any supplement regimen — especially if you take prescription medication — talk to a qualified healthcare provider.'
    ]
  },
  {
    q: 'What do the grades (A / B / C) mean?',
    a: [
      '<strong>Grade A</strong> — multiple randomized controlled trials or a meta-analysis confirm the effect.',
      '<strong>Grade B</strong> — human data exists but is limited, or the mechanism is well-established but clinical outcomes are still being measured.',
      '<strong>Grade C</strong> — some evidence supports the effect, but results are inconsistent.'
    ]
  },
  {
    q: 'Why is no stack Grade A?',
    a: ['We only assign A when there are multiple RCTs on the combination itself. There are none yet; the closest is creatine×fenugreek (Grade B, one RCT).']
  },
  {
    q: 'Do you earn money from this site?',
    a: [
      'Yes. Some links to supplement products are <strong>affiliate links</strong> — if you buy through them, we may receive a commission at no extra cost to you.',
      'This never affects which stacks we cover or how we grade them. Read our full disclosure on the <a href="/about">About page</a>.'
    ]
  }
]

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="kicker"><span className="dot"></span>EVIDENCE-BASED COMBINATIONS</div>
              <h1>
                <span className="line"><span>ONE PLUS</span></span>
                <span className="line"><span className="lime">ONE EQUALS</span></span>
                <span className="line"><span>THREE.</span></span>
              </h1>
              <p className="hero-copy">
                Most supplements are sold alone. But the research keeps showing
                the same thing: <strong>the right combination outperforms
                the sum of its parts.</strong> We read the studies, extract the
                mechanisms, and explain exactly <em>why</em> certain pairs work
                better together — with the numbers to back it up.
              </p>
              <div className="hero-meta">
                <div className="stat">
                  <div className="num"><Counter to={stats.ingredients} /></div>
                  <div className="lbl">INGREDIENTS</div>
                </div>
                <div className="stat">
                  <div className="num"><Counter to={stats.stacks} /></div>
                  <div className="lbl">STACKS</div>
                </div>
                <div className="stat">
                  <div className="num"><Counter to={stats.pathways} /></div>
                  <div className="lbl">PATHWAYS</div>
                </div>
              </div>
            </div>
            <ParallaxVisual />
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal>
            <div className="manifesto">
              <p>
                A supplement doesn&apos;t work in a vacuum. It works through a pathway.
                <strong>And when two compounds hit different points of the same
                pathway — or two complementary pathways — the effect compounds.</strong>
                That&apos;s synergy. Not marketing. Physiology.
              </p>
              <p className="sub">
                SynergyStacks is a reference library. Every claim links to a study.
                Every mechanism is explained. Every grade is earned — not bought.
              </p>
            </div>
          </Reveal>

          <div className="stacks-grid">
            {['carnitine-caffeine', 'creatine-fenugreek', 'berberine-chromium', 'cistanche-eurycoma'].map((slug, index) => {
              const s = stacks[slug]
              if (!s) return null
              const plainDescription = String(s.hero?.copy || '')
                .replace(/<[^>]*>/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/\s+/g, ' ')
                .trim()
              return (
                <Reveal key={slug} delay={index * 80}>
                  <a className="stack-card" href={`/stack/${slug}`}>
                    <div className="cat">{s.kicker?.split('·')[0]?.trim() || 'COMBINATION'}</div>
                    <div className="formula" dangerouslySetInnerHTML={{ __html: s.synergy?.result || s.metaTitle || s.title || slug }} />
                    <p className="desc">{plainDescription.length > 140 ? `${plainDescription.slice(0, 137)}…` : plainDescription}</p>
                    <span className={`evidence grade-${s.evidence?.grade || 'c'}`}>{s.evidence?.label || 'Evidence not yet classified'}</span>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal>
            <h2 className="section-heading">How we<br /><span>grade.</span></h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="method-grid">
              <div className="method-card">
                <div className="grade a">ESTABLISHED</div>
                <h4>Substantial human evidence</h4>
                <p>Substantial human evidence for at least some outcomes.</p>
              </div>
              <div className="method-card">
                <div className="grade b">SUPPORTED</div>
                <h4>Useful, more limited evidence</h4>
                <p>Useful but more limited or indirect evidence.</p>
              </div>
              <div className="method-card">
                <div className="grade c">EMERGING</div>
                <h4>Preliminary or mixed</h4>
                <p>Preliminary, mixed or mechanistic/preclinical evidence.</p>
              </div>
              <div className="method-card">
                <div className="grade c">INSUFFICIENT</div>
                <h4>Not enough evidence</h4>
                <p>Not enough evidence to classify.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container">
          <Reveal>
            <h2 className="section-heading">Frequently<br /><span>asked.</span></h2>
          </Reveal>
          <Reveal delay={80}>
            <FAQ items={homeFaq} />
          </Reveal>
        </div>
      </section>
    </>
  )
}