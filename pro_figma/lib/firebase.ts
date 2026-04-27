import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC16c6umf6I5pAGj0meNnZaAwgKCSLlE90",
    authDomain: "ayuda-z.firebaseapp.com",
    projectId: "ayuda-z",
    storageBucket: "ayuda-z.firebasestorage.app",
    messagingSenderId: "810700554302",
    appId: "1:810700554302:web:0a3f87343fa47651d4116f",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app)