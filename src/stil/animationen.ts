// Wiederverwendbare motion-Varianten. Nutzung: <motion.div variants={karteAuf} initial="zu" animate="auf" exit="zu" />
import type { Transition, Variants } from 'motion/react'

/** Standarddauer für Aufklappen, Hover, kleine Übergänge (Sekunden). */
export const DAUER_KURZ = 0.2
/** Dauer des Runenkreises beim Boss-Häkchen (Sekunden). */
export const DAUER_BOSS = 0.9
/** Abstand zwischen gestaffelten Kindern (Sekunden). */
export const STAFFEL = 0.04

export const EASE_RUNE: Transition['ease'] = [0.22, 1, 0.36, 1]

/** Karte klappt auf: Zustände `zu` / `auf`. Für Höhe zusätzlich `layout` am Element setzen. */
export const karteAuf: Variants = {
  zu: { opacity: 0, y: -6, transition: { duration: DAUER_KURZ, ease: EASE_RUNE } },
  auf: { opacity: 1, y: 0, transition: { duration: DAUER_KURZ, ease: EASE_RUNE } },
}

/** Elternliste: Zustände `zu` / `auf`; Kinder bekommen `listeGestaffelt.kind`-Varianten. */
export const listeGestaffelt = {
  eltern: {
    zu: { transition: { staggerChildren: STAFFEL, staggerDirection: -1 } },
    auf: { transition: { staggerChildren: STAFFEL } },
  },
  kind: {
    zu: { opacity: 0, y: 4, transition: { duration: DAUER_KURZ } },
    auf: { opacity: 1, y: 0, transition: { duration: DAUER_KURZ, ease: EASE_RUNE } },
  },
} satisfies Record<'eltern' | 'kind', Variants>

/** Puls für neu freigeschaltete Rezepte: Zustände `ruhe` / `neu` (3 Pulse, dann Ruhe). */
export const leuchten: Variants = {
  ruhe: { boxShadow: '0 0 0px 0px rgb(233 168 90 / 0)' },
  neu: {
    boxShadow: [
      '0 0 0px 0px rgb(233 168 90 / 0)',
      '0 0 18px 2px rgb(233 168 90 / 0.45)',
      '0 0 0px 0px rgb(233 168 90 / 0)',
    ],
    transition: { duration: 1.2, ease: 'easeInOut', repeat: 2 },
  },
}
