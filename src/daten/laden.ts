import { BiomSchema, H2_REIHENFOLGE, type Abschnitt, type Biom, type BiomId } from './schema'

const rohDaten = import.meta.glob('../../inhalt/*/daten.json', { eager: true, import: 'default' })
const rohGuides = import.meta.glob('../../inhalt/*/guide.md', { import: 'default', query: '?raw' }) as Record<string, () => Promise<string>>

function ordner(pfad: string): string {
  return pfad.split('/').at(-2) ?? pfad
}

export const BIOME: Biom[] = Object.entries(rohDaten)
  .map(([pfad, roh]) => {
    const r = BiomSchema.safeParse(roh)
    if (!r.success) throw new Error(`${pfad}: ${r.error.message}`)
    return r.data
  })
  .sort((a, b) => a.reihenfolge - b.reihenfolge)

const guideLaderProOrdner = new Map(Object.entries(rohGuides).map(([pfad, lader]) => [ordner(pfad), lader]))
const ordnerProBiom = new Map(
  Object.keys(rohDaten).map((pfad) => {
    const roh = rohDaten[pfad] as { id: BiomId }
    return [roh.id, ordner(pfad)] as const
  }),
)

export function biom(id: BiomId): Biom | undefined {
  return BIOME.find((b) => b.id === id)
}

/** Lädt guide.md eines Bioms nach (eigener Chunk), zerlegt in die sechs festen Abschnitte (H2). */
export async function guideAbschnitte(id: BiomId): Promise<Partial<Record<Abschnitt, string>>> {
  const lader = guideLaderProOrdner.get(ordnerProBiom.get(id) ?? '')
  const text = lader ? await lader() : ''
  return guideZerlegen(text)
}

export function guideZerlegen(text: string): Partial<Record<Abschnitt, string>> {
  const teile: Partial<Record<Abschnitt, string>> = {}
  const re = /^## (.+)$/gm
  const treffer = [...text.matchAll(re)]
  treffer.forEach((m, i) => {
    const titel = m[1].trim() as Abschnitt
    if (!(H2_REIHENFOLGE as readonly string[]).includes(titel)) return
    const start = m.index! + m[0].length
    const ende = treffer[i + 1]?.index ?? text.length
    teile[titel] = text.slice(start, ende).trim()
  })
  return teile
}

export const ALLE_ITEMS = new Map(BIOME.flatMap((b) => b.items.map((i) => [i.id, { ...i, biom: b.id }] as const)))

export function itemName(id: string): string {
  return ALLE_ITEMS.get(id)?.name.de ?? id
}
