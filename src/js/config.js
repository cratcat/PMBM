// CDN 방식 또는 ES 모듈 방식으로 Firebase 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "pmbm", // 프로젝트 ID
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEcJONXOlH9U_tHSeF31sSnZ3eR5idIBU",
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
