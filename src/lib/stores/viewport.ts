/**
 * Tamaño de la ventana: en pantallas estrechas (móvil y tablet en vertical) los
 * símbolos y las formas se reducen para que el tablero respire.
 *
 * Los tamaños de las piezas son props en px de cada componente (no se pueden
 * fijar solo con CSS); aquí está la única tabla de tamaños y el punto de corte.
 * Los componentes no saben nada de esto: quien los usa les pasa el tamaño.
 */
import { readable, derived } from 'svelte/store'

/** Por debajo de este ancho (sin incluirlo), tamaños compactos. */
export const COMPACT_MAX_WIDTH = '48rem'

export interface PieceSizes {
  /** Símbolos de la sala interior. */
  readonly callout: number
  /** Formas 3D de las estatuas. */
  readonly statue: number
  /** Símbolos de los caballeros y pictogramas de caballeros y ogros. */
  readonly knight: number
  /** Editor: símbolo elegido de cada callout. */
  readonly pickerSymbol: number
  /** Editor: forma elegida de cada estatua. */
  readonly pickerShape: number
  /** Editor: iconos de las opciones. */
  readonly pickerOption: number
}

export const PIECE_SIZES: Readonly<Record<'regular' | 'compact', PieceSizes>> = {
  regular: { callout: 56, statue: 80, knight: 44, pickerSymbol: 48, pickerShape: 64, pickerOption: 28 },
  compact: { callout: 44, statue: 64, knight: 36, pickerSymbol: 40, pickerShape: 52, pickerOption: 24 },
}

export function sizesFor(compact: boolean): PieceSizes {
  return PIECE_SIZES[compact ? 'compact' : 'regular']
}

/** `true` si la ventana es estrecha. Se actualiza al girar el móvil o cambiar el tamaño. */
export const compact = readable(false, (set) => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  const query = window.matchMedia(`(width < ${COMPACT_MAX_WIDTH})`)
  set(query.matches)
  const update = (event: MediaQueryListEvent) => set(event.matches)
  query.addEventListener('change', update)
  return () => query.removeEventListener('change', update)
})

/** Tamaños de las piezas para la ventana actual. */
export const pieceSizes = derived(compact, sizesFor)
