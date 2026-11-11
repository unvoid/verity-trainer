<!--
  Botón de la aplicación. Variantes:
  - primary: acción principal de una pantalla (relleno índigo).
  - secondary: resto de acciones (contorno).
-->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLButtonAttributes, 'class'> {
    variant?: 'primary' | 'secondary'
    children: Snippet
  }

  let { variant = 'secondary', type = 'button', children, ...rest }: Props = $props()
</script>

<button class="button {variant}" {type} {...rest}>
  {@render children()}
</button>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--control-height);
    padding: 0 var(--control-padding-x);
    font: inherit;
    font-weight: var(--font-weight-bold);
    border: var(--stroke-thin) solid var(--control-border);
    border-radius: var(--control-radius);
    cursor: pointer;
    transition:
      border-color var(--duration-fast) var(--easing-standard),
      background-color var(--duration-fast) var(--easing-standard),
      transform var(--duration-fast) var(--easing-standard);
  }

  .secondary {
    color: var(--control-text);
    background: var(--control-bg);
  }

  .secondary:hover:not(:disabled) {
    border-color: var(--control-border-hover);
  }

  .primary {
    color: var(--control-primary-text);
    background: var(--control-primary-bg);
    border-color: var(--control-primary-bg);
  }

  .primary:hover:not(:disabled) {
    background: color-mix(in srgb, var(--control-primary-bg), var(--control-primary-text) 12%);
  }

  .button:active:not(:disabled) {
    transform: translateY(1px);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: var(--control-disabled-opacity);
  }
</style>
