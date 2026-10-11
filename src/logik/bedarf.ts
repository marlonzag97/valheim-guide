import type { Biom, BiomId, Rezept } from '../daten/schema'

export interface BedarfZeile {
  item: string
  menge: number
  biom: BiomId
  station?: Rezept['station']
  tiefe: number
}

export interface Bedarf {
  ziel: string
  rezept?: Rezept
  biom?: BiomId
  /** Direkte Zutaten, verschachtelt bis zu den Grundstoffen. */
  baum: BedarfZeile[]
  /** Aufsummierte Grundstoffe (Items ohne Rezept). */
  grundstoffe: BedarfZeile[]
  /** Biome, in denen etwas davon zuerst vorkommt. */
  biome: BiomId[]
}

export function rezeptIndex(biome: Biom[]) {
  const rezepte = new Map<string, { rezept: Rezept; biom: BiomId }>()
  const itemBiom = new Map<string, BiomId>()
  for (const b of biome) {
    for (const i of b.items) if (!itemBiom.has(i.id)) itemBiom.set(i.id, b.id)
    for (const r of b.freischaltungen) if (!rezepte.has(r.ergebnis)) rezepte.set(r.ergebnis, { rezept: r, biom: b.id })
  }
  return { rezepte, itemBiom }
}

const MAX_TIEFE = 4

export function bedarfFuer(ziel: string, index: ReturnType<typeof rezeptIndex>): Bedarf {
  const { rezepte, itemBiom } = index
  const baum: BedarfZeile[] = []
  const summe = new Map<string, number>()
  const biome = new Set<BiomId>()

  function ab(item: string, menge: number, tiefe: number, pfad: Set<string>) {
    const r = rezepte.get(item)
    const biom = itemBiom.get(item) ?? 'wiesen'
    biome.add(biom)
    baum.push({ item, menge, biom, station: r?.rezept.station, tiefe })
    if (!r || tiefe >= MAX_TIEFE || pfad.has(item)) {
      summe.set(item, (summe.get(item) ?? 0) + menge)
      return
    }
    const faktor = Math.ceil(menge / r.rezept.menge)
    const neuerPfad = new Set(pfad).add(item)
    for (const z of r.rezept.zutaten) ab(z.item, z.menge * faktor, tiefe + 1, neuerPfad)
  }

  const start = rezepte.get(ziel)
  if (start) {
    for (const z of start.rezept.zutaten) ab(z.item, z.menge, 1, new Set([ziel]))
  }
  biome.add(start?.biom ?? itemBiom.get(ziel) ?? 'wiesen')

  const grundstoffe = [...summe.entries()]
    .map(([item, menge]) => ({ item, menge, biom: itemBiom.get(item) ?? ('wiesen' as BiomId), tiefe: 0 }))
    .sort((a, b) => b.menge - a.menge)

  return { ziel, rezept: start?.rezept, biom: start?.biom, baum, grundstoffe, biome: [...biome] }
}
