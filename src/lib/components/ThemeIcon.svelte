<!--
  Icono del control de tema (dibujo propio): luna para pasar a oscuro, sol para
  pasar a claro. Decorativo: el botón que lo contiene lleva la etiqueta.
-->
<script lang="ts">
  import type { Theme } from '../stores/theme'

  interface Props {
    /** Tema al que lleva el botón: `dark` dibuja la luna, `light` el sol. */
    to: Theme
    /** Tamaño en px. */
    size?: number
  }

  let { to, size = 20 }: Props = $props()

  /** Rayos del sol: ocho trazos cortos alrededor del centro. */
  const RAYS = Array.from({ length: 8 }, (_, index) => {
    const angle = (index * Math.PI) / 4
    const point = (radius: number) => `${12 + radius * Math.cos(angle)} ${12 + radius * Math.sin(angle)}`
    return `M${point(7.5)} L${point(9.5)}`
  }).join(' ')
</script>

<svg class="theme-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
  {#if to === 'dark'}
    <!-- Luna creciente: un disco al que otro disco le muerde un lado. -->
    <path class="fill" d="M14.5 3.2 A9 9 0 1 0 20.8 14.6 A7 7 0 1 1 14.5 3.2 Z" />
  {:else}
    <circle class="fill" cx="12" cy="12" r="4.5" />
    <path class="stroke" d={RAYS} />
  {/if}
</svg>

<style>
  .theme-icon {
    display: block;
  }

  .fill {
    fill: currentColor;
  }

  .stroke {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }
</style>
