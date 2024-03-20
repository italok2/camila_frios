// serviceWorkerRegistration.js

export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
          .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
            registration.addEventListener('updatefound', () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Enviar mensagem para o Service Worker indicando que ele deve ser ativado imediatamente
                    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
              });
            });
          })
          .catch((error) => {
            console.error('Falha ao registrar Service Worker:', error);
          });
      });
    }
  }
  