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
  <span class="select">
    <select {id} bind:value={$locale}>
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
    gap: var(--space-2);
    font-size: var(--font-size-sm);
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
    min-height: calc(var(--control-height) * 0.8);
    padding: 0 calc(var(--space-3) * 2 + 0.4em) 0 var(--space-3);
    font: inherit;
    color: var(--control-text);
    background: var(--control-bg);
    border: var(--stroke-thin) solid var(--control-border);
    border-radius: var(--control-radius);
    cursor: pointer;
    transition: border-color var(--duration-fast) var(--easing-standard);
  }

  select:hover {
    border-color: var(--control-border-hover);
  }
</style>
