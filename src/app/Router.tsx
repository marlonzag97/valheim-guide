import { HashRouter, Route, Routes } from 'react-router'
import { Layout } from './Layout'
import { Start } from '../seiten/Start'
import { BiomSeite } from '../seiten/Biom'
import { Suche } from '../seiten/Suche'
import { Einstellungen } from '../seiten/Einstellungen'
import { Tipps } from '../seiten/Tipps'

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Start />} />
          <Route path="biom/:id" element={<BiomSeite />} />
          <Route path="suche" element={<Suche />} />
          <Route path="tipps" element={<Tipps />} />
          <Route path="einstellungen" element={<Einstellungen />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
