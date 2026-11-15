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
| Canto y mando del interruptor apagado | `--palette-mid-deep` | `#5E647B` |
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

- **Pantallas estrechas** (menos de 48rem, 768 px sin incluirlos: móvil y tablet en vertical): símbolos y formas se reducen un ~20 % para que el tablero respire. La tabla de tamaños y el punto de corte están en `stores/viewport.ts` (`PIECE_SIZES`); los componentes reciben el tamaño por props. El título de la cabecera baja a `--font-size-xs`, para que quepa en una línea. Lo que se dibuja fuera de las piezas (sombras, halos, foco) nunca crea scroll horizontal (`overflow-x: clip` en `#app`).
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
     - **La esfera**, sostenida por la espiral: luz casi blanca con un núcleo cálido. **Su parte alta queda unos pocos píxeles por debajo de la fusión de las columnas laterales** (`SPHERE_GAP`): su posición se deriva de la fusión, no se fija a mano. Va **delante de las columnas laterales y detrás de las dos centrales**. La sombra interior, suave y aclarada, da el volumen; el contorno lleva el mismo canto que las columnas (luz en el borde y sombra pegada por dentro, con los valores de `EDGE`). Sin halo hacia fuera.
     - **Material de las columnas:** piedra blanca con cantos finos. Una cara frontal ancha y una lateral estrecha (del lado que mira al centro), **planas, sin degradado**; la lateral, un tono más lavanda. Cada canto (los dos bordes y la arista entre las caras) es **un par de líneas finas y nítidas**: una blanca que recoge la luz y, pegada a ella, una de sombra casi del mismo grosor. La sombra no se extiende por la cara. Las líneas tienen el **mismo grosor fino de la base a la punta** (`strip`, en unidades absolutas, no proporcional a la columna: si no, abajo, donde la columna es gruesa y más se ve, saldrían gruesas); solo se afinan en las columnas lejanas. Grosor e intensidad de la luz y la sombra de los cantos se ajustan por separado en `EDGE` (`SceneBackdrop.svelte`); los bordes del camino, en `PATH_EDGE`. **Las bases se funden con el suelo**: el tramo bajo de cada columna se desvanece hasta dejar ver solo el suelo, sin corte ni sombra (laterales, un 30 % de su altura; centrales, un tramo corto justo al tocar el suelo, por eso nacen un poco por delante del final del camino).
     - Quedan fuera por ahora los altares y las cintas de adorno que cruzan las columnas.
  4. Bruma en el centro (`--scene-mist`), que aleja las cintas de lo que se lee.
  5. Viñeteado lavanda hacia los bordes (`SceneVignette`, `--scene-vignette`), en su propia capa por encima de la bruma animada y con su propia intensidad (`--scene-vignette-opacity`, 0,9): el azul de los bordes se siente aunque la sala apenas se intuya.

  La escena (capas 2 a 4) va algo atenuada (`--scene-opacity`, 0,8).
- **Tema claro por defecto.** Modo oscuro opcional (`data-theme="dark"`) derivado de las sombras: fondo índigo, símbolos blanco hueso; granate y cobre se mantienen.
- **Símbolos 2D:** forma rellena casi negra con degradado radial cobre en el centro (brasa).
- **Formas 3D (estatuas):** granate `#863B3B` (color de referencia de la comunidad) con 2–3 tonos planos derivados para dar volumen. Sin texturas ni librerías 3D.
- **Estatuas:** la forma 3D reposando en un **cuenco tejido** de cintas (`Cradle`, en dos capas: detrás y delante de la forma), sin nombres visibles (van en la etiqueta accesible). Estado con contornos cobre: marcada (continuo), admite tu símbolo con pistas (fino) y destino de arrastre (discontinuo). La marcada tiene además una **luz cálida** de cobre detrás de la forma (`--glow-warm`), como la esfera de la sala.
- **Cobre solo para lo activo:** estatua seleccionada, estado en curso, foco. Dos formas: **contorno nítido** para lo seleccionado y **halo cálido difuso** (`--color-glow-ready`) en la tile del callout cuyo compañero ya puede salir.
- Las cintas de la sala son el motivo que se repite: fondo, cuencos y trazos de los títulos. Siempre con la misma geometría (`ribbonPath`): eje curvo y grosor variable. Lo que nace del suelo (columnas y arcos) es ancho en su base y se afila al subir; lo que no lo toca (la banda, los cuencos) se afila en las dos puntas.
- **Simpleza de inspiración japonesa:** espacio vacío, contención, nada de adorno.
- **Zonas separadas por material, nunca por líneas.** Dos materiales:
  - **Piedra** (`--color-stone`): velo claro y esmerilado (`backdrop-filter`) sobre la escena, como la piedra pálida de la sala. Lo usan la cabecera, las tiles del tablero, los selectores del editor y los botones secundarios.
  - **Planos de tono** (`--color-surface`): velos translúcidos de pizarra (6 %, 11 % al pasar por encima) para el manual.
  - Las superficies flotantes (panel de ajustes, resumen, avisos) son opacas (`--color-surface-raised`).
