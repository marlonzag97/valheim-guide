import { beforeEach, describe, expect, it } from 'vitest'
import { BiomSchema, SESSION_NEU_SCHLUESSEL, type Biom } from '../src/daten/schema'
import { LEER, exportieren, importieren, reducer, type Fortschritt } from '../src/fortschritt/reducer'
import { naechstesBiom, neuFreigeschaltet, neuNachAktion, neuSpeichern } from '../src/fortschritt/neu'

function mini(id: Biom['id'], n: number, bossId: string): Biom {
  return BiomSchema.parse({
    id, reihenfolge: n, name: { de: id, en: id }, farbe: id, untertitel: 'x',
    boss: { id: bossId, name: { de: bossId, en: bossId }, altar: 'a', opfergabe: [], belohnung: [], macht: { name: 'm', wirkung: 'w' } },
  })
}
// absichtlich unsortiert: naechstesBiom muss nach reihenfolge gehen
const biome = [mini('sumpf', 3, 'bonemass'), mini('wiesen', 1, 'eikthyr'), mini('schwarzwald', 2, 'the-elder')]

function stand(bosse: string[] = [], ziele: string[] = []): Fortschritt {
  return { besiegteBosse: new Set(bosse), erledigteZiele: new Set(ziele) }
}

describe('reducer', () => {
  it('Boss an und wieder ab', () => {
    const s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    expect([...s.besiegteBosse]).toEqual(['eikthyr'])
    expect([...reducer(s, { typ: 'boss', id: 'eikthyr', besiegt: false }).besiegteBosse]).toEqual([])
  })
  it('Ziel an und wieder ab, doppelt setzen bleibt einmal', () => {
    let s = reducer(LEER, { typ: 'ziel', id: 'a', erledigt: true })
    s = reducer(s, { typ: 'ziel', id: 'a', erledigt: true })
    expect([...s.erledigteZiele]).toEqual(['a'])
    expect(reducer(s, { typ: 'ziel', id: 'a', erledigt: false }).erledigteZiele.size).toBe(0)
  })
  it('verändert den alten Stand nicht', () => {
    const s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    expect(LEER.besiegteBosse.size).toBe(0)
    expect(s).not.toBe(LEER)
  })
  it('Import ersetzt alles, Reset leert', () => {
    const s = reducer(stand(['x'], ['y']), { typ: 'import', daten: { version: 1, besiegteBosse: ['eikthyr'], erledigteZiele: ['a'] } })
    expect([...s.besiegteBosse]).toEqual(['eikthyr'])
    expect([...s.erledigteZiele]).toEqual(['a'])
    expect(reducer(s, { typ: 'reset' })).toEqual(LEER)
  })
})

describe('exportieren / importieren', () => {
  it('Rundreise Export → JSON → Import', () => {
    const s = stand(['eikthyr', 'the-elder'], ['a', 'b'])
    const e = exportieren(s)
    expect(e).toEqual({ version: 1, besiegteBosse: ['eikthyr', 'the-elder'], erledigteZiele: ['a', 'b'] })
    const r = importieren(JSON.stringify(e))
    expect(r).toEqual({ ok: true, daten: e })
    if (r.ok) expect(reducer(LEER, { typ: 'import', daten: r.daten })).toEqual(s)
  })
  it('leerer Stand exportiert leere Listen', () => {
    expect(exportieren(LEER)).toEqual({ version: 1, besiegteBosse: [], erledigteZiele: [] })
  })
  it.each([
    ['', 'Kein Text zum Importieren.'],
    ['   ', 'Kein Text zum Importieren.'],
    ['{kaputt', 'Kein gültiges JSON. Bitte die komplette Export-Datei verwenden.'],
    ['[1,2]', 'Das ist keine Fortschritt-Datei des Valheim-Guides.'],
    ['42', 'Das ist keine Fortschritt-Datei des Valheim-Guides.'],
    ['{"version":2,"besiegteBosse":[],"erledigteZiele":[]}', 'Unbekannte Version. Erwartet wird Version 1.'],
    ['{"version":1,"erledigteZiele":[]}', 'Feld „besiegteBosse“ fehlt oder enthält ungültige IDs.'],
    ['{"version":1,"besiegteBosse":["Eikthyr Boss"],"erledigteZiele":[]}', 'Feld „besiegteBosse“ fehlt oder enthält ungültige IDs.'],
    ['{"version":1,"besiegteBosse":[],"erledigteZiele":[3]}', 'Feld „erledigteZiele“ fehlt oder enthält ungültige IDs.'],
  ])('lehnt %j ab', (text, fehler) => {
    expect(importieren(text)).toEqual({ ok: false, fehler })
  })
  it('ignoriert Zusatzfelder', () => {
    const r = importieren('{"version":1,"besiegteBosse":["eikthyr"],"erledigteZiele":[],"extra":true}')
    expect(r).toEqual({ ok: true, daten: { version: 1, besiegteBosse: ['eikthyr'], erledigteZiele: [] } })
  })
})

