// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDWUSHu72CZddwSTx6AbnP2FvgDYQj3mlI",
    authDomain: "netlify-8334b.firebaseapp.com",
    projectId: "netlify-8334b",
    storageBucket: "netlify-8334b.firebasestorage.app",
    messagingSenderId: "43052061377",
    appId: "1:43052061377:web:4909550ed225df74c1fa40",
    measurementId: "G-FS54BYM84R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
