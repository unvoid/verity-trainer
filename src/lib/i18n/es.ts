import type { Messages } from './core'

/** Textos en español. Mismas claves que `en.ts` (idioma base). Tono: docs/tono.md. */
export const es: Messages = {
  'app.title': 'Simulador de Verity',

  'language.label': 'Idioma',
  'language.name.es': 'Español',
  'language.name.en': 'English',

  // Nombres (para títulos, etiquetas y listas)
  'symbol.circle': 'Círculo',
  'symbol.square': 'Cuadrado',
  'symbol.triangle': 'Triángulo',
  'shape.sphere': 'Esfera',
  'shape.cube': 'Cubo',
  'shape.tetrahedron': 'Tetraedro',
  'shape.cylinder': 'Cilindro',
  'shape.cone': 'Cono',
  'shape.prism': 'Prisma',
  'position.left': 'Izquierda',
  'position.mid': 'Centro',
  'position.right': 'Derecha',
  'statue.name.left': 'Estatua izquierda',
  'statue.name.mid': 'Estatua central',
  'statue.name.right': 'Estatua derecha',
  'knight.left': 'Caballero izquierdo',
  'knight.mid': 'Caballero central',
  'knight.right': 'Caballero derecho',

  // Referencias (dentro de una frase)
  'symbol.ref.circle': 'círculo',
  'symbol.ref.square': 'cuadrado',
  'symbol.ref.triangle': 'triángulo',
  'statue.ref.left': 'la estatua izquierda',
  'statue.ref.mid': 'la estatua central',
  'statue.ref.right': 'la estatua derecha',

  // Partida
  'callouts.title': 'Sala interior',
  'callouts.item': '{position}: {symbol}',
  'statues.title': 'Estatuas',
  'statue.label': '{statue}: {shape}',
  'statue.marked': 'marcada con {symbol}',
  'statue.accepts': 'admite el símbolo que llevas',
  'toolbox.title': 'Símbolos',
  'toolbox.hint': 'Toca un símbolo y luego una estatua, o arrástralo hasta ella.',
  'knight.drop': '{symbol} ({knight})',
  'status.swaps': 'Intercambios: {count}',
  'status.holding': 'Llevas: {symbol}',
  'status.empty-hands': 'No llevas ningún símbolo',
  'status.mode.challenge': 'Modo desafío',

  'feedback.no-symbol-held': 'Primero coge un símbolo.',
  'feedback.symbol-not-in-shape': 'El {symbol} no está en {statue}.',
  'feedback.statue-already-selected': 'Ya has marcado {statue}. Deposita en otra.',
  'feedback.marked': 'Has marcado {statue} con el {symbol}.',
  'feedback.swapped': 'Intercambio hecho: el {firstSymbol} de {firstStatue} por el {secondSymbol} de {secondStatue}.',

  // Pistas
  'hint.symbols': 'Símbolos de la estatua',
  'hint.clash': '{symbol}: choca con el callout',
  'hint.ok': '{symbol}: no choca',
  'hint.remaining.one': 'Falta al menos {count} intercambio.',
  'hint.remaining.other': 'Faltan al menos {count} intercambios.',

  // Punto de partida
  'setup.title': 'Punto de partida',
  'setup.intro': 'Propuesta aleatoria. Cámbiala si quieres recrear una partida real.',
  'setup.callouts': 'Callouts de la sala interior',
  'setup.statues': 'Formas de las estatuas',
  'setup.group-hint': 'Al cambiar uno, elige otro: el tercero se completa solo.',
  'setup.empty': 'Sin elegir',
  'setup.incomplete': 'Completa los callouts y las estatuas para empezar.',
  'setup.warning.starts-solved.one':
    'Aviso: {statues} empieza sin el símbolo de su callout, así que ya está resuelta. No sabemos si esto puede pasar en el juego.',
  'setup.warning.starts-solved.other':
    'Aviso: {statues} empiezan sin el símbolo de su callout, así que ya están resueltas. No sabemos si esto puede pasar en el juego.',

  // Ajustes
  'settings.title': 'Ajustes',
  'settings.hints': 'Pistas',
  'settings.hints.description':
    'Muestra los símbolos de cada estatua, marca los que chocan con su callout, señala dónde puedes depositar y cuántos intercambios faltan como mínimo.',
  'settings.challenge-mode': 'Modo desafío',
  'settings.challenge-mode.description':
    'Además de no tener el símbolo de su callout, cada estatua tiene que acabar con una forma pura: esfera, cubo o tetraedro.',
  'settings.challenge-mode.locked': 'Se cambia antes de iniciar el entreno.',
  'settings.symbol-rounds': 'Símbolos por rondas',
  'settings.symbol-rounds.description': 'Los símbolos salen por rondas y caducan si no los usas a tiempo.',

  // Resultado
  'result.title': '¡Resuelto!',
  'result.swaps': 'Intercambios',
  'result.minimum': 'Mínimo',
  'result.time': 'Tiempo',
  'result.seconds': '{seconds} s',
  'result.optimal': 'Con el mínimo de intercambios.',
  'result.extra.one': 'Se podía hacer con {count} intercambio menos.',
  'result.extra.other': 'Se podía hacer con {count} intercambios menos.',
  'result.solution': 'Solución más corta',
  'result.step': 'Intercambia el {firstSymbol} de {firstStatue} con el {secondSymbol} de {secondStatue}.',

  // Acciones
  'action.start': 'Iniciar entreno',
  'action.propose': 'Otra propuesta',
  'action.new-game': 'Nueva partida',
  'action.restart': 'Reiniciar',
  'action.retry': 'Repetir',
  'action.close': 'Cerrar',
}
