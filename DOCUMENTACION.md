# Documentación Técnica - LogiMatrix Suite

Esta documentación describe la estructura y funcionamiento técnico de cada módulo de la suite de soluciones académicas para métodos cuantitativos.

## 1. Estructura General

El proyecto es una aplicación web de una sola página (SPA) construida con Vite, HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 para el diseño y jQuery para la manipulación del DOM.

**Punto de entrada:** `main.js` inicializa la navegación por pestañas y carga los módulos individuales cuando el documento está listo.

## 2. Módulos

### 2.1 Transporte (Costo Mínimo)
**Archivo:** `transporte.js`

Este módulo resuelve problemas de transporte utilizando el **Método del Costo Mínimo**.

*   **Entradas:**
    *   Número de Plantas (Oferta).
    *   Número de Clientes (Demanda).
    *   Costos de transporte unitarios entre cada Planta y Cliente.
    *   Cantidades de Oferta disponible y Demanda requerida.
*   **Lógica (`calculateTransporte`):**
    1.  Lee la matriz de costos, vectores de oferta y demanda.
    2.  Verifica si el problema está balanceado (Oferta Total == Demanda Total).
    3.  Itera seleccionando repetidamente la celda con el **menor costo unitario** disponible.
    4.  Asigna la máxima cantidad posible (`min(oferta, demanda)`) a esa celda.
    5.  Ajusta la oferta y demanda restantes y elimina la fila o columna saturada (implícitamente al no procesarla si su valor remanente es 0).
    6.  Repite hasta satisfacer todas las necesidades.
*   **Salida:**
    *   Costo Total Mínimo.
    *   Matriz de Asignación final.
    *   Bitácora paso a paso de las asignaciones.

### 2.2 Asignación (Húngaro / Backtracking)
**Archivo:** `asignacion.js`

Resuelve problemas de asignación 1 a 1 (Trabajadores a Tareas) minimizando costos.

*   **Entradas:**
    *   Tamaño de la matriz $N \times N$ (Trabajadores vs Tareas).
    *   Matriz de costos.
*   **Lógica (`munkres` y `solveMinAssignmentRecursively`):**
    *   Para $N \le 8$: Utiliza un algoritmo de **fuerza bruta/recursivo** (Backtracking) para encontrar la permutación de asignaciones que minimiza la suma de costos. Esto asegura la solución óptima exacta para matrices pequeñas típicas en ejercicios académicos.
    *   La función intenta reducir la matriz (restar mínimos de filas y columnas) como paso preliminar típico del algoritmo Húngaro, aunque la resolución final en esta implementación depende de la recursión para simplicidad y robustez en entornos pequeños.
*   **Salida:**
    *   Lista de parejas óptimas (Trabajador $\to$ Tarea).
    *   Costo Total Mínimo.

### 2.3 Rutas (Floyd-Warshall)
**Archivo:** `rutas.js`

Calcula las distancias mínimas entre todos los pares de nodos en un grafo.

*   **Entradas:**
    *   Número de nodos.
    *   Matriz de distancias directas (Adyacencia). Se usa `INF` para nodos no conectados y `0` para la diagonal principal.
*   **Lógica (`calculateFloydWarshall`):**
    *   Implementa el algoritmo **Floyd-Warshall** con complejidad $O(N^3)$.
    *   Itera sobre un nodo intermedio $k$, actualizando la distancia entre $i$ y $j$ si el camino pasando por $k$ es más corto:
        $$ D[i][j] = \min(D[i][j], D[i][k] + D[k][j]) $$
*   **Salida:**
    *   Matriz final de distancias mínimas entre todos los nodos.

### 2.4 Markov (Estado Estable)
**Archivo:** `markov.js`

Calcula las probabilidades de estado estable para una Cadena de Markov.

*   **Entradas:**
    *   Número de estados.
    *   Matriz de Transición de Probabilidades (la suma de filas debe ser 1).
*   **Lógica (`calculateMarkov`):**
    *   Utiliza el **Método de la Potencia** para encontrar el estado estable.
    *   Eleva la matriz de transición al cuadrado repetidamente (multiplicación de matrices) hasta que la matriz converge (las filas se vuelven casi idénticas) o se alcanza un límite de iteraciones.
    *   Esto simula el comportamiento del sistema a largo plazo.
*   **Salida:**
    *   Vector de probabilidades de estado estable (porcentajes de largo plazo para cada estado).

### 2.5 Pronóstico (Regresión Lineal)
**Archivo:** `pronostico.js`

Realiza una Regresión Lineal Simple para predecir valores futuros.

*   **Entradas:**
    *   Conjunto de datos históricos (pares X, Y).
    *   Valor objetivo X para pronosticar.
*   **Lógica (`calculateRegression`):**
    *   Calcula las sumatorias necesarias ($\sum X, \sum Y, \sum XY, \sum X^2$).
    *   Calcula la pendiente $b$ y la intersección $a$ usando el método de Mínimos Cuadrados Ordinarios:
        $$ b = \frac{n \sum XY - \sum X \sum Y}{n \sum X^2 - (\sum X)^2} $$
        $$ a = \frac{\sum Y - b \sum X}{n} $$
    *   Calcula el coeficiente de determinación $R^2$ para medir la calidad del ajuste.
*   **Salida:**
    *   Ecuación de la recta $Y = a + bX$.
    *   Coeficiente $R^2$.
    *   Predicción para el valor X solicitado.
