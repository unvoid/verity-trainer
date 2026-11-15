<!--
  Botón de la aplicación. Variantes:
  - primary: acción principal de una pantalla (relleno índigo).
  - secondary: resto de acciones (piedra con canto en relieve).
  - ghost: sin fondo ni canto; para iconos sueltos (p. ej. ajustes en la cabecera).
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
      background-color var(--duration-fast) var(--easing-standard),
      box-shadow var(--duration-fast) var(--easing-standard);
  }

  /* Canto en los cuatro lados; al pasar por encima cambian sutilmente canto y fondo. Nada se desplaza. */
  .secondary {
    color: var(--control-text);
    background: var(--control-bg);
    box-shadow: var(--control-edge);
  }

  .secondary:hover:not(:disabled) {
    background: var(--control-bg-hover);
    box-shadow: var(--control-edge-hover);
  }

  .primary {
    color: var(--control-primary-text);
    background: var(--control-primary-bg);
    box-shadow: var(--control-primary-edge);
  }

  .primary:hover:not(:disabled) {
    background: var(--control-primary-bg-hover);
    box-shadow: var(--control-primary-edge-hover);
  }

  /* Sin fondo ni canto; al pasar por encima aparece el plano con su canto. */
  .ghost {
    color: var(--color-text);
    background: transparent;
  }

  .ghost:hover:not(:disabled) {
    background: var(--control-ghost-bg-hover);
    box-shadow: var(--control-edge);
  }

  .icon {
    width: var(--control-icon-size);
    min-height: var(--control-icon-size);
    padding: 0;
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: var(--control-disabled-opacity);
  }
</style>
