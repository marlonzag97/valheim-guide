import type { Rezept } from '../daten/schema'
import { ALLE_ITEMS, itemName } from '../daten/laden'
import { Karte } from './Karte'

const STATION: Record<string, string> = {
  hand: 'Von Hand',
  werkbank: 'Werkbank',
  schmiede: 'Schmiede',
  kessel: 'Kessel',
  gaerbottich: 'Gärbottich',
  steinmetz: 'Steinmetz',
  kunsthandwerkstisch: 'Kunsthandwerkstisch',
  'schwarze-schmiede': 'Schwarze Schmiede',
  'galdr-tisch': 'Galdr-Tisch',
  'frost-giesserei': 'Frostgießerei',
  schmelze: 'Schmelze',
  koehler: 'Köhler',
  eidbrecher: 'Eidbrecher',
  spinnrad: 'Spinnrad',
  muehle: 'Mühle',
  feuer: 'Kochstation',
  bauen: 'Hammer (Bauen)',
}

const TYP: Record<string, string> = {
  waffe: 'Waffe',
  ruestung: 'Rüstung',
  nahrung: 'Nahrung',
  werkzeug: 'Werkzeug',
  material: 'Material',
  bauteil: 'Bauteil',
  met: 'Met',
  schild: 'Schild',
  station: 'Station',
}

export function RezeptKarte({ rezept, neu }: { rezept: Rezept; neu?: boolean }) {
  const item = ALLE_ITEMS.get(rezept.ergebnis)
  return (
    <Karte leuchtet={neu} className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="rune-titel text-base text-asche-100">
            {item?.name.de ?? rezept.ergebnis}
            {rezept.menge > 1 && <span className="ml-1 text-asche-300">×{rezept.menge}</span>}
          </div>
          <div className="text-xs text-asche-300">
            {item?.name.en} · {TYP[item?.typ ?? ''] ?? item?.typ}
          </div>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-asche-300">
          {STATION[rezept.station]}
          {rezept.stufe > 1 && ` ${rezept.stufe}`}
        </span>
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {rezept.zutaten.map((z) => (
          <li key={z.item}>
            <span className="text-glut-300">{z.menge}×</span> {itemName(z.item)}
          </li>
        ))}
      </ul>
      {item?.werte && (
        <div className="flex flex-wrap gap-x-3 text-xs text-asche-300">
          {Object.entries(item.werte).map(([k, v]) => (
            <span key={k}>
              {k} {v}
            </span>
          ))}
        </div>
      )}
      {item?.hinweis && <p className="text-xs text-asche-300">{item.hinweis}</p>}
      {neu && (
        <span className="absolute -top-2 right-3 rounded-full bg-glut-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-nacht-950">
          Neu
        </span>
      )}
    </Karte>
  )
}
