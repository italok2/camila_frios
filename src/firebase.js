import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDJsGh9E2OyHxDf3HZV3SaATUWsill-90E",
    authDomain: "italok2-4730d.firebaseapp.com",
    projectId: "italok2-4730d",
    storageBucket: "italok2-4730d.appspot.com",
    messagingSenderId: "444673984653",
    appId: "1:444673984653:web:612c130f178bc40b07bac4"  
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;