import { describe, expect, it } from 'vitest'
import { BiomSchema, type Biom } from '../src/daten/schema'
import { aktuellesBiom, biomStatus, naechsterSchritt } from '../src/logik/progression'
import { LEER, reducer } from '../src/fortschritt/reducer'

function mini(id: Biom['id'], n: number, bossId: string, ziele: string[] = []): Biom {
  return BiomSchema.parse({
    id, reihenfolge: n, name: { de: id, en: id }, farbe: id, untertitel: 'x',
    boss: { id: bossId, name: { de: bossId, en: bossId }, altar: 'a', opfergabe: [], belohnung: [], macht: { name: 'm', wirkung: 'w' } },
    checkliste: [...ziele.map((z) => ({ id: z, text: z })), { id: `z-${bossId}`, text: 'boss', bedingung: 'boss' }],
  })
}
const biome = [mini('wiesen', 1, 'eikthyr', ['a', 'b']), mini('schwarzwald', 2, 'the-elder', ['c'])]

describe('progression', () => {
  it('startet in den Wiesen mit erstem Ziel', () => {
    expect(aktuellesBiom(biome, LEER).id).toBe('wiesen')
    expect(naechsterSchritt(biome, LEER)?.text).toBe('a')
    expect(biomStatus(biome, LEER)).toEqual({ wiesen: 'aktiv', schwarzwald: 'gesperrt' })
  })
  it('zeigt Boss, wenn alle Ziele erledigt sind', () => {
    let s = reducer(LEER, { typ: 'ziel', id: 'a', erledigt: true })
    s = reducer(s, { typ: 'ziel', id: 'b', erledigt: true })
    expect(naechsterSchritt(biome, s)).toMatchObject({ istBoss: true, text: 'Zeit für den Boss: eikthyr' })
  })
  it('schaltet nach Boss-Häkchen weiter', () => {
    const s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    expect(aktuellesBiom(biome, s).id).toBe('schwarzwald')
    expect(biomStatus(biome, s)).toEqual({ wiesen: 'erledigt', schwarzwald: 'aktiv' })
    expect(naechsterSchritt(biome, s)?.text).toBe('c')
  })
  it('alles besiegt → null', () => {
    let s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    s = reducer(s, { typ: 'boss', id: 'the-elder', besiegt: true })
    expect(naechsterSchritt(biome, s)).toBeNull()
  })

  it('leere Checkliste → direkt Boss', () => {
    const leer = [BiomSchema.parse({
      id: 'wiesen', reihenfolge: 1, name: { de: 'Wiesen', en: 'Meadows' }, farbe: 'wiesen', untertitel: 'x',
      boss: { id: 'eikthyr', name: { de: 'Eikthyr', en: 'Eikthyr' }, altar: 'a', opfergabe: [], belohnung: [], macht: { name: 'm', wirkung: 'w' } },
    })]
    expect(naechsterSchritt(leer, LEER)).toMatchObject({ istBoss: true, text: 'Zeit für den Boss: Eikthyr' })
    expect(naechsterSchritt(leer, LEER)?.zielId).toBeUndefined()
  })
  it('Boss ohne eigene Ziele (nur Boss-Ziel) → direkt Boss', () => {
    const s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    const nurBoss = [mini('wiesen', 1, 'eikthyr'), mini('schwarzwald', 2, 'the-elder')]
    expect(naechsterSchritt(nurBoss, LEER)).toMatchObject({ istBoss: true, biom: { id: 'wiesen' } })
    expect(naechsterSchritt(nurBoss, s)).toMatchObject({ istBoss: true, biom: { id: 'schwarzwald' } })
  })
  it('Boss-Ziel zählt nie als nächster Schritt, auch wenn abgehakt', () => {
    let s = reducer(LEER, { typ: 'ziel', id: 'z-eikthyr', erledigt: true })
    expect(naechsterSchritt(biome, s)?.text).toBe('a')
    s = reducer(s, { typ: 'ziel', id: 'a', erledigt: true })
    s = reducer(s, { typ: 'ziel', id: 'b', erledigt: true })
    expect(naechsterSchritt(biome, s)?.istBoss).toBe(true)
  })
  it('Boss wieder abgehakt → Biom wird wieder aktiv', () => {
    let s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    expect(aktuellesBiom(biome, s).id).toBe('schwarzwald')
    s = reducer(s, { typ: 'boss', id: 'eikthyr', besiegt: false })
    expect(aktuellesBiom(biome, s).id).toBe('wiesen')
    expect(biomStatus(biome, s)).toEqual({ wiesen: 'aktiv', schwarzwald: 'gesperrt' })
    expect(naechsterSchritt(biome, s)?.text).toBe('a')
  })
  it('späterer Boss besiegt, früherer offen → früheres Biom bleibt aktiv', () => {
    const s = reducer(LEER, { typ: 'boss', id: 'the-elder', besiegt: true })
    expect(aktuellesBiom(biome, s).id).toBe('wiesen')
    expect(biomStatus(biome, s)).toEqual({ wiesen: 'aktiv', schwarzwald: 'gesperrt' })
  })
  it('alles besiegt → alle Biome erledigt, aktuelles = letztes', () => {
    let s = reducer(LEER, { typ: 'boss', id: 'eikthyr', besiegt: true })
    s = reducer(s, { typ: 'boss', id: 'the-elder', besiegt: true })
    expect(biomStatus(biome, s)).toEqual({ wiesen: 'erledigt', schwarzwald: 'erledigt' })
    expect(aktuellesBiom(biome, s).id).toBe('schwarzwald')
  })
})
