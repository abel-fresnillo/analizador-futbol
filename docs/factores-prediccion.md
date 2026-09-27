# Factores para predecir el resultado de un partido de fútbol

> Documento de referencia para el futuro documento de especificaciones del analizador de fútbol.
> Cada factor tiene un identificador estable (`F-XX`) para poder referenciarlo desde requisitos.

## Metadatos

| Campo | Valor |
|---|---|
| Estado | Borrador |
| Fecha | 2026-09-26 |
| Caso de ejemplo | México vs Chile (selecciones nacionales) |
| Salida esperada del modelo | Probabilidades de victoria local / empate / victoria visitante |

## Convenciones

- **Peso relativo**: Alto, Medio o Bajo. Es una estimación cualitativa de la influencia sobre el resultado, no un coeficiente calibrado.
- **Tipo de dato**: numérico, categórico, booleano o texto.
- **Fuente sugerida**: dónde obtener el dato. Aún no está validada.
- **Uso en modelo**: entrada directa (feature) o contexto para ajuste manual.

---

## 1. Nivel base del equipo

### F-01 Ranking FIFA
- **Descripción**: posición y puntos del ranking oficial FIFA.
- **Peso relativo**: Medio
- **Tipo de dato**: numérico
- **Fuente sugerida**: fifa.com
- **Uso en modelo**: entrada directa
- **Notas**: menos preciso que Elo.

### F-02 Rating Elo
- **Descripción**: rating que pondera la calidad del rival y el margen de victoria.
- **Peso relativo**: Alto
- **Tipo de dato**: numérico
- **Fuente sugerida**: eloratings.net
- **Uso en modelo**: entrada directa; candidato a base del modelo.

### F-03 Valor de mercado de la plantilla
- **Descripción**: suma del valor de mercado de los jugadores convocables.
- **Peso relativo**: Medio
- **Tipo de dato**: numérico
- **Fuente sugerida**: Transfermarkt
- **Uso en modelo**: entrada directa
- **Notas**: buena correlación con el rendimiento.

### F-04 Historial reciente
- **Descripción**: resultados de los últimos 10 a 15 partidos.
- **Peso relativo**: Alto
- **Tipo de dato**: numérico (resultados y diferencia de goles)
- **Fuente sugerida**: eloratings.net, FBref
- **Uso en modelo**: entrada directa
- **Notas**: pesa más que el historial histórico.

---

## 2. Forma actual

### F-05 Resultados recientes ajustados por rival
- **Descripción**: victorias, empates y derrotas de los últimos partidos, ponderados por la calidad del rival.
- **Peso relativo**: Alto
- **Tipo de dato**: numérico
- **Fuente sugerida**: FBref, eloratings.net
- **Uso en modelo**: entrada directa

### F-06 Goles a favor y en contra
- **Descripción**: promedio de goles anotados y recibidos en la ventana reciente.
- **Peso relativo**: Alto
- **Tipo de dato**: numérico
- **Fuente sugerida**: FBref
- **Uso en modelo**: entrada directa (parámetros de la distribución de Poisson).

### F-07 Goles esperados (xG)
- **Descripción**: calidad de las ocasiones creadas y concedidas. Refleja el rendimiento real mejor que el marcador.
- **Peso relativo**: Alto
- **Tipo de dato**: numérico
- **Fuente sugerida**: FBref, Understat
- **Uso en modelo**: entrada directa
- **Notas**: la cobertura de selecciones puede ser limitada.

### F-08 Tendencia
- **Descripción**: si el equipo mejora o empeora en la ventana reciente.
- **Peso relativo**: Medio
- **Tipo de dato**: numérico (pendiente) o categórico (sube, estable, baja)
- **Fuente sugerida**: derivada de F-04 a F-07
- **Uso en modelo**: entrada derivada

---

## 3. Plantilla disponible

