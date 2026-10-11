import Fuse from 'fuse.js'
import type { Biom, BiomId } from '../daten/schema'

export type TrefferTyp = 'item' | 'gegner' | 'rohstoff' | 'boss' | 'biom'

export interface Eintrag {
  id: string
  typ: TrefferTyp
  nameDe: string
  nameEn: string
  biom: BiomId
  biomName: string
  anker: string
  untertitel?: string
}

const TYP_LABEL: Record<TrefferTyp, string> = {
  item: 'Gegenstand',
  gegner: 'Gegner',
  rohstoff: 'Rohstoff',
  boss: 'Boss',
  biom: 'Biom',
}

export function typLabel(t: TrefferTyp): string {
  return TYP_LABEL[t]
}

export function indexBauen(biome: Biom[]): Eintrag[] {
  const out: Eintrag[] = []
  for (const b of biome) {
    out.push({ id: b.id, typ: 'biom', nameDe: b.name.de, nameEn: b.name.en, biom: b.id, biomName: b.name.de, anker: '', untertitel: b.untertitel })
    out.push({ id: b.boss.id, typ: 'boss', nameDe: b.boss.name.de, nameEn: b.boss.name.en, biom: b.id, biomName: b.name.de, anker: 'boss', untertitel: b.boss.altar })
    for (const g of b.gefahren) out.push({ id: g.id, typ: 'gegner', nameDe: g.name.de, nameEn: g.name.en, biom: b.id, biomName: b.name.de, anker: 'gefahren', untertitel: g.tipp })
    for (const r of b.rohstoffe) out.push({ id: r.id, typ: 'rohstoff', nameDe: r.name.de, nameEn: r.name.en, biom: b.id, biomName: b.name.de, anker: 'rohstoffe', untertitel: r.fundort })
    const rezeptItems = new Set(b.freischaltungen.map((r) => r.ergebnis))
    const rohstoffNamen = new Set(b.rohstoffe.map((r) => r.name.de))
    for (const i of b.items) {
      if (rohstoffNamen.has(i.name.de) && !rezeptItems.has(i.id)) continue
      out.push({
        id: i.id,
        typ: 'item',
        nameDe: i.name.de,
        nameEn: i.name.en,
        biom: b.id,
        biomName: b.name.de,
        anker: rezeptItems.has(i.id) ? 'freischaltungen' : 'rohstoffe',
        untertitel: i.hinweis,
      })
    }
  }
  return out
}

export function sucheErstellen(eintraege: Eintrag[]) {
  const fuse = new Fuse(eintraege, {
    keys: [
      { name: 'nameDe', weight: 0.6 },
      { name: 'nameEn', weight: 0.4 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return (frage: string, max = 30): Eintrag[] => {
    const f = frage.trim()
    if (f.length < 2) return []
    return fuse.search(f, { limit: max }).map((r) => r.item)
  }
}
