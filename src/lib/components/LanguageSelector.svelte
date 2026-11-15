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
    <!-- Código corto (ES, EN) para que la cabecera quepa en móvil; el nombre completo, en la etiqueta accesible. -->
    <select
      {id}
      bind:value={$locale}
      aria-label={$t('language.current', { label: $t('language.label'), name: $t(`language.name.${$locale}`) })}
    >
      {#each LOCALES as option (option)}
        <option value={option} lang={option} title={$t(`language.name.${option}`)}>{$t(`language.code.${option}`)}</option>
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
    min-height: var(--control-icon-size);
    padding: 0 calc(var(--space-3) * 2 + 0.4em) 0 var(--space-3);
    font: inherit;
    color: var(--color-text);
    background: transparent;
    border: 0;
    border-radius: var(--control-radius);
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--easing-standard),
      box-shadow var(--duration-fast) var(--easing-standard);
  }

  /* La flecha hereda el color del selector. */
  .select {
    color: var(--color-text);
  }

  /* Como el botón fantasma: al pasar por encima, plano con su canto. */
  select:hover {
    background: var(--control-ghost-bg-hover);
    box-shadow: var(--control-edge);
  }
</style>
