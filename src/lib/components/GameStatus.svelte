<!--
  Estado de la partida: contador, símbolo en mano, modo, pista de intercambios
  pendientes y último resultado (anunciado a lectores de pantalla).
-->
<script lang="ts">
  import type { Mode, Symbol2D } from '../domain/types'
  import { locale, t, tn } from '../i18n'
  import type { Feedback } from '../stores/game'
  import Button from './Button.svelte'

  interface Props {
    swaps: number
    held: Symbol2D | null
    mode: Mode
    feedback: Feedback | null
    /** Intercambios mínimos pendientes (pista), o `null` si no se muestran. */
    remaining: number | null
    onnewgame: () => void
    onrestart: () => void
  }

  let { swaps, held, mode, feedback, remaining, onnewgame, onrestart }: Props = $props()

  const feedbackText = $derived.by(() => {
    if (!feedback) return ''
    switch (feedback.kind) {
      case 'no-symbol-held':
        return $t('feedback.no-symbol-held')
      case 'rejected':
        return $t(`feedback.${feedback.error}`, {
          statue: $t(`statue.ref.${feedback.deposit.slot}`),
          symbol: $t(`symbol.ref.${feedback.deposit.symbol}`),
        })
      case 'marked':
        return $t('feedback.marked', {
          statue: $t(`statue.ref.${feedback.deposit.slot}`),
          symbol: $t(`symbol.ref.${feedback.deposit.symbol}`),
        })
      case 'swapped':
        return $t('feedback.swapped', {
          firstSymbol: $t(`symbol.ref.${feedback.swap.first.symbol}`),
          firstStatue: $t(`statue.ref.${feedback.swap.first.slot}`),
          secondSymbol: $t(`symbol.ref.${feedback.swap.second.symbol}`),
          secondStatue: $t(`statue.ref.${feedback.swap.second.slot}`),
        })
      case 'symbol-unavailable':
      case 'knight-defeated':
        return $t(`feedback.${feedback.kind}`, { symbol: $t(`symbol.ref.${feedback.symbol}`) })
      case 'expired': {
        const names = feedback.symbols.map((symbol) => $t(`symbol.ref.${symbol}`))
        const symbols = new Intl.ListFormat($locale, { type: 'conjunction' }).format(names)
        return $tn('feedback.expired', names.length, { symbols })
      }
      case 'ogres-appeared':
      case 'knights-returned':
        return $t(`feedback.${feedback.kind}`)
    }
  })
</script>

<section class="status">
  <p class="counters">
    <span>{$t('status.swaps', { count: swaps })}</span>
    {#if mode === 'challenge'}
      <span class="badge">{$t('status.mode.challenge')}</span>
    {/if}
    <span>{held ? $t('status.holding', { symbol: $t(`symbol.${held}`) }) : $t('status.empty-hands')}</span>
  </p>

  {#if remaining !== null && remaining > 0}
    <p class="hint">{$tn('hint.remaining', remaining)}</p>
  {/if}

  <p class="feedback" role="status">{feedbackText}</p>

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
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
  }

  .badge {
    padding: 0 var(--space-2);
    font-weight: var(--font-weight-bold);
    border: var(--stroke-thin) solid var(--color-border);
    border-radius: var(--radius-sm);
  }

  .hint {
    font-size: var(--font-size-sm);
  }

  .feedback {
    min-height: calc(var(--line-height) * 1em);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }
</style>
