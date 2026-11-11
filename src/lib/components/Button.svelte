<!--
  Botón de la aplicación. Variantes:
  - primary: acción principal de una pantalla (relleno índigo).
  - secondary: resto de acciones (plano de tono, sin borde).
  - ghost: sin borde ni fondo; para iconos sueltos (p. ej. ajustes en la cabecera).
  Con `icon`, botón cuadrado solo con icono (altura pequeña): requiere `aria-label`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLButtonAttributes, 'class'> {
    variant?: 'primary' | 'secondary' | 'ghost'
    /** Botón solo con icono (cuadrado). */
    icon?: boolean
    children: Snippet
  }

  let { variant = 'secondary', icon = false, type = 'button', children, ...rest }: Props = $props()
</script>

<button class="button {variant}" class:icon {type} {...rest}>
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
    font-size: var(--font-size-xs); /* nunca mayor que un título de sección */
    font-weight: var(--font-weight-bold);
    border: 0;
    border-radius: var(--control-radius);
    cursor: pointer;
    transition:
      color var(--duration-fast) var(--easing-standard),
      background-color var(--duration-fast) var(--easing-standard);
  }

  .secondary {
    color: var(--control-text);
    background: var(--control-bg);
  }

  .secondary:hover:not(:disabled) {
    background: var(--control-bg-hover);
  }

  .primary {
    color: var(--control-primary-text);
    background: var(--control-primary-bg);
  }

  .primary:hover:not(:disabled) {
    background: color-mix(in srgb, var(--control-primary-bg), var(--control-primary-text) 12%);
  }

  .ghost {
    color: var(--color-text);
    background: transparent;
  }

  .ghost:hover:not(:disabled) {
    background: var(--control-bg-hover);
  }

  .icon {
    width: var(--control-height-sm);
    min-height: var(--control-height-sm);
    padding: 0;
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: var(--control-disabled-opacity);
  }
</style>
