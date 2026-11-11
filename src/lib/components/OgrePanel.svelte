<!--
  Símbolos por rondas: ogros que aparecen al agotarse los símbolos y cuenta
  atrás hasta que vuelven los caballeros. Sin imágenes: texto y contornos.
-->
<script lang="ts">
  import { OGRE_SIDES, type DropsState, type OgreSide } from '../domain/drops'
  import { t } from '../i18n'
  import { clock } from '../stores/clock'
  import Button from './Button.svelte'

  interface Props {
    drops: DropsState
    disabled?: boolean
    ondefeat: (side: OgreSide) => void
  }

  let { drops, disabled = false, ondefeat }: Props = $props()

  const respawnSeconds = $derived(
    drops.respawnAt === null ? null : Math.max(0, Math.ceil((drops.respawnAt - $clock) / 1000)),
  )
</script>

{#if drops.ogres}
  <section class="ogres" aria-labelledby="ogres-title">
    <h3 id="ogres-title">{$t('ogres.title')}</h3>
    <p class="hint">{$t('ogres.hint')}</p>
    <div class="row">
      {#each OGRE_SIDES as side (side)}
        {@const alive = drops.ogres[side]}
        <Button disabled={disabled || !alive} onclick={() => ondefeat(side)}>
          {$t(`ogre.${side}`)} · {alive ? $t('knight.defeat') : $t('ogre.defeated')}
        </Button>
      {/each}
    </div>
  </section>
{:else if respawnSeconds !== null}
  <p class="respawn" role="status">{$t('rounds.respawn', { seconds: respawnSeconds })}</p>
{/if}

<style>
  .ogres {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border: var(--stroke-thin) dashed var(--color-border);
    border-radius: var(--radius-md);
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
  }

  .hint,
  .respawn {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }
</style>
