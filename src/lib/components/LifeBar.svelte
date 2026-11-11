<!--
  Barra fina que se vacía mientras caduca un símbolo soltado. Decorativa: la
  caducidad se anuncia por texto en el estado de la partida.
-->
<script lang="ts">
  import { remainingLife, type DropSlot } from '../domain/drops'
  import { clock } from '../stores/clock'

  interface Props {
    drop: DropSlot
  }

  let { drop }: Props = $props()

  const fraction = $derived(remainingLife(drop, $clock))
</script>

<span class="life" aria-hidden="true">
  <span class="fill" style:transform="scaleX({fraction})"></span>
</span>

<style>
  .life {
    display: block;
    width: 100%;
    height: var(--stroke-focus);
    overflow: hidden;
    background: var(--color-surface-hover);
    border-radius: var(--stroke-focus);
  }

  .fill {
    display: block;
    height: 100%;
    background: var(--color-active);
    transform-origin: left;
  }
</style>
