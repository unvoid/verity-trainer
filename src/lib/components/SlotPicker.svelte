<!--
  Selector de un valor para una posición: grupo de radios nativos con icono.
  Las opciones no permitidas se muestran desactivadas.
-->
<script lang="ts" generics="T extends string">
  import type { Snippet } from 'svelte'

  interface Option {
    readonly value: T
    readonly label: string
    readonly disabled: boolean
  }

  interface Props {
    /** Título del grupo (p. ej. "Estatua izquierda"). */
    legend: string
    /** `name` de los radios; único por selector. */
    name: string
    options: readonly Option[]
    value: T | null
    /** Texto cuando no hay valor elegido. */
    emptyLabel: string
    /** Icono de una opción. */
    icon: Snippet<[T, number]>
    /** Tamaño del icono del valor elegido y de las opciones, en px. */
    size?: number
    optionSize?: number
    onselect: (value: T) => void
  }

  let { legend, name, options, value, emptyLabel, icon, size = 64, optionSize = 28, onselect }: Props = $props()

  const selectedLabel = $derived(options.find((option) => option.value === value)?.label ?? emptyLabel)
</script>

<fieldset class="slot-picker tile">
  <legend>{legend}</legend>

  <div class="current" class:empty={value === null}>
    <!-- Hueco de tamaño fijo: elegido o vacío ocupan lo mismo (nada se desplaza). -->
    <span class="current-icon" style:width="{size}px" style:height="{size}px">
      {#if value !== null}
        {@render icon(value, size)}
      {:else}
        <span class="placeholder" aria-hidden="true">?</span>
      {/if}
    </span>
    <span class="current-label">{selectedLabel}</span>
  </div>

  <div class="options">
    {#each options as option (option.value)}
      <label class="option" class:checked={option.value === value} class:disabled={option.disabled} title={option.label}>
        <input
          type="radio"
          {name}
          value={option.value}
          checked={option.value === value}
          disabled={option.disabled}
          onchange={() => onselect(option.value)}
        />
        {@render icon(option.value, optionSize)}
        <span class="visually-hidden">{option.label}</span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  /* Piedra y arco de la tile común (base.css); aquí solo el relleno propio. */
  .slot-picker {
    margin: 0;
    padding: calc(var(--space-3) + var(--tile-arch) / 2) var(--space-2) var(--space-3);
  }

  /* Flotante y a todo el ancho: se comporta como un título normal dentro del grupo. */
  legend {
    float: left;
    width: 100%;
    padding: 0;
    font-size: var(--font-size-sm);
    text-align: center;
    color: var(--color-text-muted);
  }

  legend + * {
    clear: both;
  }

  .current {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }

  /* Altura fija: con o sin elección, la línea mide lo mismo (nada se desplaza). */
  .current-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    display: block;
    height: calc(var(--line-height) * 1em);
    line-height: var(--line-height);
  }

  .current.empty .current-label {
    font-weight: var(--font-weight-regular);
    color: var(--color-text-muted);
  }

  .current-icon {
    display: grid;
    place-items: center;
    flex: none;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    background: var(--color-bg);
    border-radius: var(--radius-md);
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-1);
  }

  .option {
    position: relative;
    display: grid;
    place-items: center;
    padding: var(--space-1);
    border: var(--stroke-thin) solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .option.checked {
    border-color: var(--color-active);
  }

  .option.disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .option:has(input:focus-visible) {
    outline: var(--stroke-focus) solid var(--color-focus);
    outline-offset: 1px;
  }

  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
