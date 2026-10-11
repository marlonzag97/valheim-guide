// EINGEFROREN ab Phase 1. Änderungen nur über Abweichungs-Log in PLAN.md.
import { z } from 'zod'

export const BIOM_IDS = [
  'wiesen',
  'schwarzwald',
  'sumpf',
  'berge',
  'ebenen',
  'nebellande',
  'aschlande',
  'tiefer-norden',
] as const
export type BiomId = (typeof BIOM_IDS)[number]

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ID: englisch, kebab-case')
const name = z.object({ de: z.string().min(1), en: z.string().min(1) })

export const StationSchema = z.enum([
  'hand',
  'werkbank',
  'schmiede',
  'kessel',
  'gaerbottich',
  'steinmetz',
  'kunsthandwerkstisch',
  'schwarze-schmiede',
  'galdr-tisch',
  'frost-giesserei',
  'schmelze',
  'koehler',
  'eidbrecher',
  'spinnrad',
  'muehle',
  'feuer',
  'bauen',
])
export type Station = z.infer<typeof StationSchema>

export const ItemTypSchema = z.enum([
  'waffe',
  'ruestung',
  'nahrung',
  'werkzeug',
  'material',
  'bauteil',
  'met',
  'schild',
  'station',
])

export const ItemSchema = z.object({
  id,
  name,
  typ: ItemTypSchema,
  werte: z.record(z.string(), z.number()).optional(),
  nurPc: z.boolean().optional(),
  hinweis: z.string().optional(),
})
export type Item = z.infer<typeof ItemSchema>

export const ZutatSchema = z.object({ item: id, menge: z.number().int().positive() })

export const RezeptSchema = z.object({
  id,
  ergebnis: id,
  station: StationSchema,
  stufe: z.number().int().min(1).max(7).default(1),
  zutaten: z.array(ZutatSchema).min(1),
  menge: z.number().int().positive().default(1),
  nurPc: z.boolean().optional(),
})
export type Rezept = z.infer<typeof RezeptSchema>

export const AnforderungSchema = z.object({
  item: id,
  grund: z.string().min(1),
  pflicht: z.boolean().default(true),
})
export type Anforderung = z.infer<typeof AnforderungSchema>

export const GegnerSchema = z.object({
  id,
  name,
  gefahr: z.number().int().min(1).max(5),
  schwaeche: z.array(z.string()).default([]),
  resistenz: z.array(z.string()).default([]),
  tipp: z.string().min(1),
  drops: z.array(id).default([]),
})
export type Gegner = z.infer<typeof GegnerSchema>

export const RohstoffSchema = z.object({
  id,
  name,
  fundort: z.string().min(1),
  werkzeug: z.string().optional(),
  wofuer: z.array(id).default([]),
})
export type Rohstoff = z.infer<typeof RohstoffSchema>

export const ZwischenzielSchema = z.object({
  id,
  text: z.string().min(1),
  bedingung: z.enum(['boss', 'manuell']).default('manuell'),
})
export type Zwischenziel = z.infer<typeof ZwischenzielSchema>

export const BossSchema = z.object({
  id,
  name,
  altar: z.string().min(1),
  opfergabe: z.array(ZutatSchema),
  belohnung: z.array(id),
  macht: z.object({ name: z.string(), wirkung: z.string() }),
  leben: z.number().int().positive().optional(),
  schwaeche: z.array(z.string()).default([]),
  resistenz: z.array(z.string()).default([]),
})
export type Boss = z.infer<typeof BossSchema>

export const BiomSchema = z
  .object({
    id: z.enum(BIOM_IDS),
    reihenfolge: z.number().int().min(1).max(8),
    name,
    farbe: z.enum(BIOM_IDS),
    untertitel: z.string().min(1),
    status: z.enum(['voll', 'geruest']).default('geruest'),
    boss: BossSchema,
    vorbereitung: z.array(AnforderungSchema).default([]),
    gefahren: z.array(GegnerSchema).default([]),
    rohstoffe: z.array(RohstoffSchema).default([]),
    freischaltungen: z.array(RezeptSchema).default([]),
    items: z.array(ItemSchema).default([]),
    checkliste: z.array(ZwischenzielSchema).default([]),
  })
  .superRefine((b, ctx) => {
    const ids = new Set<string>()
    for (const list of [b.gefahren, b.rohstoffe, b.freischaltungen, b.items, b.checkliste] as { id: string }[][]) {
      for (const e of list) {
        if (ids.has(e.id)) ctx.addIssue({ code: 'custom', message: `Doppelte ID im Biom: ${e.id}` })
        ids.add(e.id)
      }
    }
  })
export type Biom = z.infer<typeof BiomSchema>
export type BiomRoh = z.input<typeof BiomSchema>

export const H2_REIHENFOLGE = [
  'Vorbereitung',
  'Gefahren',
  'Rohstoffe',
  'Freischaltungen',
  'Boss',
  'Checkliste',
] as const
export type Abschnitt = (typeof H2_REIHENFOLGE)[number]

export const FortschrittExportSchema = z.object({
  version: z.literal(1),
  besiegteBosse: z.array(id),
  erledigteZiele: z.array(id),
})
export type FortschrittExport = z.infer<typeof FortschrittExportSchema>

export const LOCALSTORAGE_SCHLUESSEL = 'valheim-guide.fortschritt.v1'
export const SESSION_NEU_SCHLUESSEL = 'valheim-guide.neu.v1'
