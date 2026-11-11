<!--
  Pantalla de entrada. Secuencia:
  1. Capa con el color de fondo de la web.
  2. Fundido de entrada del título y el triángulo, quietos.
  3. Animación triángulo → círculo → cuadrado (loader en modo "una vez").
  4. Fundido de salida del título y el cuadrado (simétrico al de entrada).
  5. Con ambos ya desaparecidos, fundido de la capa y aviso `onreveal` para que
     la app haga aparecer su contenido.
  6. `onfinish` al terminar: se retira la pantalla.
  Con `prefers-reduced-motion`: sin animación de formas, fundidos breves.
  Tiempos: visual/loaderTimeline.ts.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { t } from '../i18n'
  import { DEFAULT_SPLASH_TIMINGS, splashSchedule, type SplashTimings } from '../visual/loaderTimeline'
  import ShardLoader from './ShardLoader.svelte'

  interface Props {
    /** Ciclo del loader (ms): controla la velocidad de la animación de formas. */
    cycle?: number
    timings?: SplashTimings
    /** Empieza a desaparecer la capa: la app debe hacer aparecer su contenido. */
    onreveal: () => void
    /** Termina la pantalla de entrada. */
    onfinish: () => void
  }

  let { cycle = 3600, timings = DEFAULT_SPLASH_TIMINGS, onreveal, onfinish }: Props = $props()

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /** Movimiento reducido: sin animación de formas y fundidos breves. */
  const REDUCED: SplashTimings = {
    fadeIn: 200,
    pauseBeforeStart: 600,
    holdLast: 0,
    fadeOut: 200,
    overlayFade: 200,
    overlap: 0,
  }

  const active = $derived(reducedMotion ? REDUCED : timings)

  let playing = $state(false)
  let contentOut = $state(false)
  let layerOut = $state(false)

  onMount(() => {
    // La secuencia se programa una vez, con los valores al montar.
    const schedule = splashSchedule(reducedMotion ? 0 : cycle, active)

    // Sin scroll de la página de debajo mientras se ve la pantalla de entrada.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const timers = [
      setTimeout(() => (playing = !reducedMotion), schedule.start),
      setTimeout(() => (contentOut = true), schedule.fadeOut),
      setTimeout(() => {
        layerOut = true
        onreveal()
      }, schedule.reveal),
      setTimeout(onfinish, schedule.end),
    ]
    return () => {
      timers.forEach(clearTimeout)
      root.style.overflow = previousOverflow
    }
  })
</script>

<div
  class="splash"
  class:out={layerOut}
  role="status"
  style:--fade-in="{active.fadeIn}ms"
  style:--fade-out="{active.fadeOut}ms"
  style:--layer-fade="{active.overlayFade}ms"
>
  <div class="content" class:out={contentOut}>
    <ShardLoader
      size={120}
      {cycle}
      once
      {playing}
      sequence={['triangle', 'circle', 'square']}
      label={$t('loader.label')}
    />
    <p class="title">{$t('app.title')}</p>
  </div>
</div>

<style>
  .splash {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg) var(--gradient-bg) fixed;
    transition: opacity var(--layer-fade) ease;
  }

  .splash.out {
    opacity: 0;
    pointer-events: none;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-6);
    /* backwards: la animación de entrada no retiene su valor al terminar,
       así la transición de salida puede desvanecer el contenido. */
    animation: fade-in var(--fade-in) ease backwards;
    transition: opacity var(--fade-out) ease;
  }

  .content.out {
    opacity: 0;
  }

  .title {
    margin: 0;
    font-family: var(--font-family-display);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }
</style>
