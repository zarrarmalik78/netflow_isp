import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRytnZ7F9gAK2o01aYtRL5qnguIqdpifk",
  authDomain: "isp-awz.firebaseapp.com",
  projectId: "isp-awz",
  storageBucket: "isp-awz.firebasestorage.app",
  messagingSenderId: "249565335680",
  appId: "1:249565335680:web:9ebc8eb10a06a4f17cd665"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
