# Estética

Minimalista y sencilla, sin artificios. El ambiente de la sala se transmite sobre todo con el color.

No se usan imágenes ni recursos oficiales de Bungie: el estilo es propio, inspirado en el encuentro.

## Referencia visual de la sala

Ambiente frío, brumoso y apagado: grises azulados con un tinte lavanda, luz difusa y sombras de pizarra. Lo único cálido es el granate de las estatuas y el cobre de lo activo, por eso destacan.

### Arte del encuentro

Referencia principal para la escena: el trabajo de Christian Chojnacki para la raid (Bungie), publicado en [ArtStation](https://www.artstation.com/artwork/39KJbB) (sobre todo la primera imagen). Solo como inspiración: no se copia su composición ni se usa ninguna imagen suya.

Lo que tomamos de ella:

- **Cintas:** bandas largas y finas que se estrechan en las puntas y se cruzan en arcos amplios; al cruzarse forman ojivas. Nada es recto ni pesado: la estructura parece tejida.
- **Simetría:** todo se ordena alrededor de un eje central.
- **Luz:** casi blanca, entra desde arriba y el centro; hacia los bordes se apaga en sombras azul lavanda.
- **Piedra pálida con relieve:** las columnas tienen un biselado tallado de líneas curvas que sigue sus bordes.
- **Cuencos tejidos** de cintas cruzadas, como pedestales.
- **Lo único cálido** es el cobre de la esfera central y de la doble hélice.

- Símbolos 2D: siluetas casi negras con un núcleo de brasa cobre en el centro.
- Formas 3D: sólidos granate mate, con volumen marcado solo por la luz.

## Paleta

Extraída de una captura real de la sala de Verity (colores dominantes de la escena). Definida en [`src/lib/theme/tokens.css`](../src/lib/theme/tokens.css).

| Uso | Token base | Color |
|---|---|---|
| Luces altas (fondo, arriba) | `--palette-haze-light` | `#DFE2E8` |
| Luces (fondo, abajo) | `--palette-haze` | `#CDD1DB` |
| Medios | `--palette-mid` | `#969CB0` |
| Pista de interruptor apagado | `--palette-mid-deep` | `#5E647B` |
| Texto secundario | `--palette-slate-soft` | `#3F4353` |
| Texto | `--palette-slate` | `#262A39` |
| Siluetas | `--palette-ink` | `#1F2230` |
| Formas 3D de las estatuas | `--palette-maroon` | `#863B3B` |
| Brasa de los símbolos | `--palette-copper` | `#C27A4E` |
| Contornos de estado y foco | `--palette-copper-deep` | `#9A5530` |
| Luz central de la escena | `--palette-bloom` | `#F4F4F6` |
| Sombras de la bruma | `--palette-periwinkle` | `#6C78A1` |
| Sombras profundas de los bordes | `--palette-dusk` | `#49537C` |

Los tres últimos salen del arte del encuentro: la luz de arriba y las sombras azul lavanda de los bordes. Los tonos claros de la captura del juego ya coincidían con los de ese arte.

Los componentes nunca usan la paleta base ni colores sueltos: solo los tokens semánticos (`--color-bg`, `--color-text`, `--color-statue`, `--color-active`…), que cambian con el tema. Todos los textos y elementos de interfaz cumplen WCAG 2.2 AA sobre el fondo y los planos.

## Tipografía

- **Texto:** fuente del sistema (`-apple-system, system-ui, 'Segoe UI', Roboto, Arial, sans-serif` + emojis del sistema), como bungie.net. Sin descargas.
- **Títulos:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (SIL Open Font License), también usada en bungie.net. Alojada con el proyecto mediante `@fontsource-variable/montserrat`, sin pedir nada a Google Fonts. Token `--font-family-display`.
- **Título de la web y de las secciones:** Montserrat en mayúsculas pequeñas con espaciado (`letter-spacing: 0.08em`). Los títulos de sección van centrados entre dos trazos de cinta que se afinan hacia fuera. Todos usan el componente `SectionTitle`.

## Reglas visuales

- **Escena de fondo** (`SceneBackdrop`), fija al hacer scroll, decorativa y oculta a los lectores de pantalla. De atrás hacia delante:
  1. Degradado de hueso (`--gradient-bg`). Nunca blanco puro.
  2. Luz que entra desde arriba y el centro (`--scene-bloom`).
  3. La sala (`visual/ribbons.ts`), simétrica y con un único punto de fuga:
     - **Suelo** desde el horizonte, que se aclara hacia el primer plano, y un **camino** que llega hasta el primer tercio del fondo.
     - **Bruma sobre el suelo:** un halo blanco radial donde se juntan el final del camino, la base de la espiral y las columnas centrales, por encima de todo ello. Evita que esa zona se vea sucia con tantos finales de línea y la funde en una sola luz, como el suelo nevado y brumoso de la sala.
     - **Cuatro grandes columnas por lado:** sus bases se reparten en profundidad por el suelo (las lejanas, más cerca del centro, más finas y más fundidas con la bruma) y arriba se funden todas en un punto justo encima de la esfera.
     - **Forma de las columnas** (`squircleColumn`): cuarto de superelipse. Sube casi recta, gira en una esquina redondeada y llega horizontal a la fusión, sin pico. El techo es algo menos cuadrado que el lateral para que no quede plano (`COLUMN_SQUARENESS`: `side` 0,88, `top` 0,7). Si imaginamos un espejo en el suelo, cada columna con su reflejo y su pareja del otro lado tiende a un rectángulo horizontal de esquinas redondeadas (squircle), no a un óvalo. Son gruesas en todo su recorrido: si son finas, se leen como cintas.
     - **Dos columnas centrales:** casi simétricas respecto al ecuador de la esfera (arriba y abajo se parecen, sin ser un espejo exacto). Nacen juntas un poco por delante del final del camino, llegando al suelo casi en vertical, se abren hasta tocar la esfera por sus lados a la altura del ecuador (tangentes, sin entrar) y vuelven a acercarse arriba, ya fuera del encuadre, sin juntarse. La forma es simétrica pero el grosor no: anchas junto al suelo y muy finas arriba. Mismas caras y cantos que las laterales.
     - **Espiral** bajo la esfera, del mismo material que las columnas (piedra blanca, cantos finos): tres cintas anchas por lado que se enroscan en sentidos opuestos (se cruzan como un cesto) alrededor de un **cono invertido**, estrecho en el suelo y del radio de la esfera arriba. Sube desde el final del camino hasta un poco por encima de la parte baja de la esfera y se difumina al tocarla, para que parezca que la sostiene. Las vueltas traseras quedan detrás, en penumbra.
     - **La esfera**, sostenida por la espiral: luz casi blanca con un núcleo cálido. **Su parte alta queda unos pocos píxeles por debajo de la fusión de las columnas laterales** (`SPHERE_GAP`): su posición se deriva de la fusión, no se fija a mano. Va **delante de las columnas laterales y detrás de las dos centrales**. La sombra interior se concentra junto al borde y corta en seco, sin halo hacia fuera.
     - **Material de las columnas:** piedra blanca con cantos finos. Una cara frontal ancha y una lateral estrecha (del lado que mira al centro), **planas, sin degradado**; la lateral, un tono más lavanda. Cada canto (los dos bordes y la arista entre las caras) es **un par de líneas finas y nítidas**: una blanca que recoge la luz y, pegada a ella, una de sombra casi del mismo grosor. La sombra no se extiende por la cara. Las líneas tienen el **mismo grosor fino de la base a la punta** (`strip`, en unidades absolutas, no proporcional a la columna: si no, abajo, donde la columna es gruesa y más se ve, saldrían gruesas); solo se afinan en las columnas lejanas. Grosor e intensidad de la luz y la sombra de los cantos se ajustan por separado en `EDGE` (`SceneBackdrop.svelte`); los bordes del camino, en `PATH_EDGE`. **Las bases se funden con el suelo**: el tramo bajo de cada columna se desvanece hasta dejar ver solo el suelo, sin corte ni sombra (laterales, un 30 % de su altura; centrales, un tramo corto justo al tocar el suelo, por eso nacen un poco por delante del final del camino).
     - Quedan fuera por ahora los altares y las cintas de adorno que cruzan las columnas.
  4. Bruma en el centro (`--scene-mist`), que aleja las cintas de lo que se lee, y viñeteado lavanda hacia los bordes (`--scene-vignette`).

  Toda la escena (capas 2 a 4) va muy atenuada (`--scene-opacity`, 0,3): se intuye, no se mira.
- **Tema claro por defecto.** Modo oscuro opcional (`data-theme="dark"`) derivado de las sombras: fondo índigo, símbolos blanco hueso; granate y cobre se mantienen.
- **Símbolos 2D:** forma rellena casi negra con degradado radial cobre en el centro (brasa).
- **Formas 3D (estatuas):** granate `#863B3B` (color de referencia de la comunidad) con 2–3 tonos planos derivados para dar volumen. Sin texturas ni librerías 3D.
- **Estatuas:** la forma 3D reposando en un **cuenco tejido** de cintas (`Cradle`, en dos capas: detrás y delante de la forma), sin nombres visibles (van en la etiqueta accesible). Estado con contornos cobre: marcada (continuo), admite tu símbolo con pistas (fino) y destino de arrastre (discontinuo). La marcada tiene además una **luz cálida** de cobre detrás de la forma (`--glow-warm`), como la esfera de la sala.
- **Cobre solo para lo activo:** estatua seleccionada, estado en curso, foco. Dos formas: **contorno nítido** para lo seleccionado y **halo cálido difuso** (`--glow-ready`) en la tile del callout cuyo compañero ya puede salir.
- Las cintas de la sala son el motivo que se repite: fondo, cuencos y trazos de los títulos. Siempre con la misma geometría (`ribbonPath`): eje curvo y grosor variable. Lo que nace del suelo (columnas y arcos) es ancho en su base y se afila al subir; lo que no lo toca (la banda, los cuencos) se afila en las dos puntas.
- **Simpleza de inspiración japonesa:** espacio vacío, contención, nada de adorno.
- **Zonas separadas por material, nunca por líneas.** Dos materiales:
  - **Piedra** (`--color-stone`): velo claro y esmerilado (`backdrop-filter`) sobre la escena, como la piedra pálida de la sala. Lo usan la cabecera, las tiles del tablero y los selectores del editor.
  - **Planos de tono** (`--color-surface`): velos translúcidos de pizarra (6 %, 11 % al pasar por encima) para el panel de ogros, el manual y los botones secundarios.
  - Las superficies flotantes (panel de ajustes, resumen, avisos) son opacas (`--color-surface-raised`).
- **Tile** (clase global `.tile` en `base.css`): la pieza común del tablero. Sala interior, sala de disección, símbolos de los caballeros y selectores del editor usan la misma tile, con el mismo tamaño de símbolo y una sola etiqueta corta debajo (`.tile-label`): la posición (Izquierda, Centro, Derecha) en las tres zonas, o el estado con rondas ("Usado", "Caducado"). Es de piedra y no es una caja cuadrada:
  - **Arco** arriba (`--tile-arch`): un único arco elíptico de lado a lado, como los arcos de la sala; abajo, esquinas pequeñas.
  - **Biselado en relieve:** luz en el canto de arriba (`--bevel-light`) y sombra en el de abajo (`--bevel-shade`), más una sombra suave bajo la piedra (`--shadow-stone`).
  - **Surco interior** paralelo al borde (sombra arriba, luz abajo), como el relieve curvo de las columnas.
  - Un componente que añade sombras conserva las de la piedra con `var(--tile-shadow)`.
- **Las únicas líneas que separan o marcan son señales:** los contornos cobre de los estados activos (símbolo que llevas, estatua marcada, opción elegida) y el foco de teclado. El relieve de la piedra y las cintas son luz y materia, no estructura. No existe un token de borde estructural.
- **Composición simétrica:** títulos de sección y sus ayudas, centrados. El resto de textos (estado, avisos, manual) a la izquierda. Las etiquetas bajo un icono van centradas bajo su icono.
- **Cabecera a todo el ancho**, de piedra, con su contenido también a todo el ancho (título a la izquierda, controles a la derecha), sin alinearse con el tablero. Su borde inferior es un canto fino: línea de sombra y, debajo, una de luz. Ajustes e idioma como controles sin fondo, en índigo; al pasar por encima aparece un plano suave.

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

## Estado y avisos (nada se mueve)

La interfaz no se desplaza al jugar. Se separan dos tipos de información:

- **Estado** (intercambios, símbolo que llevas, intercambios mínimos pendientes con pistas): en una zona fija bajo los símbolos de los caballeros. Las líneas reservan su hueco aunque estén vacías.
- **Eventos** (marcar, intercambiar, rechazos, avisos del editor): como **toast**, abajo y centrado en el ancho del contenido. Uno a la vez (el siguiente sustituye al anterior), sin botón de cerrar, con fundido suave. Desaparecen solos: 2,5 s los informativos y 4 s los errores, que llevan una franja granate a la izquierda. Se anuncian a lectores de pantalla.
- En el editor, el motivo de que "Iniciar entreno" esté desactivado queda además en la descripción accesible del botón.
- Con símbolos por rondas, el panel de ogros es un hueco fijo y las tiles de los caballeros reservan el sitio de la barra de caducidad.

## Bruma

Capa irregular sobre la escena, en todo el viewport, por debajo del contenido (`SceneMist`). Da a la escena vectorial una sensación orgánica, como de aire.

- **Ruido fractal** (`feTurbulence`, en `visual/mist.ts`) convertido en jirones: el ruido medio queda casi transparente y solo las zonas densas forman nubes. Blanco hueso (`--color-mist`).
- **Varias capas** con nubes de distinto tamaño que se mueven en direcciones distintas: al cruzarse, la forma cambia sin parar y nunca parece un dibujo que se desliza en bloque.
- **Viento muy suave:** cada capa recorre un camino irregular con aceleraciones y frenadas (ciclos de 40 a 140 s según el ajuste) y "respira" como en ráfagas.
- **Reparto:** en todo el viewport, también sobre el tablero (animada, ahí también suma); solo algo más densa en los bordes y abajo (`--mist-density`). Intensidad general: `--mist-opacity`.
- **Rendimiento:** el ruido se pinta una sola vez como máscara y solo se mueven las capas (`transform` y `opacity`), que lo hace la tarjeta gráfica. Nunca se anima el ruido en sí, que obligaría a recalcularlo en cada fotograma.
- Con `prefers-reduced-motion`, quieta.
- **Ajustes** en `visual/mist.ts`: dos ajustes completos para comparar, `calm` (casi quieta) y `breeze` (viento suave que se percibe), elegidos con `MIST_PRESET`. Cada uno define sus capas (tamaño, frecuencia, intensidad, duración, recorrido, ráfagas), la forma de los jirones (`contrast`, `threshold`) y su intensidad (`strength`).

## Pendiente

- **Polvo de nieve (partículas).** Propuesta acordada, sin implementar.
  - **Cómo es en el arte:** miles de motas diminutas (casi de un píxel), blancas con un toque cálido en algunas zonas, agrupadas en jirones como una nebulosa: bandas densas y huecos casi vacíos, no una lluvia uniforme. Unas pocas motas más grandes y brillantes, algunas con un pequeño destello en cruz. Máxima concentración alrededor y dentro de la esfera; en el juego hay un polvo más disperso por toda la escena.
  - **Técnica:** un `<canvas>` 2D a pantalla completa, entre la escena y la bruma, con su propia intensidad (no la atenuación de la escena). Canvas porque son miles de puntos independientes: con SVG o HTML serían miles de elementos.
  - **Reparto:** posiciones sacadas de un ruido como el de la bruma, para que salgan jirones. Muy concentrado alrededor de la esfera y disperso por el resto. El canvas usa el mismo encuadre que el SVG de la sala (lienzo 1600×1000, `slice`), así que la nube queda sobre la esfera con cualquier tamaño de ventana.
  - **Movimiento:** deriva lenta en la dirección del viento de la bruma, un leve giro alrededor de la esfera, parpadeo de cada mota a su ritmo y algún destello ocasional.
  - **Rendimiento:** limitar a ~30 fotogramas por segundo (basta para algo tan lento), menos partículas en pantallas pequeñas y resolución limitada; se pausa solo con la pestaña oculta. Con `prefers-reduced-motion`, una imagen quieta. Vigilar la batería en móvil.
  - **Parámetros para ajustar a ojo**, como la bruma: cantidad, tamaño, densidad junto a la esfera frente al resto, velocidad, parpadeo y frecuencia de destellos.
  - **Ajuste para el jugador:** un interruptor en el panel de ajustes para desactivarlas (activadas por defecto), guardado con el resto en `stores/settings.ts`. Es una preferencia visual, no una funcionalidad de la versión: no necesita interruptor en `features.ts`. Textos en `en.ts` y `es.ts`; añadirlo también a la lista `SETTINGS` del manual (`UsageGuide.svelte`), que no se genera sola.
- **Canto en los botones y sus estados.** Al usuario le ha gustado el canto de la cabecera (una línea fina de sombra y, pegada debajo, una de luz, sin sombra difusa: el mismo lenguaje que los cantos de las columnas de la escena). Idea por explorar: llevarlo a los botones y jugar con él en sus estados, por ejemplo que al pasar por encima el canto cambie (se invierta la luz y la sombra, como un relieve que se hunde, o se intensifique) en lugar de solo oscurecerse el plano. Respetar las reglas de los controles: sin desplazamiento al pulsar, foco con contorno cobre y cobre solo para lo activo.
- **Modo oscuro:** los tokens están definidos, pero aún no hay un control para activarlo.

## Favicon

Triángulo negro estático (`public/favicon.svg`): el primer símbolo que aparece en la raid, con la misma silueta que los símbolos y el loader. Con las pestañas del navegador en modo oscuro, pasa a claro. Sin animación: los favicons SVG animados solo se ven en Firefox, y animarlos con JavaScript costaría CPU y daría saltos en pestañas en segundo plano.

## Loader (fragmentos)

Indicador de carga inspirado en cómo cambian las siluetas de la pared en el juego: las formas no se transforman de manera continua, se rompen y se recomponen. Ciclo Cuadrado → Triángulo → Círculo.

- **Estilo:** sombras negras (`--color-silhouette`), sin brasa, como las siluetas de la pared en el juego. Es una excepción del loader: los símbolos 2D del resto de la web mantienen la brasa cobre.
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
- **Dónde se ve:** en la pantalla de entrada (`SplashScreen`), al abrir la web, en modo "una vez" (`ShardLoader once`):
  1. Capa con el color de fondo de la web (sin blanco).
  2. Fundido de entrada del título y el triángulo, quietos (0,4 s).
  3. Animación triángulo → círculo → cuadrado, que termina con el cuadrado entero.
  4. Fundido de salida del título y el cuadrado (0,4 s, simétrico al de entrada).
  5. Con ambos ya desaparecidos, fundido de la capa: el contenido de la app aparece con un fundido y un escalado de 0,97 a 1 (la cabecera no se escala).
  En total ~4 s con el ciclo de 3,6 s. Tiempos en `visual/loaderTimeline.ts`. Con movimiento reducido: triángulo estático, fundidos breves y sin escalado. El componente sigue teniendo modo bucle por si algún día hay cargas reales.
