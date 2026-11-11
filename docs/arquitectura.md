# Arquitectura

Proyecto personal y de aprendizaje: prioridad a código limpio y bien estructurado sobre velocidad.

## Principios

- **Una responsabilidad clara** por módulo y componente.
- **Dominio separado de la UI:** reglas, intercambios, validación y solucionador en TypeScript puro, sin dependencias de Svelte. Testeable y reutilizable.
- **Funciones puras** en el dominio: reciben un estado y devuelven uno nuevo, sin mutarlo. Nada de reloj ni aleatoriedad escondidos: se inyectan (`startedAt`, `random`).
- **Estado centralizado** en stores de Svelte. Los componentes leen el estado y emiten acciones; no contienen reglas del juego.
- **Componentes pequeños y parametrizables por props.** Sin valores fijos escondidos (tamaños, colores, tiempos, textos).
- **Colores solo mediante variables CSS** del tema (ver [estetica.md](estetica.md)).

## Estructura

```
src/
  lib/
    domain/            # TypeScript puro, sin Svelte
      types.ts         # Symbol2D, Shape3D, Slot, GameState, Scenario...
      shapes.ts        # composición/descomposición, isPure
      rules.ts         # validación del punto de partida, condición de victoria
      swap.ts          # depósito e intercambio
      solver.ts        # BFS y secuencia mínima
      scenarios.ts     # generación de escenarios válidos
    stores/
      game.ts          # estado de la partida
      settings.ts      # ajustes persistidos en localStorage
    components/        # Symbol2D, Shape3D, Statue, CalloutPanel, Toolbox, GameStatus,
                       # SettingsPanel, StartPointEditor, SolverPanel,
                       # ResultModal, ShapeMorphLoader, LanguageSelector, UsageGuide
    i18n/
      core.ts          # tipos y funciones puras (translate, resolveLocale)
      es.ts            # textos en español (idioma base de las claves)
      en.ts            # textos en inglés
      index.ts         # store del idioma y función t()
    theme/
      tokens.css       # paleta y variables
      base.css         # estilos globales mínimos
  App.svelte
tests/                 # Vitest, misma estructura que src/lib
```

## Stack

- **Vite + Svelte 5 + TypeScript**, **Vitest** para el dominio.
- Web estática; despliegue en cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
- Formas en **SVG**, sin librerías 3D.
- Astro descartado por ahora: es una única pantalla muy interactiva. Si en el futuro forma parte de una plataforma mayor, los componentes Svelte se integran en Astro como islas.

## Puntos de extensión

### Rondas de símbolos

Hoy los símbolos están siempre disponibles, como en el original. Si se quiere un modo por rondas (símbolos que se gastan, caballeros y ogros que hay que matar; ver [mecanica.md](mecanica.md#elementos)), el diseño ya lo permite sin rehacer nada:

- **Caja de símbolos:** `Toolbox` acepta `available`, la disponibilidad por caballero.
- **Store de la partida:** todo depósito pasa por `depositAt`; ahí se marcaría el símbolo como gastado.
- **Lógica de rondas:** iría en el dominio (p. ej. `domain/drops.ts`) como funciones puras: matar caballero, gastar símbolo, nueva ronda. Los tiempos (desaparición a los 10 s, reaparición) se inyectarían igual que `now`.

## Interacción

Dos formas de interactuar, **completas y equivalentes**:

1. **Arrastrar y soltar** un símbolo hasta una estatua.
   - Con **Pointer Events** (ratón, dedo y lápiz con el mismo código), no con la API de drag and drop de HTML5, cuyo soporte en móvil es irregular.
   - `touch-action` en los elementos arrastrables para no chocar con el scroll.
   - Alternativa si se complica: `svelte-dnd-action`.
2. **Tocar y tocar:** tocar un símbolo (queda resaltado en cobre) y luego una estatua. Más preciso en móvil y base del manejo con teclado.

## Accesibilidad

- Navegable con teclado: tabulador para moverse, Enter/Espacio para seleccionar y depositar.
- Etiquetas accesibles en símbolos, estatuas y estado.
- `prefers-reduced-motion` respetado en todas las animaciones.

## Idiomas

- Español e inglés. Ningún texto fijo en los componentes: todo pasa por `t(clave, parámetros)`.
- `es.ts` es el idioma base: el tipo de las claves se deriva de él, y TypeScript da error si a otro idioma le falta o le sobra una clave.
- Idioma inicial: el guardado en `localStorage` o, si no hay, el del navegador; si no es ninguno de los dos, inglés.
- Al cambiar de idioma se actualiza `<html lang>`.
- Identificadores del código en inglés; comentarios y documentación en español.

### Manual de uso

Breve y en ambos idiomas, accesible desde la web (`UsageGuide`):

- Objetivo del encuentro y del simulador.
- Cómo hacer un intercambio (arrastrando o tocando).
- Condición de victoria en modo normal y en Challenge Mode.
- Qué hace cada ajuste.
- Cómo usar el editor de punto de partida y el solucionador.
