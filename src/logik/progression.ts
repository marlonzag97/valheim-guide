// Phase-0-Fassung. Arbeiter A (Phase 1) ergänzt Tests und Feinheiten; Signaturen bleiben.
import type { Biom, BiomId } from '../daten/schema'
import type { Fortschritt } from '../fortschritt/reducer'

export type BiomStatus = 'erledigt' | 'aktiv' | 'gesperrt'

export function aktuellesBiom(biome: Biom[], f: Fortschritt): Biom {
  return biome.find((b) => !f.besiegteBosse.has(b.boss.id)) ?? biome[biome.length - 1]
}

export function biomStatus(biome: Biom[], f: Fortschritt): Record<BiomId, BiomStatus> {
  const aktiv = aktuellesBiom(biome, f)
  const alleBesiegt = biome.every((b) => f.besiegteBosse.has(b.boss.id))
  const out = {} as Record<BiomId, BiomStatus>
  for (const b of biome) {
    if (alleBesiegt) out[b.id] = 'erledigt'
    else if (b.reihenfolge < aktiv.reihenfolge) out[b.id] = 'erledigt'
    else if (b.id === aktiv.id) out[b.id] = 'aktiv'
    else out[b.id] = 'gesperrt'
  }
  return out
}

export interface NaechsterSchritt {
  biom: Biom
  text: string
  zielId?: string
  istBoss: boolean
}

export function naechsterSchritt(biome: Biom[], f: Fortschritt): NaechsterSchritt | null {
  if (biome.every((b) => f.besiegteBosse.has(b.boss.id))) return null
  const b = aktuellesBiom(biome, f)
  const offen = b.checkliste.find((z) => z.bedingung !== 'boss' && !f.erledigteZiele.has(z.id))
  if (offen) return { biom: b, text: offen.text, zielId: offen.id, istBoss: false }
  return { biom: b, text: `Stell dich ${b.boss.name.de}`, istBoss: true }
}
