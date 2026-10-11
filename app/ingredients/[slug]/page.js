import { notFound } from 'next/navigation'
import { ingredients } from '../../data/ingredients'
import { mechanisms } from '../../data/mechanisms'
import { biomarkers } from '../../data/biomarkers'
import { stacks } from '../../data/stacks'
import { IngredientPage } from '../../components/IngredientPage'

export function generateStaticParams() {
  return Object.keys(ingredients).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const ing = ingredients[slug]
  if (!ing) return { title: 'Not found — SynergyStacks' }
  return {
    title: `${ing.label} — SynergyStacks`,
    description: ing.description || `Evidence-based information about ${ing.label}.`,
  }
}

export default async function IngredientRoute({ params }) {
  const { slug } = await params
  const ing = ingredients[slug]
  if (!ing) notFound()

  // Expand mechanisms this ingredient affects
  const affectedMechanisms = (ing.affects || [])
    .map((mSlug) => mechanisms[mSlug] ? { slug: mSlug, ...mechanisms[mSlug] } : null)
    .filter(Boolean)

  // Find stacks that include this ingredient
  const relatedBiomarkers = []
  for (const mechanism of affectedMechanisms) {
    for (const bSlug of mechanism.biomarkers || []) {
      if (!relatedBiomarkers.some((b) => b.slug === bSlug) && biomarkers[bSlug]) {
        relatedBiomarkers.push({ slug: bSlug, ...biomarkers[bSlug] })
      }
    }
  }

  const relatedStacks = Object.entries(stacks)
    .filter(([_, s]) => (s.tags?.ingredients || []).includes(slug))
    .map(([stackSlug, s]) => ({
      slug: stackSlug,
      cat: s.kicker?.split('/')[0]?.trim() || '',
      formula: s.synergy?.result || s.metaTitle?.replace(' — SynergyStacks', ''),
      desc: s.hero?.copy?.slice(0, 140) + '…',
      evidence: s.evidence?.label || '',
      grade: s.evidence?.grade || null,
    }))

  return (
    <IngredientPage
      slug={slug}
      ingredient={ing}
      mechanisms={affectedMechanisms}
      biomarkers={relatedBiomarkers}
      stacks={relatedStacks}
    />
  )
}