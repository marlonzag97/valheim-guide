import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { BIOME } from '../daten/laden'
import { FortschrittExportSchema, LOCALSTORAGE_SCHLUESSEL, type BiomId } from '../daten/schema'
import { FortschrittKontext } from './kontext'
import { neuFreigeschaltet, neuNachAktion, neuSpeichern } from './neu'
import { LEER, exportieren, reducer, type Aktion, type Fortschritt } from './reducer'

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
  const [stand, dispatch] = useReducer(reducer, undefined, laden)
  const [neu, setNeu] = useState<ReadonlySet<BiomId>>(() => neuFreigeschaltet())
  const standRef = useRef(stand)
  const neuRef = useRef(neu)

  useEffect(() => {
    standRef.current = stand
    try {
      localStorage.setItem(LOCALSTORAGE_SCHLUESSEL, JSON.stringify(exportieren(stand)))
    } catch {
      /* Speicher blockiert: still weiter */
    }
  }, [stand])

  const senden = useCallback((a: Aktion) => {
    const naechste = neuNachAktion(BIOME, standRef.current, a, neuRef.current)
    standRef.current = reducer(standRef.current, a)
    neuRef.current = naechste
    neuSpeichern(naechste)
    setNeu(naechste)
    dispatch(a)
  }, [])

  const wert = useMemo(() => ({ stand, senden, neu }), [stand, senden, neu])
  return <FortschrittKontext.Provider value={wert}>{children}</FortschrittKontext.Provider>
}
