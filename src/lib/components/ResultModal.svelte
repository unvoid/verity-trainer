<!--
  Resumen al resolver: intercambios, mínimo, tiempo y la solución más corta.
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
</script>

<dialog bind:this={dialog} class="result" aria-labelledby="result-title" onclose={onclose}>
  <h2 id="result-title">{$t('result.title')}</h2>
  {#if mode === 'challenge'}
    <p class="mode">{$t('status.mode.challenge')}</p>
  {/if}

  <dl class="stats">
    <div>
      <dt>{$t('result.swaps')}</dt>
      <dd>{swaps}</dd>
    </div>
    <div>
      <dt>{$t('result.minimum')}</dt>
      <dd>{minimum}</dd>
    </div>
    <div>
      <dt>{$t('result.time')}</dt>
      <dd>{$t('result.seconds', { seconds })}</dd>
    </div>
  </dl>

  <p class="verdict">{extra > 0 ? $tn('result.extra', extra) : $t('result.optimal')}</p>

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

  .mode {
    margin-top: var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
    margin: var(--space-6) 0 var(--space-4);
  }

  .stats div {
    padding: var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
  }

  dt {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  dd {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
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
