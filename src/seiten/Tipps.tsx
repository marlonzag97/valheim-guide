import { motion } from 'motion/react'
import { PHASE_LABEL, TIPPS } from '../daten/tipps'
import { Karte } from '../komponenten/Karte'
import { RunenIcon } from '../komponenten/RunenIcon'
import { listeGestaffelt } from '../stil/animationen'

export function Tipps() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="rune-titel text-2xl text-asche-100">Zehn Dinge, die dir keiner sagt</h1>
        <p className="mt-1 text-sm text-asche-300">Das Spiel erklärt sie nicht. Jeder Punkt spart dir Stunden oder ein paar Tode.</p>
      </header>
      <motion.ol className="flex flex-col gap-3" variants={listeGestaffelt.eltern} initial="zu" animate="auf">
        {TIPPS.tipps.map((t, i) => (
          <motion.li key={t.id} variants={listeGestaffelt.kind}>
            <Karte className="flex gap-4">
              <span className="rune-titel shrink-0 text-3xl leading-none text-glut-400">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex min-w-0 flex-col gap-2">
                <div>
                  <h2 className="rune-titel text-base text-asche-100">{t.titel}</h2>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-asche-300">{PHASE_LABEL[t.phase]}</span>
                </div>
                <p className="text-sm leading-relaxed text-asche-200">{t.text}</p>
                <p className="flex items-start gap-2 text-sm text-glut-300">
                  <RunenIcon name="stern" groesse={16} className="mt-0.5 shrink-0" />
                  <span>{t.wow}</span>
                </p>
              </div>
            </Karte>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
