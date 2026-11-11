<!--
  Punto de partida: muestra una propuesta aleatoria que se puede personalizar.
  "Iniciar entreno" solo está activo con todo elegido y válido.
-->
<script lang="ts">
  import { calloutOptions, statueOptions } from '../domain/editor'
  import { SHAPES, SLOTS, SYMBOLS, type Scenario, type Shape3D as ShapeName, type Symbol2D as SymbolName } from '../domain/types'
  import { locale, t, tn } from '../i18n'
  import { setup, setupState } from '../stores/setup'
  import Button from './Button.svelte'
  import Shape3D from './Shape3D.svelte'
  import SlotPicker from './SlotPicker.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    onstart: (scenario: Scenario) => void
  }

  let { onstart }: Props = $props()

  const warning = $derived.by(() => {
    const issue = $setupState.validation?.issues.find((i) => i.code === 'statue-starts-solved')
    if (!issue) return null
    const names = issue.slots.map((slot) => $t(`statue.ref.${slot}`))
    const statues = new Intl.ListFormat($locale, { type: 'conjunction' }).format(names)
    return $tn('setup.warning.starts-solved', names.length, { statues })
  })

  function start() {
    if ($setupState.ready && $setupState.scenario) onstart($setupState.scenario)
  }
</script>

{#snippet symbolIcon(symbol: SymbolName, size: number)}
  <Symbol2D {symbol} {size} />
{/snippet}

{#snippet shapeIcon(shape: ShapeName, size: number)}
  <Shape3D {shape} {size} />
{/snippet}

<section class="editor" aria-labelledby="setup-title">
  <header>
    <h2 id="setup-title">{$t('setup.title')}</h2>
    <p class="muted">{$t('setup.intro')}</p>
  </header>

  <div class="group">
    <h3>{$t('setup.callouts')}</h3>
    <div class="slots">
      {#each SLOTS as slot (slot)}
        {@const allowed = calloutOptions($setup.callouts, slot)}
        <SlotPicker
          legend={$t(`position.${slot}`)}
          name="callout-{slot}"
          value={$setup.callouts[slot]}
          emptyLabel={$t('setup.empty')}
          options={SYMBOLS.map((symbol) => ({
            value: symbol,
            label: $t(`symbol.${symbol}`),
            disabled: !allowed.includes(symbol),
          }))}
          icon={symbolIcon}
          size={48}
          onselect={(symbol) => setup.selectCallout(slot, symbol)}
        />
      {/each}
    </div>
  </div>

  <div class="group">
    <h3>{$t('setup.statues')}</h3>
    <div class="slots">
      {#each SLOTS as slot (slot)}
        {@const allowed = statueOptions($setup.statues, slot)}
        <SlotPicker
          legend={$t(`statue.name.${slot}`)}
          name="statue-{slot}"
          value={$setup.statues[slot]}
          emptyLabel={$t('setup.empty')}
          options={SHAPES.map((shape) => ({
            value: shape,
            label: $t(`shape.${shape}`),
            disabled: !allowed.includes(shape),
          }))}
          icon={shapeIcon}
          onselect={(shape) => setup.selectStatue(slot, shape)}
        />
      {/each}
    </div>
  </div>

  <p class="muted">{$t('setup.group-hint')}</p>

  {#if warning}
    <p class="warning" role="status">{warning}</p>
  {/if}

  <div class="actions">
    <Button onclick={setup.propose}>{$t('action.propose')}</Button>
    <Button
      variant="primary"
      disabled={!$setupState.ready}
      aria-describedby={$setupState.ready ? undefined : 'setup-incomplete'}
      onclick={start}
    >
      {$t('action.start')}
    </Button>
  </div>
  {#if !$setupState.ready}
    <p id="setup-incomplete" class="muted end">{$t('setup.incomplete')}</p>
  {/if}
</section>

<style>
  .editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  h2,
  h3 {
    margin: 0;
    font-weight: var(--font-weight-bold);
  }

  h2 {
    font-size: var(--font-size-lg);
  }

  h3 {
    margin-bottom: var(--space-3);
    font-size: var(--font-size-md);
  }

  p {
    margin: 0;
  }

  .muted {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .end {
    text-align: end;
  }

  .slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-2);
  }

  .warning {
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-sm);
    background: var(--color-surface);
    border: var(--stroke-thin) solid var(--color-border);
    border-left: calc(var(--stroke-focus) * 2) solid var(--color-text-muted);
    border-radius: var(--radius-sm);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }

</style>
