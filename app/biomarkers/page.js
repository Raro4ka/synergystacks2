import { biomarkers } from '../data/biomarkers'
import { BiomarkerCard } from '../components/BiomarkerCard'

export const metadata = {
  title: 'All Biomarkers — SynergyStacks',
  description:
    'Every measurable outcome in the SynergyStacks database — testosterone, VO2max, CRP, and what affects them.',
}

const categoryLabels = {
  cognitive: 'Cognitive',
  recovery: 'Recovery',
  cardio: 'Cardiovascular',
  inflammation: 'Inflammation',
  performance: 'Performance',
  'body-comp': 'Body Composition',
  thyroid: 'Thyroid',
  hormonal: 'Hormonal',
}

const categoryOrder = [
  'cognitive',
  'recovery',
  'cardio',
  'inflammation',
  'performance',
  'body-comp',
  'thyroid',
  'hormonal',
]

function formatCategoryLabel(category) {
  return (
    categoryLabels[category] ||
    category.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  )
}

export default function BiomarkersIndexPage() {
  const grouped = {}

  Object.entries(biomarkers).forEach(([slug, biomarker]) => {
    const category = biomarker.category || 'other'

    if (!grouped[category]) {
      grouped[category] = []
    }

    grouped[category].push([slug, biomarker])
  })

  const categories = Object.keys(grouped).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)

    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1

    return indexA - indexB
  })

  const total = Object.keys(biomarkers).length

  return (
    <>
      <section style={{ padding: '140px 0 40px' }}>
        <div className="container">
          <div className="crumbs">
            <a href="/">HOME</a>
            <span className="sep">/</span>
            <span className="cur">BIOMARKERS</span>
          </div>

          <div className="kicker">
            <span className="dot" />
            DATABASE · {total} MARKERS
          </div>

          <h1 style={{ fontSize: 'clamp(40px,6.5vw,90px)' }}>
            <span className="line">
              <span>WHAT YOU</span>
            </span>
            <span className="line">
              <span className="lime">MEASURE.</span>
            </span>
          </h1>

          <p className="hero-copy">
            Every measurable outcome we track — from blood tests to DEXA scans
            to VO2max.
            <br />
            Got a lab result? Find what affects it.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="container">
          {categories.map((category) => {
            const items = grouped[category]

            if (!items || items.length === 0) return null

            return (
              <div
                key={category}
                style={{ marginBottom: 56 }}
              >
                <h2 className="ing-group-title">
                  {formatCategoryLabel(category)}
                </h2>

                <div className="bio-grid">
                  {items.map(([slug, biomarker]) => (
                    <BiomarkerCard
                      key={slug}
                      slug={slug}
                      biomarker={biomarker}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
