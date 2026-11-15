<!--
  Control de tema en la cabecera: cambia al tema contrario al que se ve
  (ver `stores/theme.ts`). Botón de icono, como ayuda y ajustes.
-->
<script lang="ts">
  import { t } from '../i18n'
  import { oppositeTheme, theme, toggleTheme } from '../stores/theme'
  import Button from './Button.svelte'
  import ThemeIcon from './ThemeIcon.svelte'

  const target = $derived(oppositeTheme($theme))
  const label = $derived($t(target === 'dark' ? 'theme.to-dark' : 'theme.to-light'))
</script>

<Button icon variant="ghost" onclick={toggleTheme} aria-label={label} title={label}>
  <ThemeIcon to={target} />
</Button>
