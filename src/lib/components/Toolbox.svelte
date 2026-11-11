<!--
  Símbolos: el que suelta cada caballero.
  - Tocar un símbolo lo coge (resaltado en cobre); tocarlo otra vez lo suelta.
    También se puede arrastrar hasta una estatua.
  - Con símbolos por rondas (`drops`), cada posición muestra su estado: caballero
    por derrotar, símbolo disponible (con barra de caducidad), usado o caducado.
    Sin imágenes de enemigos: el símbolo atenuado y texto.
-->
<script lang="ts">
  import { dragSymbol } from '../actions/dragSymbol'
  import type { DropsState } from '../domain/drops'
  import { KNIGHT_DROPS } from '../domain/rules'
  import { SLOTS, type Slot, type Symbol2D as SymbolName } from '../domain/types'
  import { t } from '../i18n'
  import LifeBar from './LifeBar.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    /** Símbolo que lleva el jugador, o `null`. */
    held: SymbolName | null
    /** Estado de las rondas, o `null` si los símbolos están siempre disponibles. */
    drops?: DropsState | null
    /** Desactiva toda la caja (p. ej. partida terminada). */
    disabled?: boolean
    /** Tamaño de cada símbolo en px. */
    size?: number
    ontoggle: (symbol: SymbolName) => void
    /** Símbolo soltado sobre una estatua al arrastrar. */
    ondrop: (slot: Slot, symbol: SymbolName) => void
    /** Rondas: derrotar al caballero de una posición. */
    ondefeatknight?: (slot: Slot) => void
  }

  let { held, drops = null, disabled = false, size = 48, ontoggle, ondrop, ondefeatknight }: Props = $props()

  function statusOf(slot: Slot) {
    return drops ? drops.slots[slot].status : 'dropped'
  }
</script>

<section class="toolbox" aria-labelledby="toolbox-title">
  <h2 id="toolbox-title">{$t('toolbox.title')}</h2>
  <p class="hint">{$t(drops ? 'toolbox.hint.rounds' : 'toolbox.hint')}</p>
  <div class="drops">
    {#each SLOTS as slot (slot)}
      {@const symbol = KNIGHT_DROPS[slot]}
      {@const status = statusOf(slot)}
      {@const symbolName = $t(`symbol.${symbol}`)}
      {#if status === 'dropped'}
        <button
          type="button"
          class="drop"
          aria-pressed={held === symbol}
          {disabled}
          onclick={() => ontoggle(symbol)}
          use:dragSymbol={{ symbol, disabled, ondrop }}
        >
          <Symbol2D {symbol} {size} />
          <span>{$t('knight.drop', { symbol: symbolName, knight: $t(`knight.${slot}`) })}</span>
          {#if drops}
            <LifeBar drop={drops.slots[slot]} />
          {/if}
        </button>
      {:else if status === 'knight'}
        <button
          type="button"
          class="drop knight"
          {disabled}
          aria-label={$t('knight.defeat.label', { knight: $t(`knight.${slot}`), symbol: $t(`symbol.ref.${symbol}`) })}
          onclick={() => ondefeatknight?.(slot)}
        >
          <span class="faded"><Symbol2D {symbol} {size} /></span>
          <span>{$t(`knight.${slot}`)}</span>
          <span class="action">{$t('knight.defeat')}</span>
        </button>
      {:else}
        <div class="drop spent" aria-label="{symbolName}: {$t(`drop.${status}`)}" role="img">
          <span class="faded"><Symbol2D {symbol} {size} /></span>
          <span>{$t(`drop.${status}`)}</span>
        </div>
      {/if}
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
    opacity: var(--control-disabled-opacity);
  }

  .drop[aria-pressed='true'] {
    border-color: var(--color-active);
    box-shadow: 0 0 0 var(--stroke-thin) var(--color-active);
  }

  /* Caballero por derrotar: contorno discontinuo, se toca (no se arrastra). */
  .knight {
    border-style: dashed;
    cursor: pointer;
    touch-action: auto;
  }

  .knight:hover:not(:disabled) {
    border-color: var(--control-border-hover);
  }

  .action {
    font-weight: var(--font-weight-bold);
  }

  /* Símbolo usado o caducado: hueco vacío. */
  .spent {
    color: var(--color-text-muted);
    background: transparent;
    border-style: dashed;
    cursor: default;
  }

  .faded {
    opacity: var(--opacity-faded);
    filter: grayscale(1);
  }
</style>
