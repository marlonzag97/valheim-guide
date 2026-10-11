import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  leuchtet?: boolean
}

export function Karte({ children, leuchtet, className = '', ...rest }: Props) {
  return (
    <div
      className={`material-holz relative rounded-karte p-4 ${leuchtet ? 'ring-1 ring-[var(--biom-akzent)] shadow-glut' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
