import firebase from 'firebase';

// firebase API configurations
const firebaseConfig = {
    apiKey: "AIzaSyAAWmsePNQ6y36KYDb8N1RrMg8-XEcblA0",
    authDomain: "reactnative-studydiary.firebaseapp.com",
    databaseURL: "https://reactnative-studydiary.firebaseio.com",
    projectId: "reactnative-studydiary",
    storageBucket: "reactnative-studydiary.appspot.com",
    messagingSenderId: "400809535063",
    appId: "1:400809535063:web:a610ef51cd9cbc35e22512"
};
// firebase buildin function, for initialzing firebase for the app
firebase.initializeApp(firebaseConfig);

// Defining some varibales and connecting them with firebase features.
export const fb = firebase;
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();