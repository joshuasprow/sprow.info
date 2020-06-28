import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

export const auth = firebase.auth();
export const db = firebase.firestore();

export type Timestamp = firebase.firestore.Timestamp;

export const newTimestamp = () => firebase.firestore.Timestamp.now();

export const formatTimestamp = (timestamp: firebase.firestore.Timestamp) => {
  const dateObj = timestamp.toDate();

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  const hours24 = dateObj.getHours();
  const hours = hours24 > 12 ? hours24 - 12 : hours24;
  const amPm = hours24 > 11 ? "pm" : "am";

  const minutes = dateObj.getMinutes();
  const minutesWithZero = minutes < 10 ? `${0}${minutes}` : minutes;

  return `${month}.${date}.${year} ${hours}:${minutesWithZero} ${amPm}`;
};

export default firebase;
