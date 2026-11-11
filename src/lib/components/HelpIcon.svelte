<!-- Icono de ayuda: interrogación en un círculo (dibujo propio). Decorativo. -->
<script lang="ts">
  interface Props {
    /** Tamaño en px. */
    size?: number
  }

  let { size = 20 }: Props = $props()
</script>

<svg class="help" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
  <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" stroke-width="1.8" />
  <path
    d="M9.4 9.4a2.7 2.7 0 1 1 3.8 2.5c-.75.33-1.2.98-1.2 1.75v.45"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
  />
  <circle cx="12" cy="16.9" r="1.15" fill="currentColor" />
</svg>

<style>
  .help {
    display: block;
  }
</style>
