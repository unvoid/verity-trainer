<!--
  Título de sección: el mismo estilo en todo el tablero y el editor
  (fuente de títulos, mayúsculas pequeñas, centrado entre dos trazos de cinta).
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    /** id para enlazarlo con `aria-labelledby` de su sección. */
    id?: string
    /** Nivel del encabezado. */
    level?: 2 | 3
    /** Subapartado de otra sección: algo más pequeño. */
    sub?: boolean
    children: Snippet
  }

  let { id, level = 2, sub = false, children }: Props = $props()
</script>

<svelte:element this={`h${level}`} {id} class="section-title" class:sub>
  {@render children()}
</svelte:element>

<style>
  /* Centrado entre dos trazos de cinta que se afinan hacia fuera (la sala es simétrica). */
  .section-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin: 0 0 var(--space-3);
    text-align: center;
    font-family: var(--font-family-display);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .section-title::before,
  .section-title::after {
    content: '';
    flex: 0 1 var(--space-8);
    height: 2px;
    border-radius: 1px;
    background: linear-gradient(to right, transparent, var(--color-ribbon-shade));
    /* Huso: grueso junto al texto, afilado en la punta. */
    clip-path: polygon(0 50%, 100% 0, 100% 100%);
  }

  .section-title::after {
    transform: scaleX(-1);
  }

  .sub {
    font-size: var(--font-size-2xs);
  }
</style>
