import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export type Timestamp = firebase.firestore.Timestamp;

const firebaseConfig = {
  apiKey: "AIzaSyDHYTMDKzXbrbd31gYwv-W8zKUlU9KfEcA",
  authDomain: "sprow-info.firebaseapp.com",
  databaseURL: "https://sprow-info.firebaseio.com",
  projectId: "sprow-info",
  storageBucket: "sprow-info.appspot.com",
  messagingSenderId: "841012177006",
  appId: "1:841012177006:web:0e875e045b8b95068f1e7f",
  measurementId: "G-MTMSFK5HF3",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.firestore();

export const newTimestamp = () => firebase.firestore.Timestamp.now();

export default firebase;
