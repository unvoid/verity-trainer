/**
 * Símbolos por rondas: de dónde salen los símbolos cuando no están siempre disponibles.
 *
 * Ciclo de una ronda:
 * 1. Hay un caballero en cada posición. Al derrotarlo suelta su símbolo (`KNIGHT_DROPS`).
 * 2. Un símbolo soltado caduca a los `symbolLifetime` ms si no se usa. Mientras el
 *    jugador lo lleva no caduca; si lo suelta sin usarlo, vuelve a contar desde cero.
 * 3. Cuando los tres símbolos se han usado o han caducado, aparecen dos ogros.
 * 4. Al derrotar a ambos, los caballeros vuelven tras `respawnDelay` ms.
 *
 * Funciones puras: reciben el estado y la hora actual y devuelven un estado nuevo.
 */
import { KNIGHT_DROPS } from './rules'
import { SLOTS, type Slot, type Symbol2D } from './types'

export const OGRE_SIDES = ['left', 'right'] as const
export type OgreSide = (typeof OGRE_SIDES)[number]

export interface DropTimings {
  /** Tiempo hasta que caduca un símbolo soltado (ms). */
  readonly symbolLifetime: number
  /** Tiempo hasta que vuelven los caballeros tras derrotar a los ogros (ms). */
  readonly respawnDelay: number
}

export const DEFAULT_TIMINGS: DropTimings = { symbolLifetime: 10_000, respawnDelay: 3_000 }

export type DropSlot =
  /** El caballero sigue vivo: el símbolo aún no ha salido. */
  | { readonly status: 'knight' }
  /** Símbolo disponible. `since`: desde cuándo cuenta la caducidad; `null` si el jugador lo lleva. */
  | { readonly status: 'dropped'; readonly since: number | null }
  | { readonly status: 'used' }
  | { readonly status: 'expired' }

export interface DropsState {
  readonly slots: Readonly<Record<Slot, DropSlot>>
  /** Ogros vivos, o `null` si no hay ogros en esta fase. */
  readonly ogres: Readonly<Record<OgreSide, boolean>> | null
  /** Cuándo vuelven los caballeros, o `null` si no hay vuelta pendiente. */
  readonly respawnAt: number | null
}

const KNIGHT: DropSlot = { status: 'knight' }

export function createDrops(): DropsState {
  return { slots: { left: KNIGHT, mid: KNIGHT, right: KNIGHT }, ogres: null, respawnAt: null }
}

/** Posición del caballero que suelta un símbolo. */
export function slotOfSymbol(symbol: Symbol2D): Slot {
  return SLOTS.find((slot) => KNIGHT_DROPS[slot] === symbol)!
}

export function isAvailable(state: DropsState, symbol: Symbol2D): boolean {
  return state.slots[slotOfSymbol(symbol)].status === 'dropped'
}

function withSlot(state: DropsState, slot: Slot, value: DropSlot): DropsState {
  return { ...state, slots: { ...state.slots, [slot]: value } }
}

/** Derrota al caballero de una posición: suelta su símbolo. */
export function defeatKnight(state: DropsState, slot: Slot, now: number): DropsState {
  if (state.slots[slot].status !== 'knight') return state
  return withSlot(state, slot, { status: 'dropped', since: now })
}

/** El jugador coge un símbolo: deja de caducar mientras lo lleva. */
export function pickUp(state: DropsState, symbol: Symbol2D): DropsState {
  const slot = slotOfSymbol(symbol)
  if (state.slots[slot].status !== 'dropped') return state
  return withSlot(state, slot, { status: 'dropped', since: null })
}

/** El jugador suelta un símbolo sin usarlo: la caducidad vuelve a contar desde ahora. */
export function putDown(state: DropsState, symbol: Symbol2D, now: number): DropsState {
  const slot = slotOfSymbol(symbol)
  if (state.slots[slot].status !== 'dropped') return state
  return withSlot(state, slot, { status: 'dropped', since: now })
}

/** Un símbolo depositado en una estatua se gasta. */
export function use(state: DropsState, symbol: Symbol2D): DropsState {
  const slot = slotOfSymbol(symbol)
  if (state.slots[slot].status !== 'dropped') return state
  return appearOgresIfDone(withSlot(state, slot, { status: 'used' }))
}

/** Derrota a un ogro. Con ambos derrotados, programa la vuelta de los caballeros. */
export function defeatOgre(state: DropsState, side: OgreSide, now: number, timings = DEFAULT_TIMINGS): DropsState {
  if (!state.ogres?.[side]) return state
  const ogres = { ...state.ogres, [side]: false }
  const allDefeated = OGRE_SIDES.every((s) => !ogres[s])
  return allDefeated ? { ...state, ogres: null, respawnAt: now + timings.respawnDelay } : { ...state, ogres }
}

export interface TickResult {
  readonly state: DropsState
  /** Símbolos que han caducado en este paso. */
  readonly expired: readonly Symbol2D[]
  readonly ogresAppeared: boolean
  readonly knightsReturned: boolean
}

/** Avanza el tiempo: caducidades, aparición de ogros y vuelta de caballeros. */
export function tick(state: DropsState, now: number, timings = DEFAULT_TIMINGS): TickResult {
  if (state.respawnAt !== null) {
    const knightsReturned = now >= state.respawnAt
    return { state: knightsReturned ? createDrops() : state, expired: [], ogresAppeared: false, knightsReturned }
  }

  let next = state
  const expired: Symbol2D[] = []
  for (const slot of SLOTS) {
    const drop = next.slots[slot]
    if (drop.status === 'dropped' && drop.since !== null && now - drop.since >= timings.symbolLifetime) {
      next = withSlot(next, slot, { status: 'expired' })
      expired.push(KNIGHT_DROPS[slot])
    }
  }
  const withOgres = appearOgresIfDone(next)
  return { state: withOgres, expired, ogresAppeared: withOgres.ogres !== null && state.ogres === null, knightsReturned: false }
}

/** Con los tres símbolos usados o caducados, aparecen los ogros. */
function appearOgresIfDone(state: DropsState): DropsState {
  if (state.ogres !== null || state.respawnAt !== null) return state
  const done = SLOTS.every((slot) => ['used', 'expired'].includes(state.slots[slot].status))
  return done ? { ...state, ogres: { left: true, right: true } } : state
}

/** Fracción de vida que le queda a un símbolo soltado (1 → recién soltado, 0 → caducado). */
export function remainingLife(drop: DropSlot, now: number, timings = DEFAULT_TIMINGS): number {
  if (drop.status !== 'dropped') return 0
  if (drop.since === null) return 1
  return Math.max(0, Math.min(1, 1 - (now - drop.since) / timings.symbolLifetime))
}
