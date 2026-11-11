<!--
  Símbolos por rondas: ogros que aparecen al agotarse los símbolos y cuenta
  atrás hasta que vuelven los caballeros. Sin imágenes: texto y contornos.
-->
<script lang="ts">
  import { OGRE_SIDES, type DropsState, type OgreSide } from '../domain/drops'
  import { t } from '../i18n'
  import { clock } from '../stores/clock'
  import Button from './Button.svelte'
  import SectionTitle from './SectionTitle.svelte'

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

<!--
  Hueco fijo: el panel existe siempre en el modo por rondas (invisible cuando no
  hay ogros ni cuenta atrás), así su aparición no desplaza la interfaz.
-->
<section
  class="ogres"
  class:idle={!drops.ogres && respawnSeconds === null}
  aria-labelledby="ogres-title"
  aria-hidden={!drops.ogres && respawnSeconds === null ? 'true' : undefined}
>
  <SectionTitle id="ogres-title" level={3}>{$t('ogres.title')}</SectionTitle>
  {#if respawnSeconds !== null}
    <p class="hint" role="status">{$t('rounds.respawn', { seconds: respawnSeconds })}</p>
  {:else}
    <p class="hint">{$t('ogres.hint')}</p>
  {/if}
  <div class="row" class:idle={!drops.ogres}>
    {#each OGRE_SIDES as side (side)}
      {@const alive = drops.ogres?.[side] ?? false}
      <Button disabled={disabled || !alive} onclick={() => ondefeat(side)}>
        {$t(`ogre.${side}`)} · {alive ? $t('knight.defeat') : $t('ogre.defeated')}
      </Button>
    {/each}
  </div>
</section>

<style>
  .ogres {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-md);
  }

  p {
    margin: 0;
  }

  /* Invisible pero ocupando su sitio. */
  .idle {
    visibility: hidden;
  }

  .hint {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }
</style>
