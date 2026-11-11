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
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    color: var(--color-text);
    border-radius: var(--control-radius);
    transition: background-color var(--duration-fast) var(--easing-standard);
  }

  .repo-link:hover {
    background: var(--control-bg-hover);
  }
</style>
