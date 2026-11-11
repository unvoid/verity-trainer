<!--
  Símbolos de la sala interior, uno por posición. La tile de quien ya puede
  salir (su estatua cumple la condición del modo) brilla con un halo cálido.
-->
<script lang="ts">
  import { canExit } from '../domain/rules'
  import { SLOTS, type Callouts, type Mode, type Statues } from '../domain/types'
  import { t } from '../i18n'
  import SectionTitle from './SectionTitle.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    callouts: Callouts
    /** Estatuas actuales y modo: para saber quién ya puede salir. Sin ellas, no se marca nada. */
    statues?: Statues
    mode?: Mode
    /** Tamaño de cada símbolo en px. */
    size?: number
  }

  let { callouts, statues, mode = 'normal', size = 56 }: Props = $props()

  function ready(slot: (typeof SLOTS)[number]): boolean {
    return statues !== undefined && canExit(callouts, statues, slot, mode)
  }
</script>

<section class="callouts" aria-labelledby="callouts-title">
  <SectionTitle id="callouts-title">{$t('callouts.title')}</SectionTitle>
  <ul>
    {#each SLOTS as slot (slot)}
      {@const item = $t('callouts.item', { position: $t(`position.${slot}`), symbol: $t(`symbol.${callouts[slot]}`) })}
      <li class="tile" class:ready={ready(slot)} aria-label={ready(slot) ? `${item}, ${$t('callouts.ready')}` : item}>
        <Symbol2D symbol={callouts[slot]} {size} />
        <span class="tile-label" aria-hidden="true">{$t(`position.${slot}`)}</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  .tile {
    transition: box-shadow var(--duration-reveal) var(--easing-standard);
  }

  .tile.ready {
    box-shadow: var(--glow-ready);
  }

  ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }


</style>
