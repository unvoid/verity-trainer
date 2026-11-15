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
      editor.ts        # edición del punto de partida: opciones válidas y autocompletado
      drops.ts         # símbolos por rondas: caballeros, caducidad, ogros
      scenarios.ts     # generación de escenarios válidos
    stores/
      game.ts          # estado de la partida
      drag.ts          # arrastre en curso (símbolo, posición, estatua debajo)
      setup.ts         # punto de partida en edición (propuesta aleatoria personalizable)
      settings.ts      # ajustes del jugador, persistidos en localStorage
      clock.ts         # hora actual para cuentas atrás (solo corre con suscriptores)
      toast.ts         # avisos efímeros: uno a la vez, desaparecen solos
      viewport.ts      # punto de corte y tabla de tamaños de las piezas (normal / compacto)
      theme.ts         # tema claro / oscuro: claro por defecto, elección guardada y data-theme
    actions/
      dragSymbol.ts    # arrastrar y soltar con Pointer Events
    features.ts        # funcionalidades disponibles en la versión (interruptores de compilación)
    visual/
      silhouettes.ts   # siluetas de los símbolos 2D (compartidas)
      shards.ts        # geometría del loader de fragmentos
      ribbons.ts       # geometría de las cintas (fondo de escena y cuencos de las estatuas)
      mist.ts          # bruma: mosaicos de ruido y capas que mueve el viento
      tileShape.ts     # contorno curvo de las tiles de piedra (cuartos de superelipse)
      dust.ts          # polvo de nieve: reparto, movimiento y encuadre de las motas
    components/        # Button, Switch, Symbol2D, Shape3D, Statue, CalloutPanel, Toolbox,
                       # GameStatus, DragLayer, SlotPicker, LifeBar, OgrePanel, SectionTitle, GearIcon,
                       # SettingsPanel, StartPointEditor, SolverPanel,
                       # ResultModal, ShardLoader, SplashScreen, Drawer, SettingsDrawer, HelpDrawer,
                       # HelpIcon, ToastMessage, LanguageSelector, UsageGuide,
                       # SceneBackdrop, SceneMist, SceneVignette, SnowDust, Cradle, TileFrame, KnightIcon, OgreIcon,
                       # ThemeToggle, ThemeIcon, Tooltip, HeartIcon, GitHubIcon, HeaderEdge
    i18n/
      core.ts          # tipos y funciones puras (translate, translatePlural)
      feedback.ts      # redacción de los avisos de la partida (para el toast)
      en.ts            # textos en inglés (idioma base de las claves)
      es.ts            # textos en español
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

## Funcionalidades y ajustes

Dos niveles distintos:

| Nivel | Quién decide | Dónde |
|---|---|---|
| **Funcionalidad disponible** | Quien publica, al compilar | `features.ts`, variables `VITE_FEATURE_*` (ver `.env.example`) |
| **Ajuste** | El jugador, en la web | `stores/settings.ts`, guardado en `localStorage` |

- Una funcionalidad desactivada no aparece en la interfaz, y su ajuste se ignora aunque el jugador lo tuviera guardado (`activeSettings`).
- El código de una funcionalidad desactivada sigue en el build (solo se oculta y se ignora). Es suficiente para no exponerla; si algún día importa el tamaño, se puede hacer que el minificador la elimine.
- Funcionalidades: `hints` (pistas), `challengeMode` (modo desafío), `symbolRounds` (símbolos por rondas; desactivada por defecto hasta implementarla).
- **Archivos de entorno:** `.env.production` (en el repositorio) es la configuración publicada; la usa `vite build`, también en Vercel. `.env` es la configuración local de desarrollo y git lo ignora: cada uno activa ahí lo que quiera probar. `.env.example` es la plantilla. No contienen secretos; si algún día hiciera falta uno, iría en las variables de Vercel, nunca en un archivo del repositorio.
- Una variable sin definir deja la funcionalidad **activada**: `.env.production` debe definirlas todas.

