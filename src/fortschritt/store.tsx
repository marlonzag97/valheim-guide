import { useEffect, useReducer, type ReactNode } from 'react'
import { FortschrittExportSchema, LOCALSTORAGE_SCHLUESSEL } from '../daten/schema'
import { FortschrittKontext } from './kontext'
import { LEER, exportieren, reducer, type Fortschritt } from './reducer'

function laden(): Fortschritt {
  try {
    const roh = localStorage.getItem(LOCALSTORAGE_SCHLUESSEL)
    if (!roh) return LEER
    const r = FortschrittExportSchema.safeParse(JSON.parse(roh))
    return r.success ? reducer(LEER, { typ: 'import', daten: r.data }) : LEER
  } catch {
    return LEER
  }
}

export function FortschrittProvider({ children }: { children: ReactNode }) {
  const [stand, senden] = useReducer(reducer, undefined, laden)
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_SCHLUESSEL, JSON.stringify(exportieren(stand)))
    } catch {
      /* Speicher blockiert: still weiter */
    }
  }, [stand])
  return <FortschrittKontext.Provider value={{ stand, senden }}>{children}</FortschrittKontext.Provider>
}
