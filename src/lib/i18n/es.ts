/**
 * Textos en español. Es el idioma base: sus claves definen `MessageKey`,
 * y el resto de idiomas deben tener exactamente las mismas.
 *
 * Interpolación: `{nombre}` se sustituye por el parámetro del mismo nombre.
 */
export const es = {
  'app.title': 'Simulador de Verity',
  'app.tagline': 'Practica los intercambios de símbolos del encuentro Verity.',

  'language.label': 'Idioma',
  'language.name.es': 'Español',
  'language.name.en': 'English',

  'symbol.circle': 'Círculo',
  'symbol.square': 'Cuadrado',
  'symbol.triangle': 'Triángulo',

  'shape.sphere': 'Esfera',
  'shape.cube': 'Cubo',
  'shape.tetrahedron': 'Tetraedro',
  'shape.cylinder': 'Cilindro',
  'shape.cone': 'Cono',
  'shape.prism': 'Prisma',

  'callouts.title': 'Sala interior',
  'callouts.item': '{position}: {symbol}',
  'position.left': 'Izquierda',
  'position.mid': 'Centro',
  'position.right': 'Derecha',

  'statues.title': 'Estatuas',
  'statue.name.left': 'Estatua izquierda',
  'statue.name.mid': 'Estatua central',
  'statue.name.right': 'Estatua derecha',
  'statue.label': '{statue}: {shape}',
  'statue.marked': 'Marcada con {symbol}',

  'toolbox.title': 'Símbolos',
  'toolbox.hint': 'Coge un símbolo y deposítalo en una estatua.',
  'knight.left': 'Caballero izquierdo',
  'knight.mid': 'Caballero central',
  'knight.right': 'Caballero derecho',
  'knight.drop': '{symbol} ({knight})',

  'status.swaps': 'Intercambios: {count}',
  'status.holding': 'Llevas: {symbol}',
  'status.empty-hands': 'No llevas ningún símbolo',
  'status.solved': '¡Resuelto!',
  'status.summary': 'Intercambios: {count} · Mínimo: {minimum} · Tiempo: {seconds} s',

  'feedback.no-symbol-held': 'Primero coge un símbolo.',
  'feedback.symbol-not-in-shape': '{statue}: la forma no contiene {symbol}.',
  'feedback.statue-already-selected': '{statue} ya está marcada. Deposita en otra estatua.',
  'feedback.marked': '{statue} marcada con {symbol}.',
  'feedback.swapped': 'Intercambio: {firstSymbol} de {firstStatue} ↔ {secondSymbol} de {secondStatue}.',

  'setup.title': 'Punto de partida',
  'setup.intro': 'Propuesta aleatoria. Cámbiala si quieres recrear una partida real.',
  'setup.callouts': 'Callouts de la sala interior',
  'setup.statues': 'Formas de las estatuas',
  'setup.group-hint': 'Al cambiar uno, elige otro: el tercero se completa solo.',
  'setup.empty': 'Sin elegir',
  'setup.incomplete': 'Completa los callouts y las estatuas para empezar.',
  'setup.warning.starts-solved': 'Aviso: esta estatua empieza sin el símbolo de su callout (ya resuelta): {statues}. No sabemos si eso puede pasar en el juego.',
  'setup.warning.starts-solved.plural': 'Aviso: estas estatuas empiezan sin el símbolo de su callout (ya resueltas): {statues}. No sabemos si eso puede pasar en el juego.',

  'action.start': 'Iniciar entreno',
  'action.propose': 'Otra propuesta',

  'action.new-game': 'Nueva partida',
  'action.restart': 'Reiniciar',
} satisfies Record<string, string>
