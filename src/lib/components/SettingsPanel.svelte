<!--
  Ajustes del jugador. Solo muestra los de las funcionalidades disponibles en
  esta versión (ver `features.ts`), más las preferencias visuales, que siempre están.
-->
<script lang="ts">
  import { DEFAULT_TIMINGS } from '../domain/drops'
  import { FEATURES } from '../features'
  import { t } from '../i18n'
  import { settings } from '../stores/settings'
  import SectionTitle from './SectionTitle.svelte'
  import Switch from './Switch.svelte'

  interface Props {
    /** Hay un entreno en curso: el modo y las rondas no se pueden cambiar. */
    playing?: boolean
  }

  let { playing = false }: Props = $props()
</script>

<section class="settings" aria-labelledby="settings-title">
  <SectionTitle id="settings-title">{$t('settings.title')}</SectionTitle>

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
      note={playing ? $t('settings.locked') : undefined}
      checked={$settings.challengeMode}
      disabled={playing}
      onchange={(value) => settings.set('challengeMode', value)}
    />
  {/if}

  {#if FEATURES.symbolRounds}
    <Switch
      id="setting-symbol-rounds"
      label={$t('settings.symbol-rounds')}
      description={$t('settings.symbol-rounds.description', { seconds: DEFAULT_TIMINGS.symbolLifetime / 1000 })}
      note={playing ? $t('settings.locked') : undefined}
      checked={$settings.symbolRounds}
      disabled={playing}
      onchange={(value) => settings.set('symbolRounds', value)}
    />
  {/if}

  <Switch
    id="setting-particles"
    label={$t('settings.particles')}
    description={$t('settings.particles.description')}
    checked={$settings.particles}
    onchange={(value) => settings.set('particles', value)}
  />
</section>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
</style>
