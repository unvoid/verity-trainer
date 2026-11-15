<!--
  Pictograma de ogro (dibujo propio, sin calcar arte del juego): masa encorvada sin
  cabeza, brazos larguísimos con garras, piernas cortas y la cara en el pecho,
  separada por un surco, con un racimo de ojos de brasa. Tinta de silueta, como los
  símbolos. Decorativo: la tile que lo contiene lleva la etiqueta.
-->
<script lang="ts">
  interface Props {
    /** Tamaño en px. */
    size?: number
  }

  let { size = 44 }: Props = $props()
</script>

<svg class="pictogram" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
  <!-- Cuerpo con el surco de la cara recortado (evenodd) y, dentro, la cara. -->
  <path
    class="ink"
    fill-rule="evenodd"
    d="M24 5 C31 5 36 8 38.5 12.5 C43 14 45.5 18.5 45.5 25 C45.5 31 45 36 45 40 C46.8 42 46.8 45 45 47 C44 44.5 42.5 43 40.5 42.5 C40 37 39.5 32 38 28 C37 31.5 35.5 34 33.5 36 C34.5 40 34.5 43.5 33.5 47 C31.5 47.6 29.5 47.6 27.5 47 C27.5 43 27 40.5 24 39.5 C21 40.5 20.5 43 20.5 47 C18.5 47.6 16.5 47.6 14.5 47 C13.5 43.5 13.5 40 14.5 36 C12.5 34 11 31.5 10 28 C8.5 32 8 37 7.5 42.5 C5.5 43 4 44.5 3 47 C1.2 45 1.2 42 3 40 C3 36 2.5 31 2.5 25 C2.5 18.5 5 14 9.5 12.5 C12 8 17 5 24 5 Z M24 13 C19.2 13 16 16.8 16 21.5 C16 26.2 19.2 30.5 24 30.5 C28.8 30.5 32 26.2 32 21.5 C32 16.8 28.8 13 24 13 Z"
  />
  <path
    class="ink"
    d="M24 14.6 C20.2 14.6 17.6 17.6 17.6 21.5 C17.6 25.4 20.2 28.9 24 28.9 C27.8 28.9 30.4 25.4 30.4 21.5 C30.4 17.6 27.8 14.6 24 14.6 Z"
  />
  <circle class="eye" cx="22" cy="19.5" r="1.1" />
  <circle class="eye" cx="26" cy="19.5" r="1.1" />
  <circle class="eye" cx="24" cy="22.5" r="1.1" />
  <circle class="eye" cx="20.8" cy="23.6" r="0.8" />
  <circle class="eye" cx="27.2" cy="23.6" r="0.8" />
</svg>

<style>
  .pictogram {
    display: block;
    flex: none;
    max-width: 100%;
    height: auto;
  }

  /* Como los símbolos: silueta casi negra; en oscuro, con un filo de luz fino. */
  .ink {
    fill: var(--color-symbol);
    stroke: var(--color-symbol-edge);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    /* Detrás del relleno: solo asoma la mitad exterior, un filo de medio píxel. */
    paint-order: stroke;
  }

  /* Ojos de brasa, como el núcleo cobre de los símbolos. */
  .eye {
    fill: var(--color-ember);
  }
</style>