- **Tile** (clase global `.tile` en `base.css`): la pieza común del tablero. Sala interior, sala de disección, símbolos de los caballeros y selectores del editor usan la misma tile, con el mismo tamaño de símbolo y una sola etiqueta corta debajo (`.tile-label`): la posición (Izquierda, Centro, Derecha) en las tres zonas, o el estado con rondas ("Usado", "Caducado"). Es de piedra y no es una caja: **su contorno no tiene ni una sola línea recta**, como la sala.
  - **Contorno** (`visual/tileShape.ts`): cada cuarto es un cuarto de superelipse hecho con una sola curva, la misma idea que la forma de las columnas. Sale horizontal del centro de arriba (o de abajo) y llega vertical a media altura del lateral. Resultado: arcos suaves arriba y abajo, laterales apenas abombados y esquinas redondeadas, sin uniones (ni hombros ni ondas). Simétrico arriba-abajo e izquierda-derecha. Se ajusta con `TILE_SQUARENESS` (`top` 0,9: arcos; `side` 0,95: laterales); cuanto más cerca de 1, más rectangular. Se calcula con el tamaño real de cada tile, así que la curva no se deforma. `--tile-arch` es solo el aire extra de arriba para el contenido.
  - **Canto en todo el contorno:** un filo de luz (`--bevel-light`) justo fuera del borde, sin línea de sombra: la escena junto a las tiles es más oscura que la piedra (viñeteado), y una sombra encajonaría la luz entre dos grises, que se lee como un contorno oscuro. Más una sombra suave bajo la piedra (`--color-stone-shadow`).
  - **Surco interior** paralelo a todo el borde (sombra dentro, luz fuera), como el relieve curvo de las columnas.
  - **Cómo se dibuja:** `.tile` (en `base.css`) es solo la maquetación. El componente `TileFrame`, primer hijo de cada tile, dibuja detrás del contenido la piedra esmerilada recortada con el contorno (`clip-path: path()`) y, en SVG, el canto, el surco, la sombra, el halo, el contorno cobre de estado y el anillo de foco, todos siguiendo la curva (`box-shadow` y `outline` no siguen un recorte). Cada componente ajusta su tile con variables CSS: `--tile-fill` (piedra; más clara al pasar por encima, transparente en los huecos usados), `--tile-outline-width` y `--tile-outline-dash` (contorno cobre; discontinuo con `--stroke-dash`), `--tile-glow` (halo) y `--tile-focus` (lo activa `:focus-visible`).
- **Las únicas líneas que separan o marcan son señales:** los contornos cobre de los estados activos (símbolo que llevas, estatua marcada, opción elegida) y el foco de teclado. El relieve de la piedra y las cintas son luz y materia, no estructura. No existe un token de borde estructural.
- **Composición simétrica:** títulos de sección y sus ayudas, centrados. El resto de textos (estado, avisos, manual) a la izquierda. Las etiquetas bajo un icono van centradas bajo su icono.
- **Cabecera a todo el ancho**, de piedra, con su contenido también a todo el ancho (título a la izquierda, controles a la derecha), sin alinearse con el tablero. Su borde inferior es un canto fino: línea de sombra y, debajo, una de luz. Ajustes e idioma como controles sin fondo, en índigo; al pasar por encima aparece una piedra algo más clara con su canto (`--control-ghost-bg-hover`).

## Controles

Botones, selectores y opciones comparten los tokens `--control-*` de `tokens.css`:

