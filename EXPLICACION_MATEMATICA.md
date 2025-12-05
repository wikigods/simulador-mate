# Explicación Matemática Paso a Paso - Profesor LogiMatrix

A continuación, presento la resolución detallada de un ejemplo representativo para cada módulo del sistema, explicado como lo haría un profesor en clase.

---

## 1. Módulo de Transporte (Método del Costo Mínimo)

**Problema:**
Tenemos 3 Plantas y 3 Clientes con los siguientes costos, oferta y demanda.

| Origen \ Destino | Cliente 1 | Cliente 2 | Cliente 3 | **Oferta** |
| :--- | :---: | :---: | :---: | :---: |
| **Planta 1** | \$10 | \$20 | \$5 | 500 |
| **Planta 2** | \$2 | \$15 | \$8 | 400 |
| **Planta 3** | \$25 | \$10 | \$15 | 300 |
| **Demanda** | 400 | 200 | 600 | **1200** |

**Resolución Paso a Paso:**

"Alumnos, el objetivo es satisfacer la demanda al menor costo posible. La regla de oro del **Costo Mínimo** es: *Busca siempre la celda más barata en toda la matriz y asigna lo máximo que puedas*."

1.  **Paso 1:** Buscamos el costo más bajo en toda la tabla.
    *   Vemos que es **\$2** (Planta 2 $\to$ Cliente 1).
    *   **Asignación:** Mínimo(Oferta P2: 400, Demanda C1: 400) = **400 unidades**.
    *   *Ajuste:* La Planta 2 se queda con 0. El Cliente 1 queda satisfecho (0).
    *   *Acción:* Tachamos la Fila 2 y la Columna 1.

2.  **Paso 2:** Buscamos el siguiente costo más bajo (sin contar filas/columnas tachadas).
    *   Es **\$5** (Planta 1 $\to$ Cliente 3).
    *   **Asignación:** Mínimo(Oferta P1: 500, Demanda C3: 600) = **500 unidades**.
    *   *Ajuste:* La Planta 1 queda en 0. Al Cliente 3 le faltan 100.
    *   *Acción:* Tachamos Fila 1.

3.  **Paso 3:** Solo nos queda la Planta 3.
    *   El Cliente 2 necesita 200. Costo: **\$10**. Asignamos **200**. (Planta 3 baja a 100).
    *   El Cliente 3 necesita 100 (le faltaban). Costo: **\$15**. Asignamos **100**. (Planta 3 baja a 0).

**Resultado Final:**
*   Costo Total = $(400 \times 2) + (500 \times 5) + (200 \times 10) + (100 \times 15)$
*   Costo Total = $800 + 2500 + 2000 + 1500 = \mathbf{\$6800}$

---

## 2. Módulo de Asignación

**Problema:**
Asignar 3 Trabajadores (W) a 3 Tareas (T) con los siguientes costos.

| | T1 | T2 | T3 |
|---|---|---|---|
| **W1** | 15 | 10 | 9 |
| **W2** | 9 | 15 | 10 |
| **W3** | 10 | 12 | 8 |

**Resolución Paso a Paso (Lógica de Fuerza Bruta/Análisis):**

"Aquí buscamos la combinación única donde cada trabajador tenga una tarea distinta y la suma sea mínima."

1.  **Opción A (Greedy/Voraz - Incorrecto pero intuitivo):**
    *   W3 toma T3 (8). W1 toma T2 (10). W2 toma T1 (9). Total: $8+10+9 = 27$.
    *   *¿Es esta la mejor? Verifiquemos todas las combinaciones.*

2.  **Análisis de Combinaciones Posibles:**
    *   W1-T1, W2-T2, W3-T3 $\to 15 + 15 + 8 = 38$
    *   W1-T1, W2-T3, W3-T2 $\to 15 + 10 + 12 = 37$
    *   W1-T2, W2-T1, W3-T3 $\to 10 + 9 + 8 = 27$
    *   W1-T2, W2-T3, W3-T1 $\to 10 + 10 + 10 = 30$
    *   W1-T3, W2-T1, W3-T2 $\to 9 + 9 + 12 = 30$
    *   **W1-T3, W2-T2, W3-T1** $\to 9 + 15 + 10 = 34$

