// index.js

import React from 'react';
import { createRoot } from 'react-dom/client'; // Importe createRoot de 'react-dom/client' em vez de 'react-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {register} from './serviceWorker'; // Importe o arquivo de registro do Service Worker

const root = createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registre o Service Worker
register();

// Se você deseja iniciar a medição de desempenho em sua aplicação, passe uma função
// para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um ponto de análise. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();
