import type { Messages } from './core'

/** Textos en español. Mismas claves que `en.ts` (idioma base). Tono: docs/tono.md. */
export const es: Messages = {
  'app.title': 'Simulador de Verity',
  'loader.label': 'Cargando…',

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
  'statues.title': 'Sala de disección',
  'statue.label': '{statue}: {shape}',
  'statue.marked': 'marcada con {symbol}',
  'statue.accepts': 'admite el símbolo que llevas',
  'toolbox.title': 'Símbolos de los caballeros',
  'toolbox.hint': 'Toca un símbolo y luego una estatua, o arrástralo hasta ella.',
  'toolbox.hint.rounds': 'Derrota a un caballero para conseguir su símbolo. Los símbolos que no uses caducan.',
  'knight.defeat': 'Derrotar',
  'knight.defeat.label': '{knight}: derrótalo para que suelte el {symbol}',
  'drop.used': 'Usado',
  'drop.expired': 'Caducado',
  'ogres.title': 'Ogros',
  'ogres.hint': 'Derrota a los dos ogros para que vuelvan los caballeros.',
  'ogre.left': 'Ogro izquierdo',
  'ogre.right': 'Ogro derecho',
  'ogre.defeated': 'Derrotado',
  'rounds.respawn': 'Los caballeros vuelven en {seconds} s.',
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
  'feedback.symbol-unavailable': 'El {symbol} no está disponible ahora.',
  'feedback.knight-defeated': 'El caballero ha soltado el {symbol}.',
  'feedback.expired.one': 'El {symbols} ha caducado.',
  'feedback.expired.other': 'Han caducado: {symbols}.',
  'feedback.ogres-appeared': 'Han aparecido dos ogros.',
  'feedback.knights-returned': 'Han vuelto los caballeros.',

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
  'setup.error.already-solved': 'Este punto de partida ya está resuelto: cambia alguna estatua para poder entrenar.',
  'setup.warning.starts-solved.one':
    'Aviso: {statues} empieza sin el símbolo de su callout, así que ya está resuelta. No sabemos si esto puede pasar en el juego.',
  'setup.warning.starts-solved.other':
    'Aviso: {statues} empiezan sin el símbolo de su callout, así que ya están resueltas. No sabemos si esto puede pasar en el juego.',

  // Pie de página
  'footer.inspired': 'Inspirado en {link} de EggAllocationService.',
  'footer.inspired.link': 'Verity Simulator',

  // Manual de uso
  'guide.title': 'Cómo se juega',
  'guide.encounter.title': 'El encuentro',
  'guide.encounter.body':
    'En Verity, el equipo de fuera intercambia símbolos entre las estatuas hasta que ninguna contiene el símbolo de su callout de la sala interior. Aquí puedes practicarlo con puntos de partida aleatorios o recreando tu propia partida.',
  'guide.shapes.title': 'Formas',
  'guide.shapes.body': 'Cada estatua tiene una forma 3D hecha de dos símbolos.',
  'guide.shapes.item': '{shape}: {first} + {second}',
  'guide.swap.title': 'Hacer un intercambio',
  'guide.swap.step1': 'Coge un símbolo de los caballeros: tócalo o arrástralo.',
  'guide.swap.step2': 'Deposítalo en una estatua cuya forma lo contenga. Esa estatua queda marcada.',
  'guide.swap.step3': 'Deposita otro símbolo en otra estatua: las dos intercambian esos símbolos.',
  'guide.swap.keyboard': 'Con teclado: Tab para moverte y Enter o Espacio para coger y depositar.',
  'guide.goal.title': 'Objetivo',
  'guide.goal.body':
    'Ninguna estatua puede contener el símbolo de su callout. Al resolverlo verás el mínimo de intercambios y, si usaste más, la solución más corta.',
  'guide.start.title': 'Punto de partida',
  'guide.start.body':
    'Cada entreno parte de una propuesta aleatoria. Para recrear tu partida, cambia los callouts y las formas de las estatuas: al cambiar uno, elige otro y el tercero se completa solo.',
  'guide.settings.title': 'Ajustes',
  'guide.coming-soon': 'Próximamente',

  // Ajustes
  'settings.title': 'Ajustes',
  'settings.hints': 'Pistas',
  'settings.hints.description':
    'Muestra los símbolos de cada estatua, marca los que chocan con su callout, señala dónde puedes depositar y cuántos intercambios faltan como mínimo.',
  'settings.challenge-mode': 'Modo desafío',
  'settings.challenge-mode.description':
    'Además de no tener el símbolo de su callout, cada estatua tiene que acabar con una forma pura: esfera, cubo o tetraedro.',
  'settings.locked': 'Se cambia antes de iniciar el entreno.',
  'settings.symbol-rounds': 'Símbolos por rondas',
  'settings.symbol-rounds.description':
    'Los símbolos salen al derrotar a los caballeros y caducan a los 10 s si no los usas. Cuando se agotan aparecen ogros; al derrotarlos vuelven los caballeros.',

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
