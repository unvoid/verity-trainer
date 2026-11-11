<!--
  Aviso efímero, abajo y centrado en el ancho del contenido. No ocupa sitio en
  la maquetación (nada se mueve) y se anuncia a lectores de pantalla.
-->
<script lang="ts">
  import { fade } from 'svelte/transition'
  import { toast } from '../stores/toast'

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = reducedMotion ? 0 : 200
</script>

<!-- La región viva existe siempre: así los lectores de pantalla anuncian cada aviso. -->
<div class="region" role="status" aria-live="polite">
  {#key $toast?.id}
    {#if $toast}
      <p class="toast" class:error={$toast.tone === 'error'} transition:fade={{ duration }}>
        {$toast.message}
      </p>
    {/if}
  {/key}
</div>

<style>
  .region {
    position: fixed;
    inset: auto 0 var(--space-6) 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    padding-inline: var(--space-4);
    pointer-events: none;
  }

  .toast {
    max-width: var(--content-width);
    margin: 0;
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text);
    background: var(--color-surface-raised);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-floating);
  }

  /* Error: mismo plano, con una franja granate a la izquierda (el color de las estatuas). */
  .toast.error {
    box-shadow:
      inset 3px 0 0 var(--color-statue),
      var(--shadow-floating);
  }
</style>
