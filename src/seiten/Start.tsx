import { Link } from 'react-router'
import { motion } from 'motion/react'
import { BIOME } from '../daten/laden'
import { useFortschritt } from '../fortschritt/kontext'
import { aktuellesBiom, naechsterSchritt } from '../logik/progression'
import { Karte } from '../komponenten/Karte'
import { RunenIcon } from '../komponenten/RunenIcon'

export function Start() {
  const { stand, senden } = useFortschritt()
  const schritt = naechsterSchritt(BIOME, stand)
  const aktiv = aktuellesBiom(BIOME, stand)
  const nichtsGeklickt = stand.besiegteBosse.size === 0 && stand.erledigteZiele.size === 0

  return (
    <div className="flex flex-col gap-6" data-biom={aktiv.id}>
      <section>
        <h1 className="rune-titel text-2xl text-asche-100">
          {nichtsGeklickt ? 'Du beginnst in den Wiesen' : schritt ? `Du bist ${schritt.biom.id === 'wiesen' ? 'in den' : 'im'} ${schritt.biom.name.de}` : 'Du hast Valheim bezwungen'}
        </h1>
        <p className="mt-1 text-sm text-asche-300">{schritt ? schritt.biom.untertitel : 'Alle acht Bosse liegen. Odin wartet.'}</p>
      </section>

      {schritt && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Karte leuchtet className="flex flex-col gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-glut-400">Nächster Schritt</div>
            <div className="rune-titel text-xl text-asche-100">{schritt.text}</div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/biom/${schritt.biom.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-glut-500 px-4 py-2 text-sm font-medium text-nacht-950 hover:bg-glut-400"
              >
                Zum Biom {schritt.biom.name.de}
                <RunenIcon name="pfeil" groesse={16} />
              </Link>
              {schritt.zielId && (
                <button
                  className="text-sm text-asche-300 underline-offset-4 hover:text-asche-100 hover:underline"
                  onClick={() => senden({ typ: 'ziel', id: schritt.zielId!, erledigt: true })}
                >
                  Erledigt, weiter
                </button>
              )}
            </div>
          </Karte>
        </motion.div>
      )}

      <section>
        <h2 className="rune-titel mb-3 text-sm uppercase tracking-[0.2em] text-asche-300">Die acht Bosse</h2>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BIOME.map((b) => {
            const besiegt = stand.besiegteBosse.has(b.boss.id)
            return (
              <li key={b.id} data-biom={b.id}>
                <Link
                  to={`/biom/${b.id}`}
                  className={`flex items-center gap-2 rounded-lg border border-white/5 px-3 py-2 text-sm hover:bg-nacht-800 ${besiegt ? 'biom-dim' : ''}`}
                >
                  <span className={besiegt ? 'text-glut-400' : 'text-[var(--biom)]'}>
                    <RunenIcon name={besiegt ? 'haken' : b.boss.id} groesse={18} />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="rune-titel text-asche-100">{b.boss.name.de}</span>
                    <span className="text-[11px] text-asche-300">{b.name.de}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <details className="group rounded-karte border border-white/5 p-4">
        <summary className="rune-titel cursor-pointer text-sm text-asche-200">Controller-Belegung PS5</summary>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-glut-300">Kreuz</dt><dd>Aufheben, benutzen, bestätigen</dd>
          <dt className="text-glut-300">Kreis</dt><dd>Zurück, Menü schließen</dd>
          <dt className="text-glut-300">Quadrat</dt><dd>Ausweichrolle</dd>
          <dt className="text-glut-300">Dreieck</dt><dd>Inventar</dd>
          <dt className="text-glut-300">R2 / L2</dt><dd>Angriff / Blocken (mit Hammer: Bauen)</dd>
          <dt className="text-glut-300">R1 / L1</dt><dd>Schneller Angriff / Zweitwaffe, Hotbar mit Steuerkreuz</dd>
          <dt className="text-glut-300">L3</dt><dd>Schleichen</dd>
          <dt className="text-glut-300">R3</dt><dd>Sprinten</dd>
          <dt className="text-glut-300">Touchpad</dt><dd>Karte · lange drücken: Macht aktivieren</dd>
        </dl>
      </details>
    </div>
  )
}
