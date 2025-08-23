import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDApAHnXrNJFcoEagJVm-fXgOoidEvAr0k",
  authDomain: "cmon-design.firebaseapp.com",
  projectId: "cmon-design",
  storageBucket: "cmon-design.firebasestorage.app",
  messagingSenderId: "514278181309",
  appId: "1:514278181309:web:f19d15ee0dcad8bf9b6ad4",
  measurementId: "G-CFYQ9N2HRZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
