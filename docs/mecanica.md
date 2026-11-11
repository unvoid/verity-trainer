# Mecánica del encuentro

Cómo funciona la parte de **intercambios de símbolos en las estatuas** del encuentro Verity (4º encuentro de *Salvation's Edge*) y cómo la modela el simulador. El código está en [`src/lib/domain/`](../src/lib/domain/).

La mecánica se ha deducido del [simulador original](https://verity.cabotmc.dev/) y de la comunidad. Las dudas sin confirmar están en [hoja-de-ruta.md](hoja-de-ruta.md#dudas-abiertas).

## Vocabulario

Estos términos se usan igual en código, UI y documentación.

| Concepto | En código | Nombres |
|---|---|---|
| Forma 2D (símbolo) | `Symbol2D` | Círculo / Cuadrado / Triángulo (en el juego: Orbicular / Quadrate / Trigon) |
| Forma 3D (sólido) | `Shape3D` | Esfera, Cubo, Tetraedro, Cilindro, Cono, Prisma |
| Símbolos de la sala interior | `callouts` | Uno por posición |
| Estatuas exteriores | `statues` | Cada una sostiene una forma 3D |
| Posiciones | `Slot` | `left`, `mid`, `right` |
| Formas puras | `isPure()` | Esfera, Cubo, Tetraedro (dos símbolos iguales) |
| Formas mixtas | — | Cilindro (Cylindric), Cono (Conoid), Prisma (Trilateral) |

En inglés se usan los términos de la comunidad.

### Composición de las formas 3D

| Forma 3D | Símbolos |
|---|---|
| Esfera | Círculo + Círculo |
| Cubo | Cuadrado + Cuadrado |
| Tetraedro | Triángulo + Triángulo |
| Cilindro | Círculo + Cuadrado |
| Cono | Círculo + Triángulo |
| Prisma | Cuadrado + Triángulo |

Los símbolos 2D son las siluetas (proyecciones ortogonales) del sólido. El juego usa sólidos idealizados: no hace falta geometría 3D real.

## Elementos

- **Callouts interiores:** los tres símbolos distintos, en un orden (6 permutaciones).
- **Estatuas:** tres, cada una con una forma 3D.
- **Caballeros:** tres enemigos. Al matarlos sueltan un símbolo: izquierdo → Círculo, central → Triángulo, derecho → Cuadrado (`KNIGHT_DROPS`). El original fija este reparto en su código; no está confirmado que el juego lo haga igual, aunque no afecta a las reglas ni al solucionador.
- **Rondas de símbolos** (pendiente de confirmar): los símbolos salen por rondas. Al matar a los tres caballeros salen tres símbolos, y no vuelven a salir hasta matar a más caballeros. Un intercambio gasta dos, así que queda uno suelto: puede servir para empezar el siguiente intercambio (si no desaparece antes), pero el segundo símbolo tiene que salir de otra ronda. Para que vuelvan a salir caballeros hay que matar antes a un ogro. El simulador lo modela con el ajuste *Realistic Symbol Drops*.

## Intercambio

1. Se deposita un símbolo en una estatua. Solo se acepta si su forma 3D **contiene** ese símbolo.
2. El primer depósito **marca** la estatua con ese símbolo.
3. No se puede depositar en la estatua marcada.
4. El segundo depósito, en otra estatua, ejecuta el **intercambio**: la estatua marcada cede el símbolo marcado y recibe el nuevo; la otra cede el nuevo y recibe el marcado. Ambas formas se recalculan.
5. Cada intercambio suma 1 al contador.
6. No hay límite de intercambios. En el juego el límite es el tiempo.

Depositar el mismo símbolo en ambas estatuas es válido: no cambia nada, pero cuenta como intercambio.

Los intercambios mueven símbolos, no los crean: entre las tres estatuas siempre hay **dos de cada símbolo**.

## Condición de victoria

- **Modo normal:** ninguna estatua contiene el símbolo de su callout.
- **Challenge Mode:** además, las tres estatuas son formas puras.

Como siempre hay dos de cada símbolo, en Challenge Mode hay **exactamente dos soluciones** por punto de partida:

- **A:** izquierda = pura del callout derecho, centro = pura del callout izquierdo, derecha = pura del callout central.
- **B:** izquierda = pura del callout central, centro = pura del callout derecho, derecha = pura del callout izquierdo.

Se aceptan ambas. El original solo muestra la A en las pistas.

## Punto de partida

| Regla | Descripción | Validación |
|---|---|---|
| 1 | Los callouts son los tres símbolos distintos (6 órdenes) | Obligatoria |
| 2 | Entre las estatuas hay exactamente dos de cada símbolo (21 combinaciones) | Obligatoria |
| 3 | Cada estatua empieza conteniendo el símbolo de su callout (nada resuelto al inicio). Deja 6 combinaciones por orden de callouts | Configurable: `off`, `warn` (por defecto en el editor) o `enforce` (en el modo aleatorio, como el original) |

La regla 3 está pendiente de confirmar: puede ser del juego o una decisión del autor original.

### Editor

Al empezar se propone un punto de partida aleatorio, que se puede personalizar antes de pulsar **Iniciar entreno**:

- Callouts y estatuas se editan como dos grupos de tres. Cambiar una posición de un grupo completo vacía las otras dos, porque con las reglas 1 y 2 cambiar una sola nunca da un grupo válido.
- Al elegir la segunda posición, la tercera se completa sola: en los callouts es el símbolo que falta; en las estatuas, la forma de los dos símbolos que faltan para tener dos de cada uno.
- Solo se ofrecen opciones que admiten una tercera válida, así que las reglas 1 y 2 no se pueden incumplir. La regla 3 se muestra como aviso.
- "Iniciar entreno" está desactivado mientras algún grupo esté incompleto.

Los escenarios aleatorios se generan enumerando todas las combinaciones y filtrando por estas reglas (36 con la regla 3), sin tabla precalculada.

## Ajustes

Los ajustes los activa el jugador y se guardan en `localStorage`. Cada uno depende de que su funcionalidad esté disponible en la versión publicada (ver [arquitectura.md](arquitectura.md#funcionalidades-y-ajustes)).

- **Pistas:**
  - Bajo cada estatua, sus dos símbolos; los que chocan con su callout, con un aro carmesí.
  - Las estatuas que admiten el símbolo que llevas se resaltan.
  - Cuántos intercambios faltan como mínimo desde el estado actual (lo calcula el solucionador, en ambos modos).
- **Modo desafío** (Challenge Mode): ver la condición de victoria. Se elige antes de iniciar el entreno; durante la partida no se puede cambiar.
- **Símbolos por rondas** (pendiente de implementar):
  - Un símbolo soltado desaparece a los 10 s si no se usa.
  - Cuando los tres se han usado o han desaparecido, aparecen ogros; al matarlos vuelven los caballeros.
  - Sin este ajuste, los símbolos están siempre disponibles.

"Image Callouts" del original no se incluye (ver [hoja-de-ruta.md](hoja-de-ruta.md#dudas-abiertas)).

Al resolver se muestra un resumen con intercambios, mínimo y tiempo. Si se usaron más intercambios de los necesarios, se indica cuántos sobraron y se muestra la solución más corta paso a paso.

## Solucionador

- Búsqueda en anchura (BFS) sobre las configuraciones de estatuas (solo 21 alcanzables).
- Devuelve la secuencia mínima de intercambios: qué símbolo de qué estatua con cuál.
- En Challenge Mode tiene en cuenta ambas soluciones (A y B) y elige la de menos pasos.
- Se usa en las pistas, en el aviso final ("solo necesitabas X") y en la vista paso a paso.

### Mínimos de intercambios

Resultados del solucionador sobre los 36 escenarios que cumplen las tres reglas:

| Estatuas al inicio | Modo normal | Challenge Mode | Escenarios |
|---|---|---|---|
| Las tres puras | 3 | 4 (A y B igual de cerca) | 6 |
| Alguna mixta | 2 | 3 (A y B igual de cerca) | 18 |
| Alguna mixta | 2 | 2 (solo por una de las dos soluciones) | 12 |

- En modo normal coincide con la regla fija del original (3 si todas empiezan puras, 2 si no).
- En Challenge Mode, en 6 escenarios la solución B es más corta que la A: las pistas del original, que solo muestran la A, piden un intercambio de más.
