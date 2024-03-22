import React, { useEffect } from 'react';
import { getMessaging } from "firebase/messaging";

const NotificationComponent = () => {
  useEffect(() => {
    const messaging = getMessaging();

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
