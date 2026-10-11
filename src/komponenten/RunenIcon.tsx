// Phase-0-Set. Arbeiter B (Phase 1) liefert das vollständige SVG-Set unter public/icons und ersetzt die Pfade hier.
import type { SVGProps } from 'react'

const PFADE: Record<string, string> = {
  wiesen: 'M4 20h16M8 20V9l4-5 4 5v11M12 4v16',
  schwarzwald: 'M12 3l6 8h-3l4 6h-5v4h-4v-4H5l4-6H6z',
  sumpf: 'M3 18c3-2 6-2 9 0s6 2 9 0M12 4v10M8 8l4-4 4 4',
  berge: 'M3 20l6-12 3 5 3-7 6 14zM9 8l2 3',
  ebenen: 'M3 20h18M6 20V9l3 3V7l3 3V6l3 3v11',
  nebellande: 'M4 9h16M3 13h18M5 17h14M12 3v3',
  aschlande: 'M12 3c3 4 5 6 5 10a5 5 0 0 1-10 0c0-2 1-3 2-5 0 2 1 3 2 3 0-3 0-5 1-8z',
  'tiefer-norden': 'M12 2v20M4 7l16 10M4 17L20 7M8 4l4 3 4-3M8 20l4-3 4 3',
  schloss: 'M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z',
  haken: 'M4 13l5 5L20 7',
  suche: 'M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM15 15l5 5',
  pfeil: 'M5 12h14M13 6l6 6-6 6',
  stern: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z',
  boss: 'M4 6l4 3 4-6 4 6 4-3-2 13H6zM9 15h6',
  werkbank: 'M3 9h18M5 9v10M19 9v10M8 5l4-2 4 2M12 3v6',
  nahrung: 'M6 4v8a6 6 0 0 0 12 0V4M9 4v4M15 4v4',
  einstellungen: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
}

export type IconName = keyof typeof PFADE

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName | string
  groesse?: number
}

export function RunenIcon({ name, groesse = 24, ...rest }: Props) {
  const d = PFADE[name] ?? PFADE.stern
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
