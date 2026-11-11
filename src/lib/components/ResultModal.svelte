<!--
  Resumen al resolver: una frase con intercambios, tiempo y mínimo, y la solución más corta.
  Usa <dialog> nativo (foco atrapado y Escape para cerrar).
-->
<script lang="ts">
  import type { Mode, Swap } from '../domain/types'
  import { t, tn } from '../i18n'
  import Button from './Button.svelte'

  interface Props {
    open: boolean
    swaps: number
    minimum: number
    seconds: number
    mode: Mode
    /** Secuencia más corta desde el punto de partida. */
    solution: readonly Swap[]
    onretry: () => void
    onnewgame: () => void
    onclose: () => void
  }

  let { open, swaps, minimum, seconds, mode, solution, onretry, onnewgame, onclose }: Props = $props()

  let dialog: HTMLDialogElement | undefined = $state()

  $effect(() => {
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  })

  const extra = $derived(swaps - minimum)

  /** Duración legible: segundos, o minutos y segundos a partir de 60 s. */
  const time = $derived(
    seconds < 60
      ? $t('time.seconds', { seconds })
      : $t('time.minutes', { minutes: Math.floor(seconds / 60), seconds: seconds % 60 }),
  )
</script>

<dialog bind:this={dialog} class="result" aria-labelledby="result-title" onclose={onclose}>
  <h2 id="result-title">{$t('result.title')}</h2>
  <p class="subtitle">{$t('result.subtitle')}</p>
  {#if mode === 'challenge'}
    <p class="mode">{$t('status.mode.challenge')}</p>
  {/if}

  <p class="summary">
    {$tn(extra > 0 ? 'result.summary.extra' : 'result.summary.optimal', swaps, { time, minimum })}
  </p>

  {#if extra > 0 && solution.length > 0}
    <h3>{$t('result.solution')}</h3>
    <ol class="steps">
      {#each solution as step, index (index)}
        <li>
          {$t('result.step', {
            firstSymbol: $t(`symbol.ref.${step.first.symbol}`),
            firstStatue: $t(`statue.ref.${step.first.slot}`),
            secondSymbol: $t(`symbol.ref.${step.second.symbol}`),
            secondStatue: $t(`statue.ref.${step.second.slot}`),
          })}
        </li>
      {/each}
    </ol>
  {/if}

  <div class="actions">
    <Button onclick={onclose}>{$t('action.close')}</Button>
    <Button onclick={onretry}>{$t('action.retry')}</Button>
    <Button variant="primary" onclick={onnewgame}>{$t('action.new-game')}</Button>
  </div>
</dialog>

<style>
  .result {
    width: min(32rem, calc(100vw - 2 * var(--space-4)));
    max-height: calc(100dvh - 2 * var(--space-4));
    padding: var(--space-6);
    color: var(--color-text);
    background: var(--color-surface-raised);
    border: 0;
    border-radius: var(--radius-md);
  }

  .result::backdrop {
    background: var(--color-backdrop);
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
  }

  h3 {
    margin-top: var(--space-6);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
  }

  .summary {
    margin-top: var(--space-6);
  }

  .subtitle {
    margin-top: var(--space-2);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .mode {
    margin-top: var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }





  .steps {
    margin: var(--space-2) 0 0;
    padding-left: var(--space-6);
    font-size: var(--font-size-sm);
  }

  .steps li + li {
    margin-top: var(--space-1);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }
</style>
