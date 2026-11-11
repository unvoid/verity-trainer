<!--
  Panel lateral flotante con su botón de apertura (icono en la cabecera).
  <dialog> nativo: foco atrapado, Escape y clic fuera para cerrar.
  Lo usan los ajustes y el manual de uso.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { t } from '../i18n'
  import Button from './Button.svelte'

  interface Props {
    /** Etiqueta accesible del botón de apertura. */
    label: string
    /** id del título del panel (para `aria-labelledby`). */
    titleId: string
    /** Icono del botón de apertura. */
    icon: Snippet
    children: Snippet
  }

  let { label, titleId, icon, children }: Props = $props()

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

<Button icon variant="ghost" onclick={open} aria-haspopup="dialog" aria-label={label} title={label}>
  {@render icon()}
</Button>

<dialog bind:this={dialog} class="drawer" aria-labelledby={titleId} onclick={onBackdropClick}>
  <!-- Foco inicial arriba del todo (si no, el navegador lo lleva a "Cerrar" y desplaza el panel). -->
  <!-- svelte-ignore a11y_autofocus -->
  <div class="content" tabindex="-1" autofocus>
    {@render children()}
    <div class="actions">
      <Button onclick={close}>{$t('action.close')}</Button>
    </div>
  </div>
</dialog>

<style>
  .drawer {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(26rem, 100vw);
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

  .content:focus {
    outline: none;
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
