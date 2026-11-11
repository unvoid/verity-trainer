/**
 * Avisos efímeros (toast): un solo mensaje a la vez, que se sustituye por el
 * siguiente y desaparece solo. Para eventos (lo que acaba de pasar), no para
 * estado permanente.
 */
import { writable, type Readable } from 'svelte/store'

export type ToastTone = 'info' | 'error'

export interface Toast {
  /** Cambia con cada aviso, aunque el texto se repita. */
  readonly id: number
  readonly message: string
  readonly tone: ToastTone
}

/** Duración en pantalla (ms). Los errores se quedan algo más: son los que más importa leer. */
export const TOAST_DURATION: Readonly<Record<ToastTone, number>> = { info: 2500, error: 4000 }

export interface ToastStore extends Readable<Toast | null> {
  show(message: string, tone?: ToastTone): void
  dismiss(): void
}

export function createToastStore(
  schedule: (fn: () => void, ms: number) => unknown = setTimeout,
  cancel: (handle: unknown) => void = (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
): ToastStore {
  const { subscribe, set } = writable<Toast | null>(null)
  let nextId = 1
  let timer: unknown = null

  function dismiss() {
    if (timer !== null) cancel(timer)
    timer = null
    set(null)
  }

  return {
    subscribe,
    show(message, tone = 'info') {
      if (timer !== null) cancel(timer)
      const id = nextId++
      set({ id, message, tone })
      timer = schedule(() => {
        timer = null
        set(null)
      }, TOAST_DURATION[tone])
    },
    dismiss,
  }
}

export const toast = createToastStore()
