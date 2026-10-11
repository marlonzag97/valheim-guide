import { z } from 'zod'
import roh from '../../inhalt/tipps.json'

export const TippSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  titel: z.string().min(1),
  phase: z.enum(['start', 'mitte', 'spaet', 'immer']),
  text: z.string().min(1),
  wow: z.string().min(1),
})
export type Tipp = z.infer<typeof TippSchema>

const TippsSchema = z.object({ stand: z.string(), tipps: z.array(TippSchema).length(10) })

export const TIPPS = TippsSchema.parse(roh)

export const PHASE_LABEL: Record<Tipp['phase'], string> = {
  start: 'Am Anfang',
  mitte: 'Mitte des Spiels',
  spaet: 'Spätes Spiel',
  immer: 'Immer',
}
