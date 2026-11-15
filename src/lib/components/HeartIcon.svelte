<!-- Corazón (dibujo propio), en el granate de las estatuas. Decorativo: el texto lo nombra. -->
<script lang="ts">
  interface Props {
    /** Tamaño en px. */
    size?: number
  }

  let { size = 12 }: Props = $props()
</script>

<svg class="heart" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12 21 C6 16.5 2 13 2 8.5 C2 5.4 4.4 3 7.3 3 C9.3 3 11 4.1 12 5.8 C13 4.1 14.7 3 16.7 3 C19.6 3 22 5.4 22 8.5 C22 13 18 16.5 12 21 Z" />
</svg>

<style>
  .heart {
    display: inline-block;
    vertical-align: -0.1em;
    fill: var(--color-statue);
  }
</style>
