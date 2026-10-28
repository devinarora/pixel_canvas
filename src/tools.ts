export type Tool = 'pencil' | 'eraser' | 'picker'

export const TOOLS = [
  { id: 'pencil', label: 'Pencil' },
  { id: 'eraser', label: 'Eraser' },
  { id: 'picker', label: 'Color picker' },
] as const satisfies ReadonlyArray<{ id: Tool; label: string }>
