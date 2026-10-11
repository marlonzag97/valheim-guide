import { test, expect } from '@playwright/test'

const SEITEN = [
  ['start', '#/'],
  ['wiesen', '#/biom/wiesen'],
  ['schwarzwald', '#/biom/schwarzwald'],
  ['suche', '#/suche?q=hirsch'],
  ['einstellungen', '#/einstellungen'],
] as const

for (const [name, hash] of SEITEN) {
  test(`Screenshot ${name}`, async ({ page }, info) => {
    await page.goto(hash)
    await page.waitForTimeout(400)
    await expect(page.locator('main')).toBeVisible()
    await page.screenshot({ path: `screenshots/${info.project.name}-${name}.png`, fullPage: true })
  })
}

test('Boss-Häkchen schaltet Biom weiter', async ({ page }) => {
  await page.goto('#/biom/wiesen')
  await page.getByRole('button', { name: /Eikthyr besiegt\?/ }).click()
  await page.goto('#/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Schwarzwald')
})
