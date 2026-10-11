import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import { Layout } from './Layout'
import { Start } from '../seiten/Start'

const BiomSeite = lazy(() => import('../seiten/Biom').then((m) => ({ default: m.BiomSeite })))
const Suche = lazy(() => import('../seiten/Suche').then((m) => ({ default: m.Suche })))
const Einstellungen = lazy(() => import('../seiten/Einstellungen').then((m) => ({ default: m.Einstellungen })))
const Tipps = lazy(() => import('../seiten/Tipps').then((m) => ({ default: m.Tipps })))

export function Router() {
  return (
    <HashRouter>
      <Suspense fallback={<p className="text-sm text-asche-300">Lädt …</p>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Start />} />
            <Route path="biom/:id" element={<BiomSeite />} />
            <Route path="suche" element={<Suche />} />
            <Route path="tipps" element={<Tipps />} />
            <Route path="einstellungen" element={<Einstellungen />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
