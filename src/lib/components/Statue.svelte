<!--
  Estatua exterior: tile con la forma 3D granate y su posición debajo,
  como en las demás zonas (el nombre completo va en la etiqueta accesible).
  Al activarla se deposita el símbolo que lleva el jugador.
  Es destino de arrastre (`data-drop-slot`).
  Con pistas: muestra sus dos símbolos, marcando los que chocan con su callout,
  y se resalta si admite el símbolo que lleva el jugador.
-->
<script lang="ts">
  import { decompose } from '../domain/shapes'
  import type { Shape3D as Shape, Slot, Symbol2D as SymbolName } from '../domain/types'
  import { t } from '../i18n'
  import Shape3D from './Shape3D.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    slot: Slot
    shape: Shape
    /** Símbolo del callout de su posición (para las pistas). */
    callout: SymbolName
    /** Símbolo con el que está marcada por el primer depósito, o `null`. */
    marked?: SymbolName | null
    disabled?: boolean
    /** Hay un símbolo arrastrado sobre ella. */
    dropHover?: boolean
    /** Mostrar pistas. */
    hints?: boolean
    /** Admite el símbolo que lleva el jugador (solo se resalta con pistas). */
    accepts?: boolean
    /** Tamaño de la forma en px. */
    size?: number
    onactivate: (slot: Slot) => void
  }

  let {
    slot,
    shape,
    callout,
    marked = null,
    disabled = false,
    dropHover = false,
    hints = false,
    accepts = false,
    size = 80,
    onactivate,
  }: Props = $props()

  const name = $derived($t(`statue.name.${slot}`))
  const shapeName = $derived($t(`shape.${shape}`))
  const symbols = $derived(decompose(shape))
  const label = $derived(
    [
      $t('statue.label', { statue: name, shape: shapeName }),
      marked ? $t('statue.marked', { symbol: $t(`symbol.ref.${marked}`) }) : null,
      hints && accepts ? $t('statue.accepts') : null,
    ]
      .filter(Boolean)
      .join(', '),
  )
</script>

<button
  type="button"
  class="statue tile"
  class:marked={marked !== null}
  class:drop-hover={dropHover}
  class:accepts={hints && accepts}
  data-drop-slot={disabled ? undefined : slot}
  aria-label={label}
  {disabled}
  onclick={() => onactivate(slot)}
>
  <span class="figure">
    <Shape3D {shape} {size} />
    {#if marked}
      <span class="mark">
        <Symbol2D symbol={marked} size={size / 3} />
      </span>
    {/if}
  </span>
  {#if hints}
    <span class="hint" title={$t('hint.symbols')}>
      {#each symbols as symbol, index (index)}
        <span class="hint-symbol" class:clash={symbol === callout}>
          <Symbol2D {symbol} size={22} label={$t(symbol === callout ? 'hint.clash' : 'hint.ok', { symbol: $t(`symbol.${symbol}`) })} />
        </span>
      {/each}
    </span>
  {/if}
  <span class="tile-label" aria-hidden="true">{$t(`position.${slot}`)}</span>
</button>

<style>
  .statue {
    width: 100%;
    cursor: pointer;
    transition:
      outline-color var(--duration-fast) var(--easing-standard),
      background-color var(--duration-fast) var(--easing-standard);
  }

  /* Al pasar por encima, el plano se oscurece un poco; nada se mueve. */
  .statue:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  .statue:disabled {
    cursor: default;
  }

  /* Estados con contornos cobre (lo activo): marcada, admite tu símbolo, destino de arrastre. */
  .statue.marked {
    outline: var(--stroke-focus) solid var(--color-active);
  }

  .statue.accepts:not(.marked) {
    outline: var(--stroke-thin) solid var(--color-active);
  }

  .statue.drop-hover {
    outline: var(--stroke-focus) dashed var(--color-active);
  }

  .figure {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  /* Símbolo marcado: proporcional a la estatua, en la esquina, para no tapar la forma. */
  .mark {
    position: absolute;
    top: 0;
    right: 0;
    width: 26%;
    transform: translate(25%, -25%);
  }

  .hint {
    display: flex;
    gap: var(--space-2);
  }

  .hint-symbol {
    padding: 2px;
    border: var(--stroke-thin) solid transparent;
    border-radius: 50%;
  }

  /* Símbolo que choca con el callout: aro granate, el color de la estatua. */
  .hint-symbol.clash {
    border-color: var(--color-statue);
    box-shadow: inset 0 0 0 var(--stroke-thin) var(--color-statue);
  }
</style>
