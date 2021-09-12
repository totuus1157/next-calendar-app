import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAl7z-k0BRRHbY-XND_bqSbIaNlUKRld60",
  authDomain: "calendar-memo-90b44.firebaseapp.com",
  projectId: "calendar-memo-90b44",
  storageBucket: "calendar-memo-90b44.appspot.com",
  messagingSenderId: "127708609182",
  appId: "1:127708609182:web:38a9785c6a155fcade198f",
};

if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}
