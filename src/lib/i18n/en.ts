import type { Messages } from './core'

/** English texts. Must define exactly the same keys as `es.ts`. */
export const en: Messages = {
  'app.title': 'Verity Trainer',
  'app.tagline': 'Practice the symbol swaps of the Verity encounter.',

  'language.label': 'Language',
  'language.name.es': 'Español',
  'language.name.en': 'English',

  'symbol.circle': 'Circle',
  'symbol.square': 'Square',
  'symbol.triangle': 'Triangle',

  'shape.sphere': 'Sphere',
  'shape.cube': 'Cube',
  'shape.tetrahedron': 'Pyramid',
  'shape.cylinder': 'Cylinder',
  'shape.cone': 'Cone',
  'shape.prism': 'Prism',

  'callouts.title': 'Inside room',
  'callouts.item': '{position}: {symbol}',
  'position.left': 'Left',
  'position.mid': 'Middle',
  'position.right': 'Right',

  'statues.title': 'Statues',
  'statue.name.left': 'Left statue',
  'statue.name.mid': 'Middle statue',
  'statue.name.right': 'Right statue',
  'statue.label': '{statue}: {shape}',
  'statue.marked': 'Marked with {symbol}',

  'toolbox.title': 'Symbols',
  'toolbox.hint': 'Pick up a symbol and deposit it on a statue.',
  'knight.left': 'Left knight',
  'knight.mid': 'Middle knight',
  'knight.right': 'Right knight',
  'knight.drop': '{symbol} ({knight})',

  'status.swaps': 'Swaps: {count}',
  'status.holding': 'Holding: {symbol}',
  'status.empty-hands': 'Not holding a symbol',
  'status.solved': 'Solved!',
  'status.summary': 'Swaps: {count} · Minimum: {minimum} · Time: {seconds} s',

  'feedback.no-symbol-held': 'Pick up a symbol first.',
  'feedback.symbol-not-in-shape': '{statue}: its shape has no {symbol}.',
  'feedback.statue-already-selected': '{statue} is already marked. Deposit on another statue.',
  'feedback.marked': '{statue} marked with {symbol}.',
  'feedback.swapped': 'Swap: {firstSymbol} from {firstStatue} ↔ {secondSymbol} from {secondStatue}.',

  'action.new-game': 'New game',
  'action.restart': 'Restart',
}
