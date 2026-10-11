import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  art?: 'primaer' | 'sekundaer' | 'leise'
}

export function Button({ art = 'sekundaer', className = '', ...rest }: Props) {
  const basis =
    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-glut-400 disabled:opacity-50'
  const stil = {
    primaer: 'bg-glut-500 text-nacht-950 hover:bg-glut-400',
    sekundaer: 'bg-nacht-700 text-asche-100 hover:bg-nacht-600 border border-white/10',
    leise: 'text-asche-300 hover:text-asche-100',
  }[art]
  return <button className={`${basis} ${stil} ${className}`} {...rest} />
}
