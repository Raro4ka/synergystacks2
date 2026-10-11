
'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { CompareTable } from './CompareTable'

const CATEGORY_LABELS = {
  'amino-acid': 'Amino Acids & Derivatives',
  stimulant: 'Stimulants',
  adaptogen: 'Adaptogens',
  botanical: 'Botanicals',
  mushroom: 'Medicinal Mushrooms',
  vitamin: 'Vitamins',
  mineral: 'Minerals',
  'fatty-acid': 'Fatty Acids',
  antioxidant: 'Antioxidants',
  polyphenol: 'Polyphenols',
  protein: 'Proteins',
  other: 'Other Compounds',
}

const EVIDENCE_LABELS = {
  established: 'Established',
  supported: 'Supported',
  emerging: 'Emerging',
  insufficient: 'Insufficient',
}

const EVIDENCE_ORDER = {
  established: 0,
  supported: 1,
  emerging: 2,
  insufficient: 3,
}

const STORAGE_KEY = 'synergystacks:preferences:v2'
const LEGACY_STORAGE_KEY = 'synergystacks:favorites:v1'

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || 'Other Compounds'
}

function getSearchText(slug, ingredient) {
  return normalize([
    slug,
    ingredient.label,
    ingredient.short,
    ingredient.description,
    getCategoryLabel(ingredient.category),
    ...(ingredient.forms || []),
    ...(ingredient.affects || []),
  ].join(' '))
}

