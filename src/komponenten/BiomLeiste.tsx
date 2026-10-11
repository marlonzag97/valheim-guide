import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import type { Biom, BiomId } from '../daten/schema'
import type { BiomStatus } from '../logik/progression'
import { RunenIcon } from './RunenIcon'

interface Props {
  biome: Biom[]
  status: Record<BiomId, BiomStatus>
}

export function BiomLeiste({ biome, status }: Props) {
  return (
    <nav aria-label="Biome" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex min-w-max gap-2 py-1">
        {biome.map((b) => {
          const s = status[b.id]
          return (
            <li key={b.id} data-biom={b.id}>
              <NavLink
                to={`/biom/${b.id}`}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                    isActive ? 'bg-nacht-700' : 'hover:bg-nacht-800'
                  } ${s === 'erledigt' ? 'biom-dim' : ''} ${s === 'gesperrt' ? 'text-asche-300' : 'text-asche-100'}`
                }
                title={`${b.name.de} (${b.name.en})`}
              >
                {s === 'aktiv' && (
                  <motion.span
                    layoutId="aktiv-ring"
                    className="absolute inset-0 rounded-lg ring-1 ring-[var(--biom)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative" style={{ color: 'var(--biom)' }}>
                  <RunenIcon name={b.id} groesse={22} />
                  {s === 'gesperrt' && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-nacht-900 p-0.5 text-asche-300">
                      <RunenIcon name="schloss" groesse={11} />
                    </span>
                  )}
                  {s === 'erledigt' && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-nacht-900 p-0.5 text-glut-400">
                      <RunenIcon name="haken" groesse={11} />
                    </span>
                  )}
                </span>
                <span className="rune-titel relative whitespace-nowrap">{b.name.de}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
