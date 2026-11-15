<!--
  Tooltip propio (el nativo de `title` tarda y no se puede estilar): una placa opaca
  con su canto, encima del elemento, que aparece al instante al pasar el ratón o
  con el foco de teclado. Se enlaza al elemento con `aria-describedby`, así que los
  lectores de pantalla lo leen. Solo texto: nada interactivo dentro.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    /** Texto del tooltip. */
    text: string
    /** El elemento al que acompaña; recibe el id del tooltip para `aria-describedby`. */
    children: Snippet<[string]>
  }

  let { text, children }: Props = $props()

  const id = $props.id()
</script>

<span class="tooltip-anchor">
  {@render children(id)}
  <span class="tooltip" {id} role="tooltip">{text}</span>
</span>

<style>
  .tooltip-anchor {
    position: relative;
    display: inline-flex;
  }

  .tooltip {
    position: absolute;
    bottom: calc(100% + var(--space-2));
    left: 50%;
    z-index: 20;
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-2xs);
    line-height: 1.3;
    white-space: nowrap;
    color: var(--color-text);
    background: var(--color-surface-raised);
    border-radius: var(--radius-sm);
    box-shadow: var(--control-edge), var(--shadow-floating);
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%);
    pointer-events: none;
    transition:
      opacity var(--duration-fast) var(--easing-standard),
      visibility var(--duration-fast) var(--easing-standard);
  }

  .tooltip-anchor:hover .tooltip,
  .tooltip-anchor:focus-within .tooltip {
    opacity: 1;
    visibility: visible;
  }
</style>
