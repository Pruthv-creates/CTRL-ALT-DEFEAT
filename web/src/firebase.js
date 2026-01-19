// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5QAqJ8DKKCXasSDBrzeAfgE2KrGrksG4",
  authDomain: "virtual-herbal-garden-84939.firebaseapp.com",
  projectId: "virtual-herbal-garden-84939",
  storageBucket: "virtual-herbal-garden-84939.firebasestorage.app",
  messagingSenderId: "299440538112",
  appId: "1:299440538112:web:2c0d571f88907ab0358ee5",
  measurementId: "G-SF6YLWWR27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { app, analytics, db };