<script lang="ts">
  import { LOCALES, locale, t } from '../i18n'

  interface Props {
    /** id del <select>, para enlazarlo con su etiqueta. */
    id?: string
  }

  let { id = 'language-selector' }: Props = $props()
</script>

<div class="language-selector">
  <label for={id}>{$t('language.label')}</label>
  <select {id} bind:value={$locale}>
    {#each LOCALES as option (option)}
      <option value={option} lang={option}>{$t(`language.name.${option}`)}</option>
    {/each}
  </select>
</div>

<style>
  .language-selector {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
  }

  select {
    font: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: var(--stroke-thin) solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--space-1) var(--space-2);
  }
</style>
