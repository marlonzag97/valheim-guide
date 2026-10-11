import { FortschrittExportSchema, type FortschrittExport } from '../daten/schema'

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

export type ImportErgebnis = { ok: true; daten: FortschrittExport } | { ok: false; fehler: string }

/** Prüft einen JSON-Text (Datei oder eingefügt) gegen das Export-Schema. */
export function importieren(text: string): ImportErgebnis {
  if (!text.trim()) return { ok: false, fehler: 'Kein Text zum Importieren.' }
  let roh: unknown
  try {
    roh = JSON.parse(text)
  } catch {
    return { ok: false, fehler: 'Kein gültiges JSON. Bitte die komplette Export-Datei verwenden.' }
  }
  const r = FortschrittExportSchema.safeParse(roh)
  if (r.success) return { ok: true, daten: r.data }
  const erstes = r.error.issues[0]
  const feld = erstes?.path.join('.') ?? ''
  if (feld === 'version') return { ok: false, fehler: 'Unbekannte Version. Erwartet wird Version 1.' }
  if (feld.startsWith('besiegteBosse') || feld.startsWith('erledigteZiele')) {
    const name = feld.startsWith('besiegteBosse') ? 'besiegteBosse' : 'erledigteZiele'
    return { ok: false, fehler: `Feld „${name}“ fehlt oder enthält ungültige IDs.` }
  }
  return { ok: false, fehler: 'Das ist keine Fortschritt-Datei des Valheim-Guides.' }
}
