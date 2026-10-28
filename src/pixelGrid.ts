export interface Point {
  x: number
  y: number
}

export interface PixelGrid {
  readonly size: number
  readonly pixels: Array<string | null>
}

export function createGrid(size: number): PixelGrid {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('Grid size must be a positive integer')
  }

  return {
    size,
    pixels: new Array<string | null>(size * size).fill(null),
  }
}

function indexOf(grid: PixelGrid, x: number, y: number): number {
  if (!Number.isInteger(x) || !Number.isInteger(y)) return -1
  if (x < 0 || y < 0 || x >= grid.size || y >= grid.size) return -1
  return y * grid.size + x
}

export function getPixel(grid: PixelGrid, x: number, y: number): string | null {
  const index = indexOf(grid, x, y)
  return index === -1 ? null : grid.pixels[index]
}

export function setPixel(
  grid: PixelGrid,
  x: number,
  y: number,
  color: string | null,
): boolean {
  const index = indexOf(grid, x, y)
  if (index === -1 || grid.pixels[index] === color) return false

  grid.pixels[index] = color
  return true
}

export function linePoints(from: Point, to: Point): Point[] {
  const points: Point[] = []
  let x = from.x
  let y = from.y

  const deltaX = Math.abs(to.x - x)
  const stepX = x < to.x ? 1 : -1
  const deltaY = -Math.abs(to.y - y)
  const stepY = y < to.y ? 1 : -1
  let error = deltaX + deltaY

  while (true) {
    points.push({ x, y })
    if (x === to.x && y === to.y) break

    const doubledError = 2 * error
    if (doubledError >= deltaY) {
      error += deltaY
      x += stepX
    }
    if (doubledError <= deltaX) {
      error += deltaX
      y += stepY
    }
  }

  return points
}
