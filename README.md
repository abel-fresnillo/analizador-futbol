# Analizador de fútbol

Aplicación web para analizar partidos de la Premier League y estimar la probabilidad de cada resultado posible: victoria local, empate o victoria visitante.

El proyecto combina datos reales del calendario y clasificación de la liga con un modelo estadístico basado en fortalezas de ataque/defensa y distribución de Poisson. El objetivo es ofrecer una vista rápida de qué tan favorecido está cada equipo para una jornada concreta.

## ¿De qué trata este proyecto?

Este proyecto fue pensado como una pequeña herramienta de análisis predictivo para fútbol. En lugar de ofrecer una "certeza", calcula una estimación probabilística a partir de:

- resultados recientes de cada equipo
- goles anotados y recibidos
- fuerza ofensiva y defensiva relativa
- temporada actual y temporada previa como referencia
- clasificación vigente de la liga

La app consume datos de football-data.org y presenta un panel por jornadas de la competencia, mostrando las probabilidades para cada partido.

## ¿Qué hace la aplicación?

- Obtiene la temporada actual y el estado de la liga
- Carga los partidos de la jornada seleccionada
- Calcula indicadores de forma y rendimiento por equipo
- Genera un modelo para estimar goles esperados
- Evalúa la probabilidad de cada resultado final:
  - local
  - empate
  - visitante
- Muestra la información en una interfaz sencilla y clara para comparar partidos

## Cómo funciona internamente

El modelo usa una aproximación estadística muy común en predicción de fútbol:

1. Se recopilan partidos terminados de la temporada actual y la anterior.
2. Se calcula una fuerza de ataque y defensa para cada equipo.
3. Se estiman goles esperados tanto para el local como para el visitante.
4. Con esos valores se aplica una distribución de Poisson.
5. Se obtienen las probabilidades finales de cada resultado.

La lógica principal está en:

- `lib/footballData.ts`: conexión con football-data.org
- `lib/predictions.ts`: construcción del predictor
- `lib/model/strengths.ts`: cálculo de fortalezas por equipo
- `lib/model/poisson.ts`: cálculo de probabilidades 1X2

## Stack tecnológico

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest
- football-data.org API

## Requisitos

Antes de ejecutar el proyecto necesitas:

- Node.js 20+ recomendado
- npm o pnpm
- una clave API de football-data.org

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` con tu clave de la API:

```env
FOOTBALL_DATA_API_KEY=tu_clave_aqui
```

Puedes basarte en el archivo `.env.example` como referencia.

## Ejecutar el proyecto

```bash
npm run dev
```

Luego abre la aplicación en tu navegador en la URL que indique Next.js, normalmente:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev       # inicia la aplicación en modo desarrollo
npm run build     # compila la app para producción
npm run start     # sirve la build generada
npm run test      # ejecuta pruebas con Vitest
npm run typecheck # valida tipos TypeScript
```

## Estructura del proyecto

```text
analizador-futbol/
├── app/                 # rutas y página principal de Next.js
├── components/         # componentes UI de la app
├── docs/               # documentación del proyecto
├── lib/                # lógica de negocio, modelado y API
│   ├── model/          # modelo estadístico
│   ├── footballData.ts # integración con football-data.org
│   ├── predictions.ts  # predictor principal
│   └── types.ts        # tipos compartidos
├── .env.example        # plantilla de variables de entorno
├── package.json        # scripts y dependencias
├── tsconfig.json       # configuración de TypeScript
├── vitest.config.mts   # configuración de pruebas
├── next.config.ts      # configuración de Next.js
└── README.md           # documentación del proyecto
```

## Importante sobre la precisión

Las probabilidades generadas no son garantías ni predicciones definitivas. El fútbol tiene mucha variabilidad, y este tipo de modelos solo estiman la probabilidad más probable a partir de datos históricos y métricas de desempeño.

Se recomienda usar la app como una herramienta de apoyo para análisis, no como una certeza absoluta.

## Mejoras futuras

- comparar varias ligas o competiciones
- añadir más métricas de forma y xG
- mostrar margen de goles y probabilidades por marcador
- incluir historial y comparativas entre equipos
- mejorar visualización de resultados con gráficos

## Autor y propósito

Este proyecto sirve como ejemplo práctico de análisis estadístico aplicado al fútbol con tecnologías modernas de frontend y modelado probabilístico. Está orientado tanto a personas interesadas en datos deportivos como a desarrolladores que quieran explorar una app con integración de API, modelado de predicción y visualización.
