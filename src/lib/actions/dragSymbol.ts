/**
 * Action de Svelte para arrastrar un símbolo hasta una estatua con Pointer Events
 * (ratón, dedo y lápiz con el mismo código).
 *
 * - El arrastre empieza al moverse más de `threshold` px; antes, es un toque normal
 *   y el `click` del elemento funciona como siempre (tocar y tocar).
 * - Los destinos son los elementos con `data-drop-slot="<slot>"`.
 * - Tras un arrastre se anula el `click` que el navegador dispara al soltar.
 * - Escape o `pointercancel` cancelan el arrastre.
 *
 * El elemento debe tener `touch-action: none` para que el arrastre no haga scroll.
 */
import type { ActionReturn } from 'svelte/action'
import { SLOTS, type Slot, type Symbol2D } from '../domain/types'
import { drag } from '../stores/drag'

export interface DragSymbolOptions {
  readonly symbol: Symbol2D
  readonly disabled?: boolean
  /** Distancia mínima (px) para considerar que es un arrastre y no un toque. */
  readonly threshold?: number
  readonly ondrop: (slot: Slot, symbol: Symbol2D) => void
}

export const DEFAULT_DRAG_THRESHOLD = 6

/** ¿Se ha movido el puntero lo suficiente para empezar a arrastrar? */
export function exceedsThreshold(dx: number, dy: number, threshold: number): boolean {
  return dx * dx + dy * dy > threshold * threshold
}

export function isSlot(value: unknown): value is Slot {
  return typeof value === 'string' && (SLOTS as readonly string[]).includes(value)
}

/** Estatua bajo un punto de la ventana, o `null`. */
function slotAt(x: number, y: number): Slot | null {
  const target = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop-slot]')
  const slot = target?.dataset.dropSlot
  return isSlot(slot) ? slot : null
}

export function dragSymbol(node: HTMLElement, initial: DragSymbolOptions): ActionReturn<DragSymbolOptions> {
  let options = initial
  let pointer: { readonly id: number; readonly startX: number; readonly startY: number } | null = null
  let dragging = false
  let suppressClick = false

  function onPointerDown(event: PointerEvent) {
    suppressClick = false
    if (options.disabled || !event.isPrimary || event.button !== 0) return
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY }
    node.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent) {
    if (!pointer || event.pointerId !== pointer.id) return
    const threshold = options.threshold ?? DEFAULT_DRAG_THRESHOLD
    if (!dragging && !exceedsThreshold(event.clientX - pointer.startX, event.clientY - pointer.startY, threshold)) {
      return
    }
    if (!dragging) {
      dragging = true
      window.addEventListener('keydown', onKeyDown)
    }
    drag.set({ symbol: options.symbol, x: event.clientX, y: event.clientY, over: slotAt(event.clientX, event.clientY) })
  }

  function onPointerUp(event: PointerEvent) {
    if (!pointer || event.pointerId !== pointer.id) return
    const wasDragging = dragging
    const slot = wasDragging ? slotAt(event.clientX, event.clientY) : null
    end()
    if (!wasDragging) return
    suppressClick = true
    if (slot) options.ondrop(slot, options.symbol)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    suppressClick = true
    end()
  }

  /** Anula el click que sigue a un arrastre (en fase de captura, antes que el de Svelte). */
  function onClick(event: MouseEvent) {
    if (!suppressClick) return
    suppressClick = false
    event.preventDefault()
    event.stopImmediatePropagation()
  }

  function end() {
    if (pointer && node.hasPointerCapture(pointer.id)) node.releasePointerCapture(pointer.id)
    pointer = null
    if (dragging) {
      dragging = false
      window.removeEventListener('keydown', onKeyDown)
      drag.set(null)
    }
  }

  node.addEventListener('pointerdown', onPointerDown)
  node.addEventListener('pointermove', onPointerMove)
  node.addEventListener('pointerup', onPointerUp)
  node.addEventListener('pointercancel', end)
  node.addEventListener('click', onClick, { capture: true })

  return {
    update(next) {
      options = next
      if (options.disabled) end()
    },
    destroy() {
      end()
      node.removeEventListener('pointerdown', onPointerDown)
      node.removeEventListener('pointermove', onPointerMove)
      node.removeEventListener('pointerup', onPointerUp)
      node.removeEventListener('pointercancel', end)
      node.removeEventListener('click', onClick, { capture: true })
    },
  }
}
