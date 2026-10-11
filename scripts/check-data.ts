import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { BiomSchema, H2_REIHENFOLGE, type Biom } from '../src/daten/schema.ts'

const wurzel = join(import.meta.dirname, '..', 'inhalt')
const ordner = readdirSync(wurzel, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

let fehler = 0
const biome: Biom[] = []
const alleItemIds = new Set<string>()

for (const o of ordner) {
  const pfad = join(wurzel, o)
  const datenPfad = join(pfad, 'daten.json')
  const guidePfad = join(pfad, 'guide.md')
  if (!existsSync(datenPfad)) {
    console.error(`✗ ${o}: daten.json fehlt`)
    fehler++
    continue
  }
  const roh = JSON.parse(readFileSync(datenPfad, 'utf8'))
  const r = BiomSchema.safeParse(roh)
  if (!r.success) {
    console.error(`✗ ${o}/daten.json:`)
    for (const i of r.error.issues) console.error(`    ${i.path.join('.')}: ${i.message}`)
    fehler++
    continue
  }
  biome.push(r.data)
  for (const i of r.data.items) {
    if (alleItemIds.has(i.id)) {
      console.error(`✗ ${o}: Item-ID "${i.id}" ist schon in einem früheren Biom definiert`)
      fehler++
    }
    alleItemIds.add(i.id)
  }
  if (!existsSync(guidePfad)) {
    console.error(`✗ ${o}: guide.md fehlt`)
    fehler++
    continue
  }
  const h2 = [...readFileSync(guidePfad, 'utf8').matchAll(/^## (.+)$/gm)].map((m) => m[1].trim())
  const erwartet = [...H2_REIHENFOLGE]
  if (r.data.status === 'voll' && JSON.stringify(h2) !== JSON.stringify(erwartet)) {
    console.error(`✗ ${o}/guide.md: H2-Reihenfolge falsch. Ist: ${h2.join(' · ')}`)
    fehler++
  }
}

// Querverweise: alle Item-IDs in Rezepten, Vorbereitung, Belohnungen müssen existieren
for (const b of biome) {
  const pruefe = (id: string, wo: string) => {
    if (!alleItemIds.has(id)) {
      console.error(`✗ ${b.id}: unbekannte Item-ID "${id}" in ${wo}`)
      fehler++
    }
  }
  for (const r of b.freischaltungen) {
    pruefe(r.ergebnis, `Rezept ${r.id}`)
    for (const z of r.zutaten) pruefe(z.item, `Rezept ${r.id}`)
  }
  for (const a of b.vorbereitung) pruefe(a.item, 'Vorbereitung')
  for (const z of b.boss.opfergabe) pruefe(z.item, 'Boss-Opfergabe')
  for (const id of b.boss.belohnung) pruefe(id, 'Boss-Belohnung')
  for (const g of b.gefahren) for (const id of g.drops) pruefe(id, `Gegner ${g.id}`)
  for (const r of b.rohstoffe) for (const id of r.wofuer) pruefe(id, `Rohstoff ${r.id}`)
}

const reihen = biome.map((b) => b.reihenfolge).sort((a, b) => a - b)
if (reihen.some((r, i) => r !== i + 1)) {
  console.error(`✗ Reihenfolge lückenhaft: ${reihen.join(',')}`)
  fehler++
}

if (fehler) {
  console.error(`\n${fehler} Fehler`)
  process.exit(1)
}
console.log(`✓ ${biome.length} Biome, ${alleItemIds.size} Items, alle Verweise gültig`)
