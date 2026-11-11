<!-- Manual de uso en un panel lateral, abierto con el icono de ayuda de la cabecera. -->
<script lang="ts">
  import { t } from '../i18n'
  import Drawer from './Drawer.svelte'
  import HelpIcon from './HelpIcon.svelte'
  import UsageGuide from './UsageGuide.svelte'
</script>

{#snippet help()}
  <HelpIcon />
{/snippet}

<Drawer label={$t('guide.title')} titleId="guide-title" icon={help}>
  <UsageGuide />
</Drawer>
