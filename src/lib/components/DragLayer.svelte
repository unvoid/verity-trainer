<!-- Símbolo que sigue al puntero durante un arrastre. No intercepta eventos. -->
<script lang="ts">
  import { drag } from '../stores/drag'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    /** Tamaño del símbolo arrastrado en px. */
    size?: number
  }

  let { size = 56 }: Props = $props()
</script>

{#if $drag}
  <div class="ghost" style:translate="{$drag.x}px {$drag.y}px" aria-hidden="true">
    <Symbol2D symbol={$drag.symbol} {size} />
  </div>
{/if}

<style>
  .ghost {
    position: fixed;
    inset: 0 auto auto 0;
    z-index: 10;
    pointer-events: none;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 4px 6px color-mix(in srgb, var(--color-silhouette), transparent 70%));
  }
</style>
