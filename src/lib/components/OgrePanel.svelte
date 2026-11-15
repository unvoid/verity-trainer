<!--
  Símbolos por rondas: ogros que aparecen al agotarse los símbolos y cuenta
  atrás hasta que vuelven los caballeros. Ocupa el sitio de los caballeros
  (App.svelte), con su misma maquetación: cada ogro es una tile con su
  pictograma y la acción debajo; derrotado, el hueco vacío.
-->
<script lang="ts">
  import { OGRE_SIDES, type DropsState, type OgreSide } from '../domain/drops'
  import { t } from '../i18n'
  import { clock } from '../stores/clock'
  import OgreIcon from './OgreIcon.svelte'
  import SectionTitle from './SectionTitle.svelte'
  import TileFrame from './TileFrame.svelte'

  interface Props {
    drops: DropsState
    disabled?: boolean
    /** Tamaño del pictograma en px (el de los símbolos de los caballeros). */
    size?: number
    ondefeat: (side: OgreSide) => void
  }

  let { drops, disabled = false, size = 44, ondefeat }: Props = $props()

  const respawnSeconds = $derived(
    drops.respawnAt === null ? null : Math.max(0, Math.ceil((drops.respawnAt - $clock) / 1000)),
  )
</script>

<section class="ogres" aria-labelledby="ogres-title">
  <SectionTitle id="ogres-title" level={3} sub>{$t('ogres.title')}</SectionTitle>
  {#if respawnSeconds !== null}
    <p class="hint" role="status">{$t('rounds.respawn', { seconds: respawnSeconds })}</p>
  {:else}
    <p class="hint">{$t('ogres.hint')}</p>
  {/if}
  <div class="row">
    {#each OGRE_SIDES as side (side)}
      {@const alive = drops.ogres?.[side] ?? false}
      {@const status = alive ? $t('knight.defeat') : $t('ogre.defeated')}
      <button
        type="button"
        class="ogre tile"
        class:defeated={!alive}
        disabled={disabled || !alive}
        aria-label={$t('ogre.label', { ogre: $t(`ogre.${side}`), status })}
        onclick={() => ondefeat(side)}
      >
        <TileFrame />
        <span class:faded={!alive}><OgreIcon {size} /></span>
        <span class="tile-label" class:action={alive} aria-hidden="true">{status}</span>
        <span class="life-slot" aria-hidden="true"></span>
      </button>
    {/each}
  </div>
</section>

<style>
  /* Misma separación que la zona de los caballeros (Toolbox): título, ayuda y tiles. */
  .ogres {
    width: 75%;
    margin-inline: auto;
  }

  .hint {
    margin: calc(-1 * var(--space-2)) 0 var(--space-3);
    font-size: var(--font-size-sm);
    text-align: center;
    color: var(--color-text-muted);
  }

  /* Dos tiles del mismo ancho que las de los caballeros (tres en la misma anchura). */
  .row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
    width: calc((100% - 2 * var(--space-3)) / 3 * 2 + var(--space-3));
    margin-inline: auto;
  }

  .ogre {
    padding: var(--space-6) var(--space-2) var(--space-4);
    cursor: pointer;
  }

  .ogre:hover:not(:disabled) {
    --tile-fill: var(--color-stone-hover);
  }

  .ogre:hover:not(:disabled) .action {
    text-decoration: underline;
  }

  .action {
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  /* Derrotado: hueco vacío, sin piedra (queda el canto), como los símbolos usados. */
  .defeated {
    --tile-fill: transparent;
    color: var(--color-text-muted);
    cursor: default;
  }

  /* Mismo alto que las tiles de los caballeros, que reservan el hueco de la barra de caducidad. */
  .life-slot {
    display: block;
    height: var(--stroke-focus);
  }

  .faded {
    opacity: var(--opacity-faded);
    filter: grayscale(1);
  }
</style>
