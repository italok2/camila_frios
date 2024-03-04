import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';

const NotificationComponent = () => {
  useEffect(() => {
    const messaging = firebase.messaging();

    messaging.requestPermission().then(() => {
      return messaging.getToken();
    }).then((token) => {
      console.log('Token gerado:', token);

      // Subscrever-se ao tópico
      messaging.subscribeToTopic('novosRegistros');
    }).catch((error) => {
      console.log('Erro ao solicitar permissão:', error);
    });

    // Configurar ouvinte para mensagens recebidas
    messaging.onMessage((payload) => {
      console.log('Mensagem recebida:', payload);
      // Exibir a notificação usando a API de notificações do navegador
    });

  }, []);

  return (
    <div>
      {/* Seu componente React aqui */}
    </div>
  );
};

export default NotificationComponent;
