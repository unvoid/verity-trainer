<script lang="ts">
  import CalloutPanel from './lib/components/CalloutPanel.svelte'
  import DragLayer from './lib/components/DragLayer.svelte'
  import GameStatus from './lib/components/GameStatus.svelte'
  import LanguageSelector from './lib/components/LanguageSelector.svelte'
  import Statue from './lib/components/Statue.svelte'
  import Toolbox from './lib/components/Toolbox.svelte'
  import { minimumSwaps } from './lib/domain/solver'
  import { SLOTS } from './lib/domain/types'
  import { t } from './lib/i18n'
  import { drag } from './lib/stores/drag'
  import { game } from './lib/stores/game'

  const finished = $derived($game.finishedAt !== null)

  const result = $derived.by(() => {
    const { finishedAt, scenario, mode, state } = $game
    if (finishedAt === null) return null
    return {
      minimum: minimumSwaps(scenario, mode) ?? 0,
      seconds: Math.round((finishedAt - state.startedAt) / 1000),
    }
  })
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
</svelte:head>

<header class="app-header">
  <h1>{$t('app.title')}</h1>
  <LanguageSelector />
</header>

<main class="app-main">
  <CalloutPanel callouts={$game.state.callouts} />

  <section aria-labelledby="statues-title">
    <h2 id="statues-title" class="visually-hidden">{$t('statues.title')}</h2>
    <div class="statues">
      {#each SLOTS as slot (slot)}
        <Statue
          {slot}
          shape={$game.state.statues[slot]}
          marked={$game.state.selection?.slot === slot ? $game.state.selection.symbol : null}
          disabled={finished}
          dropHover={$drag?.over === slot}
          onactivate={game.depositAt}
        />
      {/each}
    </div>
  </section>

  <Toolbox held={$game.held} disabled={finished} ontoggle={game.toggleHold} ondrop={game.dropAt} />

  <GameStatus
    swaps={$game.state.swaps}
    held={$game.held}
    feedback={$game.feedback}
    {result}
    onnewgame={() => game.newGame()}
    onrestart={game.restart}
  />
</main>

<DragLayer />

<style>
  .app-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-6);
    border-bottom: var(--stroke-thin) solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
  }

  .app-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    max-width: 40rem;
    margin-inline: auto;
    padding: var(--space-6) var(--space-4);
  }

  .statues {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
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
