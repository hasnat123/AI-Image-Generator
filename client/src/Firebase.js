import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "imagegeneratorai-abf96.firebaseapp.com",
    projectId: "imagegeneratorai-abf96",
    storageBucket: "imagegeneratorai-abf96.appspot.com",
    messagingSenderId: "116522120073",
    appId: "1:116522120073:web:16f7335569cda49d3fe758"
  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider()

export default app
