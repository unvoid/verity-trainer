<!--
  Manual de uso breve. Los ajustes reutilizan las descripciones del panel de
  ajustes; los que no están disponibles en esta versión se marcan como
  "Próximamente" (según features.ts).
-->
<script lang="ts">
  import { decompose } from '../domain/shapes'
  import { SHAPES } from '../domain/types'
  import { FEATURES } from '../features'
  import { t } from '../i18n'
  import SectionTitle from './SectionTitle.svelte'
  import Shape3D from './Shape3D.svelte'
  import Symbol2D from './Symbol2D.svelte'

  const SETTINGS = [
    { key: 'hints', available: FEATURES.hints },
    { key: 'challenge-mode', available: FEATURES.challengeMode },
    { key: 'symbol-rounds', available: FEATURES.symbolRounds },
  ] as const
</script>

<article class="guide" aria-labelledby="guide-title">
  <SectionTitle id="guide-title">{$t('guide.title')}</SectionTitle>

  <section>
    <h3>{$t('guide.encounter.title')}</h3>
    <p>{$t('guide.encounter.body')}</p>
  </section>

  <section>
    <h3>{$t('guide.shapes.title')}</h3>
    <p>{$t('guide.shapes.body')}</p>
    <ul class="shapes">
      {#each SHAPES as shape (shape)}
        {@const [first, second] = decompose(shape)}
        <li
          aria-label={$t('guide.shapes.item', {
            shape: $t(`shape.${shape}`),
            first: $t(`symbol.ref.${first}`),
            second: $t(`symbol.ref.${second}`),
          })}
        >
          <Shape3D {shape} size={32} />
          <span class="equals" aria-hidden="true">=</span>
          <Symbol2D symbol={first} size={18} />
          <span class="plus" aria-hidden="true">+</span>
          <Symbol2D symbol={second} size={18} />
          <span class="name" aria-hidden="true">{$t(`shape.${shape}`)}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>{$t('guide.swap.title')}</h3>
    <ol>
      <li>{$t('guide.swap.step1')}</li>
      <li>{$t('guide.swap.step2')}</li>
      <li>{$t('guide.swap.step3')}</li>
    </ol>
    <p>{$t('guide.swap.keyboard')}</p>
  </section>

  <section>
    <h3>{$t('guide.goal.title')}</h3>
    <p>{$t('guide.goal.body')}</p>
  </section>

  <section>
    <h3>{$t('guide.start.title')}</h3>
    <p>{$t('guide.start.body')}</p>
  </section>

  <section>
    <h3>{$t('guide.settings.title')}</h3>
    <dl class="settings">
      {#each SETTINGS as setting (setting.key)}
        <div class:unavailable={!setting.available}>
          <dt>
            {$t(`settings.${setting.key}`)}
            {#if !setting.available}
              <span class="soon">({$t('guide.coming-soon')})</span>
            {/if}
          </dt>
          <dd>{$t(`settings.${setting.key}.description`)}</dd>
        </div>
      {/each}
    </dl>
  </section>
</article>

<style>
  .guide {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  p,
  ol,
  dd {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  ol {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-left: var(--space-6);
  }

  .shapes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-2);
    margin: var(--space-1) 0 0;
    padding: 0;
    list-style: none;
  }

  .shapes li {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
  }

  .equals,
  .plus {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .name {
    margin-left: auto;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin: 0;
  }

  dt {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  /* Ajuste no disponible en esta versión: nombre en gris y nota "Próximamente". */
  .unavailable dt {
    color: var(--color-text-muted);
  }

  .soon {
    font-weight: var(--font-weight-regular);
  }
</style>
