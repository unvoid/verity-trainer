<!--
  Cuenco tejido de cintas en el que reposa una forma 3D, como los de la sala.
  Se dibuja en dos capas: `back` (detrás de la forma) y `front` (delante), para
  que la forma parezca apoyada dentro. Decorativo.
-->
<script lang="ts">
  import { CRADLE_RIBBONS, CRADLE_SIZE, ribbonPath } from '../visual/ribbons'

  interface Props {
    layer: 'back' | 'front'
  }

  let { layer }: Props = $props()

  const paths = $derived(CRADLE_RIBBONS[layer].map(ribbonPath))
</script>

<svg class="cradle {layer}" viewBox="0 0 {CRADLE_SIZE.width} {CRADLE_SIZE.height}" aria-hidden="true">
  {#each paths as d, index (index)}
    <path class="shade" {d} />
  {/each}
  {#each paths as d, index (index)}
    <path class="lit" {d} />
  {/each}
</svg>

<style>
  .cradle {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  /* Sombra hacia abajo (la luz viene de arriba), como en las cintas del fondo. */
  .shade {
    fill: var(--color-cradle-shade);
    transform: translate(0.5px, 1.2px);
  }

  .lit {
    fill: var(--color-cradle);
  }

  /* Lo de dentro queda en penumbra. */
  .back .lit {
    fill: var(--color-cradle-back);
  }
</style>
