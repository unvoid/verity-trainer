# Tono y vocabulario

Cómo se escriben los textos de la interfaz, en español y en inglés. Los textos están en [`src/lib/i18n/`](../src/lib/i18n/); ningún componente lleva textos fijos.

## Principios

- **Textos propios.** No se copian textos del simulador original ni de guías. Se describe lo que pasa con palabras nuestras.
- **Naturales, no forzados.** Si un término de la comunidad es estándar, se usa; si no, se elige la forma más clara, no la más original.
- **Describir, no calificar.** "Símbolos por rondas" (qué pasa) mejor que "Símbolos realistas" (un juicio).
- **Tuteo** en español. Frases cortas y directas.
- **Exclamaciones** solo para celebrar (resolver el encuentro). Avisos y errores, sin exclamaciones.
- **Errores:** qué ha pasado y, si hace falta, qué hacer. Sin culpar ("El círculo no está en la estatua izquierda", no "Has fallado").
- **Mayúsculas:** solo al inicio de frase y en nombres propios. Botones y títulos en minúscula tras la primera palabra, también en inglés ("New game", no "New Game").

## Vocabulario

| Concepto | Español | Inglés | Nota |
|---|---|---|---|
| Símbolos interiores | callouts | callouts | Jerga de la comunidad en ambos idiomas |
| Sala de las estatuas | Sala de disección | Dissection room | "Disección": como la comunidad llama al trabajo de fuera |
| Jugadores | guardianes | Guardians | Término del juego; mejor que "compañeros" |
| Grupo de juego | escuadra | fireteam | Término del juego |
| Enemigos que sueltan símbolos | caballeros | knights | |
| Enemigos entre rondas | ogros | ogres | |
| Formas 2D | Círculo, Cuadrado, Triángulo | Circle, Square, Triangle | |
| Formas 3D | Esfera, Cubo, Tetraedro, Cilindro, Cono, Prisma | Sphere, Cube, Pyramid, Cylinder, Cone, Prism | En inglés, "Pyramid" como la comunidad |
| Modo con formas puras | Modo desafío | Challenge Mode | En español se traduce; en inglés, el término del juego |
| Pistas | Pistas | Hints | |
| Símbolos que salen por tandas y caducan | Símbolos por rondas | Symbol rounds | |
| Empezar a jugar | Iniciar entreno | Start training | Deja claro que es práctica |

## Nombres y referencias

Hay dos formas de cada nombre, para que las frases suenen naturales:

- **Nombre** (`statue.name.left`, `symbol.circle`): para títulos, etiquetas y listas. Con mayúscula: "Estatua izquierda", "Círculo".
- **Referencia** (`statue.ref.left`, `symbol.ref.circle`): dentro de una frase, con artículo si lo necesita y en minúscula: "la estatua izquierda", "círculo".

✔ "Has marcado la estatua izquierda con el círculo."
✘ "Has marcado Estatua izquierda con el Círculo."

## Plurales

Los textos con número usan claves `.one` y `.other` y la función `tn()`, que elige según las reglas del idioma:

```ts
'hint.remaining.one': 'Falta al menos {count} intercambio.',
'hint.remaining.other': 'Faltan al menos {count} intercambios.',
```

Si una frase se puede escribir sin depender del número ("Intercambios: 3"), mejor así.
