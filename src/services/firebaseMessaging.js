// services/firebaseMessaging.js

import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();

export const solicitarPermissaoENotificar = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BLowMlTYUUImRVHkR9Hw3HwE9cdt06p6_RI22uX4na6CzB0xT1Ro5l1R-t8EeWj7JOqwlR5pkgTv1x055xOuz8A"
    });
    console.log("Permissão de notificação concedida e token obtido com sucesso." + token);
  } catch (error) {
    console.error("Erro ao solicitar permissão ou obter token:", error);
  }
};
