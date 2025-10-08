// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyAcaWvls3M12BnU7vM4f52TcHvgA_tUHyg",
  authDomain: "sitio-campi.firebaseapp.com",
  projectId: "sitio-campi",
  storageBucket: "sitio-campi.appspot.com",
  messagingSenderId: "122258511621",
  appId: "1:122258511621:web:689eb2817ba57a106e496c"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Disponibiliza os serviços que vamos usar
const auth = firebase.auth();
const db = firebase.firestore();
