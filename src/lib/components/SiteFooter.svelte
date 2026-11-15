<!--
  Pie de página: una sola frase normal, "Con ♥, unvoid [GitHub] · Inspirado en
  Verity Simulator". El icono de GitHub enlaza al repositorio (sin VITE_REPO_URL,
  no aparece) y el crédito al simulador original lleva su autor en el tooltip.
-->
<script lang="ts">
  import { t } from '../i18n'
  import GitHubIcon from './GitHubIcon.svelte'
  import HeartIcon from './HeartIcon.svelte'
  import Tooltip from './Tooltip.svelte'

  interface Props {
    /** Nombre con el que se firma. */
    author?: string
    /** Web del simulador que inspiró este proyecto. */
    inspirationUrl?: string
    /** Dirección del repositorio. Por defecto, VITE_REPO_URL. */
    repoUrl?: string
  }

  let {
    author = 'unvoid',
    inspirationUrl = 'https://verity.cabotmc.dev/',
    repoUrl = import.meta.env.VITE_REPO_URL ?? '',
  }: Props = $props()

  /** Trozos de un texto con marcadores (`{heart}`, `{link}`…), para intercalar elementos. */
  const split = (text: string) => text.split(/(\{\w+\})/)

  // `{heart}`, `{repo}` y `{link}` no se sustituyen al traducir: quedan como marcadores.
  // La frase se parte por el icono: texto antes, icono, texto después.
  const parts = $derived(split($t('footer.credits', { author })))
  const repoAt = $derived(parts.indexOf('{repo}'))
  const before = $derived(repoAt < 0 ? parts : parts.slice(0, repoAt))
  const after = $derived(repoAt < 0 ? [] : parts.slice(repoAt + 1))
  const inspirationName = $derived($t('footer.inspired.link'))
</script>

<!--
  Bloques en fila con `gap` (texto, icono, texto), centrados con el icono. Dentro de
  cada bloque, texto normal; en una sola línea de código, porque los saltos meterían
  espacios junto a los elementos.
-->
{#snippet text(list: string[])}{#each list as part, index (index)}{#if part === '{heart}'}<HeartIcon /><span class="visually-hidden">{$t('footer.heart')}</span>{:else if part === '{link}'}<Tooltip text={$t('footer.inspired.title', { name: inspirationName })}>{#snippet children(id)}<a href={inspirationUrl} target="_blank" rel="noopener noreferrer" aria-describedby={id}>{inspirationName}</a>{/snippet}</Tooltip>{:else}{part}{/if}{/each}{/snippet}

<footer class="site-footer">
  <p class="credits">
    <span>{@render text(before)}</span>
    {#if repoAt >= 0 && repoUrl.trim()}
      <Tooltip text={$t('footer.repo')}>
        {#snippet children(id)}
          <a class="repo" href={repoUrl} target="_blank" rel="noopener noreferrer" aria-label={$t('footer.repo')} aria-describedby={id}>
            <GitHubIcon size={14} />
          </a>
        {/snippet}
      </Tooltip>
    {/if}
    {#if after.length}
      <span>{@render text(after)}</span>
    {/if}
  </p>
</footer>

<style>
  .site-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    width: 100%;
    max-width: var(--content-width);
    margin-inline: auto;
    padding: var(--space-8) var(--space-4) var(--space-6);
    font-size: var(--font-size-xs);
    text-align: center;
    color: var(--color-text-muted);
  }

  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  a:hover {
    color: var(--color-text);
  }

  /* Texto, icono y texto en fila, centrados entre sí; si no caben, pasan a otra línea. */
  .credits {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
  }

  /* Icono de GitHub: sin subrayado, del color del texto. */
  .repo {
    display: flex;
    text-decoration: none;
  }
</style>
