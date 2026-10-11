import { categories } from './data/categories'
import { ingredients } from './data/ingredients'
import { mechanisms } from './data/mechanisms'
import { biomarkers } from './data/biomarkers'
import { stacks } from './data/stacks'

const SITE_URL = 'https://synergystacks.pages.dev'
const STATIC_ROUTES = [
  '/', '/about/', '/goals/', '/ingredients/', '/mechanisms/',
  '/biomarkers/', '/stacks/', '/search/',
]

export default function sitemap() {
  const routes = [
    ...STATIC_ROUTES,
    ...Object.keys(categories).map((slug) => `/goals/${slug}/`),
    ...Object.keys(ingredients).map((slug) => `/ingredients/${slug}/`),
    ...Object.keys(mechanisms).map((slug) => `/mechanisms/${slug}/`),
    ...Object.keys(biomarkers).map((slug) => `/biomarkers/${slug}/`),
    ...Object.keys(stacks).map((slug) => `/stack/${slug}/`),
  ]
  return [...new Set(routes)].map((route) => {
    const stackMatch = route.match(/^\/stack\/([^/]+)\/$/)
    const updated = stackMatch ? stacks[stackMatch[1]]?.updated : undefined
    return {
      url: `${SITE_URL}${route}`,
      ...(updated ? { lastModified: new Date(updated) } : {}),
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority: route === '/' ? 1 : route.split('/').filter(Boolean).length === 1 ? 0.8 : 0.6,
    }
  })
}
