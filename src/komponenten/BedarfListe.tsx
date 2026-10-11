import { useMemo } from 'react'
import { Link } from 'react-router'
import { BIOME, biom as biomVon, itemName } from '../daten/laden'
import { bedarfFuer, rezeptIndex } from '../logik/bedarf'

export function BedarfListe({ ziel }: { ziel: string }) {
  const index = useMemo(() => rezeptIndex(BIOME), [])
  const b = useMemo(() => bedarfFuer(ziel, index), [ziel, index])
  if (!b.rezept) return <p className="text-xs text-asche-300">Kein Rezept bekannt, wird gesammelt oder gefunden.</p>
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="text-[11px] uppercase tracking-[0.18em] text-asche-300">Grundstoffe gesamt</div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {b.grundstoffe.map((g) => (
          <li key={g.item} data-biom={g.biom}>
            <span className="text-glut-300">{g.menge}×</span> {itemName(g.item)}{' '}
            <Link to={`/biom/${g.biom}#rohstoffe`} className="text-xs text-[var(--biom-akzent)] hover:underline">
              {biomVon(g.biom)?.name.de}
            </Link>
          </li>
        ))}
      </ul>
      {b.baum.some((z) => z.tiefe > 1) && (
        <>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-asche-300">Zwischenschritte</div>
          <ul className="flex flex-col gap-0.5 text-xs text-asche-200">
            {b.baum
              .filter((z) => z.station)
              .map((z, i) => (
                <li key={`${z.item}-${i}`} style={{ paddingLeft: `${(z.tiefe - 1) * 12}px` }}>
                  {z.menge}× {itemName(z.item)}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  )
}
