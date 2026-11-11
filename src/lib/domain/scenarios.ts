/**
 * Generación de escenarios válidos a partir de las reglas del punto de partida.
 * No hay tabla precalculada: se enumeran todas las combinaciones y se filtran.
 */
import { DEFAULT_VALIDATION_OPTIONS, validateScenario, type ValidationOptions } from './rules'
import { SHAPES, SLOTS, SYMBOLS, type Callouts, type Scenario, type Statues } from './types'

/** Las 6 órdenes posibles de los callouts (permutaciones de los tres símbolos). */
export function allCalloutOrders(): Callouts[] {
  const orders: Callouts[] = []
  for (const left of SYMBOLS) {
    for (const mid of SYMBOLS) {
      for (const right of SYMBOLS) {
        if (new Set([left, mid, right]).size === SYMBOLS.length) orders.push({ left, mid, right })
      }
    }
  }
  return orders
}

/** Todas las combinaciones de formas en las tres estatuas (6³ = 216). */
export function allStatueCombinations(): Statues[] {
  const combinations: Statues[] = []
  for (const left of SHAPES) {
    for (const mid of SHAPES) {
      for (const right of SHAPES) combinations.push({ left, mid, right })
    }
  }
  return combinations
}

/**
 * Todos los escenarios que superan la validación con las opciones dadas.
 * Por defecto la regla 3 se exige, como en el simulador original.
 */
export function allScenarios(
  options: ValidationOptions = { ...DEFAULT_VALIDATION_OPTIONS, unsolvedStart: 'enforce' },
): Scenario[] {
  const scenarios: Scenario[] = []
  for (const callouts of allCalloutOrders()) {
    for (const statues of allStatueCombinations()) {
      const scenario = { callouts, statues }
      if (validateScenario(scenario, options).valid) scenarios.push(scenario)
    }
  }
  return scenarios
}

/** Generador de números aleatorios en [0, 1). Inyectable para tests. */
export type Random = () => number

/** Escenario aleatorio, con probabilidad uniforme entre todos los válidos. */
export function randomScenario(random: Random = Math.random, options?: ValidationOptions): Scenario {
  const scenarios = allScenarios(options)
  const index = Math.min(Math.floor(random() * scenarios.length), scenarios.length - 1)
  const scenario = scenarios[index]
  if (!scenario) throw new Error('No valid scenarios for the given options')
  return scenario
}

/** Clave estable de unas estatuas, p. ej. `sphere|cube|prism`. */
export function statuesKey(statues: Statues): string {
  return SLOTS.map((slot) => statues[slot]).join('|')
}
