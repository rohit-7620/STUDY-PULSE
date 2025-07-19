// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
// import { getAnalytics } from "firebase/analytics"; // Optional: keep if you need analytics
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// WARNING: Storing API keys directly in source code is not recommended for production.
// Consider using environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyB-vcdzvRTRiKcner4rKQ1sriTp7cN3GxM",
  authDomain: "studypulse-22703.firebaseapp.com",
  projectId: "studypulse-22703",
  storageBucket: "studypulse-22703.appspot.com", // Corrected storage bucket name (usually ends with .appspot.com)
  messagingSenderId: "78348349047",
  appId: "1:78348349047:web:af162fef3ec1f6fa742072",
  measurementId: "G-B9E07W5LB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

// Export the auth instance to be used in other components
export { auth }; 