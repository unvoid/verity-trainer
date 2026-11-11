<script lang="ts">
  import CalloutPanel from './lib/components/CalloutPanel.svelte'
  import DragLayer from './lib/components/DragLayer.svelte'
  import GameStatus from './lib/components/GameStatus.svelte'
  import LanguageSelector from './lib/components/LanguageSelector.svelte'
  import OgrePanel from './lib/components/OgrePanel.svelte'
  import ResultModal from './lib/components/ResultModal.svelte'
  import SectionTitle from './lib/components/SectionTitle.svelte'
  import SettingsDrawer from './lib/components/SettingsDrawer.svelte'
  import SplashScreen from './lib/components/SplashScreen.svelte'
  import StartPointEditor from './lib/components/StartPointEditor.svelte'
  import Statue from './lib/components/Statue.svelte'
  import Toolbox from './lib/components/Toolbox.svelte'
  import { minimumSwaps, solve } from './lib/domain/solver'
  import { depositError } from './lib/domain/swap'
  import { SLOTS, type Scenario, type Slot } from './lib/domain/types'
  import { t } from './lib/i18n'
  import { CLOCK_INTERVAL_MS } from './lib/stores/clock'
  import { drag } from './lib/stores/drag'
  import { game } from './lib/stores/game'
  import { activeSettings, modeOf } from './lib/stores/settings'
  import { setup } from './lib/stores/setup'

  /** Pantalla de entrada: se ve al menos una vez al abrir la web. */
  let splash = $state(true)
  /** El contenido aparece (fundido y escala) cuando la pantalla de entrada se retira. */
  let revealed = $state(false)

  /** Preparación del punto de partida o partida en curso. */
  let phase = $state<'setup' | 'playing'>('setup')

  function startTraining(scenario: Scenario) {
    game.newGame(scenario, { mode: modeOf($activeSettings), rounds: $activeSettings.symbolRounds })
    phase = 'playing'
  }

  function backToSetup() {
    setup.propose()
    phase = 'setup'
  }

  const finished = $derived($game.finishedAt !== null)
  const hints = $derived($activeSettings.hints)

  /** Rondas: el tiempo avanza solo mientras hay una partida en curso con rondas. */
  const roundsRunning = $derived(phase === 'playing' && $game.drops !== null && !finished)
  $effect(() => {
    if (!roundsRunning) return
    const id = setInterval(game.tick, CLOCK_INTERVAL_MS)
    return () => clearInterval(id)
  })

  /** Pista: intercambios mínimos que faltan desde el estado actual. */
  const remaining = $derived(
    hints && !finished ? minimumSwaps({ callouts: $game.state.callouts, statues: $game.state.statues }, $game.mode) : null,
  )

  /** Pista: estatuas que admiten el símbolo que lleva el jugador. */
  function accepts(slot: Slot): boolean {
    const symbol = $game.held
    return symbol !== null && depositError($game.state, { slot, symbol }) === null
  }

  /** Resumen al resolver. Se calcula una vez por partida resuelta. */
  const result = $derived.by(() => {
    const { finishedAt, scenario, mode, state } = $game
    if (finishedAt === null) return null
    const solution = solve(scenario, mode)
    return {
      finishedAt,
      minimum: solution?.swaps.length ?? 0,
      solution: solution?.swaps ?? [],
      seconds: Math.round((finishedAt - state.startedAt) / 1000),
    }
  })

  /** Partida resuelta cuyo resumen ya se cerró (para no volver a abrirlo). */
  let dismissedAt = $state<number | null>(null)
  const resultOpen = $derived(result !== null && result.finishedAt !== dismissedAt)

  function closeResult() {
    dismissedAt = result?.finishedAt ?? null
  }

  function retry() {
    closeResult()
    game.restart()
  }

  function newGameFromResult() {
    closeResult()
    backToSetup()
  }
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
</svelte:head>

{#if splash}
  <SplashScreen onreveal={() => (revealed = true)} onfinish={() => (splash = false)} />
{/if}

<header class="app-header" inert={splash}>
  <div class="header-inner">
    <h1>{$t('app.title')}</h1>
    <div class="header-actions">
      <SettingsDrawer playing={phase === 'playing'} />
      <LanguageSelector />
    </div>
  </div>
</header>

<main class="app-main" class:revealed inert={splash}>
  {#if phase === 'setup'}
    <StartPointEditor onstart={startTraining} />
  {:else}
    <CalloutPanel callouts={$game.state.callouts} />

    <section aria-labelledby="statues-title">
      <SectionTitle id="statues-title">
        {$t('statues.title')}
        {#if $game.mode === 'challenge'}
          <span class="title-note">({$t('status.mode.challenge')})</span>
        {/if}
      </SectionTitle>
      <div class="statues">
        {#each SLOTS as slot (slot)}
          <Statue
            {slot}
            shape={$game.state.statues[slot]}
            callout={$game.state.callouts[slot]}
            marked={$game.state.selection?.slot === slot ? $game.state.selection.symbol : null}
            disabled={finished}
            dropHover={$drag?.over === slot}
            {hints}
            accepts={accepts(slot)}
            onactivate={game.depositAt}
          />
        {/each}
      </div>
    </section>

    <Toolbox
      held={$game.held}
      drops={$game.drops}
      disabled={finished}
      ontoggle={game.toggleHold}
      ondrop={game.dropAt}
      ondefeatknight={game.defeatKnight}
    />

    {#if $game.drops}
      <OgrePanel drops={$game.drops} disabled={finished} ondefeat={game.defeatOgre} />
    {/if}

    <GameStatus
      swaps={$game.state.swaps}
      held={$game.held}
      feedback={$game.feedback}
      {remaining}
      onnewgame={backToSetup}
      onrestart={game.restart}
    />
  {/if}

</main>

<DragLayer />

{#if result}
  <ResultModal
    open={resultOpen}
    swaps={$game.state.swaps}
    minimum={result.minimum}
    seconds={result.seconds}
    mode={$game.mode}
    solution={result.solution}
    onretry={retry}
    onnewgame={newGameFromResult}
    onclose={closeResult}
  />
{/if}

<style>
  /* Cabecera a todo el ancho sobre un plano de tono; su contenido, alineado con el tablero. */
  .app-header {
    background: var(--color-surface);
  }

  .header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-inline: auto;
    padding: var(--space-4);
  }

  /* Aclaración junto a un título de sección: texto normal, no en mayúsculas. */
  .title-note {
    margin-left: var(--space-1);
    font-family: var(--font-family);
    font-weight: var(--font-weight-regular);
    letter-spacing: normal;
    text-transform: none;
    color: var(--color-text-muted);
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-family: var(--font-family-display);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .app-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    max-width: var(--content-width);
    margin-inline: auto;
    padding: var(--space-6) var(--space-4);
    /* Oculto y algo más pequeño hasta que se retira la pantalla de entrada. */
    opacity: 0;
    transform: scale(0.97);
    transform-origin: 50% 0;
    transition:
      opacity var(--duration-reveal) var(--easing-standard),
      transform var(--duration-reveal) var(--easing-standard);
  }

  .app-main.revealed {
    opacity: 1;
    transform: none;
  }

  .statues {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
  }

</style>
