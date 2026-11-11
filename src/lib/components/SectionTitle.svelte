<!--
  Título de sección: el mismo estilo en todo el tablero y el editor
  (fuente de títulos, mayúsculas pequeñas, alineado a la izquierda).
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
  .section-title {
    margin: 0 0 var(--space-3);
    font-family: var(--font-family-display);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text);
  }

  .sub {
    font-size: var(--font-size-2xs);
  }
</style>
