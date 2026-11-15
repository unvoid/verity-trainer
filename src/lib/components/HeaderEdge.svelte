<!--
  Borde inferior de la cabecera, sin línea recta: recto por la izquierda y, por la
  derecha, la piedra cae en un lóbulo suave (un cuarto de elipse que nace tangente
  a la línea y baja hasta la esquina).
  - Lóbulo: la misma piedra esmerilada que la cabecera, recortada con la curva.
  - Canto: sombra y, pegada debajo, luz (como los cantos de la sala), dibujado como
    una sola línea continua de lado a lado, sin costura entre el tramo recto y la curva.
  Va dentro de `.app-header`, que debe ser `position: relative` y no llevar
  `backdrop-filter` propio (bloquearía el esmerilado del lóbulo). Decorativo.
-->
<script lang="ts">
  interface Props {
    /** Ancho del lóbulo, en % del ancho de la cabecera. */
    width?: number
    /** Cuánto cae el lóbulo en la esquina derecha, en px. */
    drop?: number
  }

  let { width = 55, drop = 10 }: Props = $props()

  /** Puntos de la curva, de su inicio (tangente a la línea) a la esquina: fracciones 0–1. */
  const STEPS = 16
  const curve = Array.from({ length: STEPS + 1 }, (_, i) => {
    const angle = (i / STEPS) * (Math.PI / 2)
    return { x: Math.sin(angle), y: 1 - Math.cos(angle) }
  })

  /** Recorte del lóbulo: arriba plano y abajo la curva (en % de su propia caja). */
  const clip = $derived(
    `polygon(0 0, 100% 0, ${curve
      .slice()
      .reverse()
      .map((p) => `${(p.x * 100).toFixed(2)}% ${(p.y * 100).toFixed(2)}%`)
      .join(', ')})`,
  )

  /** Línea del canto en todo el ancho: x en % de la cabecera, y en px. */
  const line = $derived(
    `M0 0 H${100 - width} ` + curve.map((p) => `L${(100 - width + p.x * width).toFixed(2)} ${(p.y * drop).toFixed(2)}`).join(' '),
  )
</script>

<div class="lobe" style:width="{width}%" style:height="{drop}px" style:clip-path={clip} aria-hidden="true"></div>
<svg
  class="edge"
  style:height="{drop + 2}px"
  viewBox="0 -1 100 {drop + 2}"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path class="shade" d={line} />
  <path class="light" d={line} transform="translate(0 1)" />
</svg>

<style>
  .lobe {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--color-stone);
    -webkit-backdrop-filter: blur(var(--stone-blur));
    backdrop-filter: blur(var(--stone-blur));
    pointer-events: none;
  }

  /* La línea del canto se apoya en el borde inferior de la cabecera. */
  .edge {
    position: absolute;
    top: calc(100% - 1px);
    left: 0;
    width: 100%;
    overflow: visible;
    pointer-events: none;
  }

  path {
    fill: none;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  .shade {
    stroke: var(--bevel-shade);
  }

  .light {
    stroke: var(--bevel-light);
  }
</style>
