// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS (includes Popper)
import 'bootstrap';
// Import jQuery
import $ from 'jquery';
// Make jQuery available globally if needed (though imports are cleaner)
window.jQuery = window.$ = $;
// Import Custom CSS
import './style.css';

// Import Modules
import { initTransporte } from './transporte.js';
import { initAsignacion } from './asignacion.js';
import { initRutas } from './rutas.js';
import { initMarkov } from './markov.js';
import { initPronostico } from './pronostico.js';

document.querySelector('#app').innerHTML = `
  <div class="container mt-4">
    <header class="text-center mb-5">
      <h1>LogiMatrix Suite</h1>
      <p class="lead">Soluciones Académicas para Métodos Cuantitativos</p>
    </header>

    <ul class="nav nav-tabs" id="mainTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="transporte-tab" data-bs-toggle="tab" data-bs-target="#transporte" type="button" role="tab" aria-controls="transporte" aria-selected="true">Transporte</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="asignacion-tab" data-bs-toggle="tab" data-bs-target="#asignacion" type="button" role="tab" aria-controls="asignacion" aria-selected="false">Asignación</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="rutas-tab" data-bs-toggle="tab" data-bs-target="#rutas" type="button" role="tab" aria-controls="rutas" aria-selected="false">Rutas</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="markov-tab" data-bs-toggle="tab" data-bs-target="#markov" type="button" role="tab" aria-controls="markov" aria-selected="false">Markov</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="pronostico-tab" data-bs-toggle="tab" data-bs-target="#pronostico" type="button" role="tab" aria-controls="pronostico" aria-selected="false">Pronóstico</button>
      </li>
    </ul>

    <div class="tab-content p-4 border border-top-0 rounded-bottom" id="mainTabContent">
      <!-- Transporte Tab -->
      <div class="tab-pane fade show active" id="transporte" role="tabpanel" aria-labelledby="transporte-tab">
        <h3>Método del Costo Mínimo</h3>
        <p>Minimización de costos de transporte.</p>
        <div id="transporte-content"></div>
      </div>

      <!-- Asignación Tab -->
      <div class="tab-pane fade" id="asignacion" role="tabpanel" aria-labelledby="asignacion-tab">
        <h3>Asignación Óptima</h3>
        <p>Asignación de trabajadores a tareas.</p>
        <div id="asignacion-content"></div>
      </div>

      <!-- Rutas Tab -->
      <div class="tab-pane fade" id="rutas" role="tabpanel" aria-labelledby="rutas-tab">
        <h3>Rutas Mínimas (Floyd-Warshall)</h3>
        <p>Cálculo de distancias mínimas entre nodos.</p>
        <div id="rutas-content"></div>
      </div>

      <!-- Markov Tab -->
      <div class="tab-pane fade" id="markov" role="tabpanel" aria-labelledby="markov-tab">
        <h3>Cadenas de Markov</h3>
        <p>Predicción de estado estable.</p>
        <div id="markov-content"></div>
      </div>

      <!-- Pronóstico Tab -->
      <div class="tab-pane fade" id="pronostico" role="tabpanel" aria-labelledby="pronostico-tab">
        <h3>Pronóstico de Demanda</h3>
        <p>Regresión Lineal Simple.</p>
        <div id="pronostico-content"></div>
      </div>
    </div>
  </div>
`;

console.log('LogiMatrix Suite Initialized');

// Initialize Modules
$(document).ready(function() {
  initTransporte();
  initAsignacion();
  initRutas();
  initMarkov();
  initPronostico();
});
