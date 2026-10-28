import { describe, expect, it } from 'vitest'
import { createGrid, getPixel, linePoints, setPixel } from './pixelGrid'

describe('createGrid', () => {
  it('creates a square grid of transparent pixels', () => {
    const grid = createGrid(4)

    expect(grid.size).toBe(4)
    expect(grid.pixels).toHaveLength(16)
    expect(grid.pixels.every((pixel) => pixel === null)).toBe(true)
  })

  it('rejects invalid sizes', () => {
    expect(() => createGrid(0)).toThrow(RangeError)
    expect(() => createGrid(2.5)).toThrow(RangeError)
  })
})

describe('getPixel and setPixel', () => {
  it('stores colors by coordinate', () => {
    const grid = createGrid(4)

    expect(setPixel(grid, 2, 3, '#ff0000')).toBe(true)
    expect(getPixel(grid, 2, 3)).toBe('#ff0000')
    expect(getPixel(grid, 3, 2)).toBeNull()
  })

  it('reports whether a pixel actually changed', () => {
    const grid = createGrid(4)

    expect(setPixel(grid, 1, 1, '#000000')).toBe(true)
    expect(setPixel(grid, 1, 1, '#000000')).toBe(false)
    expect(setPixel(grid, 1, 1, null)).toBe(true)
  })

  it('ignores out-of-bounds coordinates', () => {
    const grid = createGrid(4)

    expect(setPixel(grid, -1, 0, '#000000')).toBe(false)
    expect(setPixel(grid, 4, 0, '#000000')).toBe(false)
    expect(getPixel(grid, -1, 0)).toBeNull()
    expect(getPixel(grid, 0, 4)).toBeNull()
  })
})

describe('linePoints', () => {
  it('returns a single point for a zero-length line', () => {
    expect(linePoints({ x: 3, y: 2 }, { x: 3, y: 2 })).toEqual([{ x: 3, y: 2 }])
  })

  it('includes both endpoints on a horizontal line', () => {
    expect(linePoints({ x: 0, y: 0 }, { x: 3, y: 0 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ])
  })

  it('draws a diagonal without gaps', () => {
    expect(linePoints({ x: 0, y: 0 }, { x: 3, y: 3 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ])
  })

  it('keeps every step adjacent for a shallow line', () => {
    const points = linePoints({ x: 0, y: 0 }, { x: 7, y: 2 })

    expect(points[0]).toEqual({ x: 0, y: 0 })
    expect(points.at(-1)).toEqual({ x: 7, y: 2 })

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1]
      const current = points[index]

      expect(Math.abs(current.x - previous.x)).toBeLessThanOrEqual(1)
      expect(Math.abs(current.y - previous.y)).toBeLessThanOrEqual(1)
    }
  })
})
