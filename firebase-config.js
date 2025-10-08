// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAyam8w_BbG9F61tIXoekslM40IEMmPlGU",
  authDomain: "sitio-campi-01.firebaseapp.com",
  projectId: "sitio-campi-01",
  storageBucket: "sitio-campi-01.firebasestorage.app",
  messagingSenderId: "540036572615",
  appId: "1:540036572615:web:3653bd0891a2a7cee025e2"
};


// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Disponibiliza os serviços que vamos usar
const auth = firebase.auth();
const db = firebase.firestore();
