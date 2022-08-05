// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
require("dotenv").config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "delawareauctionapp.firebaseapp.com",
    databaseURL: "https://delawareauctionapp-default-rtdb.firebaseio.com",
    projectId: "delawareauctionapp",
    storageBucket: "delawareauctionapp.appspot.com",
    messagingSenderId: "361117905869",
    appId: "1:361117905869:web:33b6dd2329303c9e92ca84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
