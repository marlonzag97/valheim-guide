import { createContext, useContext } from 'react'
import type { BiomId } from '../daten/schema'
import type { Aktion, Fortschritt } from './reducer'

export interface FortschrittWert {
  stand: Fortschritt
  senden: (a: Aktion) => void
  /** Biome, die in dieser Sitzung durch einen Boss-Sieg frisch freigeschaltet wurden. */
  neu: ReadonlySet<BiomId>
}

export const FortschrittKontext = createContext<FortschrittWert | null>(null)

export function useFortschritt() {
  const c = useContext(FortschrittKontext)
  if (!c) throw new Error('FortschrittProvider fehlt')
  return c
}

/** „Neu“-Leuchten: Set der in dieser Sitzung freigeschalteten Biome. */
export function useNeuBiome(): ReadonlySet<BiomId> {
  return useFortschritt().neu
}
