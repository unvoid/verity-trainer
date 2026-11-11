<!--
  Pantalla de entrada: el loader de fragmentos y el título durante un tiempo
  mínimo, aunque no haya nada que cargar. Le da identidad a la web al abrirla.
  Con `prefers-reduced-motion`, forma estática y menos espera.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { t } from '../i18n'
  import ShardLoader from './ShardLoader.svelte'

  interface Props {
    /** Tiempo mínimo visible (ms). Por defecto: el cuadrado se forma, se rompe y entra el triángulo. */
    minDuration?: number
    /** Tiempo mínimo con movimiento reducido (ms). */
    reducedMotionDuration?: number
    /** Duración del fundido de salida (ms). */
    fadeDuration?: number
    onfinish: () => void
  }

  let { minDuration = 2600, reducedMotionDuration = 800, fadeDuration = 300, onfinish }: Props = $props()

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  onMount(() => {
    // Sin scroll de la página de debajo mientras se ve la pantalla de entrada.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const id = setTimeout(onfinish, reducedMotion ? reducedMotionDuration : minDuration)
    return () => {
      clearTimeout(id)
      root.style.overflow = previousOverflow
    }
  })
</script>

<div class="splash" role="status" out:fade={{ duration: reducedMotion ? 0 : fadeDuration }}>
  <ShardLoader size={120} label={$t('loader.label')} />
  <p class="title">{$t('app.title')}</p>
</div>

<style>
  .splash {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    background: var(--color-bg) var(--gradient-bg) fixed;
  }

  .title {
    margin: 0;
    font-family: var(--font-family-display);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
</style>