- **Canto en los cuatro lados:** todos los botones con fondo llevan un canto como el de la cabecera y las columnas de la sala: un par de líneas finas (1px) de luz y sombra, sin sombra difusa. **La luz va siempre contra el lado oscuro**, para que las dos líneas se vean: en la piedra clara, sombra dentro y luz fuera; en el índigo, luz dentro y sombra fuera (`--control-edge`, `--control-primary-edge`).
- **Botón principal** (una acción principal por pantalla): relleno índigo (`--palette-dusk`), texto blanco de la luz de la sala (`--palette-bloom`). Al pasar por encima, la luz del canto se aviva y el índigo se aclara un poco.
- **Botón de icono** (`Button icon`): cuadrado, solo icono, con `aria-label`, con el lado de `--control-icon-size` (por defecto, la altura pequeña `--control-height-sm`). En la cabecera, variante `ghost`: sin borde ni fondo, icono gris que pasa a índigo al pasar por encima. Iconos de dibujo propio (p. ej. `GearIcon`).
- **Cabecera:** ayuda, ajustes, GitHub e idioma a una altura aún menor (`--control-height-xs`, que la cabecera asigna a `--control-icon-size`), para que quepa en una línea en móvil.
- **Sin efecto de pulsado:** los botones no se desplazan ni se hunden al pulsarlos; el hover solo cambia un poco el canto y el fondo.
- **Botón secundario:** de piedra (`--color-stone`) con su canto; al pasar por encima, la sombra del canto se marca un poco más y la piedra se aclara.
- **Desactivado:** opacidad reducida y cursor `not-allowed`.
- **Foco:** contorno cobre (`:focus-visible`), común a todos los controles.
- **Selectores:** sin apariencia nativa, flecha dibujada en CSS con el color del texto. El de idioma va sin etiqueta visible y en tamaño pequeño, y muestra el código corto (ES, EN) para que la cabecera quepa en una línea en móvil; el nombre completo va en su `aria-label` ("Idioma: Español") y en el `title` de cada opción.
- **Interruptores:** claro frente a oscuro, como el botón secundario frente al principal. Apagado: pista de piedra (`--color-track`) con un canto fino y el mando en tono medio (`--palette-mid-deep`, ≥ 3:1 sobre el fondo). Encendido: pista índigo rellena y mando blanco.
- **Avisos:** plano de superficie; no usan cobre, que es solo para lo activo.

Los controles nuevos usan el componente `Button` o estos tokens; nunca estilos propios sueltos.

## Estado y avisos (nada se mueve)

La interfaz no se desplaza al jugar. Se separan dos tipos de información:

- **Estado** (intercambios y símbolo que llevas —solo cuando llevas uno, tocando o arrastrando—, intercambios mínimos pendientes con pistas): en una zona fija bajo los símbolos de los caballeros, con la etiqueta en normal y tono secundario y el valor en negrita: lo que se consulta de reojo es el valor. Las líneas reservan su hueco aunque estén vacías.
- **Eventos** (marcar, intercambiar, rechazos, avisos del editor): como **toast**, abajo y centrado en el ancho del contenido. Uno a la vez (el siguiente sustituye al anterior), sin botón de cerrar, con fundido suave. Desaparecen solos: 2,5 s los informativos y 4 s los errores, que llevan una franja granate a la izquierda. Se anuncian a lectores de pantalla.
- En el editor, el motivo de que "Iniciar entreno" esté desactivado queda además en la descripción accesible del botón.
- Con símbolos por rondas, los ogros ocupan el sitio de los caballeros mientras están (y durante la cuenta atrás hasta que vuelven), con la misma maquetación: nada se desplaza. Las tiles de caballeros y ogros reservan el sitio de la barra de caducidad.

## Bruma

Capa irregular sobre la escena, en todo el viewport, por debajo del contenido (`SceneMist`). Da a la escena vectorial una sensación orgánica, como de aire.

- **Ruido fractal** (`feTurbulence`, en `visual/mist.ts`) convertido en jirones: el ruido medio queda casi transparente y solo las zonas densas forman nubes. Blanco hueso (`--color-mist`).
- **Varias capas** con nubes de distinto tamaño que se mueven en direcciones distintas: al cruzarse, la forma cambia sin parar y nunca parece un dibujo que se desliza en bloque.
- **Viento muy suave:** cada capa recorre un camino irregular con aceleraciones y frenadas (ciclos de 40 a 140 s según el ajuste) y "respira" como en ráfagas.
- **Reparto:** en todo el viewport, también sobre el tablero (animada, ahí también suma); solo algo más densa en los bordes y abajo (`--mist-density`). Intensidad general: `--mist-opacity`.
- **Rendimiento:** el ruido se pinta una sola vez como máscara y solo se mueven las capas (`transform` y `opacity`), que lo hace la tarjeta gráfica. Nunca se anima el ruido en sí, que obligaría a recalcularlo en cada fotograma.
- Con `prefers-reduced-motion`, quieta.
- **Ajustes** en `visual/mist.ts`: dos ajustes completos para comparar, `calm` (casi quieta) y `breeze` (viento suave que se percibe), elegidos con `MIST_PRESET`. Cada uno define sus capas (tamaño, frecuencia, intensidad, duración, recorrido, ráfagas), la forma de los jirones (`contrast`, `threshold`) y su intensidad (`strength`).

