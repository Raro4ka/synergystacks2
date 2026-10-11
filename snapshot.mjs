// snapshot.mjs
// Скачивает список файлов с raw.githubusercontent.com и складывает в project-snapshot.txt

import fs from 'fs/promises'
import path from 'path'

const REPO = 'Raro4ka/synergystacks2'
const BRANCH = 'main'
const BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`

const FILES = [
  'package.json',
  'next.config.mjs',
  'app/layout.js',
  'app/page.js',
  'app/robots.js',
  'app/sitemap.js',
  'app/data/stacks.js',
  'app/data/categories.js',
  'app/data/ingredients.js',
  'app/data/mechanisms.js',
  'app/data/biomarkers.js',
  'app/components/StackPage.jsx',
  'app/components/ClientUI.jsx',
  'app/components/IngredientExplorer.jsx',
  'app/components/IngredientPage.jsx',
  'app/components/MechanismExplorer.jsx',
  'app/components/MechanismPage.jsx',
  'app/stack/[slug]/page.js',
  'app/ingredients/page.js',
  'app/ingredients/[slug]/page.js',
  'app/mechanisms/page.js',
  'app/mechanisms/[slug]/page.js',
  'app/biomarkers/page.js',
  'app/biomarkers/[slug]/page.js',
  'app/goals/page.js',
  'app/goals/[slug]/page.js',
]

const OUTPUT = 'project-snapshot.txt'

async function fetchFile(url) {
  const res = await fetch(url)
  if (!res.ok) {
    return { ok: false, status: res.status, text: `// [NOT FOUND] ${url} — status ${res.status}` }
  }
  const text = await res.text()
  return { ok: true, status: 200, text }
}

async function main() {
  const chunks = []
  chunks.push(`# SynergyStacks project snapshot`)
  chunks.push(`# Repo: https://github.com/${REPO}`)
  chunks.push(`# Branch: ${BRANCH}`)
  chunks.push(`# Generated: ${new Date().toISOString()}`)
  chunks.push('')

  let ok = 0
  let missing = 0

  for (const file of FILES) {
    const url = `${BASE}/${file}`
    process.stdout.write(`Fetching ${file} ... `)
    const result = await fetchFile(url)
    if (result.ok) {
      ok++
      console.log('OK')
    } else {
      missing++
      console.log(`SKIP (${result.status})`)
    }

    chunks.push('')
    chunks.push('='.repeat(80))
    chunks.push(`FILE: ${file}`)
    chunks.push('='.repeat(80))
    chunks.push('')
    chunks.push(result.text)
    chunks.push('')
  }

  chunks.push('='.repeat(80))
  chunks.push(`SUMMARY: ${ok} files fetched, ${missing} missing`)
  chunks.push('='.repeat(80))

  await fs.writeFile(OUTPUT, chunks.join('\n'), 'utf8')
  console.log('')
  console.log(`✅ Snapshot saved to: ${path.resolve(OUTPUT)}`)
  console.log(`   Fetched: ${ok}, Missing: ${missing}`)
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})