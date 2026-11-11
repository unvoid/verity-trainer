<!--
  Estatua exterior: botón con la forma 3D sobre una base carmesí.
  Al activarla se deposita el símbolo que lleva el jugador.
-->
<script lang="ts">
  import type { Shape3D as Shape, Slot, Symbol2D as SymbolName } from '../domain/types'
  import { t } from '../i18n'
  import Shape3D from './Shape3D.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    slot: Slot
    shape: Shape
    /** Símbolo con el que está marcada por el primer depósito, o `null`. */
    marked?: SymbolName | null
    disabled?: boolean
    /** Tamaño de la forma en px. */
    size?: number
    onactivate: (slot: Slot) => void
  }

  let { slot, shape, marked = null, disabled = false, size = 96, onactivate }: Props = $props()

  const name = $derived($t(`statue.name.${slot}`))
  const shapeName = $derived($t(`shape.${shape}`))
  const markedText = $derived(marked ? $t('statue.marked', { symbol: $t(`symbol.${marked}`) }) : null)
  const label = $derived(
    [$t('statue.label', { statue: name, shape: shapeName }), markedText].filter(Boolean).join('. '),
  )
</script>

<button
  type="button"
  class="statue"
  class:marked={marked !== null}
  aria-label={label}
  {disabled}
  onclick={() => onactivate(slot)}
>
  <span class="name">{name}</span>
  <span class="figure">
    <Shape3D {shape} {size} />
    {#if marked}
      <span class="mark">
        <Symbol2D symbol={marked} size={size / 3} />
      </span>
    {/if}
  </span>
  <span class="base">{shapeName}</span>
</button>

<style>
  .statue {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-3) var(--space-3) 0;
    font: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: var(--stroke-thin) solid var(--color-statue);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition:
      box-shadow var(--duration-fast) var(--easing-standard),
      transform var(--duration-fast) var(--easing-standard);
  }

  .statue:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .statue:disabled {
    cursor: default;
  }

  .statue.marked {
    box-shadow: 0 0 0 var(--stroke-focus) var(--color-active);
  }

  .name {
    font-size: var(--font-size-sm);
    text-align: center;
    color: var(--color-text-muted);
  }

  .figure {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .mark {
    position: absolute;
    top: 0;
    right: 0;
  }

  .base {
    align-self: stretch;
    margin-inline: calc(-1 * var(--space-3));
    padding: var(--space-2);
    font-weight: var(--font-weight-bold);
    color: var(--color-on-statue);
    background: var(--color-statue);
  }
</style>
