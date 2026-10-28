import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  createGrid,
  getPixel,
  linePoints,
  setPixel,
  type PixelGrid,
  type Point,
} from './pixelGrid'
import type { Tool } from './tools'

export const GRID_SIZE = 64

interface PixelCanvasProps {
  tool: Tool
  color: string
  onPickColor: (color: string) => void
}

export function PixelCanvas({ tool, color, onPickColor }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid] = useState<PixelGrid>(() => createGrid(GRID_SIZE))
  const drawingRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return

    context.imageSmoothingEnabled = false
    context.clearRect(0, 0, GRID_SIZE, GRID_SIZE)
  }, [])

  function pointFromEvent(event: PointerEvent<HTMLCanvasElement>): Point | null {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * GRID_SIZE)
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * GRID_SIZE)

    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return null
    return { x, y }
  }

  function paintAt(point: Point, previous: Point | null) {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return

    if (tool === 'picker') {
      const picked = getPixel(grid, point.x, point.y)
      if (picked) onPickColor(picked)
      return
    }

    const nextColor = tool === 'eraser' ? null : color
    const points = previous ? linePoints(previous, point) : [point]

    for (const pixel of points) {
      if (!setPixel(grid, pixel.x, pixel.y, nextColor)) continue

      context.clearRect(pixel.x, pixel.y, 1, 1)
      if (nextColor) {
        context.fillStyle = nextColor
        context.fillRect(pixel.x, pixel.y, 1, 1)
      }
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const point = pointFromEvent(event)
    if (!point) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastPointRef.current = point
    paintAt(point, null)
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return

    const point = pointFromEvent(event)
    if (!point) {
      lastPointRef.current = null
      return
    }

    paintAt(point, lastPointRef.current)
    lastPointRef.current = point
  }

  function stopDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return

    drawingRef.current = false
    lastPointRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="pixel-canvas"
      width={GRID_SIZE}
      height={GRID_SIZE}
      role="img"
      aria-label="Pixel art canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      onLostPointerCapture={stopDrawing}
    />
  )
}
