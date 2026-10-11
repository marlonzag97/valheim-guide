import type { Boss } from '../daten/schema'
import { itemName } from '../daten/laden'
import { Button } from './Button'
import { Karte } from './Karte'
import { RunenIcon } from './RunenIcon'
import { RunenKreis } from './RunenKreis'

interface Props {
  boss: Boss
  biomId: string
  besiegt: boolean
  onToggle: (besiegt: boolean) => void
}

export function BossKarte({ boss, biomId, besiegt, onToggle }: Props) {
  return (
    <Karte className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center">
          <RunenKreis aktiv={besiegt} biomId={biomId}>
            <span className="flex h-10 w-10 items-center justify-center text-[var(--biom-akzent)]">
              <RunenIcon name={boss.id} groesse={30} />
            </span>
          </RunenKreis>
        </span>
        <div>
          <div className="rune-titel text-lg text-asche-100">{boss.name.de}</div>
          <div className="text-xs text-asche-300">{boss.name.en}</div>
        </div>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-asche-300">Altar</dt>
        <dd>{boss.altar}</dd>
        <dt className="text-asche-300">Opfergabe</dt>
        <dd>{boss.opfergabe.map((o) => `${o.menge}× ${itemName(o.item)}`).join(', ')}</dd>
        <dt className="text-asche-300">Belohnung</dt>
        <dd>{boss.belohnung.map(itemName).join(', ')}</dd>
        <dt className="text-asche-300">Macht</dt>
        <dd>
          <span className="text-glut-300">{boss.macht.name}</span> · {boss.macht.wirkung}
        </dd>
        {boss.leben && (
          <>
            <dt className="text-asche-300">Leben</dt>
            <dd>{boss.leben}</dd>
          </>
        )}
      </dl>
      <Button art={besiegt ? 'sekundaer' : 'primaer'} onClick={() => onToggle(!besiegt)} className="self-start">
        <RunenIcon name={besiegt ? 'haken' : 'boss'} groesse={16} />
        {besiegt ? `${boss.name.de} besiegt` : `${boss.name.de} besiegt?`}
      </Button>
    </Karte>
  )
}
