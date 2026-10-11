// „Neu“-Leuchten: Biome, die in dieser Sitzung durch einen Boss-Sieg freigeschaltet wurden.
import { BIOM_IDS, SESSION_NEU_SCHLUESSEL, type Biom, type BiomId } from '../daten/schema'
import type { Aktion, Fortschritt } from './reducer'

type Speicher = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function sitzung(): Speicher | null {
  try {
    return sessionStorage
  } catch {
    return null
  }
}

function istBiomId(x: unknown): x is BiomId {
  return typeof x === 'string' && (BIOM_IDS as readonly string[]).includes(x)
}

/** Liest die in dieser Sitzung freigeschalteten Biome aus dem sessionStorage. */
export function neuFreigeschaltet(speicher: Speicher | null = sitzung()): Set<BiomId> {
  try {
    const roh = speicher?.getItem(SESSION_NEU_SCHLUESSEL)
    if (!roh) return new Set()
    const liste: unknown = JSON.parse(roh)
    return new Set(Array.isArray(liste) ? liste.filter(istBiomId) : [])
  } catch {
    return new Set()
  }
}

export function neuSpeichern(neu: ReadonlySet<BiomId>, speicher: Speicher | null = sitzung()): void {
  try {
    if (neu.size === 0) speicher?.removeItem(SESSION_NEU_SCHLUESSEL)
    else speicher?.setItem(SESSION_NEU_SCHLUESSEL, JSON.stringify([...neu]))
  } catch {
    /* Speicher blockiert: Leuchten entfällt */
  }
}

/** Das Biom, das nach dem Sieg über `bossId` freigeschaltet wird (nächstes in der Reihenfolge). */
export function naechstesBiom(biome: readonly Biom[], bossId: string): BiomId | null {
  const sortiert = [...biome].sort((a, b) => a.reihenfolge - b.reihenfolge)
  const i = sortiert.findIndex((b) => b.boss.id === bossId)
  return i >= 0 ? (sortiert[i + 1]?.id ?? null) : null
}

/**
 * Reine Regel: neue Menge der „Neu“-Biome nach einer Aktion.
 * Boss gerade besiegt → nächstes Biom dazu; Boss wieder offen → wieder raus; Reset → leer.
 */
export function neuNachAktion(
  biome: readonly Biom[],
  vorher: Fortschritt,
  a: Aktion,
  neu: ReadonlySet<BiomId>,
): Set<BiomId> {
  const n = new Set(neu)
  if (a.typ === 'reset') return new Set()
  if (a.typ !== 'boss') return n
  const ziel = naechstesBiom(biome, a.id)
  if (!ziel) return n
  const warBesiegt = vorher.besiegteBosse.has(a.id)
  if (a.besiegt && !warBesiegt) n.add(ziel)
  if (!a.besiegt && warBesiegt) n.delete(ziel)
  return n
}
