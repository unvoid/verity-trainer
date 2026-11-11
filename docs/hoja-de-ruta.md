# Hoja de ruta

## Objetivos

- Practicar el encuentro con escenarios aleatorios.
- **Novedad principal:** elegir el **punto de partida** (callouts y formas de las estatuas) para recrear una situación real.
- **Solucionador:** mostrar la secuencia mínima de intercambios para el punto de partida elegido.

## Hitos

| # | Hito | Estado |
|---|---|---|
| 1 | **Base:** Vite + Svelte + TS, Vitest, tema y tokens, idiomas ES/EN | Hecho |
| 2 | **Dominio:** tipos, formas, reglas, intercambio, generación de escenarios. Con tests | Hecho |
| 3 | **Solucionador:** BFS, secuencia mínima, ambos modos. Con tests | Hecho |
| 4 | **UI básica:** callouts, estatuas, caja de símbolos, intercambio tocando, condición de victoria | Hecho |
| 5 | **Arrastrar y soltar** con Pointer Events | |
| 6 | **Editor de punto de partida** con validación | |
| 7 | **Ajustes:** pistas, Challenge Mode, Realistic Symbol Drops, persistencia | |
| 8 | **Estética:** formas SVG, paleta definitiva, loader, modo oscuro | |
| 9 | **Manual de uso** ES/EN | |
| 10 | **Pulido y despliegue:** accesibilidad, créditos en la web, publicación | |

## Dudas abiertas

- ¿La regla 3 del punto de partida (cada estatua empieza con el símbolo de su callout) es real en el juego?
- ¿Cuánto dura el límite de tiempo del encuentro y qué pasa al agotarse? ¿Se simula?
- ¿Qué símbolo suelta cada caballero? ¿Es siempre el mismo reparto por posición, como en el original?
- Rondas de símbolos: ¿salen tres por ronda y no vuelven hasta matar a más caballeros? Entre rondas hay que matar a un ogro para que salgan caballeros: ¿uno por caballero, o dos ogros por ronda como en el original?
- ¿Se mantiene "Image Callouts"? ¿Con qué imágenes, si no usamos recursos oficiales?
- Confirmar con capturas propias la paleta y el aspecto de los símbolos.
