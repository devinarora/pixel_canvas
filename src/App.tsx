import { useState } from 'react'
import { PixelCanvas } from './PixelCanvas'
import { TOOLS, type Tool } from './tools'

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool === 'pencil') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m15 5 4 4" />
        <path d="M19.5 2.5a2.1 2.1 0 0 1 3 3L8 20l-5 1 1-5Z" />
      </svg>
    )
  }

  if (tool === 'eraser') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m14 5 5 5-8.5 8.5a2 2 0 0 1-2.8 0L4 14.8a2 2 0 0 1 0-2.8Z" />
        <path d="m11 8 5 5" />
        <path d="M8 21h12" />
      </svg>
    )
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-3-3Z" />
    </svg>
  )
}

export default function App() {
  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState('#000000')

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="tools" role="group" aria-label="Drawing tools">
          {TOOLS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="tool"
              aria-pressed={tool === option.id}
              onClick={() => setTool(option.id)}
            >
              <ToolIcon tool={option.id} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <label className="color-field">
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            aria-label="Drawing color"
          />
        </label>
      </aside>

      <section className="workspace" aria-label="Canvas workspace">
        <div className="canvas-frame">
          <PixelCanvas tool={tool} color={color} onPickColor={setColor} />
        </div>
      </section>
    </main>
  )
}
