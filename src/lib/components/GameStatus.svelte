<!--
  Estado de la partida (información permanente, en una zona fija que no se mueve):
  contador, símbolo en mano y, con pistas, intercambios mínimos pendientes.
  Los eventos (lo que acaba de pasar) se muestran como toast.
-->
<script lang="ts">
  import type { Symbol2D } from '../domain/types'
  import { t, tn } from '../i18n'
  import Button from './Button.svelte'

  interface Props {
    swaps: number
    held: Symbol2D | null
    /** Intercambios mínimos pendientes (pista), o `null` si las pistas están desactivadas. */
    remaining: number | null
    onnewgame: () => void
    onrestart: () => void
  }

  let { swaps, held, remaining, onnewgame, onrestart }: Props = $props()
</script>

<section class="status">
  <p class="counters">
    <!-- Etiqueta discreta y valor en negrita: lo que se consulta de reojo es el valor. -->
    <span><span class="label">{$t('status.swaps.label')}</span> <strong>{swaps}</strong></span>
    <!-- Solo cuando llevas un símbolo (tocando o arrastrando); vacía, reserva su hueco: nada se desplaza. -->
    <span class:empty={held === null}>
      {#if held}<span class="label">{$t('status.holding.label')}</span> <strong>{$t(`symbol.${held}`)}</strong>{:else}&nbsp;{/if}
    </span>
  </p>

  <!-- Con pistas, la línea reserva su hueco aunque no haya nada que mostrar: nada se desplaza. -->
  {#if remaining !== null}
    <p class="hint" class:empty={remaining === 0}>
      {remaining > 0 ? $tn('hint.remaining', remaining) : ' '}
    </p>
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
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
  }

  .hint {
    min-height: calc(var(--line-height) * 1em);
    font-size: var(--font-size-sm);
  }

  .empty {
    visibility: hidden;
  }

  .label {
    color: var(--color-text-muted);
  }

  strong {
    font-weight: var(--font-weight-bold);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }
</style>
