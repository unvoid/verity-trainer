<!--
  Loader de fragmentos. Cada forma se recompone desde sus trozos, se queda entera
  y se rompe mientras entra la siguiente. Sombras negras, sin brasa.
  Especificación y técnica: docs/estetica.md ("Loader").

  Modos:
  - Bucle (por defecto): las formas de `sequence` se suceden sin fin.
  - Una vez (`once`): la primera empieza entera, se pasa por la segunda y la
    animación termina con la última entera. `playing` permite arrancarla después
    (p. ej. tras un fundido de entrada). Tiempos: visual/loaderTimeline.ts.

  Línea de tiempo de cada forma (fracción del ciclo; las tres desfasadas 1/3):
    0–9 %    se recompone (gira y encaja); 9–11 % en reposo
    11–33 %  entera (una sola pieza, sin juntas)
    33–45 %  se rompe: trozos separados, girados y sesgados; la forma gira y se encoge
-->
<script lang="ts">
  import type { Symbol2D } from '../domain/types'
  import { FINAL_START, FIRST_START, MIDDLE_START } from '../visual/loaderTimeline'
  import { shardShapes } from '../visual/shards'

  interface Props {
    /** Tamaño en px (ancho y alto). */
    size?: number
    /** Duración del ciclo completo de tres formas (ms). */
    cycle?: number
    /** Separación de los trozos al romperse (unidades del lienzo de 100). */
    separation?: number
    /** Texto accesible. Sin él, el loader es decorativo. */
    label?: string
    /** Orden de las formas (tres). */
    sequence?: readonly [Symbol2D, Symbol2D, Symbol2D]
    /** Recorre la secuencia una vez y se queda en la última forma. */
    once?: boolean
    /** Si es `false`, la animación queda parada (con `once`, en la primera forma entera). */
    playing?: boolean
  }

  let {
    size = 96,
    cycle = 4800,
    separation = 6,
    label,
    sequence = ['square', 'triangle', 'circle'],
    once = false,
    playing = true,
  }: Props = $props()

  const uid = $props.id()
  const shapes = $derived.by(() => {
    const all = shardShapes(separation)
    return sequence.map((symbol) => all.find((shape) => shape.symbol === symbol)!)
  })

  /**
   * Orden de pintado: en "una vez", la forma que se rompe va encima de la que
   * entra (la primera de la secuencia, la última en pintarse).
   */
  const painted = $derived(
    once ? shapes.map((shape, index) => ({ shape, index })).reverse() : shapes.map((shape, index) => ({ shape, index })),
  )

  /** Retraso de la animación de cada forma. */
  function delayOf(index: number): string {
    if (!once) return `calc(var(--cycle) / 3 * ${index})`
    const fraction = [FIRST_START, MIDDLE_START, FINAL_START][index] ?? 0
    return `calc(var(--cycle) * ${fraction})`
  }
</script>

<svg
  class="loader"
  class:once
  class:paused={!playing}
  width={size}
  height={size}
  viewBox="0 0 100 100"
  style:--cycle="{cycle}ms"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
