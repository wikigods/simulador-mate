import $ from 'jquery';

export function initMarkov() {
  const container = $('#markov-content');

  container.html(`
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Número de Estados</label>
        <input type="number" id="m-states" class="form-control" value="2" min="2">
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <button id="m-generate-btn" class="btn btn-primary w-100">Generar Matriz de Transición</button>
      </div>
    </div>
    <div id="m-matrix-container" class="mb-3 overflow-auto"></div>
    <div id="m-result" class="result-box d-none"></div>
  `);

  $('#m-generate-btn').click(function() {
    const n = parseInt($('#m-states').val());
    if (n < 2) {
      alert("Ingrese al menos 2 estados.");
      return;
    }

    let html = '<p class="text-muted small">Ingrese las probabilidades de transición (de filas a columnas). La suma de cada fila debe ser 1.</p>';
    html += '<table class="table table-bordered text-center matrix-input"><thead><tr><th>De \\ A</th>';
    for (let j = 0; j < n; j++) {
      html += `<th>E${j + 1}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let i = 0; i < n; i++) {
      html += `<tr><th class="align-middle">E${i + 1}</th>`;
      for (let j = 0; j < n; j++) {
        html += `<td><input type="number" step="0.01" class="form-control form-control-sm m-prob" data-row="${i}" data-col="${j}" value="" placeholder="Prob"></td>`;
      }
      html += `</tr>`;
    }
    html += '</tbody></table>';
    html += '<button id="m-calculate-btn" class="btn btn-success mt-2">Calcular Estado Estable</button>';

    $('#m-matrix-container').html(html);
    $('#m-result').addClass('d-none').html('');

    $('#m-calculate-btn').click(calculateMarkov);
  });
}

function calculateMarkov() {
  const n = parseInt($('#m-states').val());
  let matrix = [];

  // Read Matrix
  for (let i = 0; i < n; i++) {
    let row = [];
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      let val = parseFloat($(`.m-prob[data-row="${i}"][data-col="${j}"]`).val()) || 0;
      row.push(val);
      rowSum += val;
    }
    matrix.push(row);
    // Validate Row Sum (approximate)
    if (Math.abs(rowSum - 1.0) > 0.01) {
      alert(`La suma de probabilidades en la fila ${i + 1} es ${rowSum.toFixed(2)}. Debe ser 1.0.`);
      return;
    }
  }

  // Calculate Steady State
  // Solving pi * P = pi  => pi * (P - I) = 0
  // And sum(pi) = 1
  // This is a system of linear equations.
  // We can solve it by replacing one column of (P-I)^T with 1s to enforce sum constraint.
  // Or simply powering the matrix until convergence (approximate method).

  // Power method is easier to implement and visualizes "Transition".
  // Let's power it up to 50 times or until convergence.

  let currentState = matrix;
  let iterations = 0;
  const maxIterations = 100;
  let converged = false;

  while (iterations < maxIterations && !converged) {
    let nextState = multiplyMatrices(currentState, currentState); // Squaring speeds it up significantly

    // Check convergence (comparing rows, they should become identical)
    // Actually, P^n converges to a matrix where all rows are the steady state vector.
    // Let's check if rows are similar.

    if (isConverged(currentState, nextState)) {
      converged = true;
    }
    currentState = nextState;
    iterations++;
  }

  // Steady state is any row of the converged matrix (assuming ergodic)
  const steadyState = currentState[0].map(v => v.toFixed(4));

  let resultHtml = `<h5>Estado Estable (Probabilidades a Largo Plazo)</h5>`;
  resultHtml += `<ul>`;
  steadyState.forEach((val, idx) => {
    resultHtml += `<li>Estado E${idx + 1}: ${(parseFloat(val) * 100).toFixed(2)}%</li>`;
  });
  resultHtml += `</ul>`;

  if (!converged) {
    resultHtml += `<p class="text-warning">Nota: La matriz no convergió completamente en ${maxIterations} iteraciones de potenciación cuadrática.</p>`;
  }

  $('#m-result').removeClass('d-none').html(resultHtml);
}

function multiplyMatrices(m1, m2) {
  var result = [];
  for (var i = 0; i < m1.length; i++) {
    result[i] = [];
    for (var j = 0; j < m2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function isConverged(m1, m2) {
  const epsilon = 0.000001;
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m1[0].length; j++) {
      if (Math.abs(m1[i][j] - m2[i][j]) > epsilon) return false;
    }
  }
  return true;
}
