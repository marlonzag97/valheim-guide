// Der eine große Moment: Boss-Häkchen → Runenkreis zeichnet sich, Glut-Puls, dezenter Ring bleibt.
// Am besten um ein kompaktes Element legen (Boss-Rune, Haken-Button); der Kreis umschließt die Kinder vollständig.
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { DAUER_BOSS, EASE_RUNE } from '../stil/animationen'

interface Props {
  aktiv: boolean
  biomId: string
  onFertig?: () => void
  children?: ReactNode
}

type Phase = 'aus' | 'zeichnet' | 'steht'

/** Dauer bis der Glut-Puls abgeklungen ist und der Ring in den Ruhezustand geht (ms). */
const GESAMT_MS = 1400
const ABSTAND = 10
const DEZENT = 0.55

// Acht Runenzeichen in einem 10er-Raster um (0,0), eigene Formen, keine Spiel-Glyphen.
const RUNEN = [
  'M-2 5V-5M-2-5l4 2.5M-2-1l4 2.5',
  'M-3 5V-5l6 3v7',
  'M-2 5V-5M-2-3l4 3-4 3',
  'M2-5l-4 5 4 5',
  'M-3 5V-5l5 2.5-5 2.5 5 5',
  'M-3-5l6 10M3-5l-6 10',
  'M0 5V-5M-3-4l3 3 3-3',
  'M-3 5V-5M3 5V-5M-3-2l6 4',
]

export function RunenKreis({ aktiv, biomId, onFertig, children }: Props) {
  const reduziert = useReducedMotion() ?? false
  const [phase, setPhase] = useState<Phase>(aktiv ? 'steht' : 'aus')
  const [vorher, setVorher] = useState(aktiv)
  if (aktiv !== vorher) {
    setVorher(aktiv)
    setPhase(aktiv ? 'zeichnet' : 'aus')
  }

  const fertigRef = useRef(onFertig)
  useEffect(() => {
    fertigRef.current = onFertig
  }, [onFertig])

  useEffect(() => {
    if (phase !== 'zeichnet') return
    const t1 = setTimeout(() => fertigRef.current?.(), reduziert ? 0 : DAUER_BOSS * 1000)
    const t2 = setTimeout(() => setPhase('steht'), reduziert ? 0 : GESAMT_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [phase, reduziert])

  const huelle = useRef<HTMLSpanElement>(null)
  const [durchmesser, setDurchmesser] = useState(0)
  const sichtbar = phase !== 'aus'
  useLayoutEffect(() => {
    const el = huelle.current
    if (!sichtbar || !el) return
    const messen = () => {
      const { width, height } = el.getBoundingClientRect()
      setDurchmesser(Math.ceil(Math.hypot(width, height)) + ABSTAND * 2)
    }
    messen()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(messen)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sichtbar])

  const animiert = phase === 'zeichnet' && !reduziert

  return (
    <span ref={huelle} className="relative isolate inline-flex" data-runenkreis={phase}>
      {sichtbar && durchmesser > 0 && (
        <Kreis d={durchmesser} biomId={biomId} animiert={animiert} />
      )}
      {children}
    </span>
  )
}

function Kreis({ d, biomId, animiert }: { d: number; biomId: string; animiert: boolean }) {
  const c = d / 2
  const rAussen = c - 1.5
  const band = Math.min(16, Math.max(10, d * 0.14))
  const rHaupt = rAussen - 3
  const rInnen = rHaupt - band
  const rRune = (rHaupt + rInnen) / 2
  const k = (band - 3) / 10
  const pos = { left: '50%', top: '50%', width: d, height: d, translate: '-50% -50%' } as const

  const zeichne = (verzoegerung: number, dauer: number) =>
    animiert
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { delay: verzoegerung, duration: dauer, ease: EASE_RUNE },
            opacity: { delay: verzoegerung, duration: 0.05 },
          },
        }
      : { initial: false as const, animate: { pathLength: 1, opacity: 1 } }

  return (
    <>
      {animiert && (
        <motion.span
          aria-hidden="true"
          data-biom={biomId}
          className="pointer-events-none absolute -z-10 rounded-full"
          style={{
            ...pos,
            boxShadow: '0 0 28px 6px var(--biom-akzent), inset 0 0 18px var(--biom-akzent)',
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.85, 1.04, 1] }}
          transition={{ delay: DAUER_BOSS * 0.55, duration: DAUER_BOSS, times: [0, 0.35, 1], ease: 'easeOut' }}
        />
      )}
      <motion.svg
        aria-hidden="true"
        data-biom={biomId}
        className="pointer-events-none absolute overflow-visible"
        style={pos}
        viewBox={`0 0 ${d} ${d}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animiert ? { opacity: 1 } : false}
        animate={animiert ? { opacity: [1, 1, DEZENT] } : { opacity: DEZENT }}
        transition={{ duration: 1.4, times: [0, 0.65, 1] }}
      >
        <g transform={`rotate(-90 ${c} ${c})`}>
          <motion.circle cx={c} cy={c} r={rHaupt} stroke="var(--biom-akzent)" strokeWidth={2} {...zeichne(0, DAUER_BOSS)} />
          <motion.circle cx={c} cy={c} r={rAussen} stroke="var(--biom-akzent)" strokeWidth={1} strokeOpacity={0.6} {...zeichne(0.15, DAUER_BOSS - 0.15)} />
          <g transform={`translate(0 ${d}) scale(1 -1)`}>
            <motion.circle cx={c} cy={c} r={rInnen} stroke="var(--biom)" strokeWidth={1} strokeOpacity={0.8} {...zeichne(0.1, DAUER_BOSS - 0.2)} />
          </g>
        </g>
        {RUNEN.map((rune, i) => {
          const winkel = i * 45
          const rad = ((winkel - 90) * Math.PI) / 180
          const x = c + rRune * Math.cos(rad)
          const y = c + rRune * Math.sin(rad)
          return (
            <g key={rune} transform={`translate(${x} ${y}) rotate(${winkel}) scale(${k})`}>
              <motion.path d={rune} stroke="var(--biom)" strokeWidth={1.6 / k} {...zeichne(0.12 + i * 0.07, 0.24)} />
            </g>
          )
        })}
      </motion.svg>
    </>
  )
}