### F-09 Lesionados y suspendidos
- **Descripción**: bajas confirmadas, con atención a portero, delanteros y eje del mediocampo.
- **Peso relativo**: Alto
- **Tipo de dato**: lista categórica con la posición y la importancia del jugador
- **Fuente sugerida**: comunicados oficiales de la federación, prensa deportiva
- **Uso en modelo**: ajuste (por ejemplo, reducir el valor de plantilla de F-03).

### F-10 Convocatoria y disponibilidad
- **Descripción**: quién fue convocado y quién llega en condiciones. Los jugadores de clubes europeos pueden llegar cansados o no presentarse.
- **Peso relativo**: Medio
- **Tipo de dato**: lista categórica
- **Fuente sugerida**: lista oficial de convocados
- **Uso en modelo**: ajuste

### F-11 Profundidad de banca
- **Descripción**: calidad de los suplentes.
- **Peso relativo**: Bajo
- **Tipo de dato**: numérico o categórico
- **Fuente sugerida**: Transfermarkt
- **Uso en modelo**: contexto

---

## 4. Contexto del partido

### F-12 Localía
- **Descripción**: quién juega en casa. La ventaja típica ronda los 0.3 a 0.4 goles.
- **Peso relativo**: Alto
- **Tipo de dato**: categórico (local, visitante, neutral)
- **Fuente sugerida**: calendario oficial
- **Uso en modelo**: entrada directa

### F-13 Altitud
- **Descripción**: altura de la sede. Por ejemplo, el Estadio Azteca está a unos 2,240 m y favorece al equipo aclimatado.
- **Peso relativo**: Medio
- **Tipo de dato**: numérico (metros)
- **Fuente sugerida**: datos de la sede
- **Uso en modelo**: entrada directa o ajuste

### F-14 Tipo de partido
- **Descripción**: amistoso u oficial (eliminatoria, torneo). Los amistosos tienen rotaciones y menor intensidad, así que su resultado es más impredecible.
- **Peso relativo**: Medio
- **Tipo de dato**: categórico
- **Fuente sugerida**: calendario oficial
- **Uso en modelo**: entrada directa (también modula la confianza de la predicción).

### F-15 Lo que está en juego
- **Descripción**: clasificación, eliminación o simple preparación.
- **Peso relativo**: Medio
- **Tipo de dato**: categórico
- **Fuente sugerida**: contexto del torneo
- **Uso en modelo**: ajuste

### F-16 Viaje, clima y descanso
- **Descripción**: distancia recorrida, clima esperado y días de descanso desde el último partido.
- **Peso relativo**: Bajo
- **Tipo de dato**: numérico
- **Fuente sugerida**: calendario, pronóstico del tiempo
- **Uso en modelo**: ajuste

---

## 5. Aspectos tácticos

### F-17 Estilo de juego
- **Descripción**: posesión, contraataque o presión alta, y cómo encajan los estilos de ambos equipos.
- **Peso relativo**: Medio
- **Tipo de dato**: categórico
- **Fuente sugerida**: análisis táctico, estadísticas de FBref
- **Uso en modelo**: contexto para ajuste manual

### F-18 Balón parado
- **Descripción**: fortaleza en tiros libres y córners, a favor y en contra.
- **Peso relativo**: Bajo
- **Tipo de dato**: numérico
- **Fuente sugerida**: FBref
- **Uso en modelo**: contexto

### F-19 Director técnico
- **Descripción**: sistemas habituales y capacidad de ajuste durante el partido.
- **Peso relativo**: Bajo
- **Tipo de dato**: texto
- **Fuente sugerida**: prensa deportiva
- **Uso en modelo**: contexto

### F-20 Historial directo
- **Descripción**: resultados entre ambos equipos.
- **Peso relativo**: Bajo
- **Tipo de dato**: numérico
- **Fuente sugerida**: eloratings.net, Wikipedia
- **Uso en modelo**: contexto
- **Notas**: poco peso si las plantillas cambiaron.

