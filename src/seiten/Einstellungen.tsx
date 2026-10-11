import { useFortschritt } from '../fortschritt/kontext'
import { Button } from '../komponenten/Button'

export function Einstellungen() {
  const { senden } = useFortschritt()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="rune-titel text-2xl text-asche-100">Einstellungen</h1>
      <p className="text-sm text-asche-300">Export und Import kommen in Phase 1.</p>
      <Button
        onClick={() => {
          if (confirm('Gesamten Fortschritt zurücksetzen?')) senden({ typ: 'reset' })
        }}
        className="self-start"
      >
        Fortschritt zurücksetzen
      </Button>
    </div>
  )
}
