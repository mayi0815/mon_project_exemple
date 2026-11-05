// Interactions légères pour le prototype pédagogique.
// Aucune requête réseau, aucun suivi, aucune donnée personnelle stockée.
(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const demoButton = document.getElementById('demo-button');
  const demoMessage = document.getElementById('demo-message');
  if (demoButton && demoMessage) {
    demoButton.addEventListener('click', () => {
      demoMessage.textContent = 'Bravo ! Le bouton fonctionne. C\'est une simulation : aucun intérêt n\'a été enregistré ni transmis.';
      demoButton.textContent = 'Interaction testée ✓';
    });
  }
})();
