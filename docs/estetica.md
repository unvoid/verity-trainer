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

## ShapeMorphLoader

Indicador de carga que transforma Círculo → Cuadrado → Triángulo.

- Bucle de ida y vuelta (`animation-direction: alternate`), con una pausa en cada forma.
- Hecho con `clip-path: polygon()`. Las tres formas son polígonos con el **mismo número de puntos**, todos empezando arriba y en sentido horario, para que la transición no se retuerza.
- Los puntos se reparten por el perímetro de cada forma e incluyen siempre sus vértices.
- Núcleo cobre con degradado radial; en el triángulo baja ligeramente hacia su centro visual.
- Parámetros: número de puntos, duración del ciclo, pausa, tamaño, colores.
- Con `prefers-reduced-motion`: forma estática.
- Prototipo validado: 48 puntos, ciclo de 3,6 s, pausa del 12 % en cada forma.
