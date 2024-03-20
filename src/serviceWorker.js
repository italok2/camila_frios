// serviceWorkerRegistration.js

export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
          })
          .catch((error) => {
            console.error('Falha ao registrar Service Worker:', error);
          });
      });
    }
  }
  