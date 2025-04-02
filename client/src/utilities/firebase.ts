// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBUjbON7p7nWRon2HLvu6RCw1vqbgfXCYo",
	authDomain: "memora-31e1c.firebaseapp.com",
	projectId: "memora-31e1c",
	storageBucket: "memora-31e1c.firebasestorage.app",
	messagingSenderId: "448334870318",
	appId: "1:448334870318:web:47deae2871dca6d25d2cbf",
	measurementId: "G-V3D6ZMNWPK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
