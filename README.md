# Verity Trainer

Simulador web del encuentro **Verity** (raid *Salvation's Edge*, Destiny 2: The Final Shape) para practicar los intercambios de símbolos en las estatuas.

- Escenarios aleatorios.
- Editor de **punto de partida** para recrear una situación real.
- **Solucionador** que muestra la secuencia mínima de intercambios.

Disponible en español e inglés.

> Proyecto en desarrollo.

## Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | 26 o superior |
| npm | 11 o superior (incluido con Node 26) |

Las versiones mínimas están en `engines` de `package.json`, y el `.npmrc` del proyecto activa `engine-strict`: con una versión anterior de Node, `npm install` falla en lugar de instalar.

El archivo `.node-version` indica la versión de Node del proyecto. Lo leen la mayoría de gestores de versiones:

```sh
# n
n auto              # instala y activa la versión de .node-version
# o, sin cambiar la versión global:
n exec auto npm install

# fnm / nvm
fnm use             # nvm: nvm use 26
```

### Registro de npm

El `.npmrc` del proyecto fija el registro público (`https://registry.npmjs.org/`). Si tu `~/.npmrc` apunta a un registro privado (por ejemplo, de empresa), este proyecto lo ignora y no le envía tus credenciales.

## Instalación

```sh
git clone <url-del-repositorio>
cd verity-trainer
npm install
```

## Funcionalidades por versión

Algunas funcionalidades se pueden activar o desactivar al compilar, con variables de entorno. Copia `.env.example` como `.env.production` (o `.env.local`) y ajusta los valores:

```sh
VITE_FEATURE_HINTS=true
VITE_FEATURE_CHALLENGE_MODE=false
VITE_FEATURE_SYMBOL_ROUNDS=false
```

Una funcionalidad desactivada no aparece en la web. Más detalle en [docs/arquitectura.md](docs/arquitectura.md#funcionalidades-y-ajustes).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build de `dist/` en local |
| `npm run check` | Comprobación de tipos (Svelte + TypeScript) |
| `npm test` | Tests con Vitest (una pasada) |
| `npm run test:watch` | Tests en modo observación |

## Stack

- [Vite](https://vite.dev/) + [Svelte 5](https://svelte.dev/) + TypeScript
- [Vitest](https://vitest.dev/) para la lógica de dominio
- Formas en SVG, sin librerías 3D
- Tipografía [Inter](https://rsms.me/inter/) (SIL Open Font License), alojada con el proyecto mediante `@fontsource-variable/inter`
- Web estática: se despliega el contenido de `dist/` en cualquier hosting estático

## Estructura

```
src/
  lib/
    domain/       # Reglas del encuentro en TypeScript puro (sin Svelte)
    stores/       # Estado de la partida y ajustes
    components/   # Componentes Svelte
    i18n/         # Textos ES/EN y función t()
    theme/        # Tokens de color, tipografía y espaciado
  App.svelte
tests/            # Tests de Vitest
```

## Documentación

- [Mecánica del encuentro](docs/mecanica.md): vocabulario, reglas, ajustes y solucionador.
- [Arquitectura](docs/arquitectura.md): principios, estructura, interacción e idiomas.
- [Estética](docs/estetica.md): paleta, tipografía y reglas visuales.
- [Tono y vocabulario](docs/tono.md): cómo se escriben los textos de la web.
- [Hoja de ruta](docs/hoja-de-ruta.md): hitos y dudas abiertas.

## Créditos

- Inspirado en **[Verity Simulator](https://verity.cabotmc.dev/)** de EggAllocationService ([repositorio](https://github.com/EggAllocationService/verity-sim)). Este proyecto reimplementa la mecánica desde cero; no reutiliza su código.
- La "Shape Reference Guide" de la comunidad, creada por Nec, se ha usado como referencia.
- Destiny 2 es una marca de Bungie, Inc. Este es un proyecto de fans sin relación con Bungie; no usa imágenes ni recursos oficiales.
