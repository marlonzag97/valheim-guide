import { describe, expect, it } from 'vitest'
import { BiomSchema, type Biom } from '../src/daten/schema'
import { bedarfFuer, rezeptIndex } from '../src/logik/bedarf'
import wiesenRoh from '../inhalt/01-wiesen/daten.json'
import schwarzwaldRoh from '../inhalt/02-schwarzwald/daten.json'

const biome: Biom[] = [BiomSchema.parse(wiesenRoh), BiomSchema.parse(schwarzwaldRoh)]
const index = rezeptIndex(biome)

describe('bedarf', () => {
  it('löst Bronzeaxt bis zu Erz und Kohle auf', () => {
    const b = bedarfFuer('bronze-axe', index)
    expect(b.rezept).toBeDefined()
    const ids = b.grundstoffe.map((g) => g.item)
    expect(ids).toContain('copper-ore')
    expect(ids).toContain('tin-ore')
    expect(b.biome).toContain('schwarzwald')
  })
  it('Grundstoff ohne Rezept liefert leeren Baum', () => {
    const b = bedarfFuer('wood', index)
    expect(b.rezept).toBeUndefined()
    expect(b.baum).toEqual([])
  })
  it('rechnet Mengen hoch', () => {
    const b = bedarfFuer('hammer', index)
    expect(b.grundstoffe.find((g) => g.item === 'wood')?.menge).toBe(3)
  })
})
