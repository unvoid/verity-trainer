# Estética

Minimalista y sencilla, sin artificios. El ambiente de la sala se transmite sobre todo con el color.

No se usan imágenes ni recursos oficiales de Bungie: el estilo es propio, inspirado en el encuentro.

## Referencia visual de la sala

- Dominante muy clara: blanco hueso y lavanda pálido, luz difusa.
- Sombras frías: lavanda que baja a índigo profundo.
- Estatuas en carmesí: el único color saturado y el foco visual.
- Acento cálido puntual: cobre/ámbar.
- Símbolos 2D: siluetas negras con un núcleo de brasa naranja en el centro.
- Formas 3D: sólidos oscuros y mate, con volumen marcado solo por la luz.

## Paleta

Aproximada, pendiente de ajustar con capturas propias. Definida en [`src/lib/theme/tokens.css`](../src/lib/theme/tokens.css).

| Uso | Token base | Color |
|---|---|---|
| Fondo | `--palette-mist` | `#EEF0F6` |
| Lavanda (bordes, secundarios) | `--palette-lavender` | `#A3A8CC` |
| Índigo (texto, símbolos) | `--palette-indigo` | `#2A2C55` |
| Casi negro (siluetas) | `--palette-ink` | `#1E1F3A` |
| Carmesí (estatuas) | `--palette-crimson` | `#9E2443` |
| Cobre (activo, seleccionado, núcleo) | `--palette-copper` | `#C27A4E` |

Los componentes nunca usan la paleta base ni colores sueltos: solo los tokens semánticos (`--color-bg`, `--color-text`, `--color-statue`, `--color-active`…), que cambian con el tema.

## Tipografía

[Inter](https://rsms.me/inter/) (SIL Open Font License), alojada con el proyecto mediante `@fontsource-variable/inter`, con la fuente del sistema como respaldo. Bungie no ha publicado la fuente de la interfaz de Destiny; Inter es una sans-serif neutra de estilo parecido y de uso libre.

## Reglas visuales

- **Tema claro por defecto.** Modo oscuro opcional (`data-theme="dark"`) derivado de las sombras: fondo índigo, símbolos blanco hueso; carmesí y cobre se mantienen.
- **Símbolos 2D:** forma rellena casi negra con degradado radial cobre en el centro (brasa).
- **Formas 3D:** SVG con 2–3 tonos planos para dar volumen. Sin texturas ni librerías 3D.
- **Estatuas:** el carmesí como marco/base de la tarjeta, con la forma 3D encima.
- **Cobre solo para lo activo:** estatua seleccionada, estado en curso, foco.
- Trazos finos que recuerden a las cintas de la sala.

## Controles

Botones, selectores y opciones comparten los tokens `--control-*` de `tokens.css`:

- **Botón principal** (una acción principal por pantalla): relleno índigo, texto claro.
- **Botón secundario:** fondo de superficie y contorno lavanda; al pasar por encima, el contorno se oscurece.
- **Desactivado:** opacidad reducida y cursor `not-allowed`.
- **Foco:** contorno cobre (`:focus-visible`), común a todos los controles.
- **Selectores:** sin apariencia nativa, flecha dibujada en CSS con el color del texto.
- **Avisos:** superficie con contorno lavanda y franja izquierda índigo; no usan cobre, que es solo para lo activo.

Los controles nuevos usan el componente `Button` o estos tokens; nunca estilos propios sueltos.

## Loader (fragmentos)

Indicador de carga inspirado en cómo cambian las siluetas de la pared en el juego: las formas no se transforman de manera continua, se rompen y se recomponen. Ciclo Cuadrado → Triángulo → Círculo.

- **Estilo:** sombras negras (`--color-silhouette`), sin brasa. En el juego las siluetas de la pared son sombras.
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
- Prototipo validado el 11/11/2026.