---

## 6. Factores de menor peso

### F-21 Racha y momento psicológico
- **Peso relativo**: Bajo
- **Uso en modelo**: contexto

### F-22 Arbitraje
- **Peso relativo**: Bajo
- **Uso en modelo**: contexto

### F-23 Presión de afición y prensa
- **Peso relativo**: Bajo
- **Uso en modelo**: contexto

---

## Resumen de factores

| ID | Factor | Categoría | Peso | Uso en modelo |
|---|---|---|---|---|
| F-01 | Ranking FIFA | Nivel base | Medio | Entrada |
| F-02 | Rating Elo | Nivel base | Alto | Entrada |
| F-03 | Valor de mercado | Nivel base | Medio | Entrada |
| F-04 | Historial reciente | Nivel base | Alto | Entrada |
| F-05 | Resultados ajustados por rival | Forma | Alto | Entrada |
| F-06 | Goles a favor y en contra | Forma | Alto | Entrada |
| F-07 | xG | Forma | Alto | Entrada |
| F-08 | Tendencia | Forma | Medio | Derivada |
| F-09 | Lesionados y suspendidos | Plantilla | Alto | Ajuste |
| F-10 | Convocatoria | Plantilla | Medio | Ajuste |
| F-11 | Profundidad de banca | Plantilla | Bajo | Contexto |
| F-12 | Localía | Contexto | Alto | Entrada |
| F-13 | Altitud | Contexto | Medio | Entrada o ajuste |
| F-14 | Tipo de partido | Contexto | Medio | Entrada |
| F-15 | Lo que está en juego | Contexto | Medio | Ajuste |
| F-16 | Viaje, clima y descanso | Contexto | Bajo | Ajuste |
| F-17 | Estilo de juego | Táctico | Medio | Contexto |
| F-18 | Balón parado | Táctico | Bajo | Contexto |
| F-19 | Director técnico | Táctico | Bajo | Contexto |
| F-20 | Historial directo | Táctico | Bajo | Contexto |
| F-21 | Racha psicológica | Menor peso | Bajo | Contexto |
| F-22 | Arbitraje | Menor peso | Bajo | Contexto |
| F-23 | Presión externa | Menor peso | Bajo | Contexto |

---

## Enfoque de modelado propuesto

- **Modelo base**: rating Elo (F-02) más regresión de Poisson sobre goles esperados de cada equipo.
- **Variante**: modelo basado en xG (F-07).
- **Salida**: probabilidades de victoria local, empate y victoria visitante.
- **Referencia externa**: cuotas de casas de apuestas, como comparación del modelo.

## Restricciones y advertencias

- El fútbol tiene alta varianza. El favorito claro gana entre 50% y 70% de las veces.
- El empate ocurre alrededor del 25% de las veces.
- El sistema debe presentar probabilidades, nunca una predicción determinista.
- Los pesos relativos de este documento son cualitativos y deben calibrarse con datos históricos.

## Ejemplo de aplicación: México vs Chile

Datos por verificar antes de ejecutar el análisis:

- [ ] Sede y tipo de partido (amistoso u oficial): F-12, F-13, F-14
- [ ] Rating Elo actual de ambos: F-02
- [ ] Lesionados, suspendidos y convocatoria: F-09, F-10
- [ ] Últimos 5 a 10 partidos de cada selección: F-04 a F-07
- [ ] Cuotas de las casas de apuestas (referencia)

## Preguntas abiertas para la especificación

1. ¿Qué factores serán entradas automáticas del modelo y cuáles serán ajustes manuales del usuario?
2. ¿Qué fuentes de datos se usarán y con qué frecuencia se actualizarán?
3. ¿Cómo se calibrarán los pesos con datos históricos?
4. ¿Se limitará el alcance a selecciones nacionales o también a clubes?
5. ¿Cómo se medirá la calidad de las predicciones (por ejemplo, Brier score o log-loss)?