## Polvo de nieve

Miles de motas diminutas que flotan en la sala, como en el arte del encuentro: del azul lavanda de las sombras de la sala (en el arte son blancas, pero sobre la escena clara no se veían) y algunas cobre, agrupadas en jirones como una nebulosa y muy concentradas alrededor de la esfera, con un polvo más disperso por el resto. Unas pocas motas son más grandes.

- **Técnica:** un `<canvas>` 2D a pantalla completa (`SnowDust`), por encima de la bruma (que no lo vele) y por debajo del viñeteado y del contenido, con su propia intensidad (`--dust-opacity`) y sus colores (`--color-dust`, `--color-dust-warm`). Canvas porque son miles de puntos independientes.
- **Geometría** en `visual/dust.ts` (funciones puras, con tests): las motas viven en las coordenadas de la sala (1600×1000) y se encuadran como el SVG (`xMidYMid slice`), así que la nube queda sobre la esfera con cualquier ventana. El reparto sale de una densidad (nube gaussiana en la esfera + jirones de ruido fractal + polvo disperso) con una semilla fija: el mismo dibujo en cada carga.
- **Movimiento:** un vaivén lento en la dirección del viento y un giro alrededor de la esfera, que conservan el reparto (la nube no se va); cada mota parpadea a su ritmo.
- **Rendimiento:** como mucho 30 fotogramas por segundo, densidad de píxeles limitada (1,5), menos motas en pantallas estrechas (`compactCount`) y parado con la pestaña oculta. Con `prefers-reduced-motion`, una imagen quieta.
- **Parámetros para ajustar a ojo** en `DUST`: cantidad, tamaños, motas grandes y cálidas, pesos del reparto, tamaño de los jirones, viento, giro y parpadeo.
- **Ajuste del jugador:** "Polvo de nieve" en el panel de ajustes (activado por defecto), guardado con el resto. Es una preferencia visual: no depende de ninguna funcionalidad de la versión y siempre aparece, también en el manual.

## Pendiente

- **Modo oscuro.** Los tokens están definidos, pero aún no hay un control para activarlo. Se rediseñará a partir de su propia referencia: la misma sala en penumbra, también de Christian Chojnacki para la raid, en [ArtStation](https://cdna.artstation.com/p/assets/images/images/076/967/522/large/christian-chojnacki-cchojnacki-finalshape-raid-22-a.jpg?1718233217). Solo como inspiración, igual que la de la escena clara.
  - **Ambiente:** casi negro con tinte granate y ciruela (`#13060A` en las sombras, `#230E1E` en los medios, fondo vino `#311123`), más morado arriba en el centro (`#2F1834`).
  - **Estructura:** las mismas columnas, la ojiva central, la espiral y los cuencos, ahora en siluetas oscuras con un filo de luz azul.
  - **Luz:** una única fuente azul eléctrica. En lugar de la esfera blanca hay un cuerpo oscuro y opaco del que sale, por abajo, un haz de luz azul (`#BAD2F2` en lo más brillante, `#4364C6` en los medios) que baja por dentro de la espiral y la ilumina.
  - **Suelo:** reflejos azules, como cáusticas de agua, sobre todo en el camino y alrededor de la base (`#303C80`).
  - **Detalles:** destellos horizontales de lente a la altura media y unas pocas brasas cálidas flotando (`#F3BEA6`), que serían el equivalente oscuro del polvo de nieve.

## Pictogramas de caballero y ogro

Dibujos propios (`KnightIcon`, `OgreIcon`), inspirados en las proporciones y los rasgos de los enemigos del juego, sin calcar ningún arte. En tinta de silueta (`--color-silhouette`) con ojos de brasa (`--color-ember`), como los símbolos 2D; solo curvas.

- **Caballero:** yelmo en punta de flecha que se abre en dos cuernos, tres ojos en triángulo, hombreras que se alzan en punta y piernas firmes y abiertas.
- **Ogro:** masa encorvada sin cabeza, brazos larguísimos con garras, piernas cortas y la cara en el pecho, separada por un surco, con un racimo de ojos.
- **Dónde:** en las tiles de los caballeros por derrotar (sin indicar qué símbolo soltarán: en el juego no se sabe) y en las de los ogros, al mismo tamaño que los símbolos. Derrotados, el pictograma atenuado sobre el hueco vacío.
- Deben leerse a 28 px.

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
