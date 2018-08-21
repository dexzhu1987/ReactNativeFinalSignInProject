import firebase from "firebase";

var config = {
  apiKey: "AIzaSyBbZa3eNn-RvkCrppkVL4fmwjHwEID6dQg",
  authDomain: "reactnativefinalsigninproject.firebaseapp.com",
  databaseURL: "https://reactnativefinalsigninproject.firebaseio.com",
  projectId: "reactnativefinalsigninproject",
  storageBucket: "reactnativefinalsigninproject.appspot.com",
  messagingSenderId: "609800797128"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
