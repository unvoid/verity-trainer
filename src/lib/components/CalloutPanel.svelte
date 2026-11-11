<!-- Símbolos de la sala interior, uno por posición. -->
<script lang="ts">
  import { SLOTS, type Callouts } from '../domain/types'
  import { t } from '../i18n'
  import Symbol2D from './Symbol2D.svelte'

  interface Props {
    callouts: Callouts
    /** Tamaño de cada símbolo en px. */
    size?: number
  }

  let { callouts, size = 56 }: Props = $props()
</script>

<section class="callouts" aria-labelledby="callouts-title">
  <h2 id="callouts-title">{$t('callouts.title')}</h2>
  <ul>
    {#each SLOTS as slot (slot)}
      <li aria-label={$t('callouts.item', { position: $t(`position.${slot}`), symbol: $t(`symbol.${callouts[slot]}`) })}>
        <Symbol2D symbol={callouts[slot]} {size} />
        <span class="position" aria-hidden="true">{$t(`position.${slot}`)}</span>
      </li>
    {/each}
  </ul>
</section>

<style>
  h2 {
    margin: 0 0 var(--space-3);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    text-align: center;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
    margin: 0;
    padding: var(--space-4);
    list-style: none;
    border-block: var(--stroke-thin) solid var(--color-border);
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .position {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
</style>
