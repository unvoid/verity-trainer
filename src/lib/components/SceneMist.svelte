<!--
  Bruma irregular sobre la escena, en todo el viewport, movida por un viento muy
  suave. Va por encima de la escena y por debajo del contenido.
  - Cada capa es un color (`--color-mist`) recortado por un mosaico de ruido
    (`visual/mist.ts`): el ruido se pinta una vez y luego solo se mueve la capa.
  - Velocidad, recorrido, forma e intensidad vienen del ajuste en uso (`MIST_PRESET`).
  - Las capas recorren un camino irregular con aceleraciones y frenadas suaves,
    y "respiran" (se aclaran y espesan) como ráfagas, cada una a su ritmo.
  - En todo el viewport, también sobre el tablero; algo más densa en los bordes y abajo.
  - Con movimiento reducido, quieta. Decorativa y oculta a los lectores de pantalla.
-->
<script lang="ts">
  import { MIST_PRESET, MIST_PRESETS, mistTile } from '../visual/mist'

  const preset = MIST_PRESETS[MIST_PRESET]

  const layers = preset.layers.map((layer, index) => ({
    mask: mistTile(layer, preset),
    style: [
      `--tile: ${layer.tile}px`,
      `--dx: ${layer.drift[0]}px`,
      `--dy: ${layer.drift[1]}px`,
      `--duration: ${layer.duration}s`,
      `--gust: ${layer.gust}s`,
      `--layer-opacity: ${layer.opacity}`,
      // Cada capa empieza en un punto distinto de su recorrido.
      `--delay: -${(layer.duration * index) / preset.layers.length}s`,
    ].join('; '),
  }))
</script>

<div class="mist" aria-hidden="true" style="--mist-strength: {preset.strength}">
  {#each layers as layer, index (index)}
    <div class="layer" style="{layer.style}; mask-image: {layer.mask}; -webkit-mask-image: {layer.mask}"></div>
  {/each}
</div>

<style>
  .mist {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    opacity: calc(var(--mist-opacity) * var(--mist-strength));
    /* Reparto: en todo el viewport, algo más densa en los bordes y abajo. */
    mask-image: var(--mist-density);
    -webkit-mask-image: var(--mist-density);
  }

  .layer {
    position: absolute;
    /* Más grande que el viewport: al moverse nunca deja ver un borde. */
    inset: -25%;
    background: var(--color-mist);
    mask-size: var(--tile) var(--tile);
    -webkit-mask-size: var(--tile) var(--tile);
    mask-repeat: repeat;
    -webkit-mask-repeat: repeat;
    opacity: var(--layer-opacity);
    will-change: transform, opacity;
    animation:
      drift var(--duration) ease-in-out var(--delay) infinite,
      gust var(--gust) ease-in-out var(--delay) infinite alternate;
  }

  /* Viento: un recorrido irregular que vuelve a su origen, sin saltos. */
  @keyframes drift {
    0% {
      transform: translate3d(0, 0, 0);
    }
    28% {
      transform: translate3d(calc(var(--dx) * 0.55), calc(var(--dy) * 0.35), 0);
    }
    52% {
      transform: translate3d(var(--dx), calc(var(--dy) * -0.25), 0);
    }
    77% {
      transform: translate3d(calc(var(--dx) * 0.35), var(--dy), 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  /* Ráfagas: la capa se aclara y se vuelve a espesar. */
  @keyframes gust {
    from {
      opacity: var(--layer-opacity);
    }
    to {
      opacity: calc(var(--layer-opacity) * 0.5);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .layer {
      animation: none;
    }
  }
</style>
