// Phase-0-Fassung. Arbeiter A (Phase 1) baut Export/Import und Tests aus; Schnittstelle bleibt.
import type { FortschrittExport } from '../daten/schema'

export interface Fortschritt {
  besiegteBosse: ReadonlySet<string>
  erledigteZiele: ReadonlySet<string>
}

export type Aktion =
  | { typ: 'boss'; id: string; besiegt: boolean }
  | { typ: 'ziel'; id: string; erledigt: boolean }
  | { typ: 'import'; daten: FortschrittExport }
  | { typ: 'reset' }

export const LEER: Fortschritt = { besiegteBosse: new Set(), erledigteZiele: new Set() }

export function reducer(s: Fortschritt, a: Aktion): Fortschritt {
  switch (a.typ) {
    case 'boss': {
      const n = new Set(s.besiegteBosse)
      if (a.besiegt) n.add(a.id)
      else n.delete(a.id)
      return { ...s, besiegteBosse: n }
    }
    case 'ziel': {
      const n = new Set(s.erledigteZiele)
      if (a.erledigt) n.add(a.id)
      else n.delete(a.id)
      return { ...s, erledigteZiele: n }
    }
    case 'import':
      return { besiegteBosse: new Set(a.daten.besiegteBosse), erledigteZiele: new Set(a.daten.erledigteZiele) }
    case 'reset':
      return LEER
  }
}

export function exportieren(s: Fortschritt): FortschrittExport {
  return { version: 1, besiegteBosse: [...s.besiegteBosse], erledigteZiele: [...s.erledigteZiele] }
}
