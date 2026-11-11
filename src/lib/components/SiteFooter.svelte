<!-- Pie de página: crédito al simulador original. -->
<script lang="ts">
  import { t } from '../i18n'

  interface Props {
    /** Web del simulador que inspiró este proyecto. */
    inspirationUrl?: string
  }

  let { inspirationUrl = 'https://verity.cabotmc.dev/' }: Props = $props()

  /** El texto lleva un marcador `{link}` donde va el enlace. */
  const parts = $derived($t('footer.inspired').split('{link}'))
</script>

<footer class="site-footer">
  <p>
    {parts[0]}<a href={inspirationUrl} target="_blank" rel="noopener noreferrer">{$t('footer.inspired.link')}</a>{parts[1] ?? ''}
  </p>
</footer>

<style>
  .site-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    max-width: var(--content-width);
    margin-inline: auto;
    padding: var(--space-8) var(--space-4) var(--space-6);
    font-size: var(--font-size-xs);
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
</style>
