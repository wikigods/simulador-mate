import $ from 'jquery';

export function initTransporte() {
  const container = $('#transporte-content');

  // Initial UI
  container.html(`
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Número de Plantas (Oferta)</label>
        <input type="number" id="t-plants" class="form-control" value="3" min="1">
      </div>
      <div class="col-md-4">
        <label class="form-label">Número de Clientes (Demanda)</label>
        <input type="number" id="t-clients" class="form-control" value="3" min="1">
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <button id="t-generate-btn" class="btn btn-primary w-100">Generar Matriz</button>
      </div>
    </div>
    <div id="t-matrix-container" class="mb-3 overflow-auto"></div>
    <div id="t-result" class="result-box d-none"></div>
  `);

  // Event Listener: Generate Matrix
  $('#t-generate-btn').click(function() {
    const plants = parseInt($('#t-plants').val());
    const clients = parseInt($('#t-clients').val());

    if (plants < 1 || clients < 1) {
      alert("Por favor ingrese valores válidos.");
      return;
    }

    let html = '<table class="table table-bordered text-center matrix-input">';

    // Headers (Clients)
    html += '<thead><tr><th>Origen \\ Destino</th>';
    for (let j = 0; j < clients; j++) {
      html += `<th>Cliente ${j + 1}</th>`;
    }
    html += '<th class="table-info">Oferta</th></tr></thead>';

    // Rows (Plants)
    html += '<tbody>';
    for (let i = 0; i < plants; i++) {
      html += `<tr><th class="align-middle">Planta ${i + 1}</th>`;
      for (let j = 0; j < clients; j++) {
        html += `<td><input type="number" class="form-control form-control-sm t-cost" data-row="${i}" data-col="${j}" placeholder="Cost"></td>`;
      }
      html += `<td><input type="number" class="form-control form-control-sm t-supply" data-row="${i}" placeholder="Oferta"></td></tr>`;
    }

    // Demand Row
    html += '<tr class="table-info"><th class="align-middle">Demanda</th>';
    for (let j = 0; j < clients; j++) {
      html += `<td><input type="number" class="form-control form-control-sm t-demand" data-col="${j}" placeholder="Demanda"></td>`;
    }
    html += '<td></td></tr></tbody></table>'; // Bottom right corner empty

    html += '<button id="t-calculate-btn" class="btn btn-success mt-2">Calcular Costo Mínimo</button>';

    $('#t-matrix-container').html(html);
    $('#t-result').addClass('d-none').html('');

    // Bind Calculate Event
    $('#t-calculate-btn').click(calculateTransporte);
  });
}

function calculateTransporte() {
  const plants = parseInt($('#t-plants').val());
  const clients = parseInt($('#t-clients').val());

  // Read Data
  let costs = [];
  let supplies = [];
  let demands = [];

  // Get Costs
  for (let i = 0; i < plants; i++) {
    let row = [];
    for (let j = 0; j < clients; j++) {
      let val = parseFloat($(`.t-cost[data-row="${i}"][data-col="${j}"]`).val()) || 0;
      row.push(val);
    }
    costs.push(row);
  }

  // Get Supply
  for (let i = 0; i < plants; i++) {
    let val = parseFloat($(`.t-supply[data-row="${i}"]`).val()) || 0;
    supplies.push(val);
  }

  // Get Demand
  for (let j = 0; j < clients; j++) {
    let val = parseFloat($(`.t-demand[data-col="${j}"]`).val()) || 0;
    demands.push(val);
  }

  // Validation: Check if balanced
  const totalSupply = supplies.reduce((a, b) => a + b, 0);
  const totalDemand = demands.reduce((a, b) => a + b, 0);

  let resultHtml = `<h5>Resultados</h5>`;

  if (totalSupply !== totalDemand) {
    resultHtml += `<div class="alert alert-warning">Advertencia: El problema no está balanceado. Oferta Total: ${totalSupply}, Demanda Total: ${totalDemand}. (Este algoritmo básico asume balance, pero procederemos).</div>`;
    // For simplicity in this scope, strictly usually requires dummy rows/cols.
    // We will proceed but the result might not clear everything or will be partial.
  }

  // Clone arrays to keep originals for display if needed (not needed for logic here)
  let S = [...supplies];
  let D = [...demands];
  let assignments = Array(plants).fill().map(() => Array(clients).fill(0));
  let totalCost = 0;
  let steps = [];

  // Least Cost Method
  while (true) {
    // Find valid lowest cost cell
    let minCost = Infinity;
    let minR = -1;
    let minC = -1;

    let possible = false;

    for (let i = 0; i < plants; i++) {
      if (S[i] <= 0) continue;
      for (let j = 0; j < clients; j++) {
        if (D[j] <= 0) continue;

        if (costs[i][j] < minCost) {
          minCost = costs[i][j];
          minR = i;
          minC = j;
          possible = true;
        }
      }
    }

    if (!possible) break;

    // Allocate
    let quantity = Math.min(S[minR], D[minC]);
    assignments[minR][minC] = quantity;
    S[minR] -= quantity;
    D[minC] -= quantity;
    totalCost += quantity * minCost;

    steps.push(`Asignado ${quantity} unidades de Planta ${minR+1} a Cliente ${minC+1} (Costo Unitario: ${minCost})`);
  }

  // Display Results
  resultHtml += `<p><strong>Costo Mínimo Total: $${totalCost}</strong></p>`;

  resultHtml += `<h6>Matriz de Asignación:</h6><table class="table table-sm table-bordered">`;
  for (let i = 0; i < plants; i++) {
    resultHtml += `<tr>`;
    for (let j = 0; j < clients; j++) {
      let style = assignments[i][j] > 0 ? 'background-color: #d1e7dd; font-weight:bold;' : '';
      resultHtml += `<td style="${style}">${assignments[i][j]}</td>`;
    }
    resultHtml += `</tr>`;
  }
  resultHtml += `</table>`;

  resultHtml += `<h6>Detalles:</h6><ul>`;
  steps.forEach(step => {
    resultHtml += `<li>${step}</li>`;
  });
  resultHtml += `</ul>`;

  $('#t-result').removeClass('d-none').html(resultHtml);
}
