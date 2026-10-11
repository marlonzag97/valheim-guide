import { createContext, useContext } from 'react'
import type { Aktion, Fortschritt } from './reducer'

export const FortschrittKontext = createContext<{ stand: Fortschritt; senden: (a: Aktion) => void } | null>(null)

export function useFortschritt() {
  const c = useContext(FortschrittKontext)
  if (!c) throw new Error('FortschrittProvider fehlt')
  return c
}
