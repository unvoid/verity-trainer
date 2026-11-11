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
  import SectionTitle from './SectionTitle.svelte'
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

  let { held, drops = null, disabled = false, size = 56, ontoggle, ondrop, ondefeatknight }: Props = $props()

  function statusOf(slot: Slot) {
    return drops ? drops.slots[slot].status : 'dropped'
  }
</script>

<section class="toolbox" aria-labelledby="toolbox-title">
  <SectionTitle id="toolbox-title">{$t('toolbox.title')}</SectionTitle>
  <p class="hint">{$t(drops ? 'toolbox.hint.rounds' : 'toolbox.hint')}</p>
  <div class="drops">
    {#each SLOTS as slot (slot)}
      {@const symbol = KNIGHT_DROPS[slot]}
      {@const status = statusOf(slot)}
      {@const symbolName = $t(`symbol.${symbol}`)}
      {#if status === 'dropped'}
        <button
          type="button"
          class="drop tile"
          aria-pressed={held === symbol}
          aria-label={$t('knight.drop', { symbol: symbolName, knight: $t(`knight.${slot}`) })}
          {disabled}
          onclick={() => ontoggle(symbol)}
          use:dragSymbol={{ symbol, disabled, ondrop }}
        >
          <Symbol2D {symbol} {size} />
          <span class="tile-label">{$t(`position.${slot}`)}</span>
          {#if drops}
            <LifeBar drop={drops.slots[slot]} />
          {/if}
        </button>
      {:else if status === 'knight'}
        <button
          type="button"
          class="drop tile knight"
          {disabled}
          aria-label={$t('knight.defeat.label', { knight: $t(`knight.${slot}`), symbol: $t(`symbol.ref.${symbol}`) })}
          onclick={() => ondefeatknight?.(slot)}
        >
          <span class="faded"><Symbol2D {symbol} {size} /></span>
          <span class="tile-label action">{$t('knight.defeat')}</span>
          <span class="life-slot" aria-hidden="true"></span>
        </button>
      {:else}
        <div class="drop tile spent" aria-label="{symbolName}: {$t(`drop.${status}`)}" role="img">
          <span class="faded"><Symbol2D {symbol} {size} /></span>
          <span class="tile-label">{$t(`drop.${status}`)}</span>
          <span class="life-slot" aria-hidden="true"></span>
        </div>
      {/if}
    {/each}
  </div>
</section>

<style>
  .hint {
    margin: calc(-1 * var(--space-2)) 0 var(--space-3);
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .drops {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .drop {
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition:
      outline-color var(--duration-fast) var(--easing-standard),
      background-color var(--duration-fast) var(--easing-standard);
  }

  /* Al pasar por encima, el plano se oscurece un poco; nada se mueve. */
  .drop:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  .drop:disabled {
    cursor: default;
    opacity: var(--control-disabled-opacity);
  }

  /* Símbolo que llevas: contorno cobre (lo activo). */
  .drop[aria-pressed='true'] {
    outline: var(--stroke-focus) solid var(--color-active);
  }

  /* Caballero por derrotar: símbolo atenuado y acción; se toca (no se arrastra). */
  .knight {
    cursor: pointer;
    touch-action: auto;
  }

  .knight:hover:not(:disabled) .action {
    text-decoration: underline;
  }

  .action {
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  /* Símbolo usado o caducado: hueco vacío. */
  /* Usado o caducado: hueco vacío, sin plano. */
  .spent {
    color: var(--color-text-muted);
    background: transparent;
    cursor: default;
  }

  /* Hueco de la barra de caducidad en las tiles sin símbolo: la fila no cambia de altura. */
  .life-slot {
    display: block;
    height: var(--stroke-focus);
  }

  .faded {
    opacity: var(--opacity-faded);
    filter: grayscale(1);
  }
</style>
