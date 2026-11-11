/**
 * Textos en inglés. Es el idioma base: sus claves definen `MessageKey`,
 * y el resto de idiomas deben tener exactamente las mismas.
 *
 * - Interpolación: `{nombre}` se sustituye por el parámetro del mismo nombre.
 * - Plurales: claves `<base>.one` y `<base>.other`, usadas con `tn()`.
 * - Tono y vocabulario: docs/tono.md.
 */
export const en = {
  'app.title': 'Verity Trainer',

  'language.label': 'Language',
  'language.name.es': 'Español',
  'language.name.en': 'English',

  // Names (titles, labels and lists)
  'symbol.circle': 'Circle',
  'symbol.square': 'Square',
  'symbol.triangle': 'Triangle',
  'shape.sphere': 'Sphere',
  'shape.cube': 'Cube',
  'shape.tetrahedron': 'Pyramid',
  'shape.cylinder': 'Cylinder',
  'shape.cone': 'Cone',
  'shape.prism': 'Prism',
  'position.left': 'Left',
  'position.mid': 'Middle',
  'position.right': 'Right',
  'statue.name.left': 'Left statue',
  'statue.name.mid': 'Middle statue',
  'statue.name.right': 'Right statue',
  'knight.left': 'Left knight',
  'knight.mid': 'Middle knight',
  'knight.right': 'Right knight',

  // References (inside a sentence)
  'symbol.ref.circle': 'circle',
  'symbol.ref.square': 'square',
  'symbol.ref.triangle': 'triangle',
  'statue.ref.left': 'the left statue',
  'statue.ref.mid': 'the middle statue',
  'statue.ref.right': 'the right statue',

  // Game
  'callouts.title': 'Inside room',
  'callouts.item': '{position}: {symbol}',
  'statues.title': 'Statues',
  'statue.label': '{statue}: {shape}',
  'statue.marked': 'marked with {symbol}',
  'statue.accepts': 'accepts the symbol you hold',
  'toolbox.title': 'Symbols',
  'toolbox.hint': 'Tap a symbol and then a statue, or drag it there.',
  'toolbox.hint.rounds': 'Defeat a knight to get its symbol. Symbols you don’t use expire.',
  'knight.defeat': 'Defeat',
  'knight.defeat.label': '{knight}: defeat it to drop the {symbol}',
  'drop.used': 'Used',
  'drop.expired': 'Expired',
  'ogres.title': 'Ogres',
  'ogres.hint': 'Defeat both ogres to bring the knights back.',
  'ogre.left': 'Left ogre',
  'ogre.right': 'Right ogre',
  'ogre.defeated': 'Defeated',
  'rounds.respawn': 'The knights return in {seconds} s.',
  'knight.drop': '{symbol} ({knight})',
  'status.swaps': 'Swaps: {count}',
  'status.holding': 'Holding: {symbol}',
  'status.empty-hands': 'Not holding a symbol',
  'status.mode.challenge': 'Challenge Mode',

  'feedback.no-symbol-held': 'Pick up a symbol first.',
  'feedback.symbol-not-in-shape': 'There is no {symbol} in {statue}.',
  'feedback.statue-already-selected': 'You already marked {statue}. Use another one.',
  'feedback.marked': 'You marked {statue} with the {symbol}.',
  'feedback.swapped': 'Swapped the {firstSymbol} from {firstStatue} with the {secondSymbol} from {secondStatue}.',
  'feedback.symbol-unavailable': 'The {symbol} is not available right now.',
  'feedback.knight-defeated': 'The knight dropped the {symbol}.',
  'feedback.expired.one': 'The {symbols} expired.',
  'feedback.expired.other': 'Expired: {symbols}.',
  'feedback.ogres-appeared': 'Two ogres have appeared.',
  'feedback.knights-returned': 'The knights are back.',

  // Hints
  'hint.symbols': 'Statue symbols',
  'hint.clash': '{symbol}: clashes with the callout',
  'hint.ok': '{symbol}: no clash',
  'hint.remaining.one': 'At least {count} swap left.',
  'hint.remaining.other': 'At least {count} swaps left.',

  // Starting point
  'setup.title': 'Starting point',
  'setup.intro': 'Random proposal. Change it to recreate a real run.',
  'setup.callouts': 'Inside room callouts',
  'setup.statues': 'Statue shapes',
  'setup.group-hint': 'After changing one, pick another: the third fills in by itself.',
  'setup.empty': 'Not chosen',
  'setup.incomplete': 'Complete the callouts and statues to start.',
  'setup.warning.starts-solved.one':
    'Note: {statues} starts without its callout symbol, so it is already solved. We are not sure this can happen in the game.',
  'setup.warning.starts-solved.other':
    'Note: {statues} start without their callout symbol, so they are already solved. We are not sure this can happen in the game.',

  // Settings
  'settings.title': 'Settings',
  'settings.hints': 'Hints',
  'settings.hints.description':
    'Shows the symbols of each statue, marks the ones that clash with its callout, highlights where you can deposit, and how many swaps are left at minimum.',
  'settings.challenge-mode': 'Challenge Mode',
  'settings.challenge-mode.description':
    'Besides avoiding its callout symbol, each statue must end as a pure shape: sphere, cube or pyramid.',
  'settings.locked': 'Change it before starting a training.',
  'settings.symbol-rounds': 'Symbol rounds',
  'settings.symbol-rounds.description':
    'Symbols drop when you defeat the knights and expire after 10 s if unused. Once they run out, ogres appear; defeating them brings the knights back.',

  // Result
  'result.title': 'Solved!',
  'result.swaps': 'Swaps',
  'result.minimum': 'Minimum',
  'result.time': 'Time',
  'result.seconds': '{seconds} s',
  'result.optimal': 'With the minimum number of swaps.',
  'result.extra.one': 'It could be done with {count} fewer swap.',
  'result.extra.other': 'It could be done with {count} fewer swaps.',
  'result.solution': 'Shortest solution',
  'result.step': 'Swap the {firstSymbol} from {firstStatue} with the {secondSymbol} from {secondStatue}.',

  // Actions
  'action.start': 'Start training',
  'action.propose': 'Another proposal',
  'action.new-game': 'New game',
  'action.restart': 'Restart',
  'action.retry': 'Try again',
  'action.close': 'Close',
} satisfies Record<string, string>