>
  <defs>
    {#each shapes as shape (shape.symbol)}
      <clipPath id="{uid}-{shape.symbol}"><path d={shape.silhouette} /></clipPath>
    {/each}
  </defs>

  {#each painted as { shape, index } (shape.symbol)}
    <g
      class="shape"
      class:lead={index === 0}
      class:final={once && index === shapes.length - 1}
      style:--delay={delayOf(index)}
    >
      {#each shape.shards as shard, i (i)}
        <g
          class="shard"
          style:--dx="{shard.dx}px"
          style:--dy="{shard.dy}px"
          style:--rot="{shard.rotate}deg"
          style:--skew="{shard.skew}deg"
        >
          <g clip-path="url(#{uid}-{shape.symbol})"><polygon class="fill" points={shard.points} /></g>
        </g>
      {/each}
      <!-- Pieza entera: mismo recorte que los trozos para que los bordes sean idénticos. -->
      <g class="whole" clip-path="url(#{uid}-{shape.symbol})"><rect class="fill" width="100" height="100" /></g>
    </g>
  {/each}
</svg>

<style>
  .loader {
    display: block;
    flex: none;
    max-width: 100%;
    height: auto;
    overflow: visible;
  }

  .fill {
    fill: var(--color-silhouette);
  }

  /* Cada forma empieza con su retraso (--delay); antes, invisible. */
  .shape,
  .shard,
  .whole {
    animation-duration: var(--cycle);
    animation-iteration-count: infinite;
    animation-delay: var(--delay);
    animation-fill-mode: backwards;
  }

  /* Una vez: cada forma anima una sola vez y conserva su último estado. */
  .once .shape,
  .once .shard,
  .once .whole {
    animation-iteration-count: 1;
    animation-fill-mode: both;
  }

  /* La última forma se recompone y se queda entera (sin romperse). */
  .once .final,
  .once .final .shard,
  .once .final .whole {
    animation-duration: calc(var(--cycle) * 0.33);
  }

  .once .final {
    animation-name: shape-final;
  }

  .once .final .shard {
    animation-name: shard-final;
  }

  .once .final .whole {
    animation-name: whole-final;
  }

  .paused .shape,
  .paused .shard,
  .paused .whole {
    animation-play-state: paused;
  }

  .shape,
  .shard {
    transform-box: view-box;
    transform-origin: 50px 50px;
    animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
  }

  .shape {
    animation-name: shape-cycle;
  }

  .shard {
    animation-name: shard-cycle;
  }

  .whole {
    animation-name: whole-cycle;
    animation-timing-function: linear;
  }

  @keyframes shape-cycle {
    0% {
      transform: rotate(-35deg) scale(1.08);
    }
    9%,
    33% {
      transform: none;
    }
    45%,
    100% {
      transform: rotate(30deg) scale(0.5);
    }
  }

  @keyframes shard-cycle {
    0% {
      transform: translate(calc(var(--dx) * -1), calc(var(--dy) * -1)) rotate(calc(var(--rot) * -1))
        skewX(calc(var(--skew) * -1));
      opacity: 0;
    }
    3% {
      opacity: 1;
    }
    9%,
    11% {
      transform: none;
      opacity: 1;
    }
    11.01%,
    32.99% {
      transform: none;
      opacity: 0;
    }
    33% {
      transform: none;
      opacity: 1;
    }
    39% {
      transform: translate(calc(var(--dx) * 0.6), calc(var(--dy) * 0.6)) rotate(calc(var(--rot) * 0.6))
        skewX(calc(var(--skew) * 0.6));
      opacity: 1;
    }
    45%,
    100% {
      transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) skewX(var(--skew));
      opacity: 0;
    }
  }

  @keyframes whole-cycle {
    0%,
    11% {
      opacity: 0;
    }
    11.01%,
    32.99% {
      opacity: 1;
    }
    33%,
    100% {
      opacity: 0;
    }
  }

  /* Última forma del modo "una vez": misma línea de tiempo comprimida a 0–33 % del ciclo. */
  @keyframes shape-final {
    0% {
      transform: rotate(-35deg) scale(1.08);
    }
    27.27%,
    100% {
      transform: none;
    }
  }

  @keyframes shard-final {
    0% {
      transform: translate(calc(var(--dx) * -1), calc(var(--dy) * -1)) rotate(calc(var(--rot) * -1))
        skewX(calc(var(--skew) * -1));
      opacity: 0;
    }
    9.09% {
      opacity: 1;
    }
    27.27%,
    33.33% {
      transform: none;
      opacity: 1;
    }
    33.36%,
    100% {
      transform: none;
      opacity: 0;
    }
  }

  @keyframes whole-final {
    0%,
    33.33% {
      opacity: 0;
    }
    33.36%,
    100% {
      opacity: 1;
    }
  }

  /* Sin animación: solo la primera forma, entera y quieta. */
  @media (prefers-reduced-motion: reduce) {
    .shape,
    .shard,
    .whole {
      animation: none;
    }

    .shard {
      opacity: 0;
    }

    .shape:not(.lead) {
      display: none;
    }
  }
</style>
