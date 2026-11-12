<!--
  Forma 3D: sólido granate y mate, con volumen marcado por 3 tonos planos.
  Decorativo por defecto; con `label` se anuncia como imagen.
-->
<script lang="ts">
  import type { Shape3D } from '../domain/types'

  interface Props {
    shape: Shape3D
    /** Tamaño máximo en px (ancho y alto); se encoge si no cabe. */
    size?: number
    /** Texto accesible. Sin él, la forma es decorativa. */
    label?: string
  }

  let { shape, size = 96, label }: Props = $props()

  type Tone = 'dark' | 'mid' | 'light'
  interface Face {
    readonly tone: Tone
    readonly d: string
  }

  /** Caras de cada sólido en un lienzo de 100×100, de atrás hacia delante. */
  const FACES: Record<Shape3D, readonly Face[]> = {
    sphere: [
      { tone: 'dark', d: 'M50 12 a38 38 0 1 1 0 76 a38 38 0 1 1 0 -76 Z' },
      { tone: 'mid', d: 'M46 13 a33 33 0 1 1 0 66 a33 33 0 1 1 0 -66 Z' },
      { tone: 'light', d: 'M38 24 a14 14 0 1 1 0 28 a14 14 0 1 1 0 -28 Z' },
    ],
    cube: [
      { tone: 'light', d: 'M50 12 L84 30 L50 48 L16 30 Z' },
      { tone: 'mid', d: 'M16 30 L50 48 V88 L16 70 Z' },
      { tone: 'dark', d: 'M50 48 L84 30 V70 L50 88 Z' },
    ],
    tetrahedron: [
      { tone: 'mid', d: 'M50 10 L16 80 L58 90 Z' },
      { tone: 'dark', d: 'M50 10 L58 90 L86 74 Z' },
    ],
    cylinder: [
      { tone: 'mid', d: 'M22 24 V76 A28 10 0 0 0 78 76 V24 Z' },
      { tone: 'dark', d: 'M60 33.3 V85.3 A28 10 0 0 0 78 76 V24 A28 10 0 0 1 60 33.3 Z' },
      { tone: 'light', d: 'M22 24 A28 10 0 1 1 78 24 A28 10 0 1 1 22 24 Z' },
    ],
    cone: [
      { tone: 'mid', d: 'M50 10 L20 78 A30 9 0 0 0 80 78 Z' },
      { tone: 'dark', d: 'M50 10 L62 86.2 A30 9 0 0 0 80 78 Z' },
    ],
    prism: [
      { tone: 'dark', d: 'M12 76 L30 42 L74 28 L56 62 Z' },
      { tone: 'mid', d: 'M30 42 L74 28 L92 62 L48 76 Z' },
      { tone: 'light', d: 'M12 76 L30 42 L48 76 Z' },
    ],
  }
</script>

<svg
  class="shape"
  width={size}
  height={size}
  viewBox="0 0 100 100"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
>
  {#each FACES[shape] as face, index (index)}
    <path class="face face-{face.tone}" d={face.d} />
  {/each}
</svg>

<style>
  .shape {
    display: block;
    flex: none;
    max-width: 100%;
    height: auto;
  }

  .face-dark {
    fill: var(--color-solid-dark);
  }

  .face-mid {
    fill: var(--color-solid-mid);
  }

  .face-light {
    fill: var(--color-solid-light);
  }
</style>
