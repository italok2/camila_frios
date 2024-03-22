importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDJsGh9E2OyHxDf3HZV3SaATUWsill-90E",
    authDomain: "italok2-4730d.firebaseapp.com",
    projectId: "italok2-4730d",
    storageBucket: "italok2-4730d.appspot.com",
    messagingSenderId: "444673984653",
    appId: "1:444673984653:web:612c130f178bc40b07bac4" 
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida no service worker: ', payload);
  // Customize como você deseja manipular as notificações recebidas
});
