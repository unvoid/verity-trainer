<!--
  Estado de la partida: contador, símbolo en mano, último resultado
  (anunciado a lectores de pantalla) y resumen al resolver.
-->
<script lang="ts">
  import type { Symbol2D } from '../domain/types'
  import { t } from '../i18n'
  import type { Feedback } from '../stores/game'
  import Button from './Button.svelte'

  interface Props {
    swaps: number
    held: Symbol2D | null
    feedback: Feedback | null
    /** Resumen al resolver, o `null` si la partida sigue en curso. */
    result: { readonly minimum: number; readonly seconds: number } | null
    onnewgame: () => void
    onrestart: () => void
  }

  let { swaps, held, feedback, result, onnewgame, onrestart }: Props = $props()

  const feedbackText = $derived.by(() => {
    if (!feedback) return ''
    switch (feedback.kind) {
      case 'no-symbol-held':
        return $t('feedback.no-symbol-held')
      case 'rejected':
        return $t(`feedback.${feedback.error}`, {
          statue: $t(`statue.name.${feedback.deposit.slot}`),
          symbol: $t(`symbol.${feedback.deposit.symbol}`),
        })
      case 'marked':
        return $t('feedback.marked', {
          statue: $t(`statue.name.${feedback.deposit.slot}`),
          symbol: $t(`symbol.${feedback.deposit.symbol}`),
        })
      case 'swapped':
        return $t('feedback.swapped', {
          firstSymbol: $t(`symbol.${feedback.swap.first.symbol}`),
          firstStatue: $t(`statue.name.${feedback.swap.first.slot}`),
          secondSymbol: $t(`symbol.${feedback.swap.second.symbol}`),
          secondStatue: $t(`statue.name.${feedback.swap.second.slot}`),
        })
    }
  })
</script>

<section class="status">
  <p class="counters">
    <span>{$t('status.swaps', { count: swaps })}</span>
    <span>{held ? $t('status.holding', { symbol: $t(`symbol.${held}`) }) : $t('status.empty-hands')}</span>
  </p>

  <p class="feedback" role="status">{feedbackText}</p>

  {#if result}
    <div class="result" role="status">
      <strong>{$t('status.solved')}</strong>
      <span>{$t('status.summary', { count: swaps, minimum: result.minimum, seconds: result.seconds })}</span>
    </div>
  {/if}

  <div class="actions">
    <Button onclick={onrestart}>{$t('action.restart')}</Button>
    <Button variant="primary" onclick={onnewgame}>{$t('action.new-game')}</Button>
  </div>
</section>

<style>
  .status {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  p {
    margin: 0;
  }

  .counters {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
  }

  .feedback {
    min-height: calc(var(--line-height) * 1em);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .result {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-3) var(--space-4);
    border: var(--stroke-thin) solid var(--color-active);
    border-radius: var(--radius-md);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }
</style>