**Conclusión:**
"La asignación óptima es la combinación que dio 27.
*   Trabajador 1 $\to$ Tarea 2 (\$10)
*   Trabajador 2 $\to$ Tarea 1 (\$9)
*   Trabajador 3 $\to$ Tarea 3 (\$8)
**Costo Total Mínimo: 27**."

---

## 3. Módulo de Rutas (Floyd-Warshall)

**Problema:**
Grafo de 3 Nodos. Distancias directas:
*   1 $\to$ 2: costo 8
*   1 $\to$ 3: costo 5
*   2 $\to$ 1: costo 3
*   2 $\to$ 3: Infinito
*   3 $\to$ 2: costo 2

**Resolución Paso a Paso:**

"El algoritmo Floyd-Warshall compara: *¿Es más rápido ir directo de A a B, o pasar por un intermediario K?*"

1.  **Matriz Inicial ($D_0$):**
    $$
    \begin{pmatrix}
    0 & 8 & 5 \\
    3 & 0 & \infty \\
    \infty & 2 & 0
    \end{pmatrix}
    $$

2.  **Iteración K=1 (Usando Nodo 1 como puente):**
    *   Miramos si ir $2 \to 1 \to 3$ es mejor que $2 \to 3$ (actualmente $\infty$).
    *   $D[2][1] + D[1][3] = 3 + 5 = 8$.
    *   $8 < \infty$, así que actualizamos $D[2][3] = 8$.

3.  **Iteración K=2 (Usando Nodo 2 como puente):**
    *   Miramos si ir $3 \to 2 \to 1$ es mejor que $3 \to 1$ ($\infty$).
    *   $D[3][2] + D[2][1] = 2 + 3 = 5$. Actualizamos $D[3][1] = 5$.

4.  **Iteración K=3 (Usando Nodo 3 como puente):**
    *   Miramos $1 \to 3 \to 2$. Costo: $5 + 2 = 7$.
    *   El camino directo $1 \to 2$ costaba 8. Como $7 < 8$, ¡mejoramos la ruta!
    *   Nueva distancia $1 \to 2$ es **7**.

**Matriz Final:**
$$
\begin{pmatrix}
0 & 7 & 5 \\
3 & 0 & 8 \\
5 & 2 & 0
\end{pmatrix}
$$
"Ahora sabemos que para ir del Nodo 1 al 2, conviene pasar por el 3."

---

## 4. Módulo de Pronóstico (Regresión Lineal)

**Problema:**
Datos Históricos: (1, 2), (2, 4), (3, 5). Predecir para $X=4$.

**Resolución Paso a Paso:**

"Usaremos el método de Mínimos Cuadrados para encontrar la línea recta que pasa más cerca de todos los puntos."

1.  **Construir Tabla de Sumatorias:**
    *   $X$: 1, 2, 3 $\to \sum X = 6$
    *   $Y$: 2, 4, 5 $\to \sum Y = 11$
    *   $XY$: $1\cdot2=2$, $2\cdot4=8$, $3\cdot5=15$ $\to \sum XY = 25$
    *   $X^2$: $1, 4, 9 \to \sum X^2 = 14$
    *   $n = 3$

2.  **Calcular Pendiente ($b$):**
    $$ b = \frac{n(\sum XY) - (\sum X)(\sum Y)}{n(\sum X^2) - (\sum X)^2} $$
    $$ b = \frac{3(25) - (6)(11)}{3(14) - (36)} = \frac{75 - 66}{42 - 36} = \frac{9}{6} = \mathbf{1.5} $$
    "La pendiente es 1.5, lo que significa que por cada unidad que aumenta X, Y aumenta 1.5".

3.  **Calcular Intersección ($a$):**
    $$ a = \frac{\sum Y - b(\sum X)}{n} $$
    $$ a = \frac{11 - 1.5(6)}{3} = \frac{11 - 9}{3} = \frac{2}{3} \approx \mathbf{0.6667} $$

4.  **Ecuación y Pronóstico:**
    *   Formula: $Y = 0.67 + 1.5X$
    *   Para $X = 4$:
    *   $Y = 0.6667 + 1.5(4) = 0.6667 + 6 = \mathbf{6.67}$

"Según la tendencia histórica, si X es 4, esperamos que Y sea 6.67."
