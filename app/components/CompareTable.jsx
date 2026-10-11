'use client'

const ROWS = [
  ['forms', 'Available forms', (item) => (item.forms || []).join(', ') || 'Not documented'],
  ['evidence', 'Evidence level', (item) => item.evidenceLevel || 'Not rated'],
  ['price', 'Relative price', (item) => item.priceBand || 'Not documented'],
  ['affects', 'Related pathways', (item) => (item.affects || []).map((x) => String(x).replaceAll('-', ' ')).join(', ') || 'Not linked'],
  ['safety', 'Safety notes', (item) => [...(item.safetyNotes || []), ...(item.cautions || [])].map((x) => typeof x === 'string' ? x : x.text || x.description || '').filter(Boolean).join('; ') || 'No notes documented'],
]

export function CompareTable({ ingredients = [] }) {
  return (
    <div className="ix-compare-table-wrap" role="region" aria-label="Ingredient comparison" tabIndex={0}>
      <table className="ix-compare-table">
        <thead>
          <tr>
            <th scope="col">Feature</th>
            {ingredients.map((item) => <th scope="col" key={item.slug}>{item.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([key, label, getValue]) => (
            <tr key={key}>
              <th scope="row">{label}</th>
              {ingredients.map((item) => <td key={item.slug}>{getValue(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}