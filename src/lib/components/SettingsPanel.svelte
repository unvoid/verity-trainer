<!--
  Ajustes del jugador. Solo muestra los de las funcionalidades disponibles en
  esta versión (ver `features.ts`).
-->
<script lang="ts">
  import { FEATURES } from '../features'
  import { t } from '../i18n'
  import { settings } from '../stores/settings'
  import Switch from './Switch.svelte'

  interface Props {
    /** Hay un entreno en curso: el modo no se puede cambiar. */
    playing?: boolean
  }

  let { playing = false }: Props = $props()

  const anyAvailable = FEATURES.hints || FEATURES.challengeMode || FEATURES.symbolRounds
</script>

{#if anyAvailable}
  <section class="settings" aria-labelledby="settings-title">
    <h2 id="settings-title">{$t('settings.title')}</h2>

    {#if FEATURES.hints}
      <Switch
        id="setting-hints"
        label={$t('settings.hints')}
        description={$t('settings.hints.description')}
        checked={$settings.hints}
        onchange={(value) => settings.set('hints', value)}
      />
    {/if}

    {#if FEATURES.challengeMode}
      <Switch
        id="setting-challenge-mode"
        label={$t('settings.challenge-mode')}
        description={$t('settings.challenge-mode.description')}
        note={playing ? $t('settings.challenge-mode.locked') : undefined}
        checked={$settings.challengeMode}
        disabled={playing}
        onchange={(value) => settings.set('challengeMode', value)}
      />
    {/if}

    {#if FEATURES.symbolRounds}
      <Switch
        id="setting-symbol-rounds"
        label={$t('settings.symbol-rounds')}
        description={$t('settings.symbol-rounds.description')}
        checked={$settings.symbolRounds}
        onchange={(value) => settings.set('symbolRounds', value)}
      />
    {/if}
  </section>
{/if}

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-top: var(--space-6);
    border-top: var(--stroke-thin) solid var(--color-border);
  }

  h2 {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
  }
</style>
