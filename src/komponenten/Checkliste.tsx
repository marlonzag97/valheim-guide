import type { Zwischenziel } from '../daten/schema'
import { RunenIcon } from './RunenIcon'

interface Props {
  ziele: Zwischenziel[]
  erledigt: ReadonlySet<string>
  bossBesiegt: boolean
  onZiel: (id: string, erledigt: boolean) => void
  onBoss: (besiegt: boolean) => void
}

export function Checkliste({ ziele, erledigt, bossBesiegt, onZiel, onBoss }: Props) {
  return (
    <ol className="flex flex-col gap-2">
      {ziele.map((z, i) => {
        const istBoss = z.bedingung === 'boss'
        const an = istBoss ? bossBesiegt : erledigt.has(z.id)
        return (
          <li key={z.id}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 px-3 py-2 transition-colors hover:bg-nacht-800 ${
                an ? 'text-asche-300 line-through decoration-glut-500/60' : 'text-asche-100'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={an}
                onChange={(e) => (istBoss ? onBoss(e.target.checked) : onZiel(z.id, e.target.checked))}
              />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                  an ? 'border-glut-400 bg-glut-500 text-nacht-950' : 'border-asche-300/40'
                }`}
                aria-hidden="true"
              >
                {an && <RunenIcon name="haken" groesse={14} />}
              </span>
              <span className="flex-1 text-sm">
                <span className="mr-2 text-asche-300">{i + 1}.</span>
                {z.text}
              </span>
              {istBoss && (
                <span className="text-[var(--biom-akzent)]">
                  <RunenIcon name="boss" groesse={18} />
                </span>
              )}
            </label>
          </li>
        )
      })}
    </ol>
  )
}
