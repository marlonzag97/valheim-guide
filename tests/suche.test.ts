import { describe, expect, it } from 'vitest'
import { BiomSchema, type Biom } from '../src/daten/schema'
import { indexBauen, sucheErstellen } from '../src/logik/suche'
import wiesenRoh from '../inhalt/01-wiesen/daten.json'

const wiesen: Biom = BiomSchema.parse(wiesenRoh)
const suchen = sucheErstellen(indexBauen([wiesen]))

describe('suche', () => {
  it('findet deutsch und englisch', () => {
    expect(suchen('Feuerstein')[0]?.nameDe).toBe('Feuerstein')
    expect(suchen('flint')[0]?.nameEn).toBe('Flint')
  })
  it('findet unscharf', () => {
    expect(suchen('Eikthir').some((t) => t.id === 'eikthyr')).toBe(true)
  })
  it('liefert Sprungziel', () => {
    const t = suchen('Grauling')[0]
    expect(t).toMatchObject({ typ: 'gegner', biom: 'wiesen', anker: 'gefahren' })
  })
  it('ignoriert zu kurze Fragen', () => {
    expect(suchen('F')).toEqual([])
  })
})
