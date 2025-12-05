import $ from 'jquery';

export function initPronostico() {
  const container = $('#pronostico-content');

  container.html(`
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Datos Históricos (X, Y)</label>
        <p class="text-muted small">Ingrese pares de datos separados por línea (ej: "1, 100").</p>
        <textarea id="p-data" class="form-control" rows="6" placeholder="1, 100&#10;2, 120&#10;3, 130"></textarea>
      </div>
      <div class="col-md-6">
        <label class="form-label">Valor X a Pronosticar</label>
        <input type="number" id="p-target-x" class="form-control mb-3" placeholder="Ej: 4">
        <button id="p-calculate-btn" class="btn btn-primary w-100">Calcular Regresión Lineal</button>
      </div>
    </div>
    <div id="p-result" class="result-box d-none"></div>
  `);

  $('#p-calculate-btn').click(calculateRegression);
}

function calculateRegression() {
  const rawData = $('#p-data').val().trim();
  const targetX = parseFloat($('#p-target-x').val());

  if (!rawData) {
    alert("Ingrese datos históricos.");
    return;
  }

  // Parse Data
  const lines = rawData.split('\n');
  let n = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let parsedData = [];

  for (let line of lines) {
    let parts = line.split(',');
    if (parts.length < 2) parts = line.split(/\s+/); // Try space split if comma fails

    if (parts.length >= 2) {
      let x = parseFloat(parts[0]);
      let y = parseFloat(parts[1]);

      if (!isNaN(x) && !isNaN(y)) {
        parsedData.push({x, y});
        sumX += x;
        sumY += y;
        sumXY += (x * y);
        sumX2 += (x * x);
        n++;
      }
    }
  }

  if (n < 2) {
    alert("Se requieren al menos 2 puntos de datos válidos.");
    return;
  }

  // Calculate Slope (b) and Intercept (a)
  // b = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX^2)
  // a = (sumY - b*sumX) / n

  const denominator = (n * sumX2) - (sumX * sumX);

  if (denominator === 0) {
    alert("Error: No se puede calcular la regresión (denominador cero, varianza X nula).");
    return;
  }

  const b = ((n * sumXY) - (sumX * sumY)) / denominator;
  const a = (sumY - (b * sumX)) / n;

  // Forecast
  let forecastMsg = '';
  if (!isNaN(targetX)) {
    const prediction = a + (b * targetX);
    forecastMsg = `<div class="alert alert-success mt-3">Predicción para X=${targetX}: <strong>${prediction.toFixed(2)}</strong></div>`;
  }

  // R-squared (Optional but good for "Academic" suite)
  // SSR / SST
  const meanY = sumY / n;
  let ssTotal = 0;
  let ssRes = 0;
  for (let p of parsedData) {
    let estY = a + (b * p.x);
    ssTotal += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - estY, 2);
  }
  const r2 = 1 - (ssRes / ssTotal);


  let resultHtml = `<h5>Resultados de la Regresión</h5>`;
  resultHtml += `<p>Ecuación de la Recta: <strong>Y = ${a.toFixed(4)} + ${b.toFixed(4)}X</strong></p>`;
  resultHtml += `<p>Coeficiente de Determinación ($R^2$): ${r2.toFixed(4)}</p>`;
  resultHtml += forecastMsg;

  $('#p-result').removeClass('d-none').html(resultHtml);
}