export function IngredientExplorer({ ingredients }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [evidence, setEvidence] = useState('all')
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('name')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [compare, setCompare] = useState([])
  const deferredQuery = useDeferredValue(query)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    function handleSlashShortcut(event) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return
      event.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', handleSlashShortcut)
    return () => window.removeEventListener('keydown', handleSlashShortcut)
  }, [])

  const entries = useMemo(
    () => Object.entries(ingredients || {}),
    [ingredients]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') || '')
      setCategory(params.get('category') || 'all')
      setEvidence(params.get('evidence') || 'all')
      setPrice(params.get('price') || 'all')
      setSort(params.get('sort') || 'name')
    } catch {
      // Invalid URL state should not prevent catalog use.
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.favorites)) setFavorites(parsed.favorites.filter((x) => typeof x === 'string'))
        if (Array.isArray(parsed.compare)) setCompare(parsed.compare.filter((x) => typeof x === 'string'))
      } else {
        const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
        const parsedLegacy = legacy ? JSON.parse(legacy) : []
        if (Array.isArray(parsedLegacy)) setFavorites(parsedLegacy.filter((x) => typeof x === 'string'))
      }
    } catch {
      // Storage may be unavailable or contain invalid JSON.
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return
    const timer = window.setTimeout(() => {
      try {
        const params = new URLSearchParams(window.location.search)
        const values = { q: query, category, evidence, price, sort }
        Object.entries(values).forEach(([key, value]) => {
          if (!value || value === 'all' || (key === 'sort' && value === 'name')) params.delete(key)
          else params.set(key, value)
        })
        const search = params.toString()
        const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
        window.history.replaceState(null, '', nextUrl)
      } catch {
        // URL state is an enhancement; filters still work without it.
      }
    }, 200)
    return () => window.clearTimeout(timer)
  }, [query, category, evidence, price, sort, ready])

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites, compare }))
    } catch {
      // Preferences remain available for the current session.
    }
  }, [favorites, compare, ready])

  const categories = useMemo(() => {
    const available = new Set(
      entries.map(([, item]) => item.category || 'other')
    )

    return Object.keys(CATEGORY_LABELS)
      .filter((key) => available.has(key))
      .map((key) => ({
        value: key,
        label: CATEGORY_LABELS[key],
      }))
      .concat(
        [...available]
          .filter((key) => !CATEGORY_LABELS[key])
          .sort()
          .map((key) => ({
            value: key,
            label: key,
          }))
      )
  }, [entries])

  const filtered = useMemo(() => {
    const term = normalize(deferredQuery)

    const result = entries.filter(([slug, item]) => {
      if (
        term &&
        !getSearchText(slug, item).includes(term)
      ) {
        return false
      }

      if (
        category !== 'all' &&
        (item.category || 'other') !== category
      ) {
        return false
      }

      if (
        evidence !== 'all' &&
        item.evidenceLevel !== evidence
      ) {
        return false
      }

      if (
        price !== 'all' &&
        item.priceBand !== price
      ) {
        return false
      }

      if (
        favoritesOnly &&
        !favorites.includes(slug)
      ) {
        return false
      }

      return true
    })

    result.sort(([slugA, a], [slugB, b]) => {
      if (sort === 'evidence') {
        const difference =
          (EVIDENCE_ORDER[a.evidenceLevel] ?? 99) -
          (EVIDENCE_ORDER[b.evidenceLevel] ?? 99)

        if (difference !== 0) return difference
      }

      if (sort === 'forms') {
        const difference =
          (b.forms?.length || 0) -
          (a.forms?.length || 0)

        if (difference !== 0) return difference
      }

      if (sort === 'category') {
        const difference = getCategoryLabel(a.category)
          .localeCompare(getCategoryLabel(b.category))

        if (difference !== 0) return difference
      }

      return a.label.localeCompare(b.label) ||
        slugA.localeCompare(slugB)
    })

    return result
  }, [
    entries,
    deferredQuery,
    category,
    evidence,
    price,
    sort,
    favoritesOnly,
    favorites,
  ])

  const hasFilters =
    query !== '' ||
    category !== 'all' ||
    evidence !== 'all' ||
    price !== 'all' ||
    favoritesOnly

  function resetFilters() {
    setQuery('')
    setCategory('all')
    setEvidence('all')
    setPrice('all')
    setSort('name')
    setFavoritesOnly(false)
  }

  function toggleFavorite(slug) {
    setFavorites((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    )
  }

  return (
    <div className="ingredient-explorer">
      <div className="ix-toolbar">
        <label className="ix-search">
          <span className="ix-search-icon" aria-hidden="true">
            ⌕
          </span>

          <span className="ix-sr-only">
            Search ingredients
          </span>

          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ingredients, forms, mechanisms..."
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              className="ix-clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>

        <button
          type="button"
          className={
            'ix-filter-toggle' +
            (filtersOpen ? ' is-active' : '')
          }
          onClick={() => setFiltersOpen((value) => !value)}
          aria-expanded={filtersOpen}
          aria-controls="ingredient-filters"
        >
          <span aria-hidden="true">☷</span>
          Filters
        </button>
      </div>

      <div
        id="ingredient-filters"
        className={
          'ix-filters' + (filtersOpen ? ' is-open' : '')
        }
      >
        <label className="ix-field">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="ix-field">
          <span>Evidence level</span>
          <select
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
          >
            <option value="all">All levels</option>
            {Object.entries(EVIDENCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="ix-field">
          <span>Price indicator</span>
          <select
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            <option value="all">All prices</option>
            <option value="$">$ · Lower</option>
            <option value="$$">$$ · Medium</option>
            <option value="$$$">$$$ · Higher</option>
          </select>
        </label>

        <label className="ix-field">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="name">Name: A–Z</option>
            <option value="evidence">Evidence level</option>
            <option value="forms">Number of forms</option>
            <option value="category">Category</option>
          </select>
        </label>
      </div>

      <div className="ix-secondary-toolbar">
        <button
          type="button"
          className={
            'ix-favorites-toggle' +
            (favoritesOnly ? ' is-active' : '')
          }
          onClick={() => setFavoritesOnly((value) => !value)}
          aria-pressed={favoritesOnly}
        >
          <span aria-hidden="true">
            {favoritesOnly ? '★' : '☆'}
          </span>
          Favorites
          <span className="ix-favorite-count">
            {favorites.length}
          </span>
        </button>

        <button
          type="button"
          className="ix-compare-button"
          onClick={() => document.getElementById('ix-compare-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
          disabled={compare.length < 2}
          title={compare.length < 2 ? 'Select at least 2 ingredients to compare' : 'Jump to comparison table'}
        >
          Compare selected ({compare.length}/2)
        </button>

        <div
          className="ix-results"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>{filtered.length}</strong>
          {' '}
          {filtered.length === 1 ? 'ingredient' : 'ingredients'}
          {' '}found
        </div>

        {hasFilters && (
          <button
            type="button"
            className="ix-reset"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="ix-grid" id="ingredient-results">
          {filtered.map(([slug, ingredient]) => {
            const isFavorite = favorites.includes(slug)
            const level = ingredient.evidenceLevel || 'unrated'
            const forms = ingredient.forms || []
            const mechanisms = ingredient.affects || []

            return (
              <article className="ix-card" key={slug}>
                <div className="ix-card-top">
                  <span className="ix-category">
                    {getCategoryLabel(ingredient.category)}
                  </span>

                  <button
                    type="button"
                    className={
                      'ix-star' + (isFavorite ? ' is-active' : '')
                    }
                    onClick={() => toggleFavorite(slug)}
                    aria-label={
                      isFavorite
                        ? `Remove ${ingredient.label} from favorites`
                        : `Add ${ingredient.label} to favorites`
                    }
                    aria-pressed={isFavorite}
                  >
                    {isFavorite ? '★' : '☆'}
                  </button>
                </div>

                <h2 className="ix-card-title">
                  <a href={`/ingredients/${slug}/`}>
                    {ingredient.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </h2>

                <p className="ix-description">
                  {ingredient.description ||
                    'Description not yet available.'}
                </p>

                {mechanisms.length > 0 && (
                  <div className="ix-mechanisms">
                    <span className="ix-mini-label">
                      RELATED PATHWAYS
                    </span>
                    <div className="ix-tags">
                      {mechanisms.slice(0, 3).map((mechanism) => (
                        <span className="ix-tag" key={mechanism}>
                          {mechanism.replaceAll('-', ' ')}
                        </span>
                      ))}

                      {mechanisms.length > 3 && (
                        <span className="ix-tag ix-tag-more">
                          +{mechanisms.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="ix-card-bottom">
                  <span className={`ix-evidence evidence-${level}`}>
                    <span className="ix-evidence-dot" />
                    {EVIDENCE_LABELS[level] || 'Not rated'}
                  </span>
                  <label className="ix-compare-select">
                    <input
                      type="checkbox"
                      checked={compare.includes(slug)}
                      onChange={() => setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 4 ? [...current, slug] : current)}
                      aria-label={`Select ${ingredient.label} for comparison`}
                    />
                    Compare
                  </label>

                  <div className="ix-meta">
                    {forms.length > 0 && (
                      <span>
                        {forms.length} {forms.length === 1 ? 'form' : 'forms'}
                      </span>
                    )}

                    {ingredient.priceBand && (
                      <span
                        aria-label={`Price indicator ${ingredient.priceBand}`}
                        title="Relative price indicator, not a verified current price"
                      >
                        {ingredient.priceBand}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="ix-empty">
          <span className="ix-empty-icon" aria-hidden="true">
            ⌕
          </span>
          <h2>No ingredients found</h2>
          <p>
            Try a different search term or remove one of the filters.
          </p>
          <button
            type="button"
            className="ix-reset-button"
            onClick={resetFilters}
          >
            Clear all filters
          </button>
        </div>
      )}

      {compare.length >= 2 && (
        <section className="ix-compare-panel" id="ix-compare-panel" aria-labelledby="ix-compare-title">
          <div className="ix-compare-items">
            <h2 id="ix-compare-title">Compare ingredients</h2>
            <button type="button" className="ix-reset" onClick={() => setCompare([])}>Clear comparison</button>
          </div>
          <CompareTable ingredients={compare.map((slug) => ({ slug, ...ingredients[slug] })).filter((item) => item.label)} />
        </section>
      )}

      <p className="ix-disclaimer">
        Evidence labels are inherited from the current database.
        They are editorial classifications, not a substitute for
        evaluating the evidence for a specific outcome, population,
        dose, and safety profile.
      </p>
    </div>
  )
}
