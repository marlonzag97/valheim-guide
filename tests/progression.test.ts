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
    expect(naechsterSchritt(biome, s)).toMatchObject({ istBoss: true, text: 'Stell dich eikthyr' })
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
})
