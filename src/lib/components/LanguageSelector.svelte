<script lang="ts">
  import { LOCALES, locale, t } from '../i18n'

  interface Props {
    /** id del <select>, para enlazarlo con su etiqueta. */
    id?: string
  }

  let { id = 'language-selector' }: Props = $props()
</script>

<div class="language-selector">
  <span class="select">
    <select {id} bind:value={$locale} aria-label={$t('language.label')}>
      {#each LOCALES as option (option)}
        <option value={option} lang={option}>{$t(`language.name.${option}`)}</option>
      {/each}
    </select>
  </span>
</div>

<style>
  .language-selector {
    display: inline-flex;
    align-items: center;
    font-size: var(--font-size-xs);
  }

  .select {
    position: relative;
    display: inline-flex;
  }

  /* Flecha dibujada con bordes: hereda el color del texto. */
  .select::after {
    content: '';
    position: absolute;
    top: 50%;
    right: var(--space-3);
    width: 0.4em;
    height: 0.4em;
    border-right: var(--stroke-focus) solid currentColor;
    border-bottom: var(--stroke-focus) solid currentColor;
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  select {
    appearance: none;
    min-height: var(--control-height-sm);
    padding: 0 calc(var(--space-3) * 2 + 0.4em) 0 var(--space-3);
    font: inherit;
    color: var(--color-text);
    background: transparent;
    border: 0;
    border-radius: var(--control-radius);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--easing-standard);
  }

  /* La flecha hereda el color del selector. */
  .select {
    color: var(--color-text);
  }

  select:hover {
    background: var(--control-bg-hover);
  }
</style>
