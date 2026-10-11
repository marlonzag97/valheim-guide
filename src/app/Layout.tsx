import { NavLink, Outlet } from 'react-router'
import { BIOME } from '../daten/laden'
import { useFortschritt } from '../fortschritt/kontext'
import { biomStatus } from '../logik/progression'
import { BiomLeiste } from '../komponenten/BiomLeiste'
import { RunenIcon } from '../komponenten/RunenIcon'

export function Layout() {
  const { stand } = useFortschritt()
  const status = biomStatus(BIOME, stand)
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="rune-titel text-xl text-glut-300">
            Valheim-Guide
          </NavLink>
          <nav className="flex gap-1 text-asche-300">
            <NavLink to="/suche" className="rounded-lg p-2 hover:bg-nacht-800 aria-[current=page]:text-glut-300" aria-label="Suche">
              <RunenIcon name="suche" groesse={20} />
            </NavLink>
            <NavLink to="/einstellungen" className="rounded-lg p-2 hover:bg-nacht-800 aria-[current=page]:text-glut-300" aria-label="Einstellungen">
              <RunenIcon name="einstellungen" groesse={20} />
            </NavLink>
          </nav>
        </div>
        <BiomLeiste biome={BIOME} status={status} />
      </header>
      <main className="mt-6 flex-1">
        <Outlet />
      </main>
      <footer className="mt-10 text-center text-[11px] text-asche-300/70">
        Fan-Projekt, kein offizielles Produkt von Iron Gate oder Coffee Stain. Stand: Valheim 1.0.17 (PS5).
      </footer>
    </div>
  )
}
