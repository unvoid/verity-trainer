<!--
  Símbolos disponibles: el que suelta cada caballero.
  Tocar uno lo coge (resaltado en cobre); tocarlo otra vez lo suelta.
  También se pueden arrastrar hasta una estatua.
  `available` permite desactivar caballeros sueltos (p. ej. símbolos gastados
  en un futuro modo por rondas); por defecto están todos disponibles.
-->
<script lang="ts">
  import { dragSymbol } from '../actions/dragSymbol'
  import { KNIGHT_DROPS } from '../domain/rules'
  import { SLOTS, type Slot, type Symbol2D as SymbolName } from '../domain/types'
  import { t } from '../i18n'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    /** Símbolo que lleva el jugador, o `null`. */
    held: SymbolName | null
    /** Qué caballeros tienen su símbolo disponible. */
    available?: Readonly<Record<Slot, boolean>>
    /** Desactiva toda la caja (p. ej. partida terminada). */
    disabled?: boolean
    /** Tamaño de cada símbolo en px. */
    size?: number
    ontoggle: (symbol: SymbolName) => void
    /** Símbolo soltado sobre una estatua al arrastrar. */
    ondrop: (slot: Slot, symbol: SymbolName) => void
  }

  const ALL_AVAILABLE: Readonly<Record<Slot, boolean>> = { left: true, mid: true, right: true }

  let { held, available = ALL_AVAILABLE, disabled = false, size = 48, ontoggle, ondrop }: Props = $props()
</script>

<section class="toolbox" aria-labelledby="toolbox-title">
  <h2 id="toolbox-title">{$t('toolbox.title')}</h2>
  <p class="hint">{$t('toolbox.hint')}</p>
  <div class="drops">
    {#each SLOTS as slot (slot)}
      {@const symbol = KNIGHT_DROPS[slot]}
      <button
        type="button"
        class="drop"
        aria-pressed={held === symbol}
        disabled={disabled || !available[slot]}
        onclick={() => ontoggle(symbol)}
        use:dragSymbol={{ symbol, disabled: disabled || !available[slot], ondrop }}
      >
        <Symbol2D {symbol} {size} />
        <span>{$t('knight.drop', { symbol: $t(`symbol.${symbol}`), knight: $t(`knight.${slot}`) })}</span>
      </button>
    {/each}
  </div>
</section>

<style>
  h2 {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
  }

  .hint {
    margin: var(--space-1) 0 var(--space-3);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .drops {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    font: inherit;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    background: var(--color-surface);
    border: var(--stroke-thin) solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition: border-color var(--duration-fast) var(--easing-standard);
  }

  .drop:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .drop[aria-pressed='true'] {
    border-color: var(--color-active);
    box-shadow: 0 0 0 var(--stroke-thin) var(--color-active);
  }
</style>
