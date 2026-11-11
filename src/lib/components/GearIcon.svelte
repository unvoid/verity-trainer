<!-- Icono de engranaje (dibujo propio). Decorativo: el botón que lo contiene lleva la etiqueta. -->
<script lang="ts">
  interface Props {
    /** Tamaño en px. */
    size?: number
  }

  let { size = 20 }: Props = $props()
</script>

<svg class="gear" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
  <path
    fill-rule="evenodd"
    d="M9.23 4.92 L10.24 2.16 L13.76 2.16 L14.77 4.92 L15.05 5.04 L17.72 3.8 L20.2 6.28 L18.96 8.95 L19.08 9.23 L21.84 10.24 L21.84 13.76 L19.08 14.77 L18.96 15.05 L20.2 17.72 L17.72 20.2 L15.05 18.96 L14.77 19.08 L13.76 21.84 L10.24 21.84 L9.23 19.08 L8.95 18.96 L6.28 20.2 L3.8 17.72 L5.04 15.05 L4.92 14.77 L2.16 13.76 L2.16 10.24 L4.92 9.23 L5.04 8.95 L3.8 6.28 L6.28 3.8 L8.95 5.04 Z M12 8.6 a3.4 3.4 0 1 0 0 6.8 a3.4 3.4 0 1 0 0 -6.8 Z"
  />
</svg>

<style>
  .gear {
    display: block;
    fill: currentColor;
  }
</style>
