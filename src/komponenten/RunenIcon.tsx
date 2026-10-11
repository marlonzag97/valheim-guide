// Runen-Icon-Set: Strichstärke 2, 24px-Raster, stroke currentColor, fill none.
// Jedes Icon liegt zusätzlich als Datei unter public/icons/<name>.svg (gleiche Pfade).
import type { SVGProps } from 'react'

const PFADE = {
  wiesen: ['M3 20h18', 'M7 20c0-3-1-6-3-8', 'M10 20c0-5 0-9-2-12', 'M14 20c0-5 1-8 3-11', 'M17 20c0-2 1-4 3-5', 'M12 20v-6'],
  schwarzwald: 'M12 3l6 8h-3l4 6h-5v4h-4v-4H5l4-6H6z',
  sumpf: ['M3 19c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0', 'M12 16V4', 'M12 9L8 6', 'M12 7l4-3', 'M12 12l3-2'],
  berge: ['M2 20L9 7l4 7 3-5 6 11z', 'M7.3 10.2l2 1.5 1.7-1.2'],
  ebenen: ['M3 21h18', 'M12 21V4', 'M12 8L9 5', 'M12 8l3-3', 'M12 12L9 9', 'M12 12l3-3', 'M12 16l-3-3', 'M12 16l3-3'],
  nebellande: ['M3 9h7', 'M14 9h7', 'M5 13h14', 'M3 17h8', 'M15 17h6', 'M10 9l2-5 2 5'],
  aschlande: ['M3 20l6-9h6l6 9', 'M12 11V8', 'M9 6L8 3', 'M15 6l1-3', 'M10 20l2-4 2 4'],
  'tiefer-norden': ['M12 2v20', 'M4 7l16 10', 'M4 17L20 7', 'M8 4l4 3 4-3', 'M8 20l4-3 4 3'],
  eikthyr: ['M9 11L6 7V2', 'M6 7L3 5', 'M6 7l3-3', 'M15 11l3-4V2', 'M18 7l3-2', 'M18 7l-3-3', 'M8 11h8l-2 6-2 3-2-3z', 'M12.8 12.5l-1.6 2.2h1.6l-1.6 2.2'],
  'the-elder': ['M12 21V3', 'M12 6L9 3', 'M12 6l3-3', 'M12 12L6 9V6', 'M6 9L3 8', 'M12 12l6-3V6', 'M18 9l3-1', 'M8 21l4-3 4 3'],
  bonemass: ['M3.5 20c-1-4 1-8 4.5-9 1-4 7-4 8 0 3.5 1 5.5 5 4.5 9z', 'M8 15h8', 'M8 13.5v3', 'M16 13.5v3', 'M10 7.5h.01', 'M14 7.5h.01'],
  moder: ['M12 6v10l-2 3 3 2', 'M12 9C9 6 5 5 2 6c2 1 3 3 3 5 2-1 4-1 7 0', 'M12 9c3-3 7-4 10-3-2 1-3 3-3 5-2-1-4-1-7 0', 'M10 3l2 3 2-3'],
  yagluth: ['M7 8V3l2.5 2L12 2l2.5 3L17 3v5z', 'M7 8v5a5 5 0 0 0 3 4.6V21h4v-3.4a5 5 0 0 0 3-4.6V8', 'M9.5 12h1', 'M13.5 12h1', 'M12 21v-2'],
  'the-queen': ['M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z', 'M11 4L9 1', 'M13 4l2-3', 'M12 8l-2 3 2 2 2-2z', 'M12 13c-3 0-4 3-4 5s2 4 4 4 4-2 4-4-1-5-4-5z', 'M10 11L5 9', 'M10 12l-5 3', 'M14 11l5-2', 'M14 12l5 3'],
  fader: ['M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-4 3-5 4-8z', 'M10.5 10h.01', 'M13.5 10h.01', 'M9 14l-2 7', 'M15 14l2 7', 'M8 12l-4-2', 'M16 12l4-2'],
  'kall-fimbulbringer': ['M12 4l4 7-4 10-4-10z', 'M8 11h8', 'M9 8L6 6', 'M15 8l3-2', 'M3 3h3v3H3z', 'M18 3h3v3h-3z', 'M12 4V2'],
  werkbank: ['M3 12h18', 'M5 12v8', 'M19 12v8', 'M5 16h14', 'M8 9l6-5', 'M12 2.5l3 3'],
  schmiede: ['M3 7h13a5 4 0 0 0 5 3v1h-6l-1 3 3 5H7l3-5-1-3H5a2 2 0 0 1-2-2z', 'M18 2l-1 2', 'M21 3l-2 2'],
  nahrung: ['M3 12h18c0 5-4 8-9 8s-9-3-9-8z', 'M9 9c-1-2 1-3 0-5', 'M15 9c-1-2 1-3 0-5'],
  ruestung: ['M7 3L3 6l1 6 3-1v10h10V11l3 1 1-6-4-3c-1 2-3 3-5 3S8 5 7 3z', 'M12 6v15', 'M7 15h10'],
  waffe: ['M3 3h4l9.5 9.5-4 4L3 7z', 'M11 19l8-8', 'M17 17l3 3', 'M19 22l3-3'],
  schild: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z', 'M12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z', 'M3 12h7', 'M14 12h7'],
  met: ['M4 6l4-1c1 6 5 10 12 11l-1 4C11 19 5 14 4 6z', 'M6.5 10.5l4-1.5', 'M10 15l3-2.5'],
  schloss: ['M7 11V8a5 5 0 0 1 10 0v3', 'M5 11h14v10H5z', 'M12 15v2'],
  haken: 'M4 13l5 5L20 7',
  suche: ['M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z', 'M15 15l5 5'],
  pfeil: ['M5 12h14', 'M13 6l6 6-6 6'],
  stern: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z',
  boss: ['M6 14a6 6 0 0 1 12 0v6H6z', 'M6 13C3 12 2 9 3 5', 'M18 13c3-1 4-4 3-8', 'M12 14v6', 'M9 17h.01', 'M15 17h.01'],
  einstellungen: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3', 'M5 5l2 2', 'M17 17l2 2', 'M5 19l2-2', 'M17 7l2-2'],
  export: ['M12 15V3', 'M7 8l5-5 5 5', 'M4 15v5h16v-5'],
  import: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 15v5h16v-5'],
  reset: ['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5'],
} satisfies Record<string, string | readonly string[]>

export type IconName = keyof typeof PFADE

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName | (string & {})
  groesse?: number
}

const istIcon = (name: string): name is IconName => Object.hasOwn(PFADE, name)

export function RunenIcon({ name, groesse = 24, ...rest }: Props) {
  const eintrag: string | readonly string[] = PFADE[istIcon(name) ? name : 'stern']
  const pfade = typeof eintrag === 'string' ? [eintrag] : eintrag
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
      {pfade.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
