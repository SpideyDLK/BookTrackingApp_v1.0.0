// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKD-9t_fKbwZf1bKfE5ESrfE7OvfTA04I",
  authDomain: "booktrackingapp-efc5a.firebaseapp.com",
  projectId: "booktrackingapp-efc5a",
  storageBucket: "booktrackingapp-efc5a.appspot.com",
  messagingSenderId: "382108518213",
  appId: "1:382108518213:web:d47c88b84e6b0bb2dfe02c",
  measurementId: "G-BQ94PZLMLD",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
// const analytics = getAnalytics(app);

export { auth };
