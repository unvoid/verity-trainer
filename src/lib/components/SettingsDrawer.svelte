<!--
  Ajustes en un panel lateral flotante. Botón para abrirlo y <dialog> nativo
  (foco atrapado, Escape y clic fuera para cerrar).
-->
<script lang="ts">
  import { FEATURES } from '../features'
  import { t } from '../i18n'
  import Button from './Button.svelte'
  import GearIcon from './GearIcon.svelte'
  import SettingsPanel from './SettingsPanel.svelte'

  interface Props {
    /** Hay un entreno en curso: el modo y las rondas no se pueden cambiar. */
    playing?: boolean
  }

  let { playing = false }: Props = $props()

  const anyAvailable = FEATURES.hints || FEATURES.challengeMode || FEATURES.symbolRounds

  let dialog: HTMLDialogElement | undefined = $state()

  function open() {
    dialog?.showModal()
  }

  function close() {
    dialog?.close()
  }

  /** Clic en el fondo (fuera del panel): cierra. */
  function onBackdropClick(event: MouseEvent) {
    if (event.target === dialog) close()
  }
</script>

{#if anyAvailable}
  <Button icon variant="ghost" onclick={open} aria-haspopup="dialog" aria-label={$t('settings.title')} title={$t('settings.title')}>
    <GearIcon />
  </Button>

  <dialog bind:this={dialog} class="drawer" aria-labelledby="settings-title" onclick={onBackdropClick}>
    <div class="content">
      <SettingsPanel {playing} />
      <div class="actions">
        <Button onclick={close}>{$t('action.close')}</Button>
      </div>
    </div>
  </dialog>
{/if}

<style>
  .drawer {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(24rem, 100vw);
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    padding: 0;
    color: var(--color-text);
    background: var(--color-surface-raised);
    border: 0;
  }

  .drawer[open] {
    animation: slide-in var(--duration-normal) var(--easing-standard);
  }

  .drawer::backdrop {
    background: var(--color-backdrop);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    min-height: 100%;
    padding: var(--space-6);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
  }
</style>
