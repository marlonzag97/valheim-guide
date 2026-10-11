import { act, render } from '@testing-library/react'
import { readdirSync, readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RunenIcon } from '../src/komponenten/RunenIcon'
import { RunenKreis } from '../src/komponenten/RunenKreis'

const zustand = (c: HTMLElement) => c.querySelector('[data-runenkreis]')?.getAttribute('data-runenkreis')

describe('RunenKreis', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))
  afterEach(() => vi.useRealTimers())

  it('zeichnet bei false → true, meldet nach 900 ms und bleibt als Ring stehen', () => {
    const onFertig = vi.fn()
    const { container, rerender } = render(
      <RunenKreis aktiv={false} biomId="wiesen" onFertig={onFertig}>
        <span>Eikthyr</span>
      </RunenKreis>,
    )
    expect(zustand(container)).toBe('aus')
    expect(container.querySelector('svg')).toBeNull()

    rerender(
      <RunenKreis aktiv biomId="wiesen" onFertig={onFertig}>
        <span>Eikthyr</span>
      </RunenKreis>,
    )
    expect(zustand(container)).toBe('zeichnet')
    expect(container.querySelector('svg[data-biom="wiesen"]')).not.toBeNull()

    act(() => vi.advanceTimersByTime(899))
    expect(onFertig).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onFertig).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(600))
    expect(zustand(container)).toBe('steht')
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('startet bereits aktiv ohne Animation und ohne Meldung', () => {
    const onFertig = vi.fn()
    const { container } = render(<RunenKreis aktiv biomId="sumpf" onFertig={onFertig} />)
    expect(zustand(container)).toBe('steht')
    act(() => vi.advanceTimersByTime(2000))
    expect(onFertig).not.toHaveBeenCalled()
  })

  it('verschwindet sofort bei true → false', () => {
    const onFertig = vi.fn()
    const { container, rerender } = render(<RunenKreis aktiv={false} biomId="berge" onFertig={onFertig} />)
    rerender(<RunenKreis aktiv biomId="berge" onFertig={onFertig} />)
    rerender(<RunenKreis aktiv={false} biomId="berge" onFertig={onFertig} />)
    expect(zustand(container)).toBe('aus')
    expect(container.querySelector('svg')).toBeNull()
    act(() => vi.advanceTimersByTime(2000))
    expect(onFertig).not.toHaveBeenCalled()
  })
})

describe('RunenIcon', () => {
  const dateien = readdirSync('public/icons').filter((f) => f.endsWith('.svg') && f !== 'rune.svg')

  it('liefert mindestens das geforderte Set', () => {
    const pflicht = ['wiesen', 'schwarzwald', 'sumpf', 'berge', 'ebenen', 'nebellande', 'aschlande', 'tiefer-norden',
      'eikthyr', 'the-elder', 'bonemass', 'moder', 'yagluth', 'the-queen', 'fader', 'kall-fimbulbringer',
      'werkbank', 'schmiede', 'nahrung', 'ruestung', 'waffe', 'schild', 'met', 'schloss', 'haken', 'suche',
      'pfeil', 'stern', 'boss', 'einstellungen', 'export', 'import', 'reset']
    for (const name of pflicht) expect(dateien).toContain(`${name}.svg`)
  })

  it('SVG-Dateien und Komponente zeichnen dieselben Pfade', () => {
    for (const datei of dateien) {
      const svg = readFileSync(`public/icons/${datei}`, 'utf8')
      expect(svg).toContain('stroke="currentColor"')
      expect(svg).toContain('stroke-width="2"')
      const ausDatei = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1])
      const { container } = render(<RunenIcon name={datei.replace('.svg', '')} />)
      const ausKomponente = [...container.querySelectorAll('path')].map((p) => p.getAttribute('d'))
      expect(ausKomponente, datei).toEqual(ausDatei)
    }
  })
})
