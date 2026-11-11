<!-- Ajustes en un panel lateral, abierto con el engranaje de la cabecera. -->
<script lang="ts">
  import { FEATURES } from '../features'
  import { t } from '../i18n'
  import Drawer from './Drawer.svelte'
  import GearIcon from './GearIcon.svelte'
  import SettingsPanel from './SettingsPanel.svelte'

  interface Props {
    /** Hay un entreno en curso: el modo y las rondas no se pueden cambiar. */
    playing?: boolean
  }

  let { playing = false }: Props = $props()

  const anyAvailable = FEATURES.hints || FEATURES.challengeMode || FEATURES.symbolRounds
</script>

{#snippet gear()}
  <GearIcon />
{/snippet}

{#if anyAvailable}
  <Drawer label={$t('settings.title')} titleId="settings-title" icon={gear}>
    <SettingsPanel {playing} />
  </Drawer>
{/if}
