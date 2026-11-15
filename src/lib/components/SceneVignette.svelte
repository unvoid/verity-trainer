<!--
  Viñeteado azul lavanda hacia los bordes, como las sombras del arte del encuentro.
  Va por encima de la escena y de la bruma (también la tiñe) y por debajo del contenido,
  con su propia intensidad (`--scene-vignette-opacity`). Decorativo y oculto a los
  lectores de pantalla.
-->
<div class="vignette" aria-hidden="true"></div>

<style>
  .vignette {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: var(--scene-vignette);
    opacity: var(--scene-vignette-opacity);
  }
</style>
