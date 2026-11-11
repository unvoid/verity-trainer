<script lang="ts">
  import LanguageSelector from './lib/components/LanguageSelector.svelte'
  import { t } from './lib/i18n'
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
</svelte:head>

<header class="app-header">
  <h1>{$t('app.title')}</h1>
  <LanguageSelector />
</header>

<main class="app-main">
  <p>{$t('app.tagline')}</p>
</main>

<style>
  .app-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--stroke-thin) solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
  }

  .app-main {
    padding: var(--space-6);
    color: var(--color-text-muted);
  }
</style>
