# Estética

Minimalista y sencilla, sin artificios. El ambiente de la sala se transmite sobre todo con el color.

No se usan imágenes ni recursos oficiales de Bungie: el estilo es propio, inspirado en el encuentro.

## Referencia visual de la sala

- Dominante muy clara: blanco hueso y lavanda pálido, luz difusa.
- Sombras frías: lavanda que baja a índigo profundo.
- Estatuas en granate: el único color cálido intenso y el foco visual.
- Acento cálido puntual: cobre/ámbar.
- Símbolos 2D: siluetas negras con un núcleo de brasa naranja en el centro.
- Formas 3D: sólidos oscuros y mate, con volumen marcado solo por la luz.

## Paleta

Aproximada, pendiente de ajustar con capturas propias. Definida en [`src/lib/theme/tokens.css`](../src/lib/theme/tokens.css).

| Uso | Token base | Color |
|---|---|---|
| Fondo (blanco hueso) | `--palette-bone` | `#EFEBE4` |
| Planos (lavanda muy pálido, mezclado con lavanda) | `--palette-mist` | `#EEF0F6` |
| Lavanda (bordes, secundarios) | `--palette-lavender` | `#A3A8CC` |
| Índigo (texto, símbolos) | `--palette-indigo` | `#2A2C55` |
| Casi negro (siluetas) | `--palette-ink` | `#1E1F3A` |
| Granate (formas 3D de las estatuas) | `--palette-maroon` | `#863B3B` |
| Cobre (activo, seleccionado, núcleo) | `--palette-copper` | `#C27A4E` |

Los componentes nunca usan la paleta base ni colores sueltos: solo los tokens semánticos (`--color-bg`, `--color-text`, `--color-statue`, `--color-active`…), que cambian con el tema.

## Tipografía

- **Texto:** fuente del sistema (`-apple-system, system-ui, 'Segoe UI', Roboto, Arial, sans-serif` + emojis del sistema), como bungie.net. Sin descargas.
- **Títulos:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (SIL Open Font License), también usada en bungie.net. Alojada con el proyecto mediante `@fontsource-variable/montserrat`, sin pedir nada a Google Fonts. Token `--font-family-display`.
- **Título de la web y de las secciones:** Montserrat en mayúsculas pequeñas con espaciado (`letter-spacing: 0.08em`), centrado. Todos los títulos de sección usan el componente `SectionTitle`.
- Pendiente: revisión tipográfica general (tamaños, pesos, interlineado).

## Reglas visuales

- **Fondo blanco hueso con luz difusa:** degradado vertical muy suave (`--gradient-bg`), de hueso arriba a hueso con un toque lavanda abajo, fijo al hacer scroll. Nunca blanco puro.
- **Tema claro por defecto.** Modo oscuro opcional (`data-theme="dark"`) derivado de las sombras: fondo índigo, símbolos blanco hueso; granate y cobre se mantienen.
- **Símbolos 2D:** forma rellena casi negra con degradado radial cobre en el centro (brasa).
- **Formas 3D (estatuas):** granate `#863B3B` (color de referencia de la comunidad) con 2–3 tonos planos derivados para dar volumen. Sin texturas ni librerías 3D.
- **Estatuas:** solo la forma 3D, sin tarjeta ni nombres visibles (los nombres van en la etiqueta accesible). Estado con contornos cobre: marcada (continuo), admite tu símbolo con pistas (fino) y destino de arrastre (discontinuo).
- **Cobre solo para lo activo:** estatua seleccionada, estado en curso, foco.
- Trazos finos que recuerden a las cintas de la sala.
- **Simpleza de inspiración japonesa:** espacio vacío, contención, nada de adorno.
- **Una sola forma de separar zonas: planos de tono, nunca líneas.** Planos en lavanda pálido (`--color-surface`), algo más oscuros y fríos que el fondo hueso, como papel sobre papel. Lo usan la cabecera, las tiles del tablero, los selectores del editor, el panel de ogros, los avisos y los botones secundarios. Los planos son velos translúcidos de pizarra (6 %, 11 % al pasar por encima), así que la diferencia con el fondo es igual de sutil en todo el degradado. Las superficies flotantes (panel de ajustes, resumen) son opacas (`--color-surface-raised`).
- **Tile** (clase global `.tile` en `base.css`): la pieza común del tablero. Sala interior, sala de disección y símbolos de los caballeros usan la misma tile, con el mismo tamaño de símbolo y una sola etiqueta corta debajo (`.tile-label`): la posición (Izquierda, Centro, Derecha) en las tres zonas, o el estado con rondas ("Usado", "Caducado").
- **Las únicas líneas son señales, no estructura:** los contornos cobre de los estados activos (símbolo que llevas, estatua marcada, opción elegida) y el foco de teclado. No existe un token de borde estructural.
- **Textos alineados a la izquierda:** títulos, ayudas y avisos. Las etiquetas bajo un icono en una columna van centradas bajo su icono.
- **Cabecera a todo el ancho** sobre un plano, con su contenido alineado con el tablero (`--content-width`). Ajustes e idioma como controles sin fondo, en índigo; al pasar por encima aparece un plano suave.