## Símbolos por rondas

Implementado en `domain/drops.ts` (funciones puras con la hora inyectada) y en el store de la partida:

- El store guarda el estado de las rondas (`drops`) solo si la partida se inicia con el ajuste activo.
- `tick()` avanza el tiempo; la app lo llama cada 200 ms mientras hay una partida con rondas en curso. Si no pasa nada, el store no cambia.
- Las cuentas atrás visibles usan `stores/clock.ts`, que solo corre mientras hay componentes que lo usan.
- Los tiempos (15 s de caducidad, 3 s de vuelta) son `DEFAULT_TIMINGS` y se pueden inyectar.

## Interacción

Dos formas de interactuar, **completas y equivalentes**:

1. **Arrastrar y soltar** un símbolo hasta una estatua.
   - Con **Pointer Events** (ratón, dedo y lápiz con el mismo código), no con la API de drag and drop de HTML5, cuyo soporte en móvil es irregular.
   - `touch-action` en los elementos arrastrables para no chocar con el scroll.
   - Implementado como action (`use:dragSymbol`) sin librerías: el arrastre empieza a partir de 6 px de movimiento (antes es un toque normal), los destinos se marcan con `data-drop-slot`, y Escape o `pointercancel` lo cancelan.
2. **Tocar y tocar:** tocar un símbolo (queda resaltado en cobre) y luego una estatua. Más preciso en móvil y base del manejo con teclado.

## Accesibilidad

- Navegable con teclado: tabulador para moverse, Enter/Espacio para seleccionar y depositar.
- Etiquetas accesibles en símbolos, estatuas y estado.
- `prefers-reduced-motion` respetado en todas las animaciones.

## Idiomas

- Español e inglés. Ningún texto fijo en los componentes: todo pasa por `t(clave, parámetros)`.
- `en.ts` es el idioma base: el tipo de las claves se deriva de él, y TypeScript da error si a otro idioma le falta o le sobra una clave.
- Idioma por defecto: **inglés**. El español solo se usa si el jugador lo elige; la elección se guarda en `localStorage`. No se detecta el idioma del navegador.
- Al cambiar de idioma se actualiza `<html lang>`.
- Identificadores del código en inglés; comentarios y documentación en español.
- Plurales con claves `.one` / `.other` y `tn()`. Tono y vocabulario: [tono.md](tono.md).

### Manual de uso

Breve y en ambos idiomas, en un panel lateral abierto con el icono de ayuda de la cabecera (`HelpDrawer` → `UsageGuide`). Ajustes y manual comparten el mismo panel (`Drawer`).

- El encuentro, las formas (cada forma 3D con sus dos símbolos, con los iconos de la web), cómo hacer un intercambio (tocando, arrastrando o con teclado), el objetivo y el punto de partida.
- Los ajustes reutilizan las descripciones del panel de ajustes. Los que no están disponibles en la versión publicada (`features.ts`) se muestran con **"Próximamente"**; al activar uno, la nota desaparece sola.

## Git

- **Autoría única:** todos los commits van firmados por `unvoid <unvoid.thinks@gmail.com>`, que GitHub enlaza con la cuenta `unvoid`: el repositorio tiene un solo contribuidor. La identidad se configura **solo para este repositorio** (`git config user.name` / `user.email`), nunca la global: el ordenador puede tener otra (p. ej. la del trabajo).
- **Comprobación antes de cada commit:** el hook `.githooks/pre-commit` compara autor y committer con esa identidad y, si no coinciden, cancela el commit y explica cómo arreglarlo. Se activa solo en cualquier ordenador al hacer `npm install` (script `prepare`, que apunta `core.hooksPath` a `.githooks`). En un clon nuevo, `npm install` antes del primer commit.
- Si alguna vez entra un commit con otra identidad, se reescribe su autor antes de subirlo; si ya estaba subido, se reescribe y se hace force push, avisando antes.
- Mensajes de commit en inglés con Conventional Commits.
