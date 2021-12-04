// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhHo25BRyv2ft_UGCxdJLWwpB2TEtMvVE",
  authDomain: "heygrupos-24a3c.firebaseapp.com",
  projectId: "heygrupos-24a3c",
  storageBucket: "heygrupos-24a3c.appspot.com",
  messagingSenderId: "443828787699",
  appId: "1:443828787699:web:13263f2af9dea56116da86",
  measurementId: "G-GV5QC4T80K"
};

// Initialize Firebase
firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const firestore = firebase.firestore()
const database = firebase.database()

export {auth, firebase, firestore, database}

