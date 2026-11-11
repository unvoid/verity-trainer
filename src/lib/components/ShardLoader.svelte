<!--
  Loader de fragmentos: Cuadrado → Triángulo → Círculo. Cada forma se recompone
  desde sus trozos, se queda entera y se rompe mientras entra la siguiente.
  Sombras negras, sin brasa. Especificación y técnica: docs/estetica.md ("Loader").

  Línea de tiempo de cada forma (fracción del ciclo; las tres desfasadas 1/3):
    0–9 %    se recompone (gira y encaja); 9–11 % en reposo
    11–33 %  entera (una sola pieza, sin juntas)
    33–45 %  se rompe: trozos separados, girados y sesgados; la forma gira y se encoge
-->
<script lang="ts">
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
  }

  let { size = 96, cycle = 4800, separation = 6, label }: Props = $props()

  const uid = $props.id()
  const shapes = $derived(shardShapes(separation))
</script>

<svg
  class="loader"
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

  {#each shapes as shape, index (shape.symbol)}
    <g class="shape" style:--order={index}>
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

  /* Cada forma empieza 1/3 de ciclo después de la anterior; antes, invisible. */
  .shape,
  .shard,
  .whole {
    animation-duration: var(--cycle);
    animation-iteration-count: infinite;
    animation-delay: calc(var(--cycle) / 3 * var(--order));
    animation-fill-mode: backwards;
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

  /* Sin animación: solo el cuadrado, entero y quieto. */
  @media (prefers-reduced-motion: reduce) {
    .shape,
    .shard,
    .whole {
      animation: none;
    }

    .shard {
      opacity: 0;
    }

    .shape:not(:first-of-type) {
      display: none;
    }
  }
</style>
