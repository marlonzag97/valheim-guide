import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BIOME } from '../daten/laden'
import { indexBauen, sucheErstellen, typLabel } from '../logik/suche'
import { RunenIcon } from '../komponenten/RunenIcon'
import { BedarfListe } from '../komponenten/BedarfListe'

export function Suche() {
  const [params, setParams] = useSearchParams()
  const [frage, setFrage] = useState(params.get('q') ?? '')
  const suchen = useMemo(() => sucheErstellen(indexBauen(BIOME)), [])
  const treffer = useMemo(() => suchen(frage), [suchen, frage])

  useEffect(() => {
    const t = setTimeout(() => setParams(frage ? { q: frage } : {}, { replace: true }), 200)
    return () => clearTimeout(t)
  }, [frage, setParams])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="rune-titel text-2xl text-asche-100">Suche</h1>
      <label className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-asche-300">
          <RunenIcon name="suche" groesse={18} />
        </span>
        <input
          type="search"
          autoFocus
          value={frage}
          onChange={(e) => setFrage(e.target.value)}
          placeholder="Gegenstand, Gegner, Boss … (deutsch oder englisch)"
          className="w-full rounded-lg border border-white/10 bg-nacht-800 py-3 pl-10 pr-3 text-asche-100 placeholder:text-asche-300/60 focus:border-glut-400 focus:outline-none"
        />
      </label>
      {frage.trim().length >= 2 && treffer.length === 0 && <p className="text-sm text-asche-300">Nichts gefunden. Vielleicht ein Biom, das noch nicht geschrieben ist.</p>}
      <ul className="flex flex-col gap-2">
        {treffer.map((t) => (
          <li key={`${t.typ}-${t.id}`} data-biom={t.biom}>
            <Link
              to={`/biom/${t.biom}${t.anker ? `#${t.anker}` : ''}`}
              className="flex items-center gap-3 rounded-lg border border-white/5 px-3 py-2 hover:bg-nacht-800"
            >
              <span className="text-[var(--biom)]">
                <RunenIcon name={t.typ === 'boss' ? 'boss' : t.typ === 'biom' ? t.biom : t.typ === 'gegner' ? 'stern' : 'haken'} groesse={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="rune-titel text-asche-100">{t.nameDe}</span>{' '}
                <span className="text-xs text-asche-300">({t.nameEn})</span>
                {t.untertitel && <span className="block truncate text-xs text-asche-300">{t.untertitel}</span>}
              </span>
              <span className="shrink-0 text-right text-[11px] text-asche-300">
                {typLabel(t.typ)}
                <span className="block text-[var(--biom-akzent)]">{t.biomName}</span>
              </span>
            </Link>
            {t.typ === 'item' && t.anker === 'freischaltungen' && (
              <details className="mx-3 -mt-1 rounded-b-lg border border-t-0 border-white/5 bg-nacht-900/60 px-3 py-2">
                <summary className="cursor-pointer text-xs text-asche-300 hover:text-asche-100">Was fehlt mir dafür?</summary>
                <div className="mt-2">
                  <BedarfListe ziel={t.id} />
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
