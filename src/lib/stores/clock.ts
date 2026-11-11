/**
 * Hora actual que se actualiza sola mientras alguien la usa (p. ej. cuentas atrás).
 * Sin suscriptores, el intervalo se detiene.
 */
import { readable } from 'svelte/store'

export const CLOCK_INTERVAL_MS = 200

export const clock = readable(Date.now(), (set) => {
  set(Date.now())
  const id = setInterval(() => set(Date.now()), CLOCK_INTERVAL_MS)
  return () => clearInterval(id)
})
