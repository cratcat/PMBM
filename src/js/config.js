// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "VgEqtDdjizPp8bijJikhYNVhddo2",
  authDomain: "pmbm-927f3.firebaseapp.com",
  databaseURL: "https://pmbm-927f3-default-rtdb.firebaseio.com",
  projectId: "pmbm-927f3",
  storageBucket: "pmbm-927f3.firebasestorage.app",
  messagingSenderId: "317477047640",
  appId: "1:317477047640:web:109ccf13fe4544c498e92d",
  measurementId: "G-NL6CTBGEHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