describe('Neu-Leuchten', () => {
  beforeEach(() => sessionStorage.clear())

  it('naechstesBiom folgt der Reihenfolge, letzter Boss → null', () => {
    expect(naechstesBiom(biome, 'eikthyr')).toBe('schwarzwald')
    expect(naechstesBiom(biome, 'the-elder')).toBe('sumpf')
    expect(naechstesBiom(biome, 'bonemass')).toBeNull()
    expect(naechstesBiom(biome, 'unbekannt')).toBeNull()
  })
  it('Boss gerade besiegt → nächstes Biom ist neu', () => {
    const n = neuNachAktion(biome, LEER, { typ: 'boss', id: 'eikthyr', besiegt: true }, new Set())
    expect([...n]).toEqual(['schwarzwald'])
  })
  it('Boss war schon besiegt → nichts Neues', () => {
    const n = neuNachAktion(biome, stand(['eikthyr']), { typ: 'boss', id: 'eikthyr', besiegt: true }, new Set())
    expect(n.size).toBe(0)
  })
  it('Boss wieder abgehakt → Biom nicht mehr neu', () => {
    const n = neuNachAktion(biome, stand(['eikthyr']), { typ: 'boss', id: 'eikthyr', besiegt: false }, new Set(['schwarzwald']))
    expect(n.size).toBe(0)
  })
  it('Ziele und Import ändern nichts, Reset leert', () => {
    const vorher = new Set(['schwarzwald'] as const)
    expect([...neuNachAktion(biome, LEER, { typ: 'ziel', id: 'a', erledigt: true }, vorher)]).toEqual(['schwarzwald'])
    expect([...neuNachAktion(biome, LEER, { typ: 'import', daten: exportieren(LEER) }, vorher)]).toEqual(['schwarzwald'])
    expect(neuNachAktion(biome, LEER, { typ: 'reset' }, vorher).size).toBe(0)
  })
  it('speichert in sessionStorage und liest zurück', () => {
    expect(neuFreigeschaltet().size).toBe(0)
    neuSpeichern(new Set(['schwarzwald', 'sumpf']))
    expect(JSON.parse(sessionStorage.getItem(SESSION_NEU_SCHLUESSEL)!)).toEqual(['schwarzwald', 'sumpf'])
    expect([...neuFreigeschaltet()]).toEqual(['schwarzwald', 'sumpf'])
    neuSpeichern(new Set())
    expect(sessionStorage.getItem(SESSION_NEU_SCHLUESSEL)).toBeNull()
  })
  it('kaputter oder fremder Inhalt → leeres bzw. gefiltertes Set', () => {
    sessionStorage.setItem(SESSION_NEU_SCHLUESSEL, '{kaputt')
    expect(neuFreigeschaltet().size).toBe(0)
    sessionStorage.setItem(SESSION_NEU_SCHLUESSEL, '["sumpf","atlantis",3]')
    expect([...neuFreigeschaltet()]).toEqual(['sumpf'])
    expect(neuFreigeschaltet(null).size).toBe(0)
  })
})
