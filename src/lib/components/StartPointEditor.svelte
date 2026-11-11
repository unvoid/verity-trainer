<!--
  Punto de partida: muestra una propuesta aleatoria que se puede personalizar.
  "Iniciar entreno" solo está activo con todo elegido y válido.
  Los avisos (ya resuelto, regla 3) se muestran como toast al aparecer o cambiar:
  no ocupan sitio y nada se desplaza. El motivo de un botón desactivado queda en
  su descripción accesible.
-->
<script lang="ts">
  import { calloutOptions, statueOptions } from '../domain/editor'
  import { SHAPES, SLOTS, SYMBOLS, type Scenario, type Shape3D as ShapeName, type Symbol2D as SymbolName } from '../domain/types'
  import { locale, t, tn } from '../i18n'
  import { setup, setupState } from '../stores/setup'
  import { toast } from '../stores/toast'
  import Button from './Button.svelte'
  import SectionTitle from './SectionTitle.svelte'
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

  const alreadySolved = $derived($setupState.validation?.issues.some((i) => i.code === 'already-solved') ?? false)

  /** Motivo por el que no se puede iniciar (descripción accesible del botón). */
  const blockedReason = $derived($t(alreadySolved ? 'setup.error.already-solved' : 'setup.incomplete'))

  // Avisos como toast, solo cuando aparecen o cambian (no en cada render).
  let lastNotice: string | null = null
  $effect(() => {
    const notice = alreadySolved ? $t('setup.error.already-solved') : warning
    if (notice && notice !== lastNotice) toast.show(notice, alreadySolved ? 'error' : 'info')
    lastNotice = notice
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
    <SectionTitle id="setup-title">{$t('setup.title')}</SectionTitle>
    <p class="muted">{$t('setup.intro')}</p>
  </header>

  <div class="group">
    <SectionTitle level={3}>{$t('setup.callouts')}</SectionTitle>
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
    <SectionTitle level={3}>{$t('setup.statues')}</SectionTitle>
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

  <p class="muted hint-text">{$t('setup.group-hint')}</p>

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
    <p id="setup-incomplete" class="visually-hidden">{blockedReason}</p>
  {/if}
</section>

<style>
  .editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  p {
    margin: 0;
  }

  .muted {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .slots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }


  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }

</style>
