<!--
  Interruptor on/off: checkbox nativo con `role="switch"` y aspecto propio.
  La etiqueta y la descripción quedan asociadas para lectores de pantalla.
-->
<script lang="ts">
  interface Props {
    id: string
    label: string
    description?: string
    /** Nota adicional (p. ej. por qué está desactivado). */
    note?: string
    checked: boolean
    disabled?: boolean
    onchange: (checked: boolean) => void
  }

  let { id, label, description, note, checked, disabled = false, onchange }: Props = $props()

  const describedBy = $derived(
    [description ? `${id}-description` : null, note ? `${id}-note` : null].filter(Boolean).join(' ') || undefined,
  )
</script>

<div class="switch" class:disabled>
  <input
    {id}
    type="checkbox"
    role="switch"
    {checked}
    {disabled}
    aria-describedby={describedBy}
    onchange={(event) => onchange(event.currentTarget.checked)}
  />
  <div class="text">
    <label for={id}>{label}</label>
    {#if description}
      <p id="{id}-description" class="description">{description}</p>
    {/if}
    {#if note}
      <p id="{id}-note" class="note">{note}</p>
    {/if}
  </div>
</div>

<style>
  .switch {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  label {
    font-weight: var(--font-weight-bold);
    cursor: pointer;
  }

  .disabled label {
    cursor: not-allowed;
  }

  p {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .note {
    font-style: italic;
  }

  /* Pista y mando dibujados sobre el propio checkbox. */
  input {
    --track-width: 2.5rem;
    --track-height: 1.375rem;
    --knob-size: calc(var(--track-height) - 6px);

    appearance: none;
    position: relative;
    flex: none;
    width: var(--track-width);
    height: var(--track-height);
    margin: 0;
    margin-top: 1px;
    background: var(--color-track);
    border: 0;
    border-radius: var(--track-height);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--easing-standard);
  }

  input::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: var(--knob-size);
    height: var(--knob-size);
    background: var(--color-knob);
    border-radius: 50%;
    transition:
      transform var(--duration-fast) var(--easing-standard),
      background-color var(--duration-fast) var(--easing-standard);
  }

  input:checked {
    background: var(--control-primary-bg);
  }

  input:checked::before {
    background: var(--control-primary-text);
    transform: translateX(calc(var(--track-width) - var(--knob-size) - 6px));
  }

  input:disabled {
    cursor: not-allowed;
    opacity: var(--control-disabled-opacity);
  }
</style>
