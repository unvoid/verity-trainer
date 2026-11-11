<!-- Símbolos de la sala interior, uno por posición. -->
<script lang="ts">
  import { SLOTS, type Callouts } from '../domain/types'
  import { t } from '../i18n'
  import SectionTitle from './SectionTitle.svelte'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    callouts: Callouts
    /** Tamaño de cada símbolo en px. */
    size?: number
  }

  let { callouts, size = 56 }: Props = $props()
</script>

<section class="callouts" aria-labelledby="callouts-title">
  <SectionTitle id="callouts-title">{$t('callouts.title')}</SectionTitle>
  <ul>
    {#each SLOTS as slot (slot)}
      <li class="tile" aria-label={$t('callouts.item', { position: $t(`position.${slot}`), symbol: $t(`symbol.${callouts[slot]}`) })}>
        <Symbol2D symbol={callouts[slot]} {size} />
        <span class="tile-label" aria-hidden="true">{$t(`position.${slot}`)}</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }


</style>
