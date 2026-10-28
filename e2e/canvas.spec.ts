import { expect, test, type Locator } from '@playwright/test'

const GRID_SIZE = 64

async function setColor(input: Locator, value: string) {
  await input.evaluate((element, next) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    if (!setter) throw new Error('HTMLInputElement value setter unavailable')

    setter.call(element, next)
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}

test('paints, erases, and samples colors', async ({ page }) => {
  await page.goto('/')

  const canvas = page.getByRole('img', { name: 'Pixel art canvas' })
  await expect(canvas).toBeVisible()

  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas has no bounding box')

  const pointFor = (x: number, y: number) => ({
    x: box.x + ((x + 0.5) / GRID_SIZE) * box.width,
    y: box.y + ((y + 0.5) / GRID_SIZE) * box.height,
  })

  const pixelAt = (x: number, y: number) =>
    canvas.evaluate((element, point) => {
      const context = (element as HTMLCanvasElement).getContext('2d')
      if (!context) throw new Error('2D context unavailable')
      return Array.from(context.getImageData(point.x, point.y, 1, 1).data)
    }, { x, y })

  const start = pointFor(8, 8)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(pointFor(14, 8).x, start.y, { steps: 5 })
  await page.mouse.up()

  expect((await pixelAt(8, 8))[3]).toBe(255)
  expect((await pixelAt(14, 8))[3]).toBe(255)

  await page.getByRole('button', { name: 'Eraser' }).click()
  await expect(page.getByRole('button', { name: 'Eraser' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  await page.mouse.click(start.x, start.y)
  expect((await pixelAt(8, 8))[3]).toBe(0)

  await page.getByRole('button', { name: 'Pencil' }).click()
  const colorInput = page.getByLabel('Drawing color')
  await setColor(colorInput, '#ff0000')

  const redPoint = pointFor(20, 20)
  await page.mouse.click(redPoint.x, redPoint.y)
  expect(await pixelAt(20, 20)).toEqual([255, 0, 0, 255])

  await setColor(colorInput, '#0000ff')
  await page.getByRole('button', { name: 'Color picker' }).click()
  await page.mouse.click(redPoint.x, redPoint.y)

  await expect(colorInput).toHaveValue('#ff0000')
  await expect(
    page.getByRole('button', { name: 'Color picker' }),
  ).toHaveAttribute('aria-pressed', 'true')
})