## Controles

Botones, selectores y opciones comparten los tokens `--control-*` de `tokens.css`:

- **Botón principal** (una acción principal por pantalla): relleno índigo, texto claro.
- **Botón de icono** (`Button icon`): cuadrado, solo icono, con `aria-label`, a la altura pequeña (`--control-height-sm`). En la cabecera, variante `ghost`: sin borde ni fondo, icono gris que pasa a índigo al pasar por encima. Iconos de dibujo propio (p. ej. `GearIcon`).
- **Cabecera:** ajustes e idioma a la misma altura pequeña.
- **Sin efecto de pulsado:** los botones no se desplazan al pulsarlos.
- **Botón secundario:** plano de superficie sin borde; al pasar por encima, el plano se oscurece un poco.
- **Desactivado:** opacidad reducida y cursor `not-allowed`.
- **Foco:** contorno cobre (`:focus-visible`), común a todos los controles.
- **Selectores:** sin apariencia nativa, flecha dibujada en CSS con el color del texto. El de idioma va sin etiqueta visible (la lleva en `aria-label`) y en tamaño pequeño.
- **Interruptores:** pista de tono (`--color-track`) sin borde; activado, pista índigo.
- **Avisos:** plano de superficie; no usan cobre, que es solo para lo activo.

Los controles nuevos usan el componente `Button` o estos tokens; nunca estilos propios sueltos.

## Loader (fragmentos)

Indicador de carga inspirado en cómo cambian las siluetas de la pared en el juego: las formas no se transforman de manera continua, se rompen y se recomponen. Ciclo Cuadrado → Triángulo → Círculo.

- **Estilo:** sombras negras (`--color-silhouette`), sin brasa, como las siluetas de la pared en el juego. Es una excepción del loader: los símbolos 2D del resto de la web mantienen la brasa cobre (decisión del 11/11/2026).
- **Cortes rectos:**
  - Cuadrado y triángulo: dos mitades por un corte horizontal.
  - Círculo: tres quesitos iguales desde el centro.
- **Cada forma (~1,6 s):**
  1. Se recompone desde sus trozos sueltos mientras la anterior se rompe (las dos se superponen).
  2. Se queda entera ~1 s. Mientras está entera se dibuja una sola pieza; el cambio de trozos a pieza es instantáneo y ocurre cuando los trozos ya han encajado del todo.
  3. Se rompe: los trozos se separan unos píxeles, giran un poco y se sesgan (`skewX`); la forma entera gira y se encoge al 50 % mientras se desvanece.
- **Giro de la forma:** entra girada (−35°) y se endereza; sale girando (30°).
- **Técnica:** SVG con `clipPath` por forma y trozos con `transform` + `opacity` en CSS. Sin JavaScript en la animación; geometría precalculada.
- **Sin costuras ni saltos al recomponerse:**
  - Los trozos se solapan unas décimas por el corte (0,6 unidades en las mitades; ±1,5° y el vértice retrasado 1,5 unidades en los quesitos, para cubrir también el centro). Como son opacos, el solape no se ve.
  - La pieza entera usa el mismo `clipPath` que los trozos, para que los bordes se suavicen igual.
  - Giro, escala y encaje terminan un poco antes (9 % del ciclo) que el cambio a la pieza entera (11 %): los últimos fotogramas ya están en reposo y el cambio no se nota.
- **Sin destello:** los trozos entran opacos casi de inmediato y solo se desvanecen al final de la rotura.
- **Parámetros:** tamaño, duración del ciclo, separación, giro y sesgo de los trozos.
- Con `prefers-reduced-motion`: una forma estática.
- **Dónde se ve:** en la pantalla de entrada (`SplashScreen`), al abrir la web, durante un mínimo de 2,6 s aunque no haya nada que cargar: el cuadrado se forma, se rompe y entra el triángulo; después, fundido a la app. Con movimiento reducido, cuadrado estático y 0,8 s. El componente `ShardLoader` es reutilizable si algún día hay cargas reales.
- Prototipo validado el 11/11/2026.
