import $ from 'jquery';

export function initRutas() {
  const container = $('#rutas-content');

  container.html(`
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Número de Nodos</label>
        <input type="number" id="r-nodes" class="form-control" value="4" min="2">
      </div>
      <div class="col-md-4 d-flex align-items-end">
        <button id="r-generate-btn" class="btn btn-primary w-100">Generar Matriz de Distancias</button>
      </div>
    </div>
    <div id="r-matrix-container" class="mb-3 overflow-auto"></div>
    <div id="r-result" class="result-box d-none"></div>
  `);

  $('#r-generate-btn').click(function() {
    const n = parseInt($('#r-nodes').val());
    if (n < 2) {
      alert("Ingrese al menos 2 nodos.");
      return;
    }

    let html = '<p class="text-muted small">Ingrese las distancias entre nodos. Use "INF" o deje vacío para infinito (sin conexión directa). 0 para el mismo nodo.</p>';
    html += '<table class="table table-bordered text-center matrix-input"><thead><tr><th>Origen \\ Destino</th>';
    for (let j = 0; j < n; j++) {
      html += `<th>${j + 1}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let i = 0; i < n; i++) {
      html += `<tr><th class="align-middle">${i + 1}</th>`;
      for (let j = 0; j < n; j++) {
        let val = (i === j) ? 0 : '';
        let placeholder = (i === j) ? '-' : 'INF';
        html += `<td><input type="text" class="form-control form-control-sm r-dist" data-row="${i}" data-col="${j}" value="${val}" placeholder="${placeholder}"></td>`;
      }
      html += `</tr>`;
    }
    html += '</tbody></table>';
    html += '<button id="r-calculate-btn" class="btn btn-success mt-2">Calcular Rutas Mínimas (Floyd-Warshall)</button>';

    $('#r-matrix-container').html(html);
    $('#r-result').addClass('d-none').html('');

    $('#r-calculate-btn').click(calculateFloydWarshall);
  });
}

function calculateFloydWarshall() {
  const n = parseInt($('#r-nodes').val());
  let dist = [];
  const INF = Infinity;

  // Initialize Matrix
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      let valStr = $(`.r-dist[data-row="${i}"][data-col="${j}"]`).val().trim();
      let val;
      if (i === j) {
        val = 0;
      } else if (valStr === '' || valStr.toUpperCase() === 'INF') {
        val = INF;
      } else {
        val = parseFloat(valStr);
        if (isNaN(val)) val = INF;
      }
      row.push(val);
    }
    dist.push(row);
  }

  // Floyd-Warshall Algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Display Result
  let resultHtml = `<h5>Matriz de Distancias Mínimas</h5>`;
  resultHtml += '<table class="table table-bordered text-center table-sm">';
  resultHtml += '<thead><tr><th></th>';
  for (let j = 0; j < n; j++) {
    resultHtml += `<th>${j + 1}</th>`;
  }
  resultHtml += '</tr></thead><tbody>';

  for (let i = 0; i < n; i++) {
    resultHtml += `<tr><th>${i + 1}</th>`;
    for (let j = 0; j < n; j++) {
      let val = dist[i][j] === INF ? 'INF' : dist[i][j];
      resultHtml += `<td>${val}</td>`;
    }
    resultHtml += `</tr>`;
  }
  resultHtml += '</tbody></table>';

  $('#r-result').removeClass('d-none').html(resultHtml);
}
