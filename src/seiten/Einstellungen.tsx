import { useState, type ChangeEvent } from 'react'
import { useFortschritt } from '../fortschritt/kontext'
import { exportieren, importieren } from '../fortschritt/reducer'
import { Button } from '../komponenten/Button'
import { Karte } from '../komponenten/Karte'

const DATEINAME = 'valheim-guide-fortschritt.json'

type Meldung = { art: 'ok' | 'fehler'; text: string } | null

function MeldungZeile({ meldung }: { meldung: Meldung }) {
  if (!meldung) return null
  return (
    <p role="status" className={`text-sm ${meldung.art === 'ok' ? 'text-glut-300' : 'text-biom-aschlande'}`}>
      {meldung.text}
    </p>
  )
}

export function Einstellungen() {
  const { stand, senden } = useFortschritt()
  const [exportText, setExportText] = useState('')
  const [importText, setImportText] = useState('')
  const [meldung, setMeldung] = useState<Meldung>(null)

  function exportStarten() {
    const text = JSON.stringify(exportieren(stand), null, 2)
    setExportText(text)
    try {
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = DATEINAME
      document.body.append(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      /* Download blockiert: Text unten bleibt zum Kopieren */
    }
  }

  function importAusfuehren(text: string) {
    const r = importieren(text)
    if (!r.ok) {
      setMeldung({ art: 'fehler', text: r.fehler })
      return
    }
    senden({ typ: 'import', daten: r.daten })
    setImportText('')
    setMeldung({
      art: 'ok',
      text: `Fortschritt geladen: ${r.daten.besiegteBosse.length} Bosse, ${r.daten.erledigteZiele.length} Ziele.`,
    })
  }

  async function dateiGewaehlt(e: ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0]
    e.target.value = ''
    if (!datei) return
    try {
      importAusfuehren(await datei.text())
    } catch {
      setMeldung({ art: 'fehler', text: 'Datei konnte nicht gelesen werden.' })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="rune-titel text-2xl text-asche-100">Einstellungen</h1>

      <Karte className="flex flex-col gap-3">
        <h2 className="rune-titel text-sm uppercase tracking-[0.2em] text-asche-300">Fortschritt exportieren</h2>
        <p className="text-sm text-asche-300">
          Lädt <code className="text-asche-100">{DATEINAME}</code> herunter. Am Handy den Text unten kopieren.
        </p>
        <Button art="primaer" className="self-start" onClick={exportStarten}>
          Fortschritt exportieren
        </Button>
        {exportText && (
          <textarea
            readOnly
            aria-label="Export als Text"
            value={exportText}
            onFocus={(e) => e.currentTarget.select()}
            rows={6}
            className="w-full rounded-lg border border-white/10 bg-nacht-900 p-3 font-mono text-xs text-asche-100"
          />
        )}
      </Karte>

      <Karte className="flex flex-col gap-3">
        <h2 className="rune-titel text-sm uppercase tracking-[0.2em] text-asche-300">Fortschritt importieren</h2>
        <p className="text-sm text-asche-300">Ersetzt den aktuellen Fortschritt.</p>
        <label className="flex flex-col gap-1 text-sm text-asche-200">
          Datei wählen
          <input
            type="file"
            accept="application/json,.json"
            onChange={dateiGewaehlt}
            className="text-sm text-asche-300 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-nacht-700 file:px-3 file:py-1.5 file:text-asche-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-asche-200">
          oder JSON einfügen
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={4}
            placeholder='{"version":1,"besiegteBosse":[],"erledigteZiele":[]}'
            className="w-full rounded-lg border border-white/10 bg-nacht-900 p-3 font-mono text-xs text-asche-100 placeholder:text-asche-300/50"
          />
        </label>
        <Button className="self-start" onClick={() => importAusfuehren(importText)} disabled={!importText.trim()}>
          Fortschritt importieren
        </Button>
        <MeldungZeile meldung={meldung} />
      </Karte>

      <Karte className="flex flex-col gap-3">
        <h2 className="rune-titel text-sm uppercase tracking-[0.2em] text-asche-300">Zurücksetzen</h2>
        <Button
          className="self-start"
          onClick={() => {
            if (confirm('Gesamten Fortschritt zurücksetzen?')) {
              senden({ typ: 'reset' })
              setExportText('')
              setMeldung({ art: 'ok', text: 'Fortschritt zurückgesetzt.' })
            }
          }}
        >
          Fortschritt zurücksetzen
        </Button>
      </Karte>

      <section className="flex flex-col gap-1 text-sm text-asche-300">
        <p>
          Spielversion: <span className="text-asche-100">Valheim 1.0.17 (PS5)</span>
        </p>
        <p>Fan-Projekt, kein offizielles Produkt.</p>
      </section>
    </div>
  )
}
