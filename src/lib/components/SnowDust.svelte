<!--
  Polvo de nieve: un canvas a pantalla completa, por encima de la bruma (que no lo
  vele) y por debajo del viñeteado y del contenido, con miles de motas
  (`visual/dust.ts`) que flotan y parpadean.
  - Las motas son del azul lavanda de las sombras de la sala (algunas, cobre): en la
    escena clara, el blanco no se veía.
  - Canvas porque son miles de puntos independientes (con SVG o HTML serían miles
    de elementos).
  - Rendimiento: como mucho ~30 fotogramas por segundo, resolución limitada, menos
    motas en pantallas estrechas y parado con la pestaña oculta.
  - Con movimiento reducido, una imagen quieta.
  - Colores e intensidad del tema (`--color-dust`, `--color-dust-warm`, `--dust-opacity`).
  Decorativo y oculto a los lectores de pantalla.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { compact } from '../stores/viewport'
  import {
    DUST,
    createDust,
    motePosition,
    moteAlpha,
    sceneFrame,
    seededRandom,
    type DustMote,
  } from '../visual/dust'

  /** Fotogramas por segundo como máximo: basta para algo tan lento. */
  const MAX_FPS = 30
  /** Densidad de píxeles máxima del canvas (más no se nota en motas tan pequeñas). */
  const MAX_PIXEL_RATIO = 1.5
  /** Semilla del reparto: el mismo dibujo en cada carga. */
  const SEED = 1729

  let canvas: HTMLCanvasElement

  const motes = $derived(createDust($compact ? DUST.compactCount : DUST.count, seededRandom(SEED)))

  onMount(() => {
    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let colors = readColors()
    let width = 0
    let height = 0
    let frame = 0
    let last = 0
    const start = performance.now()

    function readColors() {
      const style = getComputedStyle(canvas)
      return {
        cold: style.getPropertyValue('--color-dust').trim(),
        warm: style.getPropertyValue('--color-dust-warm').trim(),
      }
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function draw(t: number, list: DustMote[]) {
      const ctx = context!
      const { scale, offsetX, offsetY } = sceneFrame(width, height)
      ctx.clearRect(0, 0, width, height)
      for (const mote of list) {
        const [sx, sy] = motePosition(mote, t)
        const x = offsetX + sx * scale
        const y = offsetY + sy * scale
        if (x < -4 || y < -4 || x > width + 4 || y > height + 4) continue
        const alpha = moteAlpha(mote, t)
        const half = mote.size / 2
        ctx.globalAlpha = alpha
        ctx.fillStyle = mote.warm ? colors.warm : colors.cold
        ctx.fillRect(x - half, y - half, mote.size, mote.size)
      }
      ctx.globalAlpha = 1
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      if (now - last < 1000 / MAX_FPS) return
      last = now
      draw((now - start) / 1000, motes)
    }

    function play() {
      cancelAnimationFrame(frame)
      if (reducedMotion.matches) draw(0, motes)
      else frame = requestAnimationFrame(loop)
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(frame)
      else play()
    }

    function onResize() {
      resize()
      if (reducedMotion.matches) draw(0, motes)
    }

    // El tema puede cambiar (modo oscuro): se vuelven a leer los colores.
    const themeObserver = new MutationObserver(() => {
      colors = readColors()
      if (reducedMotion.matches) draw(0, motes)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    play()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    reducedMotion.addEventListener('change', play)

    return () => {
      cancelAnimationFrame(frame)
      themeObserver.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', play)
    }
  })
</script>

<canvas class="dust" bind:this={canvas} aria-hidden="true"></canvas>

<style>
  .dust {
    position: fixed;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: var(--dust-opacity);
  }
</style>
