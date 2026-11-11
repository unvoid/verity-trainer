/**
 * Solucionador: secuencia mínima de intercambios mediante búsqueda en anchura (BFS).
 *
 * El espacio de estados son las configuraciones de estatuas con dos de cada
 * símbolo (21), así que el BFS es instantáneo y siempre exacto.
 */
import { isSolved } from './rules'
import { statuesKey } from './scenarios'
import { decompose, pureShapeOf } from './shapes'
import { swapSymbols } from './swap'
import {
  SLOTS,
  type Callouts,
  type Mode,
  type Scenario,
  type Slot,
  type Statues,
  type Swap,
  type Symbol2D,
} from './types'

export interface Solution {
  /** Intercambios a realizar, en orden. Vacío si ya está resuelto. */
  readonly swaps: readonly Swap[]
  /** Estatuas tras cada intercambio (`states[i]` es el resultado de `swaps[i]`). */
  readonly states: readonly Statues[]
  /** Estatuas al final de la secuencia. */
  readonly final: Statues
}

function uniqueSymbols(statues: Statues, slot: Slot): Symbol2D[] {
  return [...new Set(decompose(statues[slot]))]
}

/**
 * Intercambios que cambian algo: dos estatuas distintas y símbolos distintos.
 * (Intercambiar un símbolo por sí mismo no altera las formas.)
 * El orden es estable: pares de posiciones de izquierda a derecha.
 */
export function usefulSwaps(statues: Statues): Swap[] {
  const swaps: Swap[] = []
  for (const [i, a] of SLOTS.entries()) {
    for (const b of SLOTS.slice(i + 1)) {
      for (const x of uniqueSymbols(statues, a)) {
        for (const y of uniqueSymbols(statues, b)) {
          if (x !== y) swaps.push({ first: { slot: a, symbol: x }, second: { slot: b, symbol: y } })
        }
      }
    }
  }
  return swaps
}

/** Camino más corto desde `start` hasta un estado que cumpla `isGoal`, o `null`. */
export function findShortestPath(start: Statues, isGoal: (statues: Statues) => boolean): Solution | null {
  interface Visit {
    readonly statues: Statues
    readonly previous: Visit | null
    readonly swap: Swap | null
  }

  const visited = new Set([statuesKey(start)])
  let frontier: Visit[] = [{ statues: start, previous: null, swap: null }]

  while (frontier.length > 0) {
    const goal = frontier.find((visit) => isGoal(visit.statues))
    if (goal) return toSolution(goal)

    const next: Visit[] = []
    for (const visit of frontier) {
      for (const swap of usefulSwaps(visit.statues)) {
        const statues = swapSymbols(visit.statues, swap.first, swap.second)
        const key = statuesKey(statues)
        if (visited.has(key)) continue
        visited.add(key)
        next.push({ statues, previous: visit, swap })
      }
    }
    frontier = next
  }
  return null

  function toSolution(goal: Visit): Solution {
    const swaps: Swap[] = []
    const states: Statues[] = []
    for (let visit: Visit | null = goal; visit?.swap; visit = visit.previous) {
      swaps.unshift(visit.swap)
      states.unshift(visit.statues)
    }
    return { swaps, states, final: goal.statues }
  }
}

/**
 * Las dos soluciones posibles en Challenge Mode (todas puras, ninguna con su callout):
 * - A: izquierda = pura del callout derecho, centro = del izquierdo, derecha = del central.
 * - B: izquierda = pura del callout central, centro = del derecho, derecha = del izquierdo.
 */
export function challengeTargets(callouts: Callouts): { readonly a: Statues; readonly b: Statues } {
  return {
    a: {
      left: pureShapeOf(callouts.right),
      mid: pureShapeOf(callouts.left),
      right: pureShapeOf(callouts.mid),
    },
    b: {
      left: pureShapeOf(callouts.mid),
      mid: pureShapeOf(callouts.right),
      right: pureShapeOf(callouts.left),
    },
  }
}

/** Camino más corto hasta unas estatuas concretas. */
export function solveTowards(start: Statues, target: Statues): Solution | null {
  const targetKey = statuesKey(target)
  return findShortestPath(start, (statues) => statuesKey(statues) === targetKey)
}

/**
 * Secuencia mínima para resolver el escenario en el modo dado.
 * En Challenge Mode llega a la más cercana de las soluciones A y B.
 * Devuelve `null` si no tiene solución (solo con escenarios que incumplen la regla 2).
 */
export function solve(scenario: Scenario, mode: Mode): Solution | null {
  return findShortestPath(scenario.statues, (statues) => isSolved(scenario.callouts, statues, mode))
}

/** Mínimo de intercambios necesarios, o `null` si no tiene solución. */
export function minimumSwaps(scenario: Scenario, mode: Mode): number | null {
  return solve(scenario, mode)?.swaps.length ?? null
}
