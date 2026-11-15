<!--
  Pictograma de caballero (dibujo propio, sin calcar arte del juego): yelmo en
  punta de flecha con dos cuernos y tres ojos de brasa, hombreras que se alzan en
  punta y piernas firmes. Tinta de silueta, como los símbolos. Decorativo: la tile
  que lo contiene lleva la etiqueta.
-->
<script lang="ts">
  interface Props {
    /** Tamaño en px. */
    size?: number
  }

  let { size = 44 }: Props = $props()
</script>

<svg class="pictogram" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
  <path
    class="ink"
    d="M24 3 C26 6.5 30 8.5 35 9 C31.5 11 29 13 27.6 15.6 C26.2 17 21.8 17 20.4 15.6 C19 13 16.5 11 13 9 C18 8.5 22 6.5 24 3 Z"
  />
  <path
    class="ink"
    d="M19 18.5 C15.5 18.3 12 17.2 9 14.5 C7 12 5.5 9 4.5 5.5 C3 10 3 15 5 19 C6.5 22 9 23.5 12 24 C13.5 27 15.5 29.5 17.5 31 C16 35.5 14 40.5 11 46 C13 47 16.5 47.2 19.5 46.5 C21 42 22.5 38.5 24 36 C25.5 38.5 27 42 28.5 46.5 C31.5 47.2 35 47 37 46 C34 40.5 32 35.5 30.5 31 C32.5 29.5 34.5 27 36 24 C39 23.5 41.5 22 43 19 C45 15 45 10 43.5 5.5 C42.5 9 41 12 39 14.5 C36 17.2 32.5 18.3 29 18.5 C27.5 20 20.5 20 19 18.5 Z"
  />
  <circle class="eye" cx="22.3" cy="10.6" r="1" />
  <circle class="eye" cx="25.7" cy="10.6" r="1" />
  <circle class="eye" cx="24" cy="13" r="1" />
</svg>

<style>
  .pictogram {
    display: block;
    flex: none;
    max-width: 100%;
    height: auto;
  }

  .ink {
    fill: var(--color-silhouette);
  }

  /* Ojos de brasa, como el núcleo cobre de los símbolos. */
  .eye {
    fill: var(--color-ember);
  }
</style>
