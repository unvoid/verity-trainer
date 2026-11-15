<!--
  Enlace al repositorio en GitHub, como icono en la cabecera (mismo aspecto que
  los botones de icono). Solo se muestra si VITE_REPO_URL tiene valor: así puede
  quedar oculto mientras el repositorio sea privado.
-->
<script lang="ts">
  import { t } from '../i18n'
  import GitHubIcon from './GitHubIcon.svelte'

  interface Props {
    /** Dirección del repositorio. Por defecto, VITE_REPO_URL. */
    url?: string
  }

  let { url = import.meta.env.VITE_REPO_URL ?? '' }: Props = $props()
</script>

{#if url.trim()}
  <a
    class="repo-link"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={$t('header.repo')}
    title={$t('header.repo')}
  >
    <GitHubIcon />
  </a>
{/if}

<style>
  /* Mismo aspecto que Button variant="ghost" icon. */
  .repo-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-icon-size);
    height: var(--control-icon-size);
    color: var(--color-text);
    border-radius: var(--control-radius);
    transition:
      background-color var(--duration-fast) var(--easing-standard),
      box-shadow var(--duration-fast) var(--easing-standard);
  }

  /* Como el botón fantasma: al pasar por encima, plano con su canto. */
  .repo-link:hover {
    background: var(--control-ghost-bg-hover);
    box-shadow: var(--control-edge);
  }
</style>
