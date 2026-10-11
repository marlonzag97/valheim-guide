import { useParams, Link } from 'react-router'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BIOME, biom, guideAbschnitte, itemName } from '../daten/laden'
import { H2_REIHENFOLGE, type BiomId } from '../daten/schema'
import { useFortschritt } from '../fortschritt/kontext'
import { biomStatus } from '../logik/progression'
import { Karte } from '../komponenten/Karte'
import { RunenIcon } from '../komponenten/RunenIcon'
import { RezeptKarte } from '../komponenten/RezeptKarte'
import { Checkliste } from '../komponenten/Checkliste'
import { BossKarte } from '../komponenten/BossKarte'

const ANKER: Record<string, string> = {
  Vorbereitung: 'vorbereitung',
  Gefahren: 'gefahren',
  Rohstoffe: 'rohstoffe',
  Freischaltungen: 'freischaltungen',
  Boss: 'boss',
  Checkliste: 'checkliste',
}

function Prosa({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className="prose-guide text-sm leading-relaxed text-asche-200 [&_p]:mb-3 [&_strong]:text-asche-100">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  )
}

export function BiomSeite() {
  const { id } = useParams()
  const b = biom(id as BiomId)
  const { stand, senden } = useFortschritt()
  if (!b) {
    return (
      <p>
        Biom nicht gefunden. <Link to="/">Zur Startseite</Link>
      </p>
    )
  }
  const status = biomStatus(BIOME, stand)[b.id]
  const prosa = guideAbschnitte(b.id)
  const besiegt = stand.besiegteBosse.has(b.boss.id)

  return (
    <article data-biom={b.id} className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full border"
          style={{ color: 'var(--biom)', borderColor: 'var(--biom)', boxShadow: '0 0 24px color-mix(in srgb, var(--biom) 35%, transparent)' }}
        >
          <RunenIcon name={b.id} groesse={30} />
        </span>
        <div>
          <h1 className="rune-titel text-2xl text-asche-100">
            {b.name.de} <span className="text-base text-asche-300">({b.name.en})</span>
          </h1>
          <p className="text-sm text-asche-300">{b.untertitel}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[var(--biom-akzent)]">
            {status === 'aktiv' ? 'Hier bist du' : status === 'erledigt' ? 'Erledigt' : 'Noch gesperrt'}
            {b.status === 'geruest' && ' · Inhalt folgt'}
          </p>
        </div>
      </header>

      <nav className="-mx-4 overflow-x-auto px-4 text-xs">
        <ul className="flex min-w-max gap-2">
          {H2_REIHENFOLGE.map((h) => (
            <li key={h}>
              <a href={`#${ANKER[h]}`} className="rounded-full border border-white/10 px-3 py-1 text-asche-300 hover:text-asche-100">
                {h}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="vorbereitung" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Vorbereitung</h2>
        <Prosa text={prosa.Vorbereitung} />
        {b.vorbereitung.length > 0 && (
          <ul className="mt-2 flex flex-col gap-2">
            {b.vorbereitung.map((a) => (
              <li key={a.item} className="flex gap-3 rounded-lg border border-white/5 px-3 py-2 text-sm">
                <span className={a.pflicht ? 'text-glut-400' : 'text-asche-300'}>
                  <RunenIcon name={a.pflicht ? 'stern' : 'haken'} groesse={16} />
                </span>
                <span>
                  <span className="text-asche-100">{itemName(a.item)}</span>
                  {!a.pflicht && <span className="ml-1 text-[11px] text-asche-300">(optional)</span>}
                  <span className="block text-asche-300">{a.grund}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="gefahren" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Gefahren</h2>
        <Prosa text={prosa.Gefahren} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {b.gefahren.map((g) => (
            <li key={g.id}>
              <Karte className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="rune-titel text-asche-100">
                    {g.name.de} <span className="text-xs text-asche-300">({g.name.en})</span>
                  </span>
                  <span className="text-xs text-glut-300" aria-label={`Gefahr ${g.gefahr} von 5`}>
                    {'●'.repeat(g.gefahr)}
                    <span className="text-nacht-500">{'●'.repeat(5 - g.gefahr)}</span>
                  </span>
                </div>
                <p className="text-sm text-asche-200">{g.tipp}</p>
                {(g.schwaeche.length > 0 || g.drops.length > 0) && (
                  <p className="text-xs text-asche-300">
                    {g.schwaeche.length > 0 && <>Schwach gegen {g.schwaeche.join(', ')}. </>}
                    {g.drops.length > 0 && <>Lässt fallen: {g.drops.map(itemName).join(', ')}.</>}
                  </p>
                )}
              </Karte>
            </li>
          ))}
        </ul>
      </section>

      <section id="rohstoffe" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Rohstoffe</h2>
        <Prosa text={prosa.Rohstoffe} />
        <ul className="flex flex-col gap-2">
          {b.rohstoffe.map((r) => (
            <li key={r.id} className="rounded-lg border border-white/5 px-3 py-2 text-sm">
              <span className="rune-titel text-asche-100">{r.name.de}</span>{' '}
              <span className="text-xs text-asche-300">({r.name.en})</span>
              {r.werkzeug && <span className="ml-2 rounded-full border border-white/10 px-2 text-[11px] text-asche-300">{r.werkzeug}</span>}
              <p className="text-asche-300">{r.fundort}</p>
              {r.wofuer.length > 0 && <p className="text-xs text-asche-300">Für: {r.wofuer.map(itemName).join(', ')}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section id="freischaltungen" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Freischaltungen</h2>
        <Prosa text={prosa.Freischaltungen} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {b.freischaltungen.map((r) => (
            <li key={r.id}>
              <RezeptKarte rezept={r} />
            </li>
          ))}
        </ul>
      </section>

      <section id="boss" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Boss</h2>
        <Prosa text={prosa.Boss} />
        <BossKarte boss={b.boss} besiegt={besiegt} onToggle={(v) => senden({ typ: 'boss', id: b.boss.id, besiegt: v })} />
      </section>

      <section id="checkliste" className="scroll-mt-4">
        <h2 className="rune-titel mb-3 text-lg text-asche-100">Checkliste</h2>
        <Prosa text={prosa.Checkliste} />
        <Checkliste
          ziele={b.checkliste}
          erledigt={stand.erledigteZiele}
          bossBesiegt={besiegt}
          onZiel={(id, v) => senden({ typ: 'ziel', id, erledigt: v })}
          onBoss={(v) => senden({ typ: 'boss', id: b.boss.id, besiegt: v })}
        />
      </section>
    </article>
  )
}
